
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const audioUpload = async (formData) => {
    try {
        const res = await fetch(`${BASE_URL}/upload/audio`, {
            method: 'POST',
            body: formData,
        });

        return res.json();

    } catch (err) {
        console.error("Audio upload failed: ", err);
    }
};
export default audioUpload