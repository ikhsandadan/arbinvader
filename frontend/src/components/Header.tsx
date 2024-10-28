"use client";
import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link";
import { useRouter, usePathname } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useAlert } from "../provider/AlertProvider";
import { useAppContext } from '../context/AppContext';

const pages = [
    {name:'Home', link: '/'}, 
    {name: 'Store', link: '/Store'},
    {name: 'Leaderboard', link: '/Leaderboard'},
    {name: 'Profile', link: '/Profile'},
];

const ITEM_HEIGHT = 48;

const Header = () => {
    const router = useRouter();
    const pathName = usePathname();
    const { isConnected, account, chainId, setErrorAlertMessage, fetchAllUserGameStats } = useAppContext();
    const { notification, setNotification } = useAlert();
    const [badge, setBadge] = useState<number>(0);
    const sortedNotifications = [...notification].reverse();
    const [currentPage, setCurrentPage] = useState<string>('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const clearAllNotifications = () => {
        localStorage.removeItem('arbinvader-notification');
        setNotification([]);
    };

    useEffect(() => {
        if (chainId !== 11155111 && chainId !== 421614 && isConnected) (
            setErrorAlertMessage('Please switch to Arbitrum Sepolia or Ethereum Sepolia')
        )
    },[chainId]);

    useEffect(() => {
        setBadge(notification.length);
    }, [notification]);

    useEffect(() => {
        if (pathName === '/') {
            setCurrentPage('Home');
        } else if (pathName === '/Store') {
            setCurrentPage('Store');
        } else if (pathName === '/Profile') {
            setCurrentPage('Profile');
        } else if (pathName === '/Leaderboard') {
            setCurrentPage('Leaderboard');
        }
    },[pathName]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchAllUserGameStats();
        };

        fetchData();
    },[account]);

    const notifications = sortedNotifications.map((notif, index) => (
        <MenuItem key={index.toString()}>{notif}</MenuItem>
    ));

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" color='transparent'>
                <Toolbar className='flex place-items-center'>
                    <div className='flex gap-4'>
                        <div className='text-4xl text-[#e3e3e3] font-semibold'>ARBINVADER</div>
                    </div>
                    {isConnected && (
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }} className="flex space-x-2 place-items-center ml-6">
                            {pages.map((page) => (
                                <Button key={page.name} sx={{color: 'white'}} className={`font-semibold bg-[#091a1f] hover:border hover:rounded-full hover:px-6 py-2 rounded-full ${currentPage === page.name ? 'bg-[#f5f5f5] text-[#091a1f]' : 'hover:bg-[#f5f5f5] hover:text-[#091a1f]'}`}>
                                    <Link href={page.link}>{page.name}</Link>
                                </Button>
                            ))}
                        </Box>
                    )}
                    
                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: { xs: 'none', md: 'flex' } }} className='gap-5'>
                        {isConnected && (
                            <>
                            <IconButton
                                size="medium"
                                aria-label={`show ${badge} new notifications`}
                                color="inherit"
                                onClick={handleClick}
                            >
                                <Badge badgeContent={badge} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'center',
                                }}
                                slotProps={{
                                    paper: {
                                        style: {
                                            maxHeight: ITEM_HEIGHT * 5.5,
                                        },
                                    },
                                }}
                            >
                                {notifications.length > 0 ? notifications : (
                                    <MenuItem>No Notifications</MenuItem>
                                )}
                                {notifications.length > 0 && (
                                    <MenuItem onClick={clearAllNotifications}>
                                        <button className='w-full p-2 rounded-md bg-red-500 text-white hover:text-red-500 hover:bg-white'>
                                            Clear all notifications
                                        </button>
                                    </MenuItem>
                                )}
                            </Menu>
                            </>
                        )}
                        
                        <ConnectButton />
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Header;
