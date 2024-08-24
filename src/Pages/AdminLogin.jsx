import React, { useEffect, useState } from "react";
import Slide from "./../Images/side.png";
import { Container, Row, Col } from "react-bootstrap";
import { AiOutlineUser } from "react-icons/ai";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import axios from "axios";
import { ApiPaths } from "../Config";
import Loader from "../Components/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Data } from "../Common/Data";
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisility, setPasswordVisiblity] = useState(false);
  const navigate = useNavigate();
  const toastSuccess = (msg) => toast.success(msg);
  const toastFailed = (msg) => toast.error(msg);

  useEffect(() => {
    const after = window.location.search.slice(
      window.location.search.indexOf("=") + 1
    );
    setUsername(after);
  }, []);
  function LoginFunc() {
    localStorage.clear();
    if (username.length > 0 && password.length > 0) {
      setLoading(true);
      axios({
        method: "post",
        url: ApiPaths.commonLogin,
        data: {
          u_code: username,
          password: password,
          device_token: "token",
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(function (response) {
          // console.log(response);
          if (response?.data?.res == "found") {
            localStorage.setItem("userId", response?.data?.u_id);
            localStorage.setItem("token", response?.data?.token);
            navigate("/dashboard");
            setLoading(false);
          } else {
            toastFailed(response?.data?.message);
            setLoading(false);
          }
          setLoading(false);
        })
        .catch(function (response) {
          setLoading(false);
        });
    } else {
    }
  }
  useEffect(() => {
    const viewInput = document.getElementById("viewInput");
    viewInput.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("viewBtn").click();
      }
    });
  }, []);

  return (
    <>
      {loading ? <Loader /> : null}
      <ToastContainer />
      <Container id="logincontainer">
        <Row>
          <Col>
            <div className="loginContent">
              <div className="loginLogo">
                <img src={Data.logo} alt="logo.png" />
              </div>
              <div className="loginContent_inner">
                <p>sign in into user account</p>
                <div className="loginInputs">
                  <div className="loginInput_inner">
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <i>
                      <AiOutlineUser />
                    </i>
                  </div>
                  <div className="loginInput_inner">
                    <input
                      id="viewInput"
                      type={passwordVisility ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <i
                      onClick={() => setPasswordVisiblity(!passwordVisility)}
                      style={{ cursor: "pointer" }}
                    >
                      {passwordVisility ? <HiLockOpen /> : <HiLockClosed />}
                    </i>
                  </div>
                </div>
                <div className="loginForgot_link">
                  <Link to="/forget_password">forgot password</Link>
                </div>
                <div className="loginFooter_btn">
                  <button
                    className="btnPrimary mb-2"
                    onClick={LoginFunc}
                    id="viewBtn"
                  >
                    Login
                  </button>
                  <p className="sign_log">Don't have an account?</p>
                  <Link to="/register" className="btnPrimary">
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminLogin;
