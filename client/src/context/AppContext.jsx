import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(null); // null means we don't know yet
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getAuthState = async () => {
        try {
            setIsLoading(true);
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth', { 
                withCredentials: true,
                timeout: 5000 // 5 second timeout
            });
            
            if (data?.success) {
                await getUserData();
                setIsLoggedin(true);
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Don't show error toast for auth check to prevent flash of error messages
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message);
        } catch (error) {
            toast.error(error.response.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
        getAuthState
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};