import { useState } from "react";
import Icon from "../icons/Icon";
import { deleteRoom, joinRoom } from "../utils/room-manage";
import ConfirmModel from "./Confirm-model";

const AllRooms = ({
  setShowAllRooms,
  rooms,
  uid,
  socket,
  setPrivateRoom,
  setRoom,
}) => {
  const [roomName, setRoomName] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  

  // Room search. 👁️
  const filteredRooms = rooms?.filter(room =>
    room.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const roomDelete = () => {
    setLoading(true);
    setTimeout(() => {
      deleteRoom(socket, roomName, uid);
      setRoom("");
      setLoading(false);
      setIsConfirm(false);
    }, 2000);
  };

  const cancelDelete = () => {
    setRoom("");
    setIsConfirm(false);
  };

  return (
    <>
      <div id="rooms-container">
        <div className="allRooms-model">
          <h2 className="title">
            Available rooms : {filteredRooms?.length}
            <button
              className="close-btn"
              onClick={() => setShowAllRooms(false)}
            >
              <Icon name={'X'} />
            </button>
          </h2>

          <div className="search-box">
            <input
              type="search"
              name="roomSearch"
              id="roomSearch"
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">
              <Icon name={"search"} />
            </button>
          </div>

          <ul className="rooms-list">
            {filteredRooms.length > 0 ?
              filteredRooms?.map((room) => (
                
                <li className="room" key={room?.name}>
                  <h3>
                    {room.name}
                    {room?.private && <Icon name={"lock"} className={"icon"} />}
                  </h3>

                  <div className="room-btns">
                    <button
                      className="join-btn"
                      onClick={() => {
                        if (room?.private) {
                          setPrivateRoom(room.name);
                          setShowAllRooms(false);
                        } else {
                          joinRoom(socket, room.name);
                          setShowAllRooms(false);
                        }
                      }}
                    >
                      <Icon name={"joinChat"} className={"icon"} />
                      <span className="tooltip-text">Join Room</span>
                    </button>
                   

                    {uid === room.createdBy && (
                      <button
                        className="del-btn"
                        onClick={() => {
                          setIsConfirm(true);
                          setRoomName(room.name);
                        }}
                      >
                        <Icon name={"delete"} className={"icon"} />
                        <span className="tooltip-text">Delete Room</span>
                      </button>
                    )}

                  </div>
                </li>
              )) :
              <li className="room">No rooms found !</li>

            }
          </ul>
        </div>
      </div>

      {isConfirm && (
        <ConfirmModel
          title={"Delete room"}
          msg={`Are you sure you want to delete ${roomName}?`}
          loading={loading}
          confirm={roomDelete}
          cancel={cancelDelete}
        />
      )}
    </>
  );
};

export default AllRooms;
