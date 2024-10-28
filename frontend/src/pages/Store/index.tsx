"use client";
import { FC, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import Style from './store.module.css';
import spaceships from '../../utils/spaceships';
import { Ship, ShipStatsProps, StatCardProps, SpaceshipVisualProps, SpaceshipStatsProps } from '../../Ship';
import { useAppContext, ListedItem } from '../../context/AppContext';
import ListedItems from '../../components/ListedItems';
import ArrowRight from '../../images/arrowright.svg';
import { withAuth } from '../../components/auth/withAuth';
import TransferToken from '../../components/TransferToken';

const StatCard: FC<StatCardProps> = ({ label, value }) => (
    <div className='grid grid-rows-2 mb-2'>
        <div className='font-semibold'>{label}</div>
        <div className='bg-[#4c5773] p-1 text-white rounded-full'>
            <div className='place-self-center text-center justify-self-center'>{value}</div>
        </div>
    </div>
);

const ShipStats: FC<ShipStatsProps> = ({ ship }) => {
    const stats = [
        { label: 'Health Points', value: ship.hp },
        { label: 'Max Energy', value: ship.maxEnergy },
        { label: 'Energy Recovery', value: ship.energyRegen },
        { label: 'Laser Size', value: ship.laserWidth },
        { label: 'Laser Damage', value: ship.laserDamage },
        { label: 'Bullet', value: ship.bullet }
    ];

    return (
        <div className='grid grid-cols-3 text-[#4c5773] text-center mt-2 gap-2 justify-center'>
            {stats.map((stat, index) => (
                <StatCard key={index} label={stat.label} value={stat.value} />
            ))}
        </div>
    );
};

const Store: NextPage = () => {
    const router = useRouter();
    const { 
        mySpaceships, 
        allListedNfts, 
        account, 
        chainId,
        handleMintSpaceship, 
        getUserOwnedSpaceships, 
        setErrorAlertMessage, 
        getUserOwnedItems,
        getAllListedItems,
    } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const fetchData = async () => {
        setIsLoading(true);
        
        await getUserOwnedSpaceships();
        await getUserOwnedItems();
        await getAllListedItems();

        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [account]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = allListedNfts?.slice(indexOfFirstItem, indexOfLastItem) || [];
    const totalPages = Math.ceil((allListedNfts?.length || 0) / itemsPerPage);

    const handleChangePage = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleBuySpaceShip = async (ship: any) => {
        if (ship.price === 0 || mySpaceships.some(myShip => myShip.name === ship.name)) {
            return;
        } else if (chainId !== 421614) {
            setErrorAlertMessage('This feature is currently only available on Arbitrum Sepolia Testnet');
            return;
        }

        const visuals: SpaceshipVisualProps = {
            name: ship.name,
            icon: ship.icon,
            images: ship.images,
            laserColor: ship.laserColor
        };

        const stats: SpaceshipStatsProps = {
            hp: ship.hp,
            maxEnergy: ship.maxEnergy,
            energyRegen: ship.energyRegen,
            laserWidth: ship.laserWidth,
            laserDamage: ship.laserDamage,
            bullet: ship.bullet,
            width: ship.width,
            height: ship.height,
            maxFrame: ship.maxFrame
        };

        await handleMintSpaceship(visuals, stats, ship.price);
        await fetchData();
    };

    const handleItemStore = () => {
        router.push('/ItemStore');
    };

    return (
        <div style={{ minHeight: '75vh' }} className='flex flex-col gap-6 justify-center mt-20'>
            <h1 className='w-full text-3xl font-bold text-center mt-2'>Store</h1>

            <TransferToken />

            <div className={`${Style.NFTCard} flex flex-row flex-wrap gap-6 pt-10 justify-center`}>
                {spaceships.map((ship: Ship, i: number) => (
                    <div className={Style.NFTCard_box} key={i} onClick={() => handleBuySpaceShip(ship)}>
                        <div className={Style.NFTCard_box_img}>
                            <img src={ship.icon} alt="Spaceship images" width={256} height={256} className={Style.NFTCard_box_img_img} />
                        </div>

                        <div className={Style.NFTCard_box_update}>
                            <div className={Style.NFTCard_box_update_left}>
                                <div className={Style.NFTCard_box_update_left_price}>
                                    {mySpaceships.some(myShip => myShip.name === ship.name) || ship.price === 0 ? 
                                    <p className='text-green-300'>Owned</p> : <p>{ship.price} ETH</p>}
                                </div>
                            </div>

                            <div className={Style.NFTCard_box_update_right}>
                                <div className={Style.NFTCard_box_update_right_info}>
                                    <p>{ship.name}</p>
                                </div>
                            </div>
                        </div>

                        <ShipStats ship={ship} />
                    </div>
                ))}
            </div>

            <div className='xl:w-full max-w-6xl flex flex-col items-center gap-y-9 mx-5 sm:mx-8 
                md:mx-9 xl:mx-auto pt-14 pb-20 md:pb-10 lg:pb-32 xl:pb-20'
            >
                <div className='flex sm:flex-row flex-col items-center gap-y-2 px-2 sm:px-0 w-full'>
                    <h1 className='w-full text-3xl text-start font-bold'>Listed NFT Items</h1>
                    <a onClick={handleItemStore} 
                        className='inline-flex items-center justify-end font-semibold ml-auto border border-grayscale-2 
                        rounded-lg px-4 py-2 w-full sm:w-auto hover:bg-gray-800 hover:text-white cursor-pointer 
                        transition-colors duration-300'
                    >
                        <span className="whitespace-nowrap">View All</span>
                        <Image src={ArrowRight} className='ml-2 flex-shrink-0' width={20} height={20} alt="Arrow right" />
                    </a>
                </div>
                <ListedItems isLoading={isLoading} currentItems={currentItems} totalPages={totalPages} handleChangePage={handleChangePage}/>
            </div>
        </div>
    );
};

export default withAuth(Store);