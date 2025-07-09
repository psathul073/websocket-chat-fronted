import { useState } from "react"
import Icon from "../icons/Icon"
import { joinRoom } from "../utils/room-manage";

const PasswordModel = ({ socket, roomName, setRoomName, err, setErr }) => {
    const [password, setPassword] = useState("");
    const [showEye, setShowEye] = useState(false);


    return (
        <div id="pwd-backdrop">

            <div className="pwd-modal">
                <h2>🔒 Enter Password for {roomName}</h2>
                <div className="pwd-input">
                    <input
                        type={showEye ? "text" : "password"}
                        placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="eye-btn" onClick={() => setShowEye(!showEye)}> <Icon name={showEye ? 'eyeOpen' : 'eyeClose'} /></button>
                </div>

                <p className="error">{err.join && err?.message}</p>

                <div className="pwd-actions">
                    <button className="pwd-cancel" onClick={() => { setRoomName(""); setErr("") }}>Cancel</button>
                    <button className="pwd-join" onClick={() => { joinRoom(socket, roomName, password); setPassword(""); setErr("") }}>Join room</button>
                </div>

            </div>
        </div>
    )
}

export default PasswordModel