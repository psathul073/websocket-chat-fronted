import { useEffect, useRef, useState } from 'react'
import Icon from '../icons/Icon'
import { useTheme } from "../contexts/Theme-context";

const ThemeDropdown = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('system');
    const { theme, setTheme } = useTheme();
    const dropdownRef = useRef(null);


    const options = [
        { value: 'system', label: 'System', icon: 'system' },
        { value: 'light', label: 'Light', icon: 'light' },
        { value: 'dark', label: 'Dark', icon: 'dark' },
    ];

    const handleSelect = (value) => {
        setSelected(value);
        setTheme(value);
    };

    useEffect(() => {
        setSelected(theme);
    }, [theme]);

    // Handle click outside.
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('pointerdown', handleClickOutside);
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        }
    }, [])


    return (
        <div id='theme-container' ref={dropdownRef}>
            <button className='toggle-btn' onClick={() => setIsOpen(!isOpen)}>
                <Icon name={selected} />
                <span>{options.find((opt) => opt.value === selected)?.label}</span>
            </button>
            {isOpen &&
                <ul className='options'>
                    {
                        options.map((opt, i) => (
                            <li className='option' key={i} onClick={() => handleSelect(opt.value)}>
                                <Icon name={opt.icon} />
                                <span>{opt.label}</span>
                            </li>
                        ))
                    }
                </ul>
            }

        </div>
    )
}

export default ThemeDropdown