const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const updateProfile = async (formData) => {

    try {
        const res = await fetch(`${BASE_URL}/user/update`, {
            method: 'POST',
            body: formData,
        });
        
        return res.json();

    } catch (err) {
        console.error("Profile update failed: ", err);
    }

};

export default updateProfile;