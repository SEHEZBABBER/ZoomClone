import { useContext } from "react";
import "../App.css"
import { userContext } from "../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function LandingPage() {
    const navigate = useNavigate();
    const {username,setusername} = useContext(userContext);
    function handlelogout(){
        axios.get("http://localhost:8000/logout",{withCredentials:true})
        .then(()=>setusername(null));
    }
    return ( 
        <div className="landingPageContainer">
            <nav>
                <div className="title">
                    {username?<h2>{username}</h2>:<h2 style={{fontSize:"50px"}}>Joom</h2>}
                </div>
                <div className="linkers">
                    {!username ? (
                    <div role="button" onClick={()=>navigate('/auth')}>
                        <p>Login</p>
                    </div>
                    ):(
                    <div role="button" onClick={handlelogout}>
                        <p>Logout</p>
                    </div>
                )}
                </div>
            </nav>
            <div className="mainContainer">
                <div className="text">
                    <h1 style={{color:"white"}}><span style={{color:"orange"}}>Connect </span>with your Loved Ones</h1>
                    <h3 style={{color:"white"}}>Cover a distance by Joom</h3>
                    <div role="button" onClick={()=>navigate("/joincall")}>
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