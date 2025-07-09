import { BrowserRouter as Router, Routes, Route } from "react-router";
import PrivateRoute from "./routes/PrivateRoutes";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import ForgotPwd from "./pages/Forgot-pwd";
import { ThemeProvider } from "./contexts/Theme-context";


const App = () => {

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/reset" element={<ForgotPwd />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

