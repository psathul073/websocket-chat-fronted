import { auth, db } from "../config/firebase";
import { signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Icon from "../icons/Icon";
import ProfilePopup from "../components/Profile-popup";
import ProfileUpdate from "../components/Profile-update";
import Settings from "../components/Settings";
import Content from "../components/Content";
import AllRooms from "../components/All-rooms";
import ConfirmModel from "../components/Confirm-model";
import { deleteAccount, joinRoom } from "../utils/room-manage";

const Home = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showProfilePop, setShowProfilePop] = useState(false);
  const [showProfileUpdate, setShowProfileUpdate] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState("");
  const [privateRoom, setPrivateRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [isDisable, setIsDisable] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false);
  const [isConnected, setIsConnected] = useState(null);

  const navigate = useNavigate();

  // User signout.
  const handleSignOut = async () => {
    localStorage.clear();
    await signOut(auth);
    setUserData(null);
    navigate(0);
  };

  // Fetch user data.
  useEffect(() => {

    const fetchUserData = async () => {
      const user = auth.currentUser;
      // console.log(user);

      if (!user) return;

      try {
        // Cache data.
        const cachedData = localStorage.getItem('userData');

        if (cachedData) {
          const { user, fetchedAt } = JSON.parse(cachedData);
          const isExpired = (Date.now() - fetchedAt) > 30 * 60 * 1000; // 30 minutes.
          if (!isExpired) {
            setUserData(user);
            return;
          }
        };
        // console.log('updated...', user);

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          localStorage.setItem('userData', JSON.stringify({
            user: { uid: user.uid, ...userDoc.data() },
            fetchedAt: Date.now(),
          }));
        };
      } catch (error) {
        console.error(error)
      }
    };
    fetchUserData();
  }, []);

  // WebSocket.
  useEffect(() => {

    if (!userData) return;

    const WS_URL = import.meta.env.VITE_WS_URL; // Backend URL.
    const ws = new WebSocket(WS_URL); // Connect to backend server.

    // If websocket is connected.
    ws.onopen = () => { setIsConnected(true); setIsDisable(false); console.log("WebSocket connected"); }

    // If data is received.
    ws.onmessage = (ev) => {

      // console.log('Raw message:', ev.data);

      const data = JSON.parse(ev.data);

      // If receive rooms update.
      if (data.type === 'rooms-updated') {
        setRooms(data.rooms); // Show room list
      }

      // Room create.
      if (data.type === 'create-success') {

        setRoom(data?.roomName);
        setMessages([]);
        setPrivateRoom(null);
        setError('');

      }

      // Room join.
      if (data.type === 'join-success') {

        setRoom(data?.roomName);
        setMessages(data?.messages);
        setPrivateRoom(null);
        setError('');

      }

      // Errors.
      if (data.type === 'error') setError(data);

      // Messages.
      if (data.type === 'message' && data.message.roomName === room) {
        setMessages((prev) => [...prev, data.message]); // Add new message
      }

      // Room delete.
      if (data.type === 'message-deleted') {
        setMessages((prev) => prev.filter((msg) => msg.id !== data.id));
        setIsDisable(false);
      }

      // User delete.
      if (data.type === 'delete-success') {
        handleSignOut(); // Firebase Auth session is cleared and redirect to signin...
        ws.close();  // Kill socket
      }

    };

    // If websocket is disconnected.
    ws.onclose = () => { setIsConnected(false); setIsDisable(true); console.log("❌ Disconnected from server"); }

    setSocket(ws);

    return () => ws.close(); // for cleanup...

  }, [userData, room]);


  return (

    <section id="main" >

      {/* Sidebar Open Button */}
      {!isOpen && <button className="open-btn" onClick={() => setIsOpen(true)}>
        <Icon name={'chat'} className={'icon'} />
        <p>Available Rooms 🡢</p>
      </button>}

      {/* User avatar & profile*/}
      <button className="avatar" style={{ borderColor: isConnected ? '#15803d' : '#be123c' }} onClick={() => setShowProfilePop(true)}>
        <img src={userData?.avatar ? userData.avatar : "/avatar.webp"} alt="avatar" loading="lazy" />
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        <div className="header">
          Available Rooms
          <button className="close-btn" onClick={() => setIsOpen(false)}> <Icon name={'backWord'} /> </button>
        </div>

        <ul className="room-lists">
          {
            rooms?.map((room, i) => (
              i < 5 &&
              <li key={room?.name} className="room-title"
                onClick={() => {
                  if (room?.private) { setPrivateRoom(room?.name); setIsOpen(false) } else { joinRoom(socket, room.name); setIsOpen(false) };
                }} > {room?.name} {room?.private && <Icon name={'lock'} className={'lc-icon'} />}  <Icon name={'joinChat'} className={'jc-icon'} /> </li>
            ))
          }

        </ul>

        <button className="showAll-btn" onClick={() => { setShowAllRooms(true); setIsOpen(false) }}>Show all rooms<Icon name={'expand'} /></button>

        {/* <div className="room-btns">
          <button className="create-btn" onClick={() => { setMode('create'); setIsOpen(false) }}>Create<Icon name={'create'} /></button>
          <button className="join-btn" onClick={() => { setMode('join'); setIsOpen(false) }}>Join<Icon name={'joinChat'} /></button>
        </div> */}

      </aside>

      {/* main content */}
      <Content user={userData} socket={socket} room={room} setRoom={setRoom} err={error} setErr={setError} privateRoom={privateRoom} setPrivateRoom={setPrivateRoom} messages={messages} setMessages={setMessages} isDisable={isDisable} setIsDisable={setIsDisable} connection={isConnected} />

      {/* Profile popup model */}
      {showProfilePop && <ProfilePopup setShowProfilePop={setShowProfilePop} setShowProfileUpdate={setShowProfileUpdate} setShowSettings={setShowSettings} userData={userData} signOut={handleSignOut} />}

      {/* Profile update popup model  */}
      {showProfileUpdate && <ProfileUpdate setShowProfileUpdate={setShowProfileUpdate} userData={userData} />}

      {/* Settings popup model */}
      {showSettings && <Settings setShowSettings={setShowSettings} signOut={handleSignOut} setIsConfirm={setIsConfirm} />}

      {/* Show all rooms model */}
      {showAllRooms && <AllRooms setShowAllRooms={setShowAllRooms} rooms={rooms} setRooms={setRooms} uid={userData?.uid} socket={socket} setPrivateRoom={setPrivateRoom} setRoom={setRoom} connection={isConnected} />}

      {/* Confirm model for account removal */}
      {isConfirm && <ConfirmModel
        title={'Account Removal'}
        msg={'Are you sure you want to delete your account? This will permanently remove your account and all data.'}
        type={'Account'}
        cancel={() => setIsConfirm(false)}
        confirm={() => { deleteAccount(socket, userData?.uid); setIsDisable(true) }}
        loading={isDisable}
      />}

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={() => setIsOpen(false)} ></div>}

    </section>

  );
};

export default Home;
