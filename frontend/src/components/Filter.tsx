"use client";
import React, { useState, FC } from "react";
import { FaSearch } from "react-icons/fa";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const ITEM_HEIGHT = 48;

interface SideFilterProps {
    setSearchQuery: (query: string) => void;
    setPriceRange: (range: { min: number; max: number }) => void;
    rarity: string;
    setRarity: (rarity: string) => void;
};

const options = [
    'All',
    'Common',
    'Uncommon',
    'Rare',
    'Epic',
    'Legendary'
];

const SideFilter: FC<SideFilterProps> = ({ setSearchQuery, setPriceRange, rarity, setRarity }) => {
    const [searchQuery, setSearchQueryState] = useState<string>("");
    const [priceRange, setPriceRangeState] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        setRarity(target.textContent as string);
        setAnchorEl(null);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQueryState(query);
        setSearchQuery(query);
    };

    const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
        const value = Number(event.target.value);
        const newPriceRange = { ...priceRange, [type]: value };
        setPriceRangeState(newPriceRange);
        setPriceRange(newPriceRange);
    };

    return (
        <div className='flex flex-row gap-12 justify-between items-center w-full px-40 py-2 mt-2'>
            <div className='flex flex-col'>
                <button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    className="
                    items-center ml-8 max-w-32 py-2 border-white border-2 rounded-md 
                    hover:bg-gray-800 hover:text-white cursor-pointer transition-colors duration-300"
                >
                    <h3>{rarity !== "" ? rarity : "Filter By Rarity"}</h3>
                </button>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
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
                    {options.map((option) => (
                        <MenuItem
                            key={option}
                            onClick={handleClose}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </Menu>
                <div className='flex flex-row items-center gap-2 ml-8 mt-4'>
                    <FaSearch />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search item name..."
                        className="rounded-md text-black pl-2 py-1"
                    />
                </div>
            </div>
            <div className='flex flex-col mr-8 gap-2'>
                <h3>Price Range</h3>
                <div className='flex flex-row'>
                    <label>
                        Min:
                        <input
                            type="number"
                            value={priceRange.min}
                            step={0.01}
                            placeholder="ETH"
                            onChange={(e) => handlePriceChange(e, "min")}
                            className="mr-6 ml-2 rounded-md text-black pl-2 py-1"
                        />
                    </label>
                    <label>
                        Max:
                        <input
                            type="number"
                            value={priceRange.max}
                            step={0.01}
                            placeholder="ETH"
                            onChange={(e) => handlePriceChange(e, "max")}
                            className="ml-2 rounded-md text-black pl-2 py-1"
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default SideFilter;