"use client";
import { FC, useState, useCallback, useEffect, useMemo } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';

import { useAppContext, ListedItem, AuctionEndStatus, Items } from '../context/AppContext';
import BuyListingModal from '../components/BuyListingModal';
import PlacingBidModal from './PlacingBidModal';
import AcceptBidModal from './AcceptBidModal';

// Constants
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";
const RARITY_COLORS = {
    Common: 'text-white',
    Uncommon: 'text-green-500',
    Rare: 'text-blue-500',
    Epic: 'text-purple-500',
    Legendary: 'text-red-500'
} as const;

type Props = {
    isLoading: boolean;
    currentItems: ListedItem[];
    totalPages: number;
    handleChangePage: (newPage: number) => void;
};

// NFT Card Component
const NFTCard: FC<{
    item: ListedItem;
    account: string;
    isAuctionEnded: boolean;
    formatDateTime: (time: number) => string;
    onBuy: (item: ListedItem) => void;
    onBid: (item: ListedItem) => void;
    onAcceptBid: (item: ListedItem) => void;
    buttonLoading: boolean;
    userOwnedItems: Items[];
}> = ({ 
    item, 
    account, 
    isAuctionEnded, 
    formatDateTime, 
    onBuy, 
    onBid,
    onAcceptBid,
    buttonLoading,
    userOwnedItems 
}) => {
    const truncateAddress = (address: string) => 
        `0x${address.substring(2, 6)}...${address.substring(address.length - 5)}`;

    // Check if user already owns this type of item
    const userOwnsItem = useMemo(() => {
        return userOwnedItems.some(ownedItem => 
            ownedItem.name === item.name && 
            ownedItem.rarity === item.rarity
        );
    }, [userOwnedItems, item]);

    return (
        <div className='flex flex-col flex-wrap gap-2 p-2 border border-gray-300 rounded-lg 
            place-content-center items-center hover:bg-black hover:shadow-[0_0_10px_#ffffff] 
            hover:text-white transition duration-500 cursor-pointer w-[300px] h-[500px] bg-black/60'
        >
            <div className='w-24 h-24 p-2'>
                <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
            </div>
            <h3 className='text-center text-xl font-bold'>{item.name}</h3>
            <p className={`${RARITY_COLORS[item.rarity as keyof typeof RARITY_COLORS] || 'text-white'} text-md font-semibold`}>
                {item.rarity}
            </p>
            <p className='text-md font-semibold text-[#6b9ed7]'>{item.price} ETH</p>
            
            <div className='flex flex-col flex-wrap'>
                {item.seller !== account ? (
                    <>
                    <p className='text-center text-md font-semibold'>Seller:</p>
                    <p className='text-center text-md font-semibold'>{truncateAddress(item.seller)}</p>
                    </>
                ) : (
                    <p className='text-center text-md font-semibold'>This is your item</p>
                )}
            </div>

            {item.allowBids && (
                <AuctionInfo 
                    item={item}
                    isAuctionEnded={isAuctionEnded}
                    formatDateTime={formatDateTime}
                    truncateAddress={truncateAddress}
                />
            )}

            <ActionButton 
                item={item}
                account={account}
                isAuctionEnded={isAuctionEnded}
                buttonLoading={buttonLoading}
                onBuy={onBuy}
                onBid={onBid}
                onAcceptBid={onAcceptBid}
                userOwnsItem={userOwnsItem}
            />
        </div>
    );
};

// Auction Information Component
const AuctionInfo: FC<{
    item: ListedItem;
    isAuctionEnded: boolean;
    formatDateTime: (time: number) => string;
    truncateAddress: (address: string) => string;
}> = ({ item, isAuctionEnded, formatDateTime, truncateAddress }) => {
    const hasHighestBidder = item.highestBidder !== EMPTY_ADDRESS;

    return (
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
                <p className='text-md text-center'>{hasHighestBidder ? 'Auction ended' : 'No bids'}</p>
            ) : (
                <p className='text-md'>Auction end time: {formatDateTime(item.endTime)}</p>
            )}
        </div>
    );
};

