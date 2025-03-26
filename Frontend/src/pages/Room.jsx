import { useContext, useEffect, useCallback, useState } from "react";
import { SocketContext } from "../context/socketContext";
import { PeerContext } from "../context/PeerContext";
import ReactPlayer from "react-player";

function Room() {
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteans,
    sendStream,
    remoteStreams,
  } = useContext(PeerContext);
  const socket = useContext(SocketContext);

  // Handle new user joining the call
  const handleNewUserJoined = useCallback(
    async (username) => {
      console.log(`${username} joined`);
      const offer = await createOffer(); // Create an offer for the new user
      socket.emit("call-user", { username, offer }); // Send offer to the new user
    },
    [socket, createOffer]
  );

  // Handle incoming call with an offer
  const handleIncommingCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("Incoming call from:", from, offer);
      let ans = await createAnswer(offer); // Create answer for the incoming offer
      console.log("Answer created:", ans);
      socket.emit("call-accepted", { username: from, ans }); // Send answer back to caller
    },
    [createAnswer, socket]
  );

  // Handle accepted call with the answer
  const handleCallAccepted = useCallback(
    async (data) => {
      let { ans } = data;
      console.log("Call accepted, setting remote answer:", ans);
      try {
        await setRemoteans(ans); // Set remote description
        console.log("Remote answer set successfully!");
      } catch (err) {
        console.error("Error setting remote answer:", err);
      }
    },
    [setRemoteans]
  );

  // Register and clean up event listeners
  useEffect(() => {
    console.log("Registering socket listeners...");
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      console.log("Cleaning up socket listeners...");
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleCallAccepted, handleIncommingCall, handleNewUserJoined]);

  const [MyStream, setMyStream] = useState(null);

  // Get local media stream
  const getUserMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
      console.log("Stream received:", stream);
      sendStream(stream); // ✅ Send stream after receiving it
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    getUserMediaStream();
  }, [sendStream]);

  return (
    <>
      {/* Display local video */}
      {MyStream && (
        <ReactPlayer
          url={MyStream} // ✅ Pass stream directly (no need for URL.createObjectURL)
          playing
          muted
          width="600px"
          height="400px"
        />
      )}

      {/* Map through remoteStreams and render each one */}
      {remoteStreams.map((stream, index) => (
        <ReactPlayer
          key={index}
          url={stream} // ✅ Pass remote stream directly
          playing
          muted={false} // Enable audio for remote streams
          width="600px"
          height="400px"
        />
      ))}
    </>
  );
}

export default Room;
