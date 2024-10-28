import { useState, Dispatch, SetStateAction } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';

import { useAppContext, ListedItem } from '../context/AppContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    p: 4,
	border: '2px solid #ffffff',
	bgcolor: 'rgba(0,0,0,0.7)',
};

const BuyListingModal = ({
    open, 
    onClose,
	setButtonLoading,
	getRarityColor,
	item,
} :  {open: boolean, onClose: () => void, setButtonLoading: Dispatch<SetStateAction<boolean>>, getRarityColor: (rarity: string) => string, item: ListedItem }) => {
	const { handleBuyItem, getAllListedItems } = useAppContext();

	const onSubmit = async () => {
		console.log("Buy Listing: ", item);
		await handleBuyItem(item?.name, item?.tokenId, item?.price);
		await getAllListedItems();
		handleOnCLose();
	};

	const handleOnCLose = () => {
		setButtonLoading(false);
		onClose();
	};

    return (
        <Modal
			aria-labelledby="buy-listing-modal"
			aria-describedby="buy-listing-modal"
			open={open}
			onClose={handleOnCLose}
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}
		>
			<Fade in={open}>
				<Box sx={style} className="rounded-md">
					<div className='flexl flex-col gap-2 items-center p-2'>
						<h3 className='text-xl mb-4'>Confirmation to buy</h3>
						<img src={item?.image} alt={item?.name} className='w-24 h-24 mx-auto' />
						<p className='text-center text-lg font-bold'>{item?.name}</p>
						<p className={`${getRarityColor(item?.rarity)} text-md font-semibold text-center`}>{item?.rarity}</p>
                        <p className='text-md font-semibold text-center'>{item?.price} ETH</p>
						<div className="flex justify-center gap-2 mt-4">
							<button onClick={onSubmit} className='bg-green-600 rounded-md my-2 px-4 py-1 text-white hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max'>Buy</button>
							<button onClick={handleOnCLose} className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max'>Cancel</button>
						</div>
					</div>
				</Box>
			</Fade>
		</Modal>
    )
}

export default BuyListingModal;