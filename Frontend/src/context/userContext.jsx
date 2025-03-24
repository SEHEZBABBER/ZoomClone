import { createContext , useState } from "react";
export const userContext = createContext();
export const UserProvider = ({children})=>{
    const [username,setusername] = useState(null);
    return (
        <userContext.Provider value={{username,setusername}}>
            {children}
        </userContext.Provider>
    );
}