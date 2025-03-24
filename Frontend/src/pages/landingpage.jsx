import { useContext } from "react";
import "../App.css"
import { userContext } from "../context/userContext";
function LandingPage() {
    const {username} = useContext(userContext);
    return ( 
        <div className="landingPageContainer">
            <nav>
                <div className="title">
                    {username?<h2>{username}</h2>:<h2>Zoom Clone</h2>}
                </div>
                <div className="linkers">
                    <p>Join as Guest</p>
                    <p>Register</p>
                    <div role="button">
                        <p>Login</p>
                    </div>
                </div>
            </nav>
            <div className="mainContainer">
                <div className="text">
                    <h1 style={{color:"white"}}><span style={{color:"orange"}}>Connect </span>with your Loved Ones</h1>
                    <h3 style={{color:"white"}}>Cover a distance by zoom</h3>
                    <div role="button">
                        <p>Get Started</p>
                    </div>
                </div>
                <div className="image">
                    <img src="/public/mobile.png" alt="images of 2 mobiles" />
                </div>
            </div>
        </div>
     );
}

export default LandingPage;