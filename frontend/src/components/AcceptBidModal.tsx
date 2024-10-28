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

const AcceptBidModal = ({
    open, 
    onClose,
	getRarityColor,
	item,
} :  {open: boolean, onClose: () => void, getRarityColor: (rarity: string) => string, item: ListedItem }) => {
	const { handleAcceptBid, getAllListedItems } = useAppContext();

	const onSubmit = async () => {
		console.log("Accepting Bid: ", item);
		await handleAcceptBid(item.name, item.tokenId);
		await getAllListedItems();
		onClose();
	};

    return (
        <Modal
			aria-labelledby="accept-bid-modal"
			aria-describedby="accept-bid-modal"
			open={open}
			onClose={onClose}
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
						<h3 className='text-xl mb-4'>Confirmation to accept bid</h3>
						<img src={item?.image} alt={item?.name} className='w-24 h-24 mx-auto' />
						<p className='text-center text-lg font-bold'>{item?.name}</p>
						<p className={`${getRarityColor(item?.rarity)} text-md font-semibold text-center`}>{item?.rarity}</p>
                        <p className='text-md font-semibold text-center text-yellow-500'>Highest Bid: {item?.highestBid} ETH</p>
                        <p className='text-md font-semibold text-center'>
                            Highest Bidder: {`0x${item?.highestBidder.substring(2, 6)}...${item?.highestBidder.substring(item?.highestBidder.length - 5)}`}
                        </p>
						<div className="flex justify-center gap-2 mt-4">
							<button onClick={onSubmit} className='bg-green-600 rounded-md my-2 px-4 py-1 text-white hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max'>Confirm</button>
							<button onClick={onClose} className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max'>Cancel</button>
						</div>
					</div>
				</Box>
			</Fade>
		</Modal>
    )
}

export default AcceptBidModal;