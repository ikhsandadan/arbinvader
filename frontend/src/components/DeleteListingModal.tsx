import { useState } from 'react';
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

const DeleteListingModal = ({
    open, 
    onClose,
	item,
} :  {open: boolean, onClose: () => void, item: ListedItem }) => {
	const { handleCancelListing, getUserOwnedItems } = useAppContext();

	const onSubmit = async () => {
		await handleCancelListing(item?.tokenId);
		await getUserOwnedItems();
		onClose();
	};

    return (
        <Modal
			aria-labelledby="delete-listing-modal"
			aria-describedby="delete-listing-modal"
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
						<h3 className='text-xl mb-4'>Are you sure you want to remove {item?.name} from listing?</h3>
						<img src={item?.image} alt={item?.name} className='w-24 h-24 mx-auto' />
						<div className="flex justify-center gap-2">
							<button onClick={onSubmit} className='bg-red-600 rounded-md my-2 px-2 py-1 text-white hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max'>Delete</button>
							<button onClick={onClose} className='bg-white rounded-md my-2 px-2 py-1 text-black hover:bg-transparent hover:text-white hover:border hover:border-white max-w-max'>Cancel</button>
						</div>
					</div>
				</Box>
			</Fade>
		</Modal>
    )
}

export default DeleteListingModal;