"use client";
import { FC, ReactNode, useState, useContext, createContext, useEffect, Dispatch, SetStateAction } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAccount, useWaitForTransactionReceipt, useAccountEffect } from "wagmi";
import { readContract, simulateContract, getChainId, getBalance } from "@wagmi/core";
import { parseEther, formatEther } from 'viem';
import { EthBridger, getArbitrumNetwork } from "@arbitrum/sdk";
import { ethers, providers } from "ethers";
import { useRouter } from "next/navigation";

import config from "../wagmi";
import { 
    SPACESHIPS_ABI, 
    GAMESTATS_ABI, 
    ARBITEMS_ABI, 
    ARBITMARKETPLACE_ABI, 
    spaceshipsAddress, 
    gameStatsAddress, 
    arbitemsAddress, 
    arbitMarketplaceAddress 
} from "../contracts/arbinvader-contract";
import { useWriteSpaceshipsCreateSpaceship } from "../contracts/generated_spaceships";
import { useWriteGameStatsSaveGameSession } from "../contracts/generated_gamestats";
import { useWriteArbitemsCreateItem, useWriteArbitemsSetMarketplace, useWriteArbitemsApprove } from "../contracts/generated_arbitems";
import { 
    useWriteArbitMarketplaceListItem, 
    useWriteArbitMarketplaceCancelListing, 
    useWriteArbitMarketplaceEndAuction,
    useWriteArbitMarketplaceUpdatePrice,
    useWriteArbitMarketplaceBuyItem,
    useWriteArbitMarketplacePlaceBid,
    useWriteArbitMarketplaceAcceptBid,
} from "../contracts/generated_arbitmarketplace";
import { AlertProvider, useAlert } from "../provider/AlertProvider";
import { MySpaceships, SpaceshipVisualProps, SpaceshipStatsProps } from "../Ship";
import spaceships from "../utils/spaceships";
import { useEthersSigner } from "../components/ethers";

const theme = createTheme({
    palette: {
        primary: {
        main: "#000000",
        },
        secondary: {
        main: "#FFFFFF",
        },
    },
});

const rarityOrder = {
    'Legendary': 1,
    'Epic': 2,
    'Rare': 3,
    'Uncommon': 4,
    'Common': 5
};

export interface CollectedItem {
    id: number;
    name: string;
    image: HTMLImageElement;
    rarity: string;
    collected: boolean;
};

export interface Items {
    tokenId: number;
    owner: string;
    name: string;
    rarity: keyof typeof rarityOrder;
    image: string;
};

export interface ItemToList {
    tokenId: number;
    name: string;
    rarity: string;
    image: string;
    price: string;
    allowBids: boolean;
    auctionDuration: number;
};

export interface AuctionEndStatus {
    [tokenId: string]: boolean;
};

export interface ListedItem {
    tokenId: number;
    name: string;
    rarity: keyof typeof rarityOrder;
    image: string;
    seller: string;
    price: string;
    isActive: boolean;
    allowBids: boolean;
    highestBid: string;
    highestBidder: string;
    endTime: number;
};

export interface MyGameStats {
    gamesPlayed: number;
    bestScore: number;
    spaceship: string;
};

export interface AllUserGameStats extends MyGameStats {
    address: string;
};

interface AppContextState {
    chainId: number;
    mySpaceships: MySpaceships[];
    myStats: MyGameStats | undefined;
    allUserStats: AllUserGameStats[] | undefined;
    ownedItems: Items[];
    allListedNfts: ListedItem[] | undefined;
    userListedItems: ListedItem[] | undefined;
    isConnected: boolean;
    account: string | undefined;
    srcBalance: number;
    dstBalance: number;
    transferTxnHash: string | undefined;
    formatDateTime: (timestamp: number) => string;
    setSpaceShipsImage: (name: string) => string | undefined;
    setSrcBalance: Dispatch<SetStateAction<number>>;
    setDstBalance: Dispatch<SetStateAction<number>>;
    setErrorAlertMessage: (message: string | null) => void;
    setInfoAlertMessage: (message: string | null) => void;
    handleMintSpaceship: (visual: SpaceshipVisualProps, stats: SpaceshipStatsProps, price: number) => void;
    getUserOwnedSpaceships: () => void;
    getWalletBalance: (selectedChainId: number, setBalance: React.Dispatch<React.SetStateAction<number>>) => void;
    ethDeposit: (childChainId: number, amount: number) => void;
    ethWithdraw: (childChainId: number, amount: number) => void;
    handleSaveGameSession: (score: number, spaceshipName: string) => void;
    fetchUserGameStats: () => void;
    fetchAllUserGameStats: () => void;
    handleMintItems: (item: CollectedItem) => void;
    getUserOwnedItems: () => void;
    handleApprove: (tokenId: number) => void;
    handleListItems: (listedItem: ItemToList) => void;
    getAllListedItems: () => void;
    getUserListedItems: () => void;
    handleCancelListing: (tokenId: number) => void;
    handleEndAuction: (item: ListedItem) => void;
    handleUpdatePrice: (name: string, tokenId: number, price: string) => void;
    handleBuyItem: (name: string, tokenId: number, price: string) => void;
    handlePlacingBid: (name: string, tokenId: number, bid: string) => void;
    handleAcceptBid: (name: string, tokenId: number) => void;
};

