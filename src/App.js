
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Page from "./Pages/Page";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgetPassword from "./Pages/ForgetPassword/ForgetPassword";
import AdminLogin from "./Pages/AdminLogin";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Page />}></Route> */}
        <Route path="/dashboard/*" element={<LandingPage />}></Route>
        <Route path="/page" element={<Page />}></Route>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forget_password" element={<ForgetPassword />}></Route>
        <Route path="/admin_login" element={<AdminLogin />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
