"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton } from '@mui/material';
import { useAccount } from "wagmi";
import Image from 'next/image';
import Divider from '@mui/material/Divider';

import {  CollectedItem, useAppContext } from '../../context/AppContext';
import ItemCollectedModal from '../../components/ItemCollectedModal';
import Canvas from '../../Games/Canvas';
import spaceships from '../../utils/spaceships';
import items from '../../utils/items';
import { aliens } from '../../utils/enemy';
import { bosses } from '../../utils/enemy';
import ArrowRight from '../../images/arrowright.svg';

const Homepage = () => {
    const router = useRouter();
    const { 
        account, 
        mySpaceships, 
        chainId, 
        myStats, 
        allUserStats,
        setSpaceShipsImage, 
        getUserOwnedSpaceships, 
        setErrorAlertMessage, 
        fetchUserGameStats, 
        fetchAllUserGameStats 
    } = useAppContext();
    const [hp, setHp] = useState<number>();
    const [scores, setScores] = useState(0);
    const [ship, setShip] = useState();
    const [collectedItems, setCollectedItems] = useState<CollectedItem[]>([]);
    const [startGame, setStartGame] = useState(false);
    const [open, setOpen] = useState(false);
    const [clickedItems, setClickedItems] = useState<{ [key: string]: boolean }>({});
    const [selectedItems, setSelectedItems] = useState<CollectedItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const selectedItemsRef = useRef(selectedItems);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = collectedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(collectedItems.length / itemsPerPage);

    useEffect(() => {
        selectedItemsRef.current = selectedItems;
    }, [selectedItems]);

    const handleStartGame = (ship: any) => {
        if (chainId === 421614) {
            setShip(ship);
            setStartGame(true);
            setOpen(false);
        } else {
            setErrorAlertMessage('This feature is currently only available on Arbitrum Sepolia Testnet');
        }
    };

    const handleChangePage = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleClose = () => {
        setOpen(false);
        setStartGame(false);
    };

    const handleSelectItem = useCallback((id: number, name: string) => {
        setCollectedItems(prevItems => {
            if (!prevItems) return [];
            
            const isCurrentlyCollected = prevItems.some(item => item.id === id && item.collected);
            const shouldCollect = !isCurrentlyCollected;
            
            // Update collection status for all items with the same name
            const updatedItems = prevItems.map(item =>
                item.name === name ? { ...item, collected: shouldCollect } : item
            );
            
            setSelectedItems(prev => {
                if (shouldCollect) {
                    // Add only one item with the same name
                    const itemToAdd = updatedItems.find(item => item.name === name && item.collected);
                    return itemToAdd ? [...prev.filter(item => item.name !== name), itemToAdd] : prev;
                } else {
                    // Remove all items with the same name
                    return prev.filter(item => item.name !== name);
                }
            });
            
            return updatedItems;
        });
        
        setClickedItems(prev => {
            const newClickedItems: Record<number, boolean> = { ...prev };
            
            currentItems.forEach(item => {
                if (item.name === name) {
                    newClickedItems[item.id] = !prev[id]; // Toggle the clicked state
                }
            });
            
            return newClickedItems;
        });
    }, [currentItems]);
    
    useEffect(() => {
        if (hp === 0) {
            setOpen(true);
        }
    }, [hp]);

    useEffect(() => {
        const fetchData = async () => {
            await getUserOwnedSpaceships();
            await fetchUserGameStats();
            await fetchAllUserGameStats();
        };

        fetchData();
    }, [account]);

    const handleLeaderboard = () => {
        router.push('/Leaderboard');
    };

    const handleHome = () => {
        setStartGame(false);
    };

    const getTop10Leaderboard = useCallback(() => {
        if (!allUserStats) return [];
    
        return Object.entries(allUserStats)
            .map(([ index, {address, gamesPlayed, bestScore, spaceship }]) => ({
                address,
                gamesPlayed,
                bestScore,
                spaceship,
            }))
            .sort((a, b) => b.bestScore - a.bestScore)
            .slice(0, 10);
    }, [allUserStats]);   

    return (
        <div style={{minHeight: '75vh'}} className='flex flex-col gap-4 items-center justify-center mt-20'>
            {useAccount().isConnected ? (
                <div className='flex flex-col items-center w-full'>
                    {!startGame ? (
                        <div className='flex flex-col'>
                            <div className='flex flex-col gap-y-4 mx-5 sm:mx-20 lg:mx-28 py-10'>
                                <h1 className='text-3xl font-bold text-center'>🚀 Welcome to, Arbinvader!</h1>
                            </div>
                            <div className='flex flex-col items-center gap-12 max-w-screen w-full px-8'>
                                <h1 className='text-center text-2xl font-bold'>Choose your Spaceship</h1>
                                <div className='flex flex-col p-6 max-w-max'>
                                    <h2 className='w-full text-2xl text-center'>Free Spaceships</h2>
                                    <div className='grid grid-flow-col auto-cols-auto gap-8 justify-center p-8'>
                                        <IconButton onClick={() => handleStartGame(spaceships[0])}>
                                            <div className='rounded-md bg-transparent hover:scale-150 hover:shadow-[0_0_10px_#6b9ed7] 
                                                hover:m-4 transition duration-500'
                                            >
                                                <img src={spaceships[0].icon} className='size-32 hover:scale-x-105'/>
                                            </div>
                                        </IconButton>
                                    </div>

                                    <h2 className='w-full text-2xl text-center mt-4'>Purchased Spaceship</h2>
                                    <div className='grid grid-flow-col auto-cols-auto gap-8 justify-center p-8'>
                                        {mySpaceships.map((myShip: any, index: number) => (
                                            <IconButton onClick={() => handleStartGame(myShip)} key={index}>
                                                <div className='rounded-md bg-transparent hover:scale-150 hover:shadow-[0_0_10px_#6b9ed7] 
                                                    hover:m-4 transition duration-500'
                                                >
                                                    <img src={myShip.icon} className='size-32 hover:scale-x-105'/>
                                                </div>
                                            </IconButton>
                                        ))}
                                    </div>

                                    <div className="text-3xl font-bold text-center text-white mb-3">How To Play:</div>
                                    <div className="text-2xl font-bold text-center text-white">
                                        Press the &quot;Spacebar&quot; button to shoot, Left Control (CTRL) to shoot laser, and arrows to move left or right!
                                    </div>
                                </div>

                                <Divider orientation="horizontal" variant="fullWidth" className='self-center bg-white mt-0 w-full'/>

                                <div className='flex flex-col p-6 w-full max-w-4xl items-center'>
                                    <div className='xl:w-full max-w-[1000px] flex flex-col items-center gap-y-9 mx-5 sm:mx-8 md:mx-9 xl:mx-auto 
                                        pt-14 pb-20 md:pb-10 lg:pb-32 xl:pb-20'
                                    >
                                        <div className='flex sm:flex-row flex-col items-center gap-y-2 px-2 sm:px-0 w-full'>
                                            <h2 className='w-full text-2xl text-center font-bold'>Top 10 Leaderboard</h2>
                                            <a onClick={handleLeaderboard} className='flex items-center justify-between font-semibold ml-auto border 
                                                border-grayscale-2 rounded-lg px-4 py-2 w-full sm:w-auto hover:bg-gray-800 cursor-pointer transition-colors duration-300'
                                            >
                                                <span>Leaderboard</span>
                                                <Image src={ArrowRight} className='ml-2 mr-6' width={24} height={24}  alt="Arrow right" />
                                            </a>
                                        </div>
                                        <div className='w-full overflow-x-auto'>
                                            <table className='w-full border-collapse rounded-md overflow-hidden'>
                                                <thead>
                                                    <tr className='bg-gray-300 dark:bg-gray-700'>
                                                        <th className='p-2 text-left font-bold'>Rank</th>
                                                        <th className='p-2 text-left font-bold'>User Address</th>
                                                        <th className='p-2 text-right font-bold'>Score</th>
                                                        <th className='p-2 text-right font-bold'>Games Played</th>
                                                        <th className='p-2 text-center font-bold'>Spaceship</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getTop10Leaderboard().map((user, index) => (
                                                        <tr key={index} 
                                                            className={`border-b last:border-b-0 ${user.address === account ? 
                                                                'bg-gray-200 dark:bg-gray-600' : ''}`}
                                                        >
                                                            <td className='p-2 text-left font-semibold'>{index + 1}</td>
                                                            <td className='p-2 text-left font-mono'>
                                                                {`0x${user.address.substring(2, 6)}...${user.address.substring(user.address.length - 5)}`}
                                                            </td>
                                                            <td className='p-2 text-right'>{user.bestScore.toLocaleString()}</td>
                                                            <td className='p-2 text-right'>{user.gamesPlayed.toLocaleString()}</td>
                                                            <td className='flex flex-row- flex-wrap justify-evenly items-center gap-2 p-2 text-left'>
                                                                {user.spaceship}
                                                                <img src={setSpaceShipsImage(user.spaceship)} className='w-10 h-10'/>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col items-center'>
                            <Canvas
                                setScores={setScores}
                                ship={ship}
                                aliens={aliens}
                                bosses={bosses}
                                items={items}
                                setHp={setHp}
                                setCollectedItems={setCollectedItems}
                            />
                            <div>
                                <button onClick={handleHome} className='bg-white rounded-md px-4 py-2 mt-4 text-black hover:bg-transparent hover:text-white hover:border hover:border-white'>Back to home</button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <h1 className='w-full text-center text-3xl'>Please connect your wallet</h1>
            )}

            <ItemCollectedModal 
                open={open}
                myStats={myStats}
                collectedItems={collectedItems} 
                selectedItems={selectedItems} 
                currentItems={currentItems} 
                scores={scores} 
                totalPages={totalPages} 
                clickedItems={clickedItems} 
                handleClose={handleClose} 
                handleChangePage={handleChangePage} 
                handleSelectItem={handleSelectItem} 
                ship={ship}
                />
        </div>
    )
}

export default Homepage;
