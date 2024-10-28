"use client";
import { useState, useEffect, useMemo, useCallback } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Pagination from '@mui/material/Pagination';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Divider from '@mui/material/Divider';

import { useAppContext, ListedItem, AuctionEndStatus, Items } from '../../context/AppContext';
import { withAuth } from '../../components/auth/withAuth';
import Filter from '../../components/Filter';
import BuyListingModal from '../../components/BuyListingModal';
import PlacingBidModal from '../../components/PlacingBidModal';
import AcceptBidModal from '../../components/AcceptBidModal';
import ArrowLeft from '../../images/arrowleft.svg';

// Constants
const ITEMS_PER_PAGE = 12;
const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

// Rarity color mapping
const RARITY_COLORS = {
    Common: 'text-white',
    Uncommon: 'text-green-500',
    Rare: 'text-blue-500',
    Epic: 'text-purple-500',
    Legendary: 'text-red-500'
} as const;

// Component for displaying NFT item card
const NFTCard = ({ 
    item, 
    account, 
    isAuctionEnded, 
    formatDateTime, 
    onBuy, 
    onBid,
    onAcceptBid,
    buttonLoading,
    userOwnedItems 
}: {
    item: ListedItem;
    account: string;
    isAuctionEnded: boolean;
    formatDateTime: (time: number) => string;
    onBuy: (item: ListedItem) => void;
    onBid: (item: ListedItem) => void;
    onAcceptBid: (item: ListedItem) => void;
    buttonLoading: boolean;
    userOwnedItems: Items[];
}) => {
    const getRarityColor = (rarity: string): string => 
        RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || 'text-white';

    const truncateAddress = (address: string) => 
        `0x${address.substring(2, 6)}...${address.substring(address.length - 5)}`;

    const userOwnsItem = userOwnedItems.some(
        ownedItem => ownedItem.name === item.name && ownedItem.rarity === item.rarity
    );

    return (
        <div className='flex flex-col flex-wrap gap-2 p-2 border border-gray-300 rounded-lg 
            place-content-center items-center hover:bg-black hover:shadow-[0_0_10px_#ffffff] 
            hover:text-white transition duration-500 cursor-pointer w-[300px] h-[500px] bg-black/60'>
            <div className='w-24 h-24 p-2 mt-2'>
                <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
            </div>
            <h3 className='text-center text-xl font-bold'>{item.name}</h3>
            <p className={`${getRarityColor(item.rarity)} text-md font-semibold`}>{item.rarity}</p>
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

            {userOwnsItem && (
                <p className='text-yellow-500 text-center text-md font-semibold'>
                    You already own this item
                </p>
            )}

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

// Component for auction information
const AuctionInfo = ({ 
    item, 
    isAuctionEnded,
    formatDateTime,
    truncateAddress 
}: {
    item: ListedItem;
    isAuctionEnded: boolean;
    formatDateTime: (time: number) => string;
    truncateAddress: (address: string) => string;
}) => {
    if (!item.allowBids) return null;

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
                <p className='text-md text-center'>
                    {hasHighestBidder ? 'Auction ended' : 'No bids'}
                </p>
            ) : (
                <p className='text-md'>Auction end time: {formatDateTime(item.endTime)}</p>
            )}
        </div>
    );
};

