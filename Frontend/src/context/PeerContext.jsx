import { createContext, useEffect, useMemo, useState, useCallback } from "react";

export const PeerContext = createContext(null);

export const PeerProvider = (props) => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302", // Public STUN server
          },
        ],
      }),
    []
  );

  const [remoteStreams, setRemoteStreams] = useState([]);

  // Create and send an offer
  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    console.log("Offer created and set as local description:", offer);
    return offer;
  };

  // Create and send an answer
  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const ans = await peer.createAnswer();
    await peer.setLocalDescription(ans);
    console.log("Answer created and set as local description:", ans);
    return ans;
  };

  // Set the remote answer
  const setRemoteans = async (ans) => {
    await peer.setRemoteDescription(ans);
    console.log("Remote answer set successfully!");
  };

  // Send local media stream to peer
  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
    console.log("Local stream tracks added to peer connection.");
  };

  // Handle remote tracks and add them to remote streams
  const handlePeerEvents = useCallback((ev) => {
    const streams = ev.streams;
    if (streams.length > 0) {
      console.log("New remote stream received:", streams[0]);
      setRemoteStreams((prevStreams) => [...prevStreams, streams[0]]);
    }
  }, []);

  // Handle negotiationneeded event to create and send offer
  const handleNegotiationNeeded = useCallback(async () => {
    console.log("Negotiation needed. Creating and sending new offer...");
    const offer = await createOffer(); // Create offer during renegotiation
    // Emit the offer to the other peer (handle it on socket level)
    props.onNegotiationNeeded && props.onNegotiationNeeded(offer);
  }, [createOffer, props]);

  useEffect(() => {
    if (peer) {
      console.log("Adding event listeners...");

      // Listen for remote tracks
      peer.addEventListener("track", handlePeerEvents);

      // Listen for negotiation needed event
      peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

      return () => {
        console.log("Removing event listeners...");
        peer.removeEventListener("track", handlePeerEvents);
        peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
      };
    }
  }, [peer, handlePeerEvents, handleNegotiationNeeded]);

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteans,
        sendStream,
        remoteStreams,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