// Action Button Component
const ActionButton: FC<{
    item: ListedItem;
    account: string;
    isAuctionEnded: boolean;
    buttonLoading: boolean;
    onBuy: (item: ListedItem) => void;
    onBid: (item: ListedItem) => void;
    onAcceptBid: (item: ListedItem) => void;
    userOwnsItem: boolean;
}> = ({ item, account, isAuctionEnded, buttonLoading, onBuy, onBid, onAcceptBid, userOwnsItem }) => {
    if (buttonLoading) {
        return <CircularProgress color="secondary" size={20}/>;
    }

    // Check if the current user is the seller
    const isSeller = item.seller === account;
    
    // Check if there's an active bid
    const hasActiveBid = item.highestBidder !== EMPTY_ADDRESS;
    
    // Define action conditions
    const canBuy = (isAuctionEnded && !hasActiveBid) || !item.allowBids;
    const canBid = !isAuctionEnded && item.allowBids && item.highestBidder !== account && !isSeller;
    const canAcceptBid = hasActiveBid && !isAuctionEnded && item.allowBids;
    const isHighestBidder = item.highestBidder === account;

    if (isSeller) {
        if (canAcceptBid) {
            return (
                <button 
                    className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent 
                        hover:text-white hover:border hover:border-white max-w-max'
                    onClick={() => onAcceptBid(item)}
                >
                    Accept Bid ({item.highestBid} ETH)
                </button>
            );
        }
        return <p className='text-md font-semibold text-center'>Your listing {hasActiveBid ? `(Current bid: ${item.highestBid} ETH)` : ''}</p>;
    }

    if (isHighestBidder) {
        return <p className='text-md font-semibold text-center text-[#6b9ed7]'>You are the highest bidder</p>;
    }

    if (!userOwnsItem) {
        if (canBuy) {
            return (
                <button 
                    className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent 
                        hover:text-white hover:border hover:border-white max-w-max'
                    onClick={() => onBuy(item)}
                >
                    Buy Now
                </button>
            );
        }
    
        if (canBid) {
            return (
                <button 
                    className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent 
                        hover:text-white hover:border hover:border-white max-w-max'
                    onClick={() => onBid(item)}
                >
                    Place Bid
                </button>
            );
        }
    } else if (userOwnsItem) {
        return <p className='text-md font-semibold text-center text-yellow-500'>You already own this item</p>;
    }

    return null;
};

const ListedItems: FC<Props> = ({ isLoading, currentItems, totalPages, handleChangePage }) => {
    const { account, allListedNfts, ownedItems, formatDateTime } = useAppContext();
    const [ buttonLoading, setButtonLoading ] = useState(false);
    const [ isAuctionEnded, setIsAuctionEnded ] = useState<AuctionEndStatus>({});
    const [ openBuyListingModal, setOpenBuyListingModal ] = useState(false);
    const [ openBidListingModal, setOpenBidListingModal ] = useState(false);
    const [ openAcceptBidModal, setOpenAcceptBidModal ] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState<ListedItem | null>(null);

    const handleBuy = useCallback((item: ListedItem) => {
        setButtonLoading(true);
        setSelectedItem(item);
        setOpenBuyListingModal(true);
    }, []);

    const handleBid = useCallback((item: ListedItem) => {
        setSelectedItem(item);
        setOpenBidListingModal(true);
    }, []);

    const handleAcceptBid = useCallback((item: ListedItem) => {
        setSelectedItem(item);
        setOpenAcceptBidModal(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setOpenBuyListingModal(false);
        setOpenBidListingModal(false);
        setOpenAcceptBidModal(false);
        setSelectedItem(null);
    }, []);

    const topList = useMemo(() => {
        if (!allListedNfts) return [];
    
        return Object.entries(allListedNfts)
            .map(([ _, item ]) => item)
            .slice(0, 3);
    }, [allListedNfts]);

    useEffect(() => {
        const updateAuctionEndStatus = () => {
            if (!allListedNfts?.length) return;

            const newStatus = allListedNfts.reduce((acc, item) => {
                acc[item.tokenId.toString()] = new Date() >= new Date(formatDateTime(item.endTime));
                return acc;
            }, {} as AuctionEndStatus);

            setIsAuctionEnded(newStatus);
        };

        updateAuctionEndStatus();
        const intervalId = setInterval(updateAuctionEndStatus, 1000);
        return () => clearInterval(intervalId);
    }, [allListedNfts]);

    return (
        <div className='flex flex-col flex-wrap'>
            {allListedNfts && (
                <div className='flex flex-row gap-4 mx-auto mt-4 flex-wrap items-center justify-center'>
                    {isLoading ? (
                        <CircularProgress color="secondary" size={50}/>
                    ) : (
                        topList.map((item, i) => (
                            <NFTCard
                                key={`${item.tokenId}-${i}`}
                                item={item}
                                account={account as string}
                                isAuctionEnded={isAuctionEnded[item.tokenId.toString()]}
                                formatDateTime={formatDateTime}
                                onBuy={handleBuy}
                                onBid={handleBid}
                                onAcceptBid={handleAcceptBid}
                                buttonLoading={buttonLoading}
                                userOwnedItems={ownedItems || []}
                            />
                        ))
                    )}
                </div>
            )}

            <div className='flex justify-center my-4 text-white'>
                {(currentItems?.length ?? 0) > 0 && (
                    <Pagination 
                        count={totalPages}
                        variant="outlined"
                        shape="rounded"
                        color='secondary'
                        onChange={(_, newPage) => handleChangePage(newPage)}
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                )}
            </div>

            {selectedItem && (
                <>
                    <BuyListingModal
                        open={openBuyListingModal}
                        onClose={handleModalClose}
                        setButtonLoading={setButtonLoading}
                        getRarityColor={rarity => RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || 'text-white'}
                        item={selectedItem}
                    />
                    <PlacingBidModal
                        open={openBidListingModal}
                        onClose={handleModalClose}
                        getRarityColor={rarity => RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || 'text-white'}
                        item={selectedItem}
                    />
                    <AcceptBidModal
                        open={openAcceptBidModal}
                        onClose={handleModalClose}
                        getRarityColor={rarity => RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || 'text-white'}
                        item={selectedItem}
                    />
                </>
            )}
        </div>
    );
};

export default ListedItems;