// Component for action button (Buy/Bid)
const ActionButton = ({ 
    item,
    account,
    isAuctionEnded,
    buttonLoading,
    onBuy,
    onBid,
    onAcceptBid,
    userOwnsItem
}: {
    item: ListedItem;
    account: string;
    isAuctionEnded: boolean;
    buttonLoading: boolean;
    onBuy: (item: ListedItem) => void;
    onBid: (item: ListedItem) => void;
    onAcceptBid: (item: ListedItem) => void;
    userOwnsItem: boolean;
}) => {
    if (buttonLoading) {
        return <CircularProgress color="secondary" size={20}/>;
    }

    // Check if the current user is the seller
    const isSeller = item.seller === account;
    
    // Check if there's an active bid
    const hasActiveBid = item.highestBidder !== EMPTY_ADDRESS;
    
    // Check if the current user is the highest bidder
    const isHighestBidder = item.highestBidder === account;

    // // If user already owns the item, don't show any action buttons
    // if (userOwnsItem) {
    //     return null;
    // }

    // Seller view
    if (isSeller) {
        if (hasActiveBid && !isAuctionEnded && item.allowBids) {
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

    // Highest bidder view
    if (isHighestBidder) {
        return <p className='text-md font-semibold text-center text-[#6b9ed7]'>You are the highest bidder</p>;
    }

    // Other users view
    if (!userOwnsItem) {
        if (!item.allowBids || (isAuctionEnded && !hasActiveBid)) {
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
    
        if (!isAuctionEnded && item.allowBids) {
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
        return null;
    }

    return null;
};

const ItemStore = () => {
    const router = useRouter();
    const { account, allListedNfts, ownedItems, getAllListedItems, formatDateTime } = useAppContext();
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ buttonLoading, setButtonLoading ] = useState(false);
    const [ isAuctionEnded, setIsAuctionEnded ] = useState<AuctionEndStatus>({});
    const [ openBuyListingModal, setOpenBuyListingModal ] = useState(false);
    const [ openBidListingModal, setOpenBidListingModal ] = useState(false);
    const [ openAcceptBidModal, setOpenAcceptBidModal ] = useState(false);
    const [ selectedItem, setSelectedItem ] = useState<ListedItem | null>(null);
    const [ filteredItems, setFilteredItems ] = useState<any>(allListedNfts);
    const [ searchQuery, setSearchQuery ] = useState<string>('');
    const [ priceRange, setPriceRange ] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
    const [ rarity, setRarity ] = useState<string>('');

    // Memoized calculations
    const totalPages = useMemo(() => 
        Math.ceil((filteredItems?.length || 0) / ITEMS_PER_PAGE), 
        [filteredItems]
    );

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredItems?.slice(start, end) || [];
    }, [filteredItems, currentPage]);

    // Handlers
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

    const handleBack = () => {
        router.push('/Store');
    };

    // Effects
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

    useEffect(() => {
        const fetchListedNfts = async () => {
            setIsLoading(true);
            try {
                await getAllListedItems();
            } finally {
                setIsLoading(false);
            }
        };

        fetchListedNfts();
    }, [account]);

    useEffect(() => {
        if (allListedNfts) {
            const filterNfts = () => {
                return allListedNfts.filter((nft) => {
                    const matchesRarity = rarity === '' || rarity === 'All' || nft.rarity === rarity;
                    const matchesSearch = searchQuery === '' || nft.name.toLowerCase().includes(searchQuery.toLowerCase());
                    const price = parseFloat(nft.price);
                    const matchesPriceRange = 
                        (priceRange.min === 0 && priceRange.max === 0) ||
                        (priceRange.max === 0 && price >= priceRange.min) ||
                        (price >= priceRange.min && price <= priceRange.max);
    
                    return matchesRarity && matchesSearch && matchesPriceRange;
                });
            };

            setFilteredItems(filterNfts());
        }

    }, [rarity, searchQuery, priceRange, allListedNfts]);

    return (
        <div style={{ minHeight: '75vh' }} className='flex flex-col gap-6 justify-center mt-20'>
            <h1 className='w-full text-center text-3xl mt-2'>Item Store</h1>
            <div className='ml-48'>
                <a onClick={handleBack} 
                    className='inline-flex items-center justify-end font-semibold ml-auto border 
                    border-grayscale-2 rounded-lg px-4 py-2 w-full sm:w-auto hover:bg-gray-800 
                    hover:text-white cursor-pointer transition-colors duration-300'
                >
                    <Image src={ArrowLeft} className='mr-2 flex-shrink-0' width={20} height={20} alt="Arrow right" />
                    <span className="whitespace-nowrap">Back to Store</span>
                </a>
            </div>

            <Filter setSearchQuery={setSearchQuery} setPriceRange={setPriceRange} rarity={rarity} setRarity={setRarity}/>

            <Divider orientation="horizontal" variant="fullWidth" className='self-center bg-white mb-6 mt-0 w-10/12'/>
            
            <div className='flex flex-row gap-4 mx-10 mt-4 flex-wrap items-center justify-center'>
                {isLoading ? (
                    <CircularProgress color="secondary" size={50}/>
                ) : (
                    currentItems.map((item: any, i: number) => (
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
                            userOwnedItems={ownedItems}
                        />
                    ))
                )}
            </div>

            {currentItems.length > 0 && (
                <div className='flex justify-center my-4 text-white'>
                    <Pagination 
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, page) => setCurrentPage(page)}
                        variant="outlined"
                        shape="rounded"
                        color='secondary'
                        sx={{
                            '& .MuiPaginationItem-root': {
                                color: 'white',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </div>
            )}

            {selectedItem && (
                <>
                    <BuyListingModal
                        open={openBuyListingModal}
                        onClose={handleModalClose}
                        setButtonLoading={setButtonLoading}
                        getRarityColor={color => RARITY_COLORS[color as keyof typeof RARITY_COLORS] || 'text-white'}
                        item={selectedItem}
                    />
                    <PlacingBidModal
                        open={openBidListingModal}
                        onClose={handleModalClose}
                        getRarityColor={color => RARITY_COLORS[color as keyof typeof RARITY_COLORS] || 'text-white'}
                        item={selectedItem}
                    />
                    <AcceptBidModal
                        open={openAcceptBidModal}
                        onClose={handleModalClose}
                        getRarityColor={color => RARITY_COLORS[color as keyof typeof RARITY_COLORS] || 'text-white'}
                        item={selectedItem}
                    />
                </>
            )}
        </div>
    );
};

export default withAuth(ItemStore);