import { useNavigate } from "react-router";
import Icon from "../icons/Icon";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth, db, googleProvider } from "../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


const Signin = () => {

    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Signin user.
    const signInUser = async (formData) => {
        setLoading(true);
        const { email, password } = formData;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setLoading(false);
            navigate("/");

        } catch (err) {
            setLoading(false);
            console.error(err);
            switch (err.code) {
                case 'auth/user-not-found':
                    setMessage('No account found with this email.');
                    break;
                case 'auth/invalid-credential':
                    setMessage("Invalid email or password");
                    break;
                case 'auth/wrong-password':
                    setMessage("Incorrect password. Please try again.");
                    break;
                case 'auth/too-many-requests':
                    setMessage("Too many failed login attempts. Please try again later.");
                    break;
                default:
                    alert("An unexpected error occurred. Please try again.")
                    break;
            }
        };
    };

    // Google signin.
    const handleGoogleSignIn = async () => {
        setLoading(true);
        //   await  signInWithRedirect(auth, googleProvider);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Set user.
            await setDoc(doc(db, "users", user.uid), {
                username: user.displayName || "",
                email: user.email,
                provider: "google",
            }, { merge: true });

            setLoading(false);
            navigate("/");

        } catch (err) {
            console.error("Popup sign-in error:", err);
        }
    };

    return (
        <section id='signup-container'>

            <div className='signin-model'>
                <h1>Hello, welcome Back 👻</h1>

                {/* Form input */}
                <form onSubmit={handleSubmit(signInUser)}>
                    <div className='signin-input'>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" {...register('email', { required: true, pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Please enter your email!' } })} />
                    </div>
                    <div className='signin-input'>
                        <label htmlFor="password">Password</label>
                        <input type={showPassword ? "text" : "password"} name="password" id="password" {...register('password', { required: true, pattern: { value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, message: 'Must contain 8 or more characters and one number and uppercase,lowercase letter.' } })} />
                        <button className="eye" type="button" onClick={() => setShowPassword(!showPassword)} ><Icon name={showPassword ? 'eyeOpen' : 'eyeClose'} /></button>
                    </div>
                    <p className="forgot-pwd" onClick={() => navigate('/reset')} >Forgot password?</p>
                    <p id="error-msg">{errors?.password?.message || message}</p>
                    <button disabled={loading} type="submit" id="register"> {loading ? <span className="loader"></span> : 'Login'} </button>
                </form>

                <h2>or</h2>
                <button disabled={loading} id="google" onClick={handleGoogleSignIn}><Icon name={'google'} /> Continue with Google</button>
                <p>Don`t have an account? <span onClick={() => navigate('/signup')}>Sign up</span></p>
            </div>

        </section>
    );
}

export default Signin;