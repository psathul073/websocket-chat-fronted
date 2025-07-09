import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ForgotPwd = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const resetPassword = async ({ email }) => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Check your inbox.");
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error sending password reset email:", error.code, error.message);
            if (error.code == "auth / invalid - email") {
                setMessage("The email address is not valid.")
            };
        }
    };

    return (
        <section id='forgot-container'>
            <div className='forgot-model'>
                <h1>Reset your password !</h1>

                <form onSubmit={handleSubmit(resetPassword)}>
                    <div className='forgot-input'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" {...register('email', { required: true, pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Please enter your email!' } })} />
                    </div>

                    <p id="error-msg">{errors?.password?.message || message}</p>
                    <button disabled={loading} type="submit" id="send">{loading ? <span className="loader"></span> : 'Send Reset Email'}</button>
                </form>


                <p onClick={() => navigate('/signin')} >Log In</p>
            </div>
        </section>
    )
}

export default ForgotPwd