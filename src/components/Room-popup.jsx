
const RoomPopup = ({ mode, setMode }) => {

    if (mode == 'create') {
        return (
            <div className="room-popup">
                <div className="create-room">
                    <h3>Create Room <button className="close-btn" onClick={() => setMode(null)}> ✖ </button> </h3>
                    <p className="err-text">password error</p>
                    <div className="room-inputs">
                        <label htmlFor="roomName">Room name<><span>*</span></></label>
                        <input type="text" id="roomName" />
                    </div>
                    <div className="room-inputs">
                        <label htmlFor="password">Password</label>
                        <input type="text" id="password" />
                    </div>
                    <button className="create-btn">Create Room</button>
                </div>
            </div>

        )
    };

    if (mode == 'join') {
        return (
            <div className="room-popup">
                <div className="join-room">
                    <h3>Join room <button className="close-btn" onClick={() => setMode(null)}> ✖ </button> </h3>
                    <p className="err-text">password error</p>
                    <div className="room-inputs">
                        <label htmlFor="jRoomName">Room name<><span>*</span></></label>
                        <input type="text" id="jRoomName" />
                    </div>
                    <div className="room-inputs">
                        <label htmlFor="jPassword">Password</label>
                        <input type="text" id="jPassword" />
                    </div>
                    <button className="join-btn">Join Room</button>
                </div>
            </div>
        )
    };

}

export default RoomPopup