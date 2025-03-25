import { createContext, useMemo, useRef } from "react";

export const PeerContext = createContext(null);

export const PeerProvider = (props) => {
  const peer = useMemo(() => new RTCPeerConnection(), []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const ans = await peer.createAnswer();
    await peer.setLocalDescription(ans);
    return ans;
  };

  const setRemoteans = async (ans) => {
    await peer.setRemoteDescription(ans);
  };

  return (
    <PeerContext.Provider value={{ peer, createOffer, createAnswer, setRemoteans }}>
      {props.children}
    </PeerContext.Provider>
  );
};
