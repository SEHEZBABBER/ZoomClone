import { useContext, useEffect, useState, useRef } from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { userContext } from "../context/userContext";

function VideoComponent() {
    const { username, setusername } = useContext(userContext);
    const [camerapermission, setcamerapermission] = useState(null);
    const [micpermission, setmicpermission] = useState(null);
    const [screenPermission, setscreenpermission] = useState(null);
    const [camera, setcamera] = useState(true);
    const [mic, setmic] = useState(true);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        axios
            .get("http://localhost:8000/userdata", { withCredentials: true })
            .then((res) => setusername(res.data.message))
            .catch(() => {
                window.location.href = "/auth";
            });
    }, []);

    async function getPermissions() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
            setcamerapermission(true);
            setmicpermission(true);
        } catch (err) {
            setcamerapermission(false);
            setmicpermission(false);
        }
    }

    useEffect(() => {
        getPermissions();
    }, []);

    const toggleMic = () => {
        if (streamRef.current) {
            const audioTracks = streamRef.current.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks[0].enabled = !mic;
                setmic(!mic);
            }
        }
    };

    const toggleCamera = () => {
        if (streamRef.current) {
            const videoTracks = streamRef.current.getVideoTracks();
            if (videoTracks.length > 0) {
                videoTracks[0].enabled = !camera;
                setcamera(!camera);
            }
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-7">
                    <div className="video-container d-flex justify-content-center align-items-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted={!mic}
                            className="w-50"
                            style={{ height: "400px", borderRadius: "10px" }}
                        />
                        <div className="video-overlay">
                            <h5>{username}</h5>
                        </div>
                    </div>
                    <div className="controls d-flex justify-content-between mt-3">
                        <button className="btn btn-secondary" onClick={toggleMic}>
                            {mic ? "Mute" : "Unmute"}
                        </button>
                        <button className="btn btn-secondary" onClick={toggleCamera}>
                            <i className={`fas ${camera ? "fa-video" : "fa-video-slash"}`}></i>{" "}
                            {camera ? "Stop Video" : "Start Video"}
                        </button>
                    </div>
                </div>

                <div className="col-md-5 text-center d-flex flex-column justify-content-center align-items-center">
                    <h4 className="mt-5">Ready to join?</h4>
                    <input
                        type="text"
                        className="form-control mb-3"
                        id="meetinnumber"
                        placeholder="Enter Meeting Id"
                    />
                    <button className="btn btn-primary btn-lg btn-join mb-2" style={{ width: "fit-content" }}>
                        Join Meeting
                    </button>
                    <button
                        className="btn btn-primary btn-lg btn-join"
                        style={{ width: "fit-content" }}
                        onClick={() => (window.location.href = "/")}
                    >
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoComponent;
