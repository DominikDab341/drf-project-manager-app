import { createContext, useContext, useState, useEffect, Children} from "react";
import apiClient from "../api/apiClient";

const UserContext = createContext(null);


export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    

    const fetchUser = async () => {
        try {
            const response = await apiClient.get('/users/me');
            setUser(response.data)
        } catch (error) {
            console.error("fetch user details error: ", error);
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <UserContext.Provider value = {{user, fetchUser, setUser}}>
            {children}
        </UserContext.Provider>
    );
}


export const useUser = () => {
    return useContext(UserContext);
}