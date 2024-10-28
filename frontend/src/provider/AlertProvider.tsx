"use client";
import {
    createContext,
    FC,
    ReactNode,
    useContext,
    useState,
    useEffect
} from "react";
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface AlertContextState {
    setSuccessAlertMessage: (message: string | null) => void;
    setInfoAlertMessage: (message: string | null) => void;
    setErrorAlertMessage: (message: string | null) => void;
    setLoadingAlertMessage: (message: string | null) => void;
    setLoadingUpdateAlertMessage: (id: any | null, message: string | null, type: ToastType | null) => void;
    notification: any[];
    setNotification: (notification: any[]) => void;
};

export const AlertContext = createContext<AlertContextState | undefined>(
    undefined
);

export function useAlert(): AlertContextState {
    const context = useContext(AlertContext);
    if (!context)
        throw new Error("useAlert must be used within an AlertProvider");
    return context;
};

export const AlertProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [notification, setNotification] = useState<any[]>([]);

    // To update and store notification
    useEffect(() => {
        let notifData = localStorage.getItem('arbinvader-notification');
        if (notifData) {
            setNotification(JSON.parse(localStorage.getItem('arbinvader-notification') as any));
        } else {
            localStorage.setItem('arbinvader-notification', JSON.stringify([]));
        }
    }, []);

    const setSuccessAlertMessage = (message: string | null) => {
        setNotification((prevNotification) => {
            const updatedNotification = [...prevNotification, message];
            localStorage.setItem('arbinvader-notification', JSON.stringify(updatedNotification));
            return updatedNotification;
        });

        return (
            toast.success(message)
        );
    };

    const setInfoAlertMessage = (message: string | null) => {
        setNotification((prevNotification) => {
            const updatedNotification = [...prevNotification, message];
            localStorage.setItem('arbinvader-notification', JSON.stringify(updatedNotification));
            return updatedNotification;
        });

        return (
            toast.info(message)
        );
    };

    const setErrorAlertMessage = (message: string | null) => {
        setNotification((prevNotification) => {
            const updatedNotification = [...prevNotification, message];
            localStorage.setItem('arbinvader-notification', JSON.stringify(updatedNotification));
            return updatedNotification;
        });

        return (
            toast.error(message)
        );
    };

    const setLoadingAlertMessage = (message: string | null) => {
        return toast.loading(message);
    };

    const setLoadingUpdateAlertMessage = (id: any | null, message: string | null, type: ToastType | null) => {
        setNotification((prevNotification) => {
            const updatedNotification = [...prevNotification, message];
            localStorage.setItem('arbinvader-notification', JSON.stringify(updatedNotification));
            return updatedNotification;
        });

        return toast.update(id, { 
            render: message, 
            type: type, 
            isLoading: false, 
            autoClose: 5000, 
            hideProgressBar: false, 
            closeOnClick: true,
            transition: Slide,
            pauseOnFocusLoss: true,
            rtl: false,
            draggable: true,
            theme: "dark",
            style: {width: 'auto'},
        });
        
    };

    return (
        <AlertContext.Provider
            value={{
                setSuccessAlertMessage,
                setInfoAlertMessage,
                setErrorAlertMessage,
                setLoadingAlertMessage,
                setLoadingUpdateAlertMessage,
                notification,
                setNotification,
            }}
        >
            {children}
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Slide}
                style={{width: 'auto'}}
            />
        </AlertContext.Provider>
    );
};