import { useNavigate } from "react-router";
import Icon from "../icons/Icon";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth, db, googleProvider } from "../config/firebase";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";


const Signup = () => {

  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Signup user.
  const signUpUser = async (forData) => {
    setLoading(true);
    const { username, email, password } = forData;
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      // Add user data...
      await setDoc(doc(db, "users", user.uid), {
        username,
        email
      });
      setLoading(false);
      navigate('/');

    } catch (err) {
      setLoading(false);
      const errorCode = err.code;
      const errorMessage = err.message;

      console.error("Error creating user:", errorCode, errorMessage);
      switch (errorCode) {
        case 'auth/email-already-in-use':
          setMessage("Someone already has an account with that email.");
          break;

        case 'auth/invalid-email':
          setMessage(" The email address doesn't look right.");
          break;

        default:
          alert(`An unexpected error occurred: ${errorMessage}`);
          break;
      }
    }


  };

  // Google sign up.
  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;
      if (!user) return;

      // Set user.
      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName || "",
        email: user.email,
        avatar: user.photoURL,
        provider: "google",
      }, { merge: true });

      setLoading(false);
      navigate("/");

    } catch (err) {
      console.error("Popup sign-up error:", err);
    }
  };

  return (
    <section id='signup-container'>

      <div className='signup-model'>
        <h1>Welcome to Simple Chat</h1>

        {/* Input form */}
        <form onSubmit={handleSubmit(signUpUser)}>
          <div className='signup-input'>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" {...register('username')} />
          </div>
          <div className='signup-input'>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" {...register('email', { required: true, pattern: { value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, message: 'Please enter your email!' } })} />
          </div>
          <div className='signup-input'>
            <label htmlFor="password">Password</label>
            <input type={showPassword ? "text" : "password"} name="password" id="password"  {...register('password', { required: true, pattern: { value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/, message: 'Must contain 8 or more characters and one number and uppercase,lowercase letter.' } })} />
            <button className="eye" onClick={() => setShowPassword(!showPassword)} ><Icon name={showPassword ? 'eyeOpen' : 'eyeClose'} /></button>
          </div>
          <p id="error-msg">{errors?.password?.message || message}</p>
          <button disabled={loading} type="submit" id="register">{loading ? <span className="loader"></span> : 'Register'}</button>
        </form>

        <h2>or</h2>
        <button disabled={loading} id="google" onClick={() => handleGoogleSignUp()}><Icon name={'google'} /> Sign up with Google</button>
        <p>Already have an account? <span onClick={() => navigate('/signin')}>Sign in</span></p>
      </div>
      
    </section>
  )
}

export default Signup