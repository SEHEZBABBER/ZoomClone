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

        socket.on("call-accepted", (data) => {
            const { username, ans } = data;
            const socketId = usernameToidMap[username];
            if (socketId) {
                socket.to(socketId).emit("call-accepted", { ans });
            }
        });

        socket.on("call-user", (data) => {
            const { username, offer } = data;
            const fromUsername = socketIdTousernameMap[socket.id];
            const id = usernameToidMap[username];
            if (id) {
                socket.to(id).emit("incomming-call", { from: fromUsername, offer });
            }
        });

        socket.on("join-call", (path) => {
            let username = path.username;
            let id = socket.id;
            usernameToidMap[username] = id;
            socketIdTousernameMap[id] = username;

            if (!connections[path.meetingNumber]) {
                connections[path.meetingNumber] = [];
            }
            connections[path.meetingNumber].push(socket.id);
            timeOnline[socket.id] = new Date();

            for (let a = 0; a < connections[path.meetingNumber].length; a++) {
                if (socket.id !== connections[path.meetingNumber][a]) {
                    io.to(connections[path.meetingNumber][a]).emit("user-joined", username);
                }
            }

            if (messages[path.meetingNumber]) {
                for (let a = 0; a < messages[path.meetingNumber].length; a++) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path.meetingNumber][a]["data"],
                        messages[path.meetingNumber][a]["sender"],
                        messages[path.meetingNumber][a]["socket-id-sender"]
                    );
                }
            }

            socket.emit("joined-call", path.meetingNumber);
        });

        socket.on("signal", (toid, message) => {
            io.to(toid).emit("signal", socket.id, message);
        });

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
                    io.to(connections[meetingRoom][i]).emit("chat-message", data, sender, socket.id);
                }
            }
        });

        socket.on("disconnect", () => {
            let diffTime = new Date() - timeOnline[socket.id];
            let meetingRoom = null;

            for (let path in connections) {
                if (connections[path].includes(socket.id)) {
                    meetingRoom = path;
                    connections[path] = connections[path].filter((elem) => elem !== socket.id);

                    if (connections[path].length === 0) {
                        delete connections[path];
                    }
                    break;
                }
            }

            if (meetingRoom) {
                for (let i = 0; i < connections[meetingRoom]?.length; i++) {
                    io.to(connections[meetingRoom][i]).emit("user-left", socket.id);
                }
            }

            delete usernameToidMap[socketIdTousernameMap[socket.id]];
            delete socketIdTousernameMap[socket.id];
            delete timeOnline[socket.id];
        });
    });

    return io;
};