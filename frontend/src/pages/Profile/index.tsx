"use client";
import React, { useEffect, useState } from 'react';

import { useAppContext, ListedItem, AuctionEndStatus } from '../../context/AppContext';
import { withAuth } from '../../components/auth/withAuth';
import ListItemModal from '../../components/ListItemModal';
import DeleteListingModal from '../../components/DeleteListingModal';
import EditListingModal from '../../components/EditListingModal';
import AcceptBidModal from '../../components/AcceptBidModal';
import CircularProgress from '@mui/material/CircularProgress';

interface Item {
    name: string;
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
    image: string;
    tokenId: string | number;
};

// Constants
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
const RARITY_COLORS = {
    Common: 'text-white',
    Uncommon: 'text-green-500',
    Rare: 'text-blue-500',
    Epic: 'text-purple-500',
    Legendary: 'text-red-500'
} as const;

// NFT Card Component for Listed Items
const ListedNFTCard = ({ 
    item, 
    account,
    isAuctionEnded,
    formatDateTime,
    onEdit,
    onRemove,
    onAcceptBid,
    onEndAuction,
    getRarityColor
}: {
    item: ListedItem;
    account: string;
    isAuctionEnded: boolean;
    formatDateTime: (time: number) => string;
    onEdit: (item: ListedItem) => void;
    onRemove: (item: ListedItem) => void;
    onAcceptBid: (item: ListedItem) => void;
    onEndAuction: (item: ListedItem) => void;
    getRarityColor: (rarity: string) => string;
}) => {
    const truncateAddress = (address: string) => 
        `0x${address.substring(2, 6)}...${address.substring(address.length - 5)}`;

    const hasHighestBidder = item.highestBidder !== EMPTY_ADDRESS;

    return (
        <div className='flex flex-col place-content-center items-center gap-2 bg-black/70
            border rounded-lg p-2 w-[300px] h-[500px]'>
            <h3 className='text-center text-xl font-semibold'>{item.name}</h3>
            <p className={`text-center font-semibold ${getRarityColor(item.rarity)}`}>
                {item.rarity}
            </p>
            <img src={item.image} alt={item.name} className='w-24 h-24' />
            <p className='text-md'>Listed Price: {item.price} ETH</p>

            {item.allowBids && (
                <div className='flex flex-col gap-2 items-center mt-2'>
                    <p className='text-lg font-semibold text-center'>Auction data</p>
                    {hasHighestBidder && (
                        <>
                            <p className='text-md font-semibold text-center text-yellow-500'>
                                Highest Bid: {item.highestBid} ETH
                            </p>
                            <p className='text-md text-center'>
                                Highest Bidder: {truncateAddress(item.highestBidder)}
                            </p>
                        </>
                    )}
                    {isAuctionEnded ? (
                        <>
                            <p className='text-md text-center'>Auction ended</p>
                            {hasHighestBidder && (
                                <button
                                    className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent 
                                        hover:text-white hover:border hover:border-white max-w-max'
                                    onClick={() => onEndAuction(item)}
                                >
                                    End Auction
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <p className='text-md'>Auction end time: {formatDateTime(item.endTime)}</p>
                            {hasHighestBidder && (
                                <button
                                    className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent 
                                        hover:text-white hover:border hover:border-white max-w-max'
                                    onClick={() => onAcceptBid(item)}
                                >
                                    Accept Bid ({item.highestBid} ETH)
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            <div className='flex flex-wrap gap-3'>
                {!item?.allowBids ? (
                    <button
                        className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent 
                            hover:text-white hover:border hover:border-white max-w-max'
                        onClick={() => onEdit(item)}
                    >
                        Edit Listing Price
                    </button>
                ) : null}

                <button
                    className='bg-red-600 rounded-md my-2 px-2 py-1 text-white hover:bg-transparent 
                        hover:text-white hover:border hover:border-white max-w-max'
                    onClick={() => onRemove(item)}
                >
                    Remove Listing
                </button>
            </div>
        </div>
    );
};

const Profile = () => {
    const { 
        account,
        mySpaceships, 
        ownedItems, 
        myStats,
        allUserStats,
        userListedItems,
        formatDateTime,
        setSpaceShipsImage,
        fetchUserGameStats,
        fetchAllUserGameStats,
        getUserOwnedItems,
        getUserListedItems,
        handleEndAuction,
        setInfoAlertMessage,
    } = useAppContext();
    
    // State Management
    const [openModal, setOpenModal] = useState(false);
    const [itemToBeListed, setItemToBeListed] = useState<Item | null>(null);
    const [myPosition, setMyPosition] = useState(0);
    const [filteredOwnedItems, setFilteredOwnedItems] = useState<Item[]>([]);
    const [openDeleteListingModal, setOpenDeleteListingModal] = useState(false);
    const [openEditListingModal, setOpenEditListingModal] = useState(false);
    const [openAcceptBidModal, setOpenAcceptBidModal] = useState(false);
    const [listingToBeRemoved, setListingToBeRemoved] = useState<ListedItem | null>(null);
    const [listingToBeEdited, setListingToBeEdited] = useState<ListedItem | null>(null);
    const [listingToAcceptBid, setListingToAcceptBid] = useState<ListedItem | null>(null);
    const [isAuctionEnded, setIsAuctionEnded] = useState<AuctionEndStatus>({});
    const [isLoading, setIsLoading] = useState(false);

    // Handlers
    const handleListing = (item: Item) => {
        setItemToBeListed(item);
        setOpenModal(true);
    };

    const handleEditListing = (item: ListedItem) => {
        setListingToBeEdited(item);
        setOpenEditListingModal(true);
    };

    const handleRemoveListing = (item: ListedItem) => {
        setListingToBeRemoved(item);
        setOpenDeleteListingModal(true);
    };

    const handleAcceptBid = (item: ListedItem) => {
        setListingToAcceptBid(item);
        setOpenAcceptBidModal(true);
    };

    const handleEndAuctionButton = async (item: ListedItem) => {
        setIsLoading(true);
        try {
            await handleEndAuction(item);
            await getUserListedItems();
            await getUserOwnedItems();
        } finally {
            setIsLoading(false);
        }
    };

    const getRarityColor = (rarity: string): string => 
        RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || 'text-white';

    // Modal Close Handlers
    const handleCloseModal = () => setOpenModal(false);
    const handleDeleteListingModalClose = () => setOpenDeleteListingModal(false);
    const handleEditListingModalClose = () => setOpenEditListingModal(false);
    const handleAcceptBidModalClose = () => setOpenAcceptBidModal(false);

    // Effects
    useEffect(() => {
        const updateAuctionEndStatus = () => {
            if (userListedItems && userListedItems.length > 0) {
                const newAuctionEndStatus: AuctionEndStatus = {};
                userListedItems.forEach(item => {
                    const endTime = formatDateTime(item.endTime);
                    newAuctionEndStatus[item.tokenId.toString()] = new Date() >= new Date(endTime);
                });
                setIsAuctionEnded(newAuctionEndStatus);
            }
        };
    
        updateAuctionEndStatus();
        const intervalId = setInterval(updateAuctionEndStatus, 1000);
        return () => clearInterval(intervalId);
    }, [userListedItems, formatDateTime]);

    useEffect(() => {
        if (isAuctionEnded.ended) {
            setInfoAlertMessage("Auction for your item has ended.");
        }
    }, [isAuctionEnded, setInfoAlertMessage]);

    useEffect(() => {
        const fetchData = async () => {
            if (account) {
                setIsLoading(true);
                try {
                    await Promise.all([
                        fetchUserGameStats(),
                        fetchAllUserGameStats(),
                        getUserOwnedItems(),
                        getUserListedItems()
                    ]);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [account]);

    useEffect(() => {
        const index = (allUserStats ?? []).findIndex(user => user.address === account);
        setMyPosition(index !== -1 ? index + 1 : 0);
    }, [allUserStats, account]);

    useEffect(() => {
        if (ownedItems && userListedItems) {
            const listedItemTokenId = new Set(userListedItems.map(item => item.tokenId));
            const filtered = ownedItems.filter(item => !listedItemTokenId.has(item.tokenId));
            setFilteredOwnedItems(filtered);
        }
    }, [ownedItems, userListedItems]);

    // Render Loading State
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CircularProgress color="secondary" size={50}/>
            </div>
        );
    }

    return (
        <div style={{minHeight: '75vh'}} className='w-full sm:p-14 p-5 min-h-screen text-white mt-20'>
            <h1 className='text-2xl font-bold'>My Profile</h1>

            {/* Address Section */}
            <div className='flex flex-col border rounded-lg p-5 mt-6'>
                <p className='font-semibold pb-2'>My Address</p>
                <p className='ml-4'>{account}</p>
            </div>

            {myStats && (
                <div className='flex flex-row flex-wrap gap-2 justify-between mt-4 px-44'>
                    {/* Rank Section */}
                    <div className='flex flex-col place-content-center'>
                        <div className='font-semibold pb-2 mb-2'>My Rank</div>
                        <div className='px-4 py-2 border rounded-md max-w-max ml-4'>
                            <h1 className='text-4xl font-bold pb-2 px-2 text-yellow-400'>{myPosition}</h1>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className='flex flex-col place-content-center mt-2'>
                        <div className='font-semibold pb-2 mb-2'>My Stats</div>
                        <div className='flex flex-row flex-wrap gap-4'>
                            <ul className='list-disc ml-4'>
                                <li><strong>Best Score: {myStats?.bestScore}</strong></li>
                                <li><strong>Games Played: {myStats?.gamesPlayed}</strong></li>
                                <li>
                                    <div className='flex flex-row flex-wrap justify-evenly gap-2 items-center'>
                                        <strong>Spaceship: {myStats?.spaceship}</strong>
                                        <img src={setSpaceShipsImage(myStats?.spaceship as string)} className='w-10 h-10'/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Spaceships Collection Section */}
            {mySpaceships.length > 0 && (
                <div className='flex flex-col place-content-center mt-6'>
                    <div className='font-semibold pb-2 mb-2'>My Spaceships Collections</div>
                    <div className='flex flex-row flex-wrap gap-4'>
                        {mySpaceships.map((myShip, index) => (
                            <div key={index} className='flex flex-col gap-2 place-content-center items-center bg-black/70 border rounded-lg p-2'>
                                <h3 className='text-center font-semibold'>{myShip.name}</h3>
                                <img src={myShip.icon} alt={myShip.name} className='size-44'/>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Owned Items Section */}
            {filteredOwnedItems.length > 0 && (
                <div className='flex flex-col place-content-center mt-8'>
                    <div className='font-semibold pb-2 mb-2'>My Collected Items</div>
                    {filteredOwnedItems.length > 0 && (
                        <div className='flex flex-row flex-wrap gap-4'>
                            {filteredOwnedItems.map((item, index) => (
                                <div key={index} className='flex flex-col gap-2 bg-black/70  border rounded-lg p-2 items-center'>
                                    <h3 className='text-center font-semibold'>{item.name}</h3>
                                    <p className={`text-center font-semibold ${getRarityColor(item.rarity)}`}>
                                        {item.rarity}
                                    </p>
                                    <img src={item.image} alt={item.name} className='w-24 h-24' />
                                    <button
                                        className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent 
                                            hover:text-white hover:border hover:border-white max-w-max'
                                        onClick={() => handleListing(item)}
                                    >
                                        List in Marketplace
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {/* Listed Items Section */}
            {userListedItems && userListedItems.length > 0 && (
                <div className='flex flex-col place-content-center mt-8'>
                    <div className='font-semibold pb-2 mb-2'>My Listed Items</div>
                    <div className='flex flex-row flex-wrap gap-4'>
                        {userListedItems.map((item, index) => (
                            <ListedNFTCard
                                key={index}
                                item={item}
                                account={account as string}
                                isAuctionEnded={isAuctionEnded[item.tokenId.toString()]}
                                formatDateTime={formatDateTime}
                                onEdit={handleEditListing}
                                onRemove={handleRemoveListing}
                                onAcceptBid={handleAcceptBid}
                                onEndAuction={handleEndAuctionButton}
                                getRarityColor={getRarityColor}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            <ListItemModal 
                open={openModal} 
                item={itemToBeListed} 
                handleClose={handleCloseModal} 
            />
            <DeleteListingModal 
                open={openDeleteListingModal} 
                onClose={handleDeleteListingModalClose} 
                item={listingToBeRemoved as ListedItem}
            />
            <EditListingModal 
                open={openEditListingModal} 
                onClose={handleEditListingModalClose} 
                item={listingToBeEdited as ListedItem} 
            />
            <AcceptBidModal
                open={openAcceptBidModal}
                onClose={handleAcceptBidModalClose}
                getRarityColor={getRarityColor}
                item={listingToAcceptBid as ListedItem}
            />
        </div>
    );
};

export default withAuth(Profile);
