import { createContext, useContext, useState, useEffect, Children} from "react";
import apiClient from "../api/apiClient";

const UserContext = createContext(null);


export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken){
            setLoading(false);
            return
        }

        try {
            const response = await apiClient.get('/users/me');
            setUser(response.data)
        } catch (error) {
            console.error("fetch user details error: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <UserContext.Provider value = {{user, fetchUser, setUser, loading}}>
            {!loading && children}
        </UserContext.Provider>
    );
}


export const useUser = () => {
    return useContext(UserContext);
}