import { useEffect, useState, useRef } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { ARBITRUM_SEPOLIA, SEPOLIA, DEFAULT_VALUE } from '../utils/SupportedTokens';
import { useAppContext } from '../context/AppContext';

import { withAuth } from './auth/withAuth';
import Link from 'next/link';

interface MenuItem {
    key: string;
    name: string;
}

const TransferToken = () => {
    const { chainId, srcBalance, dstBalance, transferTxnHash, setSrcBalance, setDstBalance, getWalletBalance, ethDeposit, ethWithdraw, setErrorAlertMessage } = useAppContext();
    const menu: MenuItem[] = [
        { key: ARBITRUM_SEPOLIA, name: ARBITRUM_SEPOLIA },
        { key: SEPOLIA, name: SEPOLIA },
    ];

    const INSUFFICIENT_VALUE = 'Insufficient balance';
    const ENTER_AMOUNT = 'Enter an amount';
    const SEND = 'Send';

    const [defaultValue, setDefaultValue] = useState<string>(DEFAULT_VALUE(chainId));
    const [selectedItem, setSelectedItem] = useState<string>(defaultValue);
    const [menuItems, setMenuItems] = useState<MenuItem[]>(getFilteredItems(defaultValue));
    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [sendBtnText, setSendBtnText] = useState(ENTER_AMOUNT);
    const [isLoading, setIsLoading] = useState(false);

    function getFilteredItems(ignoreValue: string): MenuItem[] {
        return menu.filter(item => item.key !== ignoreValue);
    }

    useEffect(() => {
        setDefaultValue(DEFAULT_VALUE(chainId));
    }, [chainId]);

    useEffect(() => {
        setSelectedItem(defaultValue);
    }, [defaultValue]);

    useEffect(() => {
        setMenuItems(getFilteredItems(selectedItem));
    }, [selectedItem]);

    useEffect(() => {
        if (selectedItem === ARBITRUM_SEPOLIA) {
            getWalletBalance(421614, setSrcBalance);
            setRecipient(SEPOLIA);
        } else if (selectedItem === SEPOLIA) {
            getWalletBalance(11155111, setSrcBalance);
            setRecipient(ARBITRUM_SEPOLIA);
        }
    },[selectedItem]);
    
    useEffect(() => {
        if (recipient === ARBITRUM_SEPOLIA) {
            getWalletBalance(421614, setDstBalance);
        } else if (recipient === SEPOLIA) {
            getWalletBalance(11155111, setDstBalance);
        }
    },[recipient]);

    const handleSendTransaction = async () => {
        setIsLoading(true);
        try {
            if (selectedItem === SEPOLIA && chainId === 11155111) {
                await ethDeposit(421614, Number(amount));
            } else if (selectedItem === ARBITRUM_SEPOLIA && chainId === 421614) {
                await ethWithdraw(421614, Number(amount));
            } else {
                setErrorAlertMessage('Unsupported chain. Please switch to Ethereum Sepolia or Arbitrum Sepolia.');
            }
        } catch (error: any) {
            console.error('Error during transfer:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSendBtnClassName = () => {
        let className = 'p-4 w-full my-2 rounded-xl text-lg'
        className +=
        sendBtnText === ENTER_AMOUNT
            ? ' text-zinc-400 bg-zinc-800 pointer-events-none'
            : ' bg-[#6b9ed7] text-white hover:bg-[#182432] hover:text-white'
        className += sendBtnText === INSUFFICIENT_VALUE ? ' bg-rose-700 pointer-events-none text-white' : ''
        return className;
    };

    const updtaeBtnText = (tokenBalance: number, value: string) => {
        if (tokenBalance >= Number(value) && value !== '') {
            setSendBtnText(SEND);
        } else if (value === '') {
            setSendBtnText(ENTER_AMOUNT);
        } else {
            setSendBtnText(INSUFFICIENT_VALUE);
        }
    };

    useEffect(() => {
        updtaeBtnText(srcBalance, amount);
    },[srcBalance, amount]);

    return (
        <div className='felx flex-col items-center bg-zinc-900 w-[35%] p-4 px-6 rounded-xl place-self-center'>
            <div className='flex items-center justify-between py-4 px-1'>
                <p className='text-white font-semibold text-xl'>Token Transfer</p>
            </div>
            <div className='relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-[2px] border-transparent hover:border-zinc-600'>
                <div className="flex items-center rounded-xl mb-4">
                    <input
                        className="w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent"
                        type="number"
                        placeholder="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className='flex flex-col gap-2'>
                        <Dropdown className="min-w-0 w-fit bg-slate-200 rounded-md" placement="bottom-end" isDisabled={true}>
                            <DropdownTrigger
                                style={{
                                    backgroundColor: '#182432',
                                    color: '#6b9ed7'
                                }}
                                className="w-fit rounded-md py-2"
                                disabled
                            >
                                <Button className='text-white px-8'>
                                    {selectedItem}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label='Dynamic Actions'
                                items={menuItems}
                                onAction={(key) => {
                                    setSelectedItem(key as string);
                                    setMenuItems(getFilteredItems(key as string));
                                }}
                            >
                            {(item: MenuItem) => (
                                <DropdownItem
                                    aria-label='srcToken'
                                    key={item.key}
                                    className='text-black'
                                >
                                {item.name}
                                </DropdownItem>
                            )}
                            </DropdownMenu>
                        </Dropdown>

                        <div className='text-end'>Balance: {srcBalance} ETH</div>
                    </div>
                </div>

                <ArrowDownwardIcon 
                    className='absolute left-1/2 z-10 -translate-x-1/2 -bottom-6 size-10 p-1 
                    bg-[#212429] border-4 border-zinc-900 text-zinc-300 rounded-xl hover:scale-110' 
                />
            </div>

            <div className='relative bg-[#212429] p-4 py-6 rounded-xl mb-2 border-[2px] z-0 border-transparent hover:border-zinc-600'>
                <div className="flex items-center rounded-xl mb-4">
                    <input
                        className="w-full outline-none h-8 px-2 appearance-none text-3xl bg-transparent"
                        type="text"
                        placeholder="Recipient Address"
                        value={recipient}
                        readOnly
                    />
                </div>
                <div className='text-end'>Balance: {dstBalance} ETH</div>
            </div>

            {transferTxnHash && (
                <div className='text-center w-full'>
                    <Link href={transferTxnHash} target="_blank" rel="noopener noreferrer" className='text-blue-500 underline'>
                        Link to transaction hash
                    </Link>
                </div>
            )}

            <button
                className={getSendBtnClassName()}
                onClick={() => {
                    if (sendBtnText === SEND) {
                        handleSendTransaction();
                    }
                }}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : sendBtnText}
            </button>
        </div>
    );
};

export default withAuth(TransferToken);
