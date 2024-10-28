"use client";
import { FC, useState, FormEvent, ChangeEvent, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
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

const EditListingModal = ({ open, onClose, item }: { open: boolean, onClose: () => void, item: ListedItem }) => {
    const { handleUpdatePrice, getUserListedItems } = useAppContext();
    const [itemToBeListed, setItemToBeListed] = useState<ItemToList>({
        tokenId: item?.tokenId || 0,
        name: item?.name || '',
        rarity: item?.rarity || '',
        image: item?.image || '',
        price: item?.price || '',
        allowBids: item?.allowBids || false,
        auctionDuration: item?.endTime / 1000 || 0,
    });

    useEffect(() => {
        if (item) {
            setItemToBeListed({
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
        setItemToBeListed({ ...itemToBeListed, [name]: value });
    };

    const handleOnClose = () => {
        onClose();
        setItemToBeListed({
            tokenId: item.tokenId,
            name: item.name,
            rarity: item.rarity,
            image: item.image,
            price: item.price,
            allowBids: item.allowBids,
            auctionDuration: item.endTime / 1000,
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log("Edited item: ", itemToBeListed);
        await handleUpdatePrice(itemToBeListed.name, itemToBeListed.tokenId, itemToBeListed.price);
        await getUserListedItems();

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
                                <h3 className='text-xl mb-4'>Edit Listing for {item?.name}</h3>
                                <img src={item?.image} alt={item?.name} className='w-24 h-24 mx-auto' />
                                <form className='flex flex-col gap-2 items-center' onSubmit={handleSubmit}>
                                    <label className='block mb-2 text-sm font-medium'>Price</label>
                                    <input
                                        type="number"
                                        min="0.001"
                                        step="0.001"
                                        name='price'
                                        value={itemToBeListed?.price}
                                        placeholder='ETH'
                                        className='mb-2 p-2 text-black max-w-min rounded-md text-center'
                                        onChange={handleInputChange}
                                    />
                                    <div className="flex justify-center gap-2 mt-4">
                                        <button type="submit" className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max'>
                                            Submit
                                        </button>
                                        <button type="button" className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max' onClick={handleOnClose}>
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

export default EditListingModal;