import { Link } from 'react-router';
import ThemeDropdown from './Theme-dropdown';
import { useEffect, useRef } from 'react';
import Icon from '../icons/Icon';

const Settings = ({ setShowSettings, signOut, setIsConfirm }) => {

  const settingsRef = useRef(null);

  // Close settings on click outside.
  useEffect(() => {
    const handleClickOnOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOnOutside);
    return () => document.removeEventListener('pointerdown', handleClickOnOutside);
  }, [])


  return (
    <div className='stg-backdrop'>
      {/* Settings model */}
      <div id="settings-container" ref={settingsRef}>

        <header>
          <h3>Settings</h3> <button className="close-btn" onClick={() => setShowSettings(false)}><Icon name={'X'} /> </button>
        </header>
        {/* Options */}
        <div className="stg-option">
          Theme
          <ThemeDropdown />
        </div>
        <div className="stg-option">
          Account Removal
          <button className='removal-btn' onClick={() => setIsConfirm(true)}>Delete</button>
        </div>
        <div className="stg-option">
          Account Logout
          <button className='logout-btn' onClick={signOut}>Logout<span className='loader0'></span></button>
        </div>

        {/* Extra links */}
        <div className='pp-tc'>
          <Link>Privacy Policy</Link>
          .
          <Link>Terms of Service</Link>
        </div>

      </div>
    </div>

  )
}

export default Settings