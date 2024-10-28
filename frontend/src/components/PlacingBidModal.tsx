"use client";
import { FC, useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import { parseEther } from 'viem';

import { useAppContext, ListedItem, ItemToList } from '../context/AppContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4,
    border: '2px solid #ffffff',
    bgcolor: 'rgba(0,0,0,0.7)',
};

const PlacingBidModal = ({ open, onClose, getRarityColor, item }: { open: boolean, onClose: () => void, getRarityColor: (rarity: string) => string, item: ListedItem }) => {
    const { handlePlacingBid, getAllListedItems } = useAppContext();
    const [itemToBid, setItemToBid] = useState<ItemToList>({
        tokenId: item?.tokenId || 0,
        name: item?.name || '',
        rarity: item?.rarity || '',
        image: item?.image || '',
        price: item?.price || '',
        allowBids: item?.allowBids || false,
        auctionDuration: item?.endTime ? item.endTime / 1000 : 0,
    });
    const [bid, setBid] = useState('');

    useEffect(() => {
        if (item) {
            setItemToBid({
                tokenId: item.tokenId,
                name: item.name,
                rarity: item.rarity,
                image: item.image,
                price: item.price,
                allowBids: item.allowBids,
                auctionDuration: item.endTime / 1000,
            });
        }
    }, [item]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBid(value);
    };

    const handleOnClose = () => {
        onClose();
        if (item) {
            setItemToBid({
                tokenId: item.tokenId,
                name: item.name,
                rarity: item.rarity,
                image: item.image,
                price: item.price,
                allowBids: item.allowBids,
                auctionDuration: item.endTime / 1000,
            });
            setBid('');
        }
        setBid('');
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Bid item: ", itemToBid);
        await handlePlacingBid(itemToBid.name, itemToBid.tokenId, bid);
        await getAllListedItems();
        handleOnClose();
    };

    return (
        <Modal
            aria-labelledby="edit-listing-modal"
            aria-describedby="edit-listing-modal"
            open={open}
            onClose={handleOnClose}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <Box sx={style} className="rounded-md" >
                    <div className='flex flex-col gap-2 items-center p-2'>
                        {item && (
                            <>
                            <h3 className='text-xl mb-4'>Placing bid for {item.name}</h3>
                            <img src={item.image} alt={item.name} className='w-24 h-24 mx-auto' />
                            <h3 className='text-center text-lg font-bold'>{item.name}</h3>
                            <p className={`${getRarityColor(item?.rarity)} text-md font-semibold`}>{item?.rarity}</p>
                            {item.highestBidder !== "0x0000000000000000000000000000000000000000" ? (
                                <>
                                <p className='text-md text-center'>Highest Bid: {item.highestBid} ETH</p>
                                <p className='text-md text-center'>
                                    Highest Bidder: {`0x${item.highestBidder.substring(2, 6)}...${item.highestBidder.substring(item.highestBidder.length - 5)}`}
                                </p>
                                </>
                            ) : (<p className='text-md text-center'>No bids</p>)}
                            <form className='flex flex-col gap-2 items-center' onSubmit={handleSubmit}>
                                <label className='block mb-2 text-sm font-medium'>Bid:</label>
                                <input
                                    type="number"
                                    min="0.001"
                                    step="0.001"
                                    name='price'
                                    value={bid}
                                    placeholder='ETH'
                                    className='mb-2 p-2 text-black max-w-min rounded-md text-center'
                                    onChange={handleInputChange}
                                />
                                <div className="flex justify-center gap-2 mt-4">
                                    <button type="submit" className='bg-white rounded-md my-2 px-2 py-1 text-black 
                                        hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max'
                                    >
                                        Submit
                                    </button>
                                    <button type="button" className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent 
                                        hover:text-white hover:border hover:border-white max-w-max' 
                                        onClick={handleOnClose}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                            </>
                        )}
                    </div>
                </Box>
            </Fade>
        </Modal>
    );
};

export default PlacingBidModal;