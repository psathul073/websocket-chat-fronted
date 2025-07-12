import { useEffect, useRef } from "react";
import Icon from "../icons/Icon";

const ProfilePopup = ({ setShowProfilePop, setShowProfileUpdate, setShowSettings, userData, signOut }) => {
  
  const profilePopRef = useRef(null);

  // Hide model on outside click.
  useEffect(() => {
    const handleClickOnOutside = (e) => {
      if (profilePopRef.current && !profilePopRef.current.contains(e.target)) {
        setShowProfilePop(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOnOutside)
    return () => {
      document.removeEventListener('pointerdown', handleClickOnOutside);
    }
  }, []);

  return (

    // Profile popup container.
    <div id="profile-popup" ref={profilePopRef}>

      <button className="close-btn" onClick={() => setShowProfilePop(false)}> <Icon name={'X'}/> </button>

      <p className="email-id">{userData?.email}</p>
      {/* user avatar */}
      <div className="img-container">
        <img src={userData?.avatar  ? userData.avatar : "/avatar.webp"} alt="avatar" width={'99px'} />
        <button className="camera-btn" onClick={() => { setShowProfileUpdate(true); setShowProfilePop(false) }}><Icon name={'edit'} /></button>
      </div>

      <h2 className="username">Hi, {userData?.username}!</h2>

      {/* user action btn */}
      <div className="popup-btns">
        <button className="settings-btn" onClick={() => { setShowSettings(true); setShowProfilePop(false) }}><Icon name={'settings'} className={'icon'} /> Settings</button>
        <button className="signout-btn" onClick={signOut}><Icon name={'signout'} className={'icon'} /> Sign out</button>
      </div>

    </div>
  )
}

export default ProfilePopup