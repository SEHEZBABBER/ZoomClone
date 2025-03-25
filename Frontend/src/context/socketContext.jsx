import React, { useMemo } from "react";
import { createContext } from "react";
import {io} from "socket.io-client";
export const SocketContext = createContext(null);
export const SocketProvider = (props)=>{
    const socket = useMemo(()=>io('http://localhost:8000'),[]);
    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
} 