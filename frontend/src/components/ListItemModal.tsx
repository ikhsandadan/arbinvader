"use client";
import { FC, useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import { useAppContext, ItemToList } from '../context/AppContext';
import { withAuth } from './auth/withAuth';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4,
    border: '2px solid #ffffff',
    bgcolor: 'rgba(0,0,0,0.7)',
};

interface ListItemModalProps {
    open: boolean;
    item: any;
    handleClose: () => void;
};

const ListItemModal: FC<ListItemModalProps> = ({ open, item, handleClose }) => {
    const { handleListItems, getUserListedItems } = useAppContext();
    const [durationValue, setDurationValue] = useState<string>('0');
    const [durationType, setDurationType] = useState<string>('minutes');
    const [itemToBeListed, setItemToBeListed] = useState<ItemToList>({
        tokenId: item?.tokenId,
        name: item?.name,
        rarity: item?.rarity,
        image: item?.image,
        price: '',
        allowBids: false,
        auctionDuration: 0,
    });

    useEffect(() => {
        if (item) {
            setItemToBeListed({
                tokenId: item.tokenId,
                name: item.name,
                rarity: item.rarity,
                image: item.image,
                price: '',
                allowBids: false,
                auctionDuration: 0,
            })
        }
    },[item]);

    let rarityColor;
    switch (item?.rarity) {
        case 'Common':
            rarityColor = 'text-white';
            break;
        case 'Uncommon':
            rarityColor = 'text-green-500';
            break;
        case 'Rare':
            rarityColor = 'text-blue-500';
            break;
        case 'Epic':
            rarityColor = 'text-purple-500';
            break;
        case 'Legendary':
            rarityColor = 'text-red-500';
            break;
        default:
            rarityColor = 'text-white';
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === 'durationValue') {
            setDurationValue(e.target.value);
            const seconds = calculateSeconds(parseFloat(e.target.value), durationType);
            setItemToBeListed(prev => ({
                ...prev,
                auctionDuration: seconds
            }));
        } else if (e.target.name === 'durationType') {
            setDurationType(e.target.value);
            const seconds = calculateSeconds(parseFloat(durationValue), e.target.value);
            setItemToBeListed(prev => ({
                ...prev,
                auctionDuration: seconds
            }));
        } else if (e.target.name === 'allowBids') {
            setItemToBeListed({
                ...itemToBeListed,
                [e.target.name]: e.target.value === 'true',
            });
        } else {
            setItemToBeListed({
                ...itemToBeListed,
                [e.target.name]: e.target.type === 'number' ? e.target.value : e.target.value,
            });
        }
    };

    const calculateSeconds = (value: number, type: string): number => {
        switch (type) {
            case 'minutes':
                return value * 60;
            case 'hours':
                return value * 60 * 60;
            case 'days':
                return value * 24 * 60 * 60;
            default:
                return 0;
        }
    };

    const handleList = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Listing item:", itemToBeListed);
        await handleListItems(itemToBeListed);
        await getUserListedItems();
        handleClose();
    };

    const handleOnClose = () => {
        handleClose();
        setItemToBeListed({
            tokenId: item.tokenId,
            name: item.name,
            rarity: item.rarity,
            image: item.image,
            price: '',
            allowBids: false,
            auctionDuration: 0,
        });
        setDurationValue('0');
        setDurationType('hours');
    };

    return (
        <Modal
            open={open}
            onClose={handleOnClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
        >
            <Box sx={style} className="rounded-md">
                <form className="flex flex-col items-center p-2 max-w-xl" onSubmit={handleList}>
                    <div className="flex flex-col items-center p-2 max-w-xl">
                        <h3 className='text-center font-semibold'>{item?.name}</h3>
                        <p className={`text-center mt-2 font-semibold ${rarityColor}`}>{item?.rarity}</p>
                        <img src={item?.image} className='w-24 h-24' alt="Item" />
                    </div>
                    <label className='block mb-2 text-sm font-medium'>Price</label>
                    <input
                        type="number"
                        step="0.00001"
                        name='price'
                        id='price'
                        placeholder='ETH'
                        className='mb-2 p-2 text-black max-w-min rounded-md text-center'
                        onChange={handleInputChange}
                        required
                    />
                    <div className='flex flex-col gap-2 items-center'>
                        <label className='block mb-2 text-sm font-medium'>Allow Bids</label>
                        <select
                            name='allowBids'
                            className='mb-2 p-2 text-black max-w-min rounded-md text-center cursor-pointer'
                            onChange={handleInputChange}
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                        
                        {itemToBeListed.allowBids && (
                            <div className='flex flex-col gap-2'>
                                <label className='block mb-2 text-sm font-medium text-center'>Auction Duration</label>
                                <div className='flex gap-2'>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        name='durationValue'
                                        value={durationValue}
                                        className='mb-2 p-2 text-black w-24 rounded-md text-center'
                                        onChange={handleInputChange}
                                    />
                                    <select
                                        name='durationType'
                                        value={durationType}
                                        className='mb-2 p-2 text-black w-24 rounded-md text-center cursor-pointer'
                                        onChange={handleInputChange}
                                    >
                                        <option value="minutes">Minutes</option>
                                        <option value="hours">Hours</option>
                                        <option value="days">Days</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='flex flex-row gap-2'>
                        <button className="bg-white rounded-md my-2 px-4 py-2 text-black hover:bg-transparent 
                            hover:text-white hover:border hover:border-white"
                        >
                            List your items
                        </button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default withAuth(ListItemModal);