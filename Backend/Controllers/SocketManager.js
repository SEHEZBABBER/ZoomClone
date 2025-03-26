import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};
let usernameToidMap = {};
let socketIdTousernameMap = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        // Handle a user accepting a call
        socket.on("call-accepted", (data) => {
            const { username, ans } = data;
            const socketId = usernameToidMap[username];
            if (socketId) {
                console.log(`Emitting call-accepted to socket: ${socketId}`);
                io.to(socketId).emit("call-accepted", { ans }); // Emit to the correct socket
            } else {
                console.log(`No socket found for user: ${username}`);
            }
        });

        // Handle a user calling another user
        socket.on("call-user", (data) => {
            const { username, offer } = data;
            const fromUsername = socketIdTousernameMap[socket.id];
            const id = usernameToidMap[username];
            if (id) {
                console.log(`Emitting incoming call to: ${id}`);
                io.to(id).emit("incomming-call", { from: fromUsername, offer });
            }
        });

        // Handle a user joining the call
        socket.on("join-call", (path) => {
            let username = path.username;
            let id = socket.id;

            // Map username to socket.id
            usernameToidMap[username] = id;
            socketIdTousernameMap[id] = username;

            console.log(`User joined: ${username} with Socket ID: ${id}`);
            console.log("usernameToidMap: ", usernameToidMap);

            if (!connections[path.meetingNumber]) {
                connections[path.meetingNumber] = [];
            }
            connections[path.meetingNumber].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Notify all other users in the meeting that a new user joined
            for (let i = 0; i < connections[path.meetingNumber].length; i++) {
                if (socket.id !== connections[path.meetingNumber][i]) {
                    io.to(connections[path.meetingNumber][i]).emit(
                        "user-joined",
                        username
                    );
                }
            }

            // Send existing messages to the newly joined user
            if (messages[path.meetingNumber]) {
                for (let i = 0; i < messages[path.meetingNumber].length; i++) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path.meetingNumber][i]["data"],
                        messages[path.meetingNumber][i]["sender"],
                        messages[path.meetingNumber][i]["socket-id-sender"]
                    );
                }
            }

            socket.emit("joined-call", path.meetingNumber);
        });

        // Handle signaling
        socket.on("signal", (toid, message) => {
            io.to(toid).emit("signal", socket.id, message);
        });

        // Handle chat messages
        socket.on("chat-message", (data, sender) => {
            let meetingRoom = null;
            for (let path in connections) {
                if (connections[path].includes(socket.id)) {
                    meetingRoom = path;
                    break;
                }
            }

            if (meetingRoom) {
                if (!messages[meetingRoom]) {
                    messages[meetingRoom] = [];
                }
                messages[meetingRoom].push({
                    sender: sender,
                    data: data,
                    "socket-id-sender": socket.id,
                });

                for (let i = 0; i < connections[meetingRoom].length; i++) {
                    io.to(connections[meetingRoom][i]).emit(
                        "chat-message",
                        data,
                        sender,
                        socket.id
                    );
                }
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            let diffTime = new Date() - timeOnline[socket.id];
            let meetingRoom = null;

            for (let path in connections) {
                if (connections[path].includes(socket.id)) {
                    meetingRoom = path;
                    connections[path] = connections[path].filter(
                        (elem) => elem !== socket.id
                    );

                    if (connections[path].length === 0) {
                        delete connections[path];
                    }
                    break;
                }
            }

            if (meetingRoom) {
                for (let i = 0; i < connections[meetingRoom]?.length; i++) {
                    io.to(connections[meetingRoom][i]).emit(
                        "user-left",
                        socket.id
                    );
                }
            }

            delete usernameToidMap[socketIdTousernameMap[socket.id]];
            delete socketIdTousernameMap[socket.id];
            delete timeOnline[socket.id];
        });
    });

    return io;
};
