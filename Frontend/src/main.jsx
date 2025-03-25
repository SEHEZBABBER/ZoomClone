import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/userContext.jsx";
import { SocketProvider } from "./context/socketContext.jsx";
import { PeerProvider } from "./context/PeerContext.jsx";

createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <PeerProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </PeerProvider>
  </SocketProvider>
);
