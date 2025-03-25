import { useContext, useEffect } from "react";
import { SocketContext } from "../context/socketContext";
import { PeerContext } from "../context/PeerContext";
import { useCallback } from "react";

function Room() {
  const { peer, createOffer, createAnswer, setRemoteans } =
    useContext(PeerContext);
  const socket = useContext(SocketContext);
  const handleNewUserJoined = useCallback(
    async (username) => {
      console.log(`${username} joined`);
      const offer = await createOffer();
      socket.emit("call-user", { username, offer });
    },
    [socket, createOffer]
  );
  const handleIncommingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("In comming call form ", from, offer);
      let ans = await createAnswer(offer);
      socket.emit("call-accepted", { username: from, ans });
    },
    [createAnswer, socket]
  );
  const handleCallAccepted = useCallback(
    async (data) => {
      let { ans } = data;
      console.log("call accepted", ans); // this is not being printed 
      await setRemoteans(ans);
    },
    [setRemoteans]
  );
  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleCallAccepted);
    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket,handleCallAccepted,handleIncommingCall,handleNewUserJoined]);

  return <h1>Meeting Room</h1>;
}

export default Room;