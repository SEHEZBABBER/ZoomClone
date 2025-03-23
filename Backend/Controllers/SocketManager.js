import { Server } from "socket.io"
let connections = {};
let messages = {};
let timeOnline = {};
export const connectToSocket = (server) =>{
    const io = new Server(server);
    io.on("connection",(socket)=>{
        socket.on("join-call",(path)=>{
            if(connections[path] === undefined){
                // there is no path like that in connection so youre the first one to join this path means youre the first one in this meeting 
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();
            // we are sending message of the new user joined to all the people that were in the meeting
            for(let a = 0;a<connections[path].length;a++){
                io.to(connections[path][a]).emit("user joined",socket.id);
            }
            // a new user joined now he should be able to see the conversation that has happend before he joined
            if(messages[path]!==undefined){
                for(let a = 0;a<messages[path].length;a++){
                    io.to(socket.id).emit("chat-message",messages[path][a]['data'],messages[path][a]['sender'],messages[path][a]['socket-id-sender']);
                }
            }
            // if there are no cnversattion before we are not sending anything this means it will show empty in the chat box
        })
        socket.on("signal",(toid,message)=>{
            io.to(toid).emit("signal",socket.id,message);
        })
        socket.on("chat-message",(data,sender)=>{
            // someone has send a message in a meeting so we will have to add that to messages
            // first we need to find that if meeting room exists in connection or not like 
            // it is not possible that it would no exist in a conneciton because there is no way that you will be able to send a message without being in a meeting but still we have to get in which meeting room has the message been sent 
            let meetingRoom = null;
            for(let path in connections){
                for(let j = 0;j<connections[path].length;j++){
                    if(connections[path][j] === socket.id){
                        meetingRoom = path;
                    }
                }
            }
            if(meetingRoom){
                // we found the meeting room 
                if(messages[meetingRoom] === undefined){
                    messages[meetingRoom] = [];
                }
                messages[meetingRoom].push({"sender":sender,"data":data,"socket-id-sender":socket.id});
                for(let i = 0;i<connections[meetingRoom].length;i++){
                    io.to(connections[meetingRoom][i]).emit("chat-message",data,sender,socket.id);
                }
            }
        })
        socket.on("disconnect",()=>{
            let diffTime = new Date() - timeOnline[socket.id];
            let meetinRoom;
            for(let path in connections){
                for(let i = 0;i<connections[path].length;i++){
                    if(connections[path][i] === socket.id){
                        meetingRoom = path;
                    connections[path] = connections[path].filter((elem)=>elem!==socket.id);
                    if(connections[path].length === 0)delete connections[path];
                    }
                }
            }
            if(meetinRoom){
                for(let i = 0;i<connections[meetinRoom].length;i++){
                    io.to(connections[meetinRoom][i]).emit("user-left",socket.id);
                }
            }
        })
    })
    return io;
}