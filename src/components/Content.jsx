import ChatBox from "./Chat-box"
import PasswordModel from "./Password-model"
import { useState } from "react"
import { createRoom, joinRoom } from "../utils/room-manage"

const Content = ({ user, socket, room, setRoom, err, setErr, privateRoom, setPrivateRoom, messages, setMessages, isDisable, setIsDisable }) => {

    const [createInput, setCreateInput] = useState("");
    const [createPwd, setCreatePwd] = useState("");
    const [joinInput, setJoinInput] = useState("");
    const [joinPwd, setJoinPwd] = useState("");


    // Handle room create.
    const handleCreate = () => {
        createRoom(socket, user?.uid, createInput, createPwd);
        setCreateInput("");
        setCreatePwd("");
    };
    // Handle room join.
    const handleJoin = () => {
        joinRoom(socket, joinInput, joinPwd);
        setJoinInput("");
        setJoinPwd("")
    };

    // Room close.
    const leaveRoom = () => {
        setMessages([]);
        setCreateInput("");
        setCreatePwd("");
        setJoinInput("");
        setJoinPwd("")
        setRoom("");
        setErr("");
    };

    return (
        <>
            {/* Contents */}
            {!room &&
                <div id="content-container">
                    <div className="person-img">
                        <h1>Welcome, {user?.username} </h1>
                        <img src="./person.webp" alt="person-image" loading="lazy" />

                    </div>
                    <div className="jc-box">
                        <div className="create-room">
                            <h3>Create Room</h3>
                            <p className="err-text">{err?.create && err.message}</p>
                            <div className="room-inputs">
                                <label htmlFor="cRoomName">Room name<><span>*</span></></label>
                                <input type="text" id="cRoomName" value={createInput} onChange={(e) => setCreateInput(e.target.value)} />
                            </div>
                            <div className="room-inputs">
                                <label htmlFor="cPassword">Password</label>
                                <input type="text" id="cPassword" value={createPwd} onChange={(e) => setCreatePwd(e.target.value)} />
                            </div>
                            <button className="create-btn" onClick={handleCreate}>Create Room</button>
                        </div>

                        <div className="join-room">
                            <h3>Join room</h3>
                            <p className="err-text">{err?.join && err.message}</p>
                            <div className="room-inputs">
                                <label htmlFor="jRoomName">Room name<><span>*</span></></label>
                                <input type="text" id="jRoomName" value={joinInput} onChange={(e) => setJoinInput(e.target.value)} />
                            </div>
                            <div className="room-inputs">
                                <label htmlFor="jPassword">Password</label>
                                <input type="text" id="jPassword" value={joinPwd} onChange={(e) => setJoinPwd(e.target.value)} />
                            </div>
                            <button className="join-btn" onClick={handleJoin}>Join Room</button>
                        </div>
                    </div>
                </div>}

            {/* chat container */}
            {room && <ChatBox user={user} socket={socket} room={room} messages={messages} leaveRoom={leaveRoom} isDisable={isDisable} setIsDisable={setIsDisable} />}

            {privateRoom && <PasswordModel socket={socket} roomName={privateRoom} setRoomName={setPrivateRoom} err={err} setErr={setErr} />}

        </>

    )
}

export default Content