export const AppContexts = createContext<AppContextState | undefined>(
    undefined
);

export function useAppContext(): AppContextState {
    const context = useContext(AppContexts);
    if (!context)
        throw new Error("useAppContext must be used within an AppContextProvider");
    return context;
};

const AppContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();
    const chainId = getChainId(config);
    const isConnected = useAccount().isConnected;
    const { setNotification, setSuccessAlertMessage, setInfoAlertMessage, setErrorAlertMessage, setLoadingAlertMessage, setLoadingUpdateAlertMessage } = useAlert();
    const [account, setAccount] = useState(useAccount()?.address);
    const [srcBalance, setSrcBalance] = useState<number>(0);
    const [dstBalance, setDstBalance] = useState<number>(0);
    const [mySpaceships, setMyspaceships] = useState<MySpaceships[]>([]);
    const [myStats, setMyStats] = useState<MyGameStats>();
    const [allUserStats, setAllUserStats] = useState<AllUserGameStats[]>([]);
    const [ownedItems, setOwnedItems] = useState<Items[]>([]);
    const [userListedItems, setUserListedItems] = useState<ListedItem[]>([]);
    const [allListedNfts, setAllListedNfts] = useState<ListedItem[]>([]);
    const [transferTxnHash, setTransferTxnHash] = useState('');

    const signer = useEthersSigner({chainId: chainId});

    const formatDateTime = (timestamp: number) => {
        if (!timestamp || timestamp === 0) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const setSpaceShipsImage = (name: string) => {
        const spaceshipsNames = ['Fighter', 'Nautolan', 'Nairan', 'Klaed'];
        const spaceshipName = spaceshipsNames.includes(name) ? name : '';
    
        const spaceship = spaceships.find(item => item.name === spaceshipName);
        return spaceship?.icon;
    }; 

    useAccountEffect({
    	onConnect(data) {
        	setAccount(data.address);
    	},
    	onDisconnect() {
        	console.log("Account Disconnected");
        	setAccount(undefined);
            localStorage.clear();
            setNotification([]);
            router.push('/');
    	},
	});

    const { data: mintSpaceshipTxHash, writeContractAsync: mintSpaceship } =
		useWriteSpaceshipsCreateSpaceship();
    
    const { data: saveGameSessionTxHash, writeContractAsync: saveGameSession } =
        useWriteGameStatsSaveGameSession();
    
    const { data: mintItemTxHash, writeContractAsync: mintItem } =
        useWriteArbitemsCreateItem();

    const { data: approveTxnHash, writeContractAsync: approve } =
        useWriteArbitemsApprove();

    const { data: setMarketplaceTxnHash, writeContractAsync: setMarketplace } =
        useWriteArbitemsSetMarketplace();

    const { data: listItemTxnHash, writeContractAsync: listItem } =
        useWriteArbitMarketplaceListItem();

    const { data: cancelListingTxnHash, writeContractAsync: cancelListing } =
        useWriteArbitMarketplaceCancelListing();

    const { data: endAuctionTxnHash, writeContractAsync: endAuction } =
        useWriteArbitMarketplaceEndAuction();

    const { data: updatePriceTxnHash, writeContractAsync: updatePrice } =
        useWriteArbitMarketplaceUpdatePrice();

    const { data: buyItemTxnHash, writeContractAsync: buyItem } =
        useWriteArbitMarketplaceBuyItem();

    const { data: placeBidTxnHash, writeContractAsync: placeBid } =
        useWriteArbitMarketplacePlaceBid();

    const { data: acceptBidTxnHash, writeContractAsync: acceptBid } =
        useWriteArbitMarketplaceAcceptBid();

    const {
        isSuccess: isMinted,
        isLoading: isMinting,
        isError: isMintError,
    } = useWaitForTransactionReceipt({
        hash: mintSpaceshipTxHash,
    });

    const {
        isSuccess: isSaved,
        isLoading: isSaving,
        isError: isSaveError,
    } = useWaitForTransactionReceipt({
        hash: saveGameSessionTxHash,
    });

    const {
        isSuccess: isMintedItem,
        isLoading: isMintingItem,
        isError: isMintErrorItem,
    } = useWaitForTransactionReceipt({
        hash: mintItemTxHash,
    });

    const {
        isSuccess: isApproved,
        isLoading: isApproving,
        isError: isApproveError,
    } = useWaitForTransactionReceipt({
        hash: approveTxnHash,
    });

    const {
        isSuccess: isSetMarketplace,
        isLoading: isSettingMarketplace,
        isError: isSetMarketplaceError,
    } = useWaitForTransactionReceipt({
        hash: setMarketplaceTxnHash,
    });

    const {
        isSuccess: isListed,
        isLoading: isListing,
        isError: isListError,
    } = useWaitForTransactionReceipt({
        hash: listItemTxnHash,
    });

    const {
        isSuccess: isCanceled,
        isLoading: isCancelling,
        isError: isCancelError,
    } = useWaitForTransactionReceipt({
        hash: cancelListingTxnHash,
    });

    const {
        isSuccess: isEnded,
        isLoading: isEnding,
        isError: isEndError,
    } = useWaitForTransactionReceipt({
        hash: endAuctionTxnHash,
    });

    const {
        isSuccess: isUpdated,
        isLoading: isUpdating,
        isError: isUpdateError,
    } = useWaitForTransactionReceipt({
        hash: updatePriceTxnHash,
    });

    const {
        isSuccess: isBought,
        isLoading: isBuying,
        isError: isBuyError,
    } = useWaitForTransactionReceipt({
        hash: buyItemTxnHash,
    });

    const {
        isSuccess: isPlacedBid,
        isLoading: isPlacingBid,
        isError: isPlaceBidError,
    } = useWaitForTransactionReceipt({
        hash: placeBidTxnHash,
    });

    const {
        isSuccess: isAcceptedBid,
        isLoading: isAcceptingBid,
        isError: isAcceptBidError,    
    } = useWaitForTransactionReceipt({
        hash: acceptBidTxnHash,
    });

    const getWalletBalance = (selectedChainId: number, setBalance: Dispatch<SetStateAction<number>>) => {
        try {
            if (account && chainId === 421614 || account && chainId === 11155111) {
                const balance = getBalance(config, {
                    address: account as any,
                    chainId: selectedChainId as any,
                });
        
                balance.then((balance) => {
                    const currentBalance = parseFloat(balance.formatted);
                    setBalance(parseFloat(currentBalance.toFixed(4)));
                });
            }
        } catch (error: any) {
            console.error("Error getting balance: ", error);
        }
    };

    const ethDeposit = async (childChainId: number, amount: number) => {
        const l2network = await getArbitrumNetwork(childChainId);
        const ethBridger = new EthBridger(l2network);
        const parentSigner = signer;

        const messageId = setLoadingAlertMessage(`Transferring ${amount} ETH in progress. Please wait...`);

        if (!parentSigner) {
            console.error('Parent signer is undefined. Please make sure the signer is available.');
            setLoadingUpdateAlertMessage(messageId,`Transferring ${amount} ETH failed. Please try again later`, "error");
            return;
        }
    
        try {
            const amountInEther = ethers.utils.parseEther(amount.toString());
    
            // Make sure to use the correct keys for the deposit function
            const deposit_L2 = await ethBridger.deposit({
                amount: amountInEther,
                parentSigner,
            });

            const ethDepositTxReceipt = await deposit_L2.wait();
    
            console.log('Deposit successful: ', ethDepositTxReceipt.transactionHash);

            setTransferTxnHash(`https://sepolia.etherscan.io/tx/${ethDepositTxReceipt.transactionHash}`);

            setLoadingUpdateAlertMessage(messageId,`Transferring ${amount} ETH successful with tx hash: ${ethDepositTxReceipt.transactionHash}`, "success");
        } catch (error: any) {
            console.error('Error during transfer:', error);
            setLoadingUpdateAlertMessage(messageId,`Transferring ${amount} ETH failed. Please try again later`, "error");
        }
    };

    const ethWithdraw = async (childChainId: number, amount: number) => {
        const childNetwork = await getArbitrumNetwork(childChainId)
        const ethBridger = new EthBridger(childNetwork)
        const childSigner = signer;

        const messageId = setLoadingAlertMessage(`Transferring ${amount} ETH in progress. Please wait...`);

        if (!childSigner) {
            console.error('Parent signer is undefined. Please make sure the signer is available.');
            setLoadingUpdateAlertMessage(messageId,`Transferring ${amount} ETH failed. Please try again later`, "error");
            return;
        }
    
        try {
            const amountInEther = ethers.utils.parseEther(amount.toString());
    
            if (account) {
                const destinationAddress = account;
                const deposit_L2 = await ethBridger.withdraw({
                    from: account,
                    amount: amountInEther,
                    childSigner,
                    destinationAddress,
                });
    
                const ethDepositTxReceipt = await deposit_L2.wait();
        
                console.log('Deposit successful: ', ethDepositTxReceipt.transactionHash);
    
                setTransferTxnHash(`https://sepolia.arbiscan.io/tx/${ethDepositTxReceipt.transactionHash}`);
    
                setLoadingUpdateAlertMessage(messageId,`Transferring ${amount} ETH successful with tx hash: ${ethDepositTxReceipt.transactionHash}`, "success");
            }
        } catch (error: any) {
            console.error('Error during transfer:', error);
            setLoadingUpdateAlertMessage(messageId,`Transferring ${amount} ETH failed. Please try again later`, "error");
        }
    }

    const handleMintSpaceship = async (visuals: SpaceshipVisualProps, stats: SpaceshipStatsProps, price: number) => {
        const messageId = setLoadingAlertMessage(`Minting ${visuals.name} in progress. Please wait...`);
        try {
            await simulateContract(config, {
                abi: SPACESHIPS_ABI,
                address: spaceshipsAddress,
                functionName: "createSpaceship",
                args: [visuals as any, stats as any],
                value: parseEther(price.toString()),
            }).catch((err) => {
                console.error("Simulation failed with ", err);
            });

            await mintSpaceship({
                address: spaceshipsAddress,
                args: [visuals as any, stats as any],
                value: parseEther(price.toString()),
            });

            if (isMintError) {
                setLoadingUpdateAlertMessage(messageId,`Minting ${visuals.name} failed. Please try again later`, "error");
            } else if (isMinted) {
                await getUserOwnedSpaceships();
                setLoadingUpdateAlertMessage(messageId,`Minting ${visuals.name} successful`, "success");
            }

            await getUserOwnedSpaceships();
            setLoadingUpdateAlertMessage(messageId,`Minting ${visuals.name} successful`, "success");
        } catch (err: any) {
            console.error("Minting failed with ", err);
            setLoadingUpdateAlertMessage(messageId,`Minting ${visuals.name} failed. Please try again later`, "error");
        }
    };

    const getUserOwnedSpaceships = async () => {
        if (account && chainId === 421614) {
            try {
                const ownedSpaceships = await readContract(config, {
                    abi: SPACESHIPS_ABI,
                    address: spaceshipsAddress,
                    functionName: "getUserSpaceships",
                    args: [account],
                });

                setMyspaceships(
                    ownedSpaceships.map((spaceship: any) => ({
                        name: spaceship.visuals.name,
                        icon: spaceship.visuals.icon,
                        images: spaceship.visuals.images,
                        laserColor: spaceship.visuals.laserColor,
                        hp: parseInt(spaceship.stats.hp),
                        maxEnergy: parseInt(spaceship.stats.maxEnergy),
                        energyRegen: parseInt(spaceship.stats.energyRegen),
                        laserWidth: parseInt(spaceship.stats.laserWidth),
                        laserDamage: parseInt(spaceship.stats.laserDamage),
                        bullet: parseInt(spaceship.stats.bullet),
                        width: parseInt(spaceship.stats.width),
                        height: parseInt(spaceship.stats.height),
                        maxFrame: parseInt(spaceship.stats.maxFrame),
                    }))
                );
            } catch (err: any) {
                console.error("Failed to get spaceships:", err);
            }
        } else {
            return console.log("Please connect your wallet");
        }
    };

    const handleSaveGameSession = async (score: number, spaceshipName: string) => {
        const messageId = setLoadingAlertMessage(`Save game session in progress. Please wait...`);
        if (account) {
            try {
                await simulateContract(config, {
                    abi: GAMESTATS_ABI,
                    address: gameStatsAddress,
                    functionName: "saveGameSession",
                    args: [BigInt(score), spaceshipName],
                }).catch((err) => {
                    console.error("Simulation failed with ", err);
                });

                await saveGameSession({
                    address: gameStatsAddress,
                    args: [BigInt(score), spaceshipName],
                });
    
                if (isSaveError) {
                    setLoadingUpdateAlertMessage(messageId,`Saving game session failed. Please try again later`, "error");
                } else if (isSaved) {
                    await fetchUserGameStats();
                    await fetchAllUserGameStats();
                    setLoadingUpdateAlertMessage(messageId,`Saving game session successful`, "success");
                }

                await fetchUserGameStats();
                await fetchAllUserGameStats();
                setLoadingUpdateAlertMessage(messageId,`Saving game session successful`, "success");
            } catch (err: any) {
                console.error("Saving game session failed with ", err);
                setLoadingUpdateAlertMessage(messageId,`Saving game session failed. Please try again later`, "error");
            }
        }
    };

    const fetchUserGameStats = async () => {
        if (account) {
            try {
                const userGameStats = await readContract(config, {
                    abi: GAMESTATS_ABI,
                    address: gameStatsAddress,
                    functionName: "getUserStats",
                    args: [account],
                });

                setMyStats({
                    gamesPlayed: parseInt(userGameStats[0].toString()),
                    bestScore: parseInt(userGameStats[1].toString()),
                    spaceship: userGameStats[2],
                });
            } catch (err: any) {
                console.error("Failed to get user game stats:", err);
            }
        }
    };

    const fetchAllUserGameStats = async () => {
        if (account && chainId === 421614) {
            try {
                const userGameStats = await readContract(config, {
                    abi: GAMESTATS_ABI,
                    address: gameStatsAddress,
                    functionName: "getAllUserStats",
                });

                // @ts-ignore
                const sortedUsers = userGameStats.sort((a: any, b: any) => (parseInt(b.bestScore.toString()) ?? 0) - (parseInt(a.bestScore.toString()) ?? 0));

                setAllUserStats(
                    sortedUsers.map((stats: any) => ({
                        address: stats.addr,
                        gamesPlayed: parseInt(stats.gamesPlayed.toString()),
                        bestScore: parseInt(stats.bestScore.toString()),
                        spaceship: stats.spaceship,
                    }))
                );
            } catch (err: any) {
                console.error("Failed to get all user game stats:", err);
            }
        }
    };

    const handleMintItems = async (item: CollectedItem) => {
        const messageId = setLoadingAlertMessage(`Minting ${item.name} in progress. Please wait...`);
        if (account) {
            try {
                await simulateContract(config, {
                    abi: ARBITEMS_ABI,
                    address: arbitemsAddress,
                    functionName: "createItem",
                    args: [item.name, item.rarity, item.image.src as string],
                }).catch((err) => {
                    console.error("Simulation failed with ", err);
                });

                await mintItem({
                    address: arbitemsAddress,
                    args: [item.name, item.rarity, item.image.src as string],
                });

                if (isMintError) {
                    setLoadingUpdateAlertMessage(messageId,`Minting ${item.name} failed. Please try again later`, "error");
                } else if (isMinted) {
                    getUserOwnedItems();
                    setLoadingUpdateAlertMessage(messageId,`Minting ${item.name} successful`, "success");
                }

                getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Minting ${item.name} successful`, "success");
            } catch (err: any) {
                console.error("Failed to mint item:", err);
                setLoadingUpdateAlertMessage(messageId,`Minting ${item.name} failed. Please try again later`, "error");
            }
        }
    };

    const getUserOwnedItems = async () => {
        if (account) {
            try {
                const ownedItems = await readContract(config, {
                    abi: ARBITEMS_ABI,
                    address: arbitemsAddress,
                    functionName: "getUserItems",
                    args: [account],
                });

                const formattedItems: Items[] = ownedItems.map((item: any) => ({
                    tokenId: parseInt(item.tokenId.toString()),
                    owner: item.owner,
                    name: item.name,
                    rarity: item.rarity,
                    image: item.image
                }));
        
                // Sort items by rarity (from most rare to most common)
                const sortedItems = formattedItems.sort((a, b) => {
                    const rarityA = rarityOrder[a.rarity] || 999;
                    const rarityB = rarityOrder[b.rarity] || 999;
                    return rarityA - rarityB;
                });

                setOwnedItems(sortedItems);

            } catch (err: any) {
                console.error("Failed to get user owned items:", err);
            }
        }
    };

    const handleSetMarketplaceAddress = async () => {
        try {
            await simulateContract(config, {
                abi: ARBITEMS_ABI,
                address: arbitemsAddress,
                functionName: "setMarketplace",
                args: [arbitMarketplaceAddress],
            }).catch((err) => {
                console.error("Simulation to set marketplace address failed with ", err);
            });

            await setMarketplace({
                address: arbitemsAddress,
                args: [arbitMarketplaceAddress],
            });

            if (isSetMarketplaceError) {
                console.error("Failed to set marketplace address: ", isSetMarketplaceError);
            } else if (isSetMarketplace) {
                console.log("Set marketplace address successful");
            }
        } catch (err: any) {
            console.error("Failed to set marketplace address: ", err);
        }
    };

    const getMarkeplaceAddress = async () => {
        try {
            const address = await readContract(config, {
                abi: ARBITEMS_ABI,
                address: arbitemsAddress,
                functionName: "marketplaceAddress",
            });

            return address;
        } catch (err: any) {
            console.error("Failed to get marketplace address:", err);
        }
    };

    const handleApprove = async (tokenId: number) => {
        const messageId = setLoadingAlertMessage(`Approving item in progress. Please wait...`);
        let marketplaceAddress = await getMarkeplaceAddress();

        if (marketplaceAddress !== arbitMarketplaceAddress) {
            await handleSetMarketplaceAddress();
            marketplaceAddress = await getMarkeplaceAddress();
        }

        if (marketplaceAddress) {
            try {
                await simulateContract(config, {
                    abi: ARBITEMS_ABI,
                    address: arbitemsAddress,
                    functionName: "approve",
                    args: [arbitMarketplaceAddress, BigInt(tokenId)],
                }).catch((err) => {
                    console.error("Simulation to approve item failed with ", err);
                    return false;
                });

                await approve({
                    address: arbitemsAddress,
                    args: [marketplaceAddress, BigInt(tokenId)],
                });
                
                if (isApproveError) {
                    setLoadingUpdateAlertMessage(messageId,`Approving item failed. Please try again later`, "error");
                    return false;
                } else if (isApproved) {
                    setLoadingUpdateAlertMessage(messageId,`Approving item successful`, "success");
                    return true;
                }

                setLoadingUpdateAlertMessage(messageId,`Approving item successful`, "success");
                return true;
            } catch (err: any) {
                console.error("Failed to approve item:", err);
                setLoadingUpdateAlertMessage(messageId,`Approving item failed. Please try again later`, "error");
                return false;
            }
        }
    };

    const getUserListedItems = async () => {
        if (account) {
            try {
                await getUserOwnedItems();

                const listedItems = await readContract(config, {
                    abi: ARBITMARKETPLACE_ABI,
                    address: arbitMarketplaceAddress,
                    functionName: "getUserListings",
                    args: [account],
                });
    
                const formattedItems: ListedItem[] = listedItems.map((item: any) => ({
                    tokenId: parseInt(item.tokenId.toString()),
                    name: item.name,
                    rarity: item.rarity,
                    image: item.image,
                    seller: item.seller,
                    price: formatEther(item.price),
                    isActive: item.isActive as boolean,
                    allowBids: item.allowBids as boolean,
                    highestBid: formatEther(item.highestBid),
                    highestBidder: item.highestBidder,
                    endTime: parseInt(item.endTime.toString()) * 1000,
                }));
        
                // Sort items by rarity (from most rare to most common)
                const sortedItems = formattedItems.sort((a, b) => {
                    const rarityA = rarityOrder[a.rarity] || 999;
                    const rarityB = rarityOrder[b.rarity] || 999;
                    return rarityA - rarityB;
                });
        
                setUserListedItems(sortedItems);
            } catch (error: any) {
                console.error("Error getting user listed items: ", error);
            }
        }
    };

    const getAllListedItems = async () => {
        try {
            const listedItems = await readContract(config, {
                abi: ARBITMARKETPLACE_ABI,
                address: arbitMarketplaceAddress,
                functionName: "getAllListings",
            });
    
            const formattedItems: ListedItem[] = listedItems.map((item: any) => ({
                tokenId: parseInt(item.tokenId.toString()),
                name: item.name,
                rarity: item.rarity,
                image: item.image,
                seller: item.seller,
                price: formatEther(item.price),
                isActive: item.isActive as boolean,
                allowBids: item.allowBids as boolean,
                highestBid: formatEther(item.highestBid),
                highestBidder: item.highestBidder,
                endTime: parseInt(item.endTime.toString()) * 1000,
            }));
    
            // Sort items by rarity (from most rare to most common)
            const sortedItems = formattedItems.sort((a, b) => {
                const rarityA = rarityOrder[a.rarity] || 999;
                const rarityB = rarityOrder[b.rarity] || 999;
                return rarityA - rarityB;
            });
    
            setAllListedNfts(sortedItems);
        } catch (error: any) {
            console.error("Error getting all listed items: ", error);
        }
    };

    const handleListItems = async (listedItem: ItemToList) => {
        const messageId = setLoadingAlertMessage(`Listing ${listedItem.name} in progress. Please wait...`);
        const isApproved = await handleApprove(listedItem.tokenId);

        if (isApproved) {
            try {
                await simulateContract(config, {
                    abi: ARBITMARKETPLACE_ABI,
                    address: arbitMarketplaceAddress,
                    functionName: "listItem",
                    args: [BigInt(listedItem.tokenId), listedItem.name, listedItem.rarity, listedItem.image, parseEther(listedItem.price), listedItem.allowBids, BigInt(listedItem.auctionDuration)],
                }).catch((err) => {
                    console.error("Simulation to list item failed with ", err);
                });
    
                await listItem({
                    address: arbitMarketplaceAddress,
                    args: [BigInt(listedItem.tokenId), listedItem.name, listedItem.rarity, listedItem.image, parseEther(listedItem.price), listedItem.allowBids, BigInt(listedItem.auctionDuration)],
                });
    
                if (isListError) {
                    await getUserListedItems();
                    await getAllListedItems();
                    setLoadingUpdateAlertMessage(messageId,`Listing ${listedItem.name} failed. Please try again later`, "error");
                } else if (isListed) {
                    await getUserListedItems();
                    await getAllListedItems();
                    setLoadingUpdateAlertMessage(messageId,`Listing ${listedItem.name} successful`, "success");
                }

                await getUserListedItems();
                await getAllListedItems();
                setLoadingUpdateAlertMessage(messageId,`Listing ${listedItem.name} successful`, "success");
            } catch (err: any) {
                await getUserListedItems();
                await getAllListedItems();
                console.error("Failed to list item:", err);
                setLoadingUpdateAlertMessage(messageId,`Listing ${listedItem.name} failed. Please try again later`, "error");
            }
        } else {
            setLoadingUpdateAlertMessage(messageId,`Listing ${listedItem.name} failed to be approved. Please try again later`, "error");
        }
    };

    const handleCancelListing = async (tokenId: number) => {
        const messageId = setLoadingAlertMessage(`Removing listing in progress. Please wait...`);
        try {
            await simulateContract(config, {
                abi: ARBITMARKETPLACE_ABI,
                address: arbitMarketplaceAddress,
                functionName: "cancelListing",
                args: [BigInt(tokenId)],
            }).catch((err) => {
                console.error("Simulation to removing listing failed with ", err);
            });

            await cancelListing({
                address: arbitMarketplaceAddress,
                args: [BigInt(tokenId)],
            });

            if (isListError) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Removing listing failed. Please try again later`, "error");
            } else if (isCanceled) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Removing listing successful`, "success");
            }

            await getUserListedItems();
            await getAllListedItems();
            await getUserOwnedItems();
            setLoadingUpdateAlertMessage(messageId,`Removing listing successful`, "success");
        } catch (err: any) {
            console.error("Failed to cancel listing:", err);
            setLoadingUpdateAlertMessage(messageId,`Removing listing failed. Please try again later`, "error");
        }
    };

    const handleEndAuction = async (item: ListedItem) => {
        const messageId = setLoadingAlertMessage(`Ending auction for ${item.name} in progress. Please wait...`);

        try {
            await simulateContract(config, {
                abi: ARBITMARKETPLACE_ABI,
                address: arbitMarketplaceAddress,
                functionName: "endAuction",
                args: [BigInt(item.tokenId)],
            }).catch((err) => {
                console.error("Simulation to end auction failed with ", err);
            });

            await endAuction({
                address: arbitMarketplaceAddress,
                args: [BigInt(item.tokenId)],
            });

            if (isEndError) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Ending auction for ${item.name} failed. Please try again later`, "error");
            } else if (isEnded) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Ending auction for ${item.name} successful`, "success");
            }

            await getUserListedItems();
            await getAllListedItems();
            await getUserOwnedItems();
            setLoadingUpdateAlertMessage(messageId,`Ending auction for ${item.name} successful`, "success");
        } catch (err: any) {
            console.error("Failed to end auction:", err);
            setLoadingUpdateAlertMessage(messageId,`Ending auction for ${item.name} failed. Please try again later`, "error");
        }
    };

    const handleAcceptBid = async (name: string, tokenId: number) => {
        const messageId = setLoadingAlertMessage(`Accepting bid for ${name} in progress. Please wait...`);
        try {
            await simulateContract(config, {
                abi: ARBITMARKETPLACE_ABI,
                address: arbitMarketplaceAddress,
                functionName: "acceptBid",
                args: [BigInt(tokenId)],
            }).catch((err) => {
                console.error("Simulation to accept bid failed with ", err);
            })

            await acceptBid({
                address: arbitMarketplaceAddress,
                args: [BigInt(tokenId)],
            });

            if (isAcceptBidError) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Accepting bid for ${name} failed. Please try again later`, "error");
            } else if (isAcceptedBid) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Accepting bid for ${name} successful`, "success");
            }

            await getUserListedItems();
            await getAllListedItems();
            await getUserOwnedItems();
            setLoadingUpdateAlertMessage(messageId,`Accepting bid for ${name} successful`, "success");
        } catch (err: any) {
            console.error("Failed to accept bid:", err);
            setLoadingUpdateAlertMessage(messageId,`Accepting bid for ${name} failed. Please try again later`, "error");
        }
    };

    const handleUpdatePrice = async (name: string, tokenId: number, price: string) => {
        const messageId = setLoadingAlertMessage(`Updating price for ${name} in progress. Please wait...`);
        try {
            await simulateContract(config, {
                abi: ARBITMARKETPLACE_ABI,
                address: arbitMarketplaceAddress,
                functionName: "updatePrice",
                args: [BigInt(tokenId), parseEther(price)],
            }).catch((err) => {
                console.error("Simulation to update price failed with ", err);
            });

            await updatePrice({
                address: arbitMarketplaceAddress,
                args: [BigInt(tokenId), parseEther(price)],
            });

            if (isUpdateError) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Updating price for ${name} failed. Please try again later`, "error");
            } else if (isUpdated) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Updating price for ${name} successful`, "success");
            }

            await getUserListedItems();
            await getAllListedItems();
            await getUserOwnedItems();
            setLoadingUpdateAlertMessage(messageId,`Updating price for ${name} successful`, "success");
        } catch (err: any) {
            console.error("Failed to update price:", err);
            setLoadingUpdateAlertMessage(messageId,`Updating price for ${name} failed. Please try again later`, "error");
        }
    };

    const handleBuyItem = async (name: string, tokenId: number, price: string) => {
        const messageId = setLoadingAlertMessage(`Buying ${name} in progress. Please wait...`);

        try {
            await simulateContract(config, {
                abi: ARBITMARKETPLACE_ABI,
                address: arbitMarketplaceAddress,
                functionName: "buyItem",
                args: [BigInt(tokenId)],
                value: parseEther(price),
            }).catch((err) => {
                console.error("Simulation to buy item failed with ", err);
            });

            await buyItem({
                address: arbitMarketplaceAddress,
                args: [BigInt(tokenId)],
                value: parseEther(price),
            });

            if (isBuyError) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Buying ${name} failed. Please try again later`, "error");
            } else if (isBought) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Buying ${name} successful`, "success");
            }

            await getUserListedItems();
            await getAllListedItems();
            await getUserOwnedItems();
            setLoadingUpdateAlertMessage(messageId,`Buying ${name} successful`, "success");
        } catch (err: any) {
            console.error("Failed to buy item:", err);
            setLoadingUpdateAlertMessage(messageId,`Buying ${name} failed. Please try again later`, "error");
        }
    };

    const handlePlacingBid = async (name: string, tokenId: number, bid: string) => {
        const messageId = setLoadingAlertMessage(`Placing bid for ${name} in progress. Please wait...`);
        try {
            await simulateContract(config, {
                abi: ARBITMARKETPLACE_ABI,
                address: arbitMarketplaceAddress,
                functionName: "placeBid",
                args: [BigInt(tokenId)],
                value: parseEther(bid),
            }).catch((err) => {
                console.error("Simulation to place bid failed with ", err);
            });

            await placeBid({
                address: arbitMarketplaceAddress,
                args: [BigInt(tokenId)],
                value: parseEther(bid),
            });

            if (isPlaceBidError) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Placing bid for ${name} failed. Please try again later`, "error");
            } else if (isPlacedBid) {
                await getUserListedItems();
                await getAllListedItems();
                await getUserOwnedItems();
                setLoadingUpdateAlertMessage(messageId,`Placing bid for ${name} successful`, "success");
            }

            await getUserListedItems();
            await getAllListedItems();
            await getUserOwnedItems();
            setLoadingUpdateAlertMessage(messageId,`Placing bid for ${name} successful`, "success");
        } catch (err: any) {
            console.error("Failed to place bid:", err);
            setLoadingUpdateAlertMessage(messageId,`Placing bid for ${name} failed. Please try again later`, "error");
        }
    };

    return (
        <ThemeProvider theme={theme}>
        <AppContexts.Provider
        value={{
            chainId,
            mySpaceships,
            myStats,
            allUserStats,
            ownedItems,
            allListedNfts,
            userListedItems,
            isConnected,
            account,
            srcBalance,
            dstBalance,
            transferTxnHash,
            formatDateTime,
            setSpaceShipsImage,
            setSrcBalance,
            setDstBalance,
            setErrorAlertMessage,
            setInfoAlertMessage,
            handleMintSpaceship,
            getUserOwnedSpaceships,
            getWalletBalance,
            ethDeposit,
            ethWithdraw,
            handleSaveGameSession,
            fetchUserGameStats,
            fetchAllUserGameStats,
            handleMintItems,
            getUserOwnedItems,
            handleApprove,
            handleListItems,
            getAllListedItems,
            getUserListedItems,
            handleCancelListing,
            handleEndAuction,
            handleUpdatePrice,
            handleBuyItem,
            handlePlacingBid,
            handleAcceptBid,
        }}>
            {children}
        </AppContexts.Provider>
        </ThemeProvider>
    )
};

export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <AlertProvider>
            <AppContextProvider>{children}</AppContextProvider>
        </AlertProvider>
    );
};