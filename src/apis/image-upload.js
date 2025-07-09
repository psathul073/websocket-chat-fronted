
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const imageUpload = async (formData) => {
    try {
        const res = await fetch(`${BASE_URL}/upload/img`,{
            method: 'POST',
            body: formData,
        });

        return res.json();
        
    } catch (err) {
        console.error("Image upload failed: ", err);
    }
};

export default imageUpload
