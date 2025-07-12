import { useEffect, useRef } from "react"
import Icon from "../icons/Icon"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useNavigate } from 'react-router'
import updateProfile from "../apis/update-profile";

const ProfileUpdate = ({ setShowProfileUpdate, userData }) => {

    const { register, handleSubmit, setValue } = useForm();
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const profileRef = useRef(null);
    const navigate = useNavigate();

    //  Handle image pick.
    const handleImageChange = (e) => {
        const max_file_size = 1 * 1024 * 1024; // 1Mb in bytes.
        const selectedImg = e.target.files[0];

        if (!selectedImg) return;
        if (selectedImg > max_file_size) return;

        setValue(e.target.id, selectedImg); // Directly store  in the form
        // Set image preview.
        const objURL = URL.createObjectURL(selectedImg);
        setAvatar(objURL);
    };

    // For profile update.
    const onSubmit = async (data) => {

        if (!avatar && !data.username) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("avatar", data?.avatar);
        formData.append("username", data?.username);
        formData.append("uid", userData?.uid ?? '');
        formData.append("public_id", userData?.public_id ?? '');

        const res = await updateProfile(formData);
        setLoading(false);
        setMsg(res?.message);
        if (res.type) {
            localStorage.clear('userData');
            navigate(0);
        };
    };

    // Revoke url for solve memory leaks.
    useEffect(() => {
        return () => {
            if (avatar) {
                URL.revokeObjectURL(avatar);
            }
        };
    }, [avatar]);

    // Hide model on outside click.
    useEffect(() => {
        const handleClickOnOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileUpdate(false);
            }
        };
        document.addEventListener('pointerdown', handleClickOnOutside)
        return () => {
            document.removeEventListener('pointerdown', handleClickOnOutside);
        }
    }, []);

    return (
        <div className="profile-backdrop">

            {/* Profile update container */}
            <div id="profile-update" ref={profileRef}>
                {/* Model header */}
                <h3>Profile update</h3>
                <button className="close-btn" onClick={() => setShowProfileUpdate(false)}> <Icon name={'X'} /> </button>
           
                {/* Update form */}
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="img-container">
                        <img src={avatar ? avatar : "/avatar.webp"} alt="avatar" width={'99px'} />

                        <button className="camera-btn" type="button">
                            <label htmlFor="avatar"><Icon name={'camera'} /></label>
                            <input type="file" name="avatar" id="avatar" accept='image/png, image/jpeg, image/webp' onChange={handleImageChange} />
                        </button>

                    </div>

                    <input className="username" placeholder="Enter a username" maxLength={10} {...register('username')} ></input>

                    {/* For error message */}

                    <p>{msg}</p>

                    <button className="update" type="submit"> Update {loading && <span className="loader"></span>}</button>
                </form>

            </div>

        </div>
    )

}

export default ProfileUpdate