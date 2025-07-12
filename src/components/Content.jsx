import ChatBox from "./Chat-box"
import PasswordModel from "./Password-model"
import { useState } from "react"
import { createRoom, joinRoom } from "../utils/room-manage"

const Content = ({ user, socket, room, setRoom, err, setErr, privateRoom, setPrivateRoom, messages, setMessages, isDisable, setIsDisable, connection }) => {

    const [createInput, setCreateInput] = useState("");
    const [createPwd, setCreatePwd] = useState("");
    const [joinInput, setJoinInput] = useState("");
    const [joinPwd, setJoinPwd] = useState("");


    // Handle room create.
    const handleCreate = () => {
        if (connection) {
            createRoom(socket, user.uid, createInput, createPwd);
            setCreateInput("");
            setCreatePwd("");
        }
    };
    // Handle room join.
    const handleJoin = () => {
        if (connection) {
            joinRoom(socket, joinInput, joinPwd);
            setJoinInput("");
            setJoinPwd("")
        }
    };
    // Handle room close.
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
            {/* Room create and join container */}
            {!room &&
                <div id="content-container">
                    {/* Hero section */}
                    <div className="person-img">
                        <h1>Welcome, {user?.username} </h1>
                        <img src="./person.webp" alt="person-image" loading="lazy" />

                    </div>

                    {/* Room create and join section */}
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

                </div>
            }

            {/* chat container */}
            {room && <ChatBox user={user} socket={socket} room={room} messages={messages} leaveRoom={leaveRoom} isDisable={isDisable} setIsDisable={setIsDisable} connection={connection} />}

            {/* Password model for private room */}
            {privateRoom && <PasswordModel socket={socket} roomName={privateRoom} setRoomName={setPrivateRoom} err={err} setErr={setErr} />}

        </>

    )
}

export default Content