import React, { useEffect, useState } from "react";
import "./ForgetPassword.css";
import Slide from "./../../Images/side.png";
import { Container, Row, Col } from "react-bootstrap";
import { AiOutlineUser } from "react-icons/ai";
import { HiLockClosed, HiLockOpen } from "react-icons/hi";
import axios from "axios";
import { ApiPaths } from "../../Config";
import Loader from "../../Components/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Data } from "../../Common/Data";
const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisility, setPasswordVisiblity] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const navigate = useNavigate();
  const toastSuccess = (msg) => toast.success(msg);
  const toastFailed = (msg) => toast.error(msg);

  function SendForgetOtp() {
    if (username.length > 0 && password.length > 0) {
      setLoading(true);
      axios({
        method: "post",
        url: ApiPaths.sendForgetOTP,
        data: {
          u_code: username,
          password: password,
          otp_type: "forgot_password",
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(function (response) {
          Data.isDebug && console.log(response);
          if (response?.data?.res == "success") {
            toastSuccess(response?.data?.message);
            setShowOtp(true);
          } else {
            toastFailed(response?.data?.res);
          }
          setLoading(false);
        })
        .catch(function (response) {
          setLoading(false);
        });
    } else {
      toastFailed("check username or password");
    }
  }
  function ForgetPasswordFunc() {
    let user_Id = localStorage.getItem("userId");
    Data.isDebug && console.log("userId", username);
    Data.isDebug && console.log("passwrpassword", password);
    Data.isDebug && console.log("otp", otp);
    setOtpError("");
    if (otp.length !== 6) {
      setOtpError("Invalid OTP");
    }
    setOtpLoading(true);
    if (otp.length == 6) {
      axios({
        method: "post",
        url: ApiPaths.forgotPassword,
        data: {
          u_code: username,
          otp_type: "forgot_password",
          entered_otp: otp,
          new_password: password,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(function (response) {
          // Data.isDebug && console.log(response);
          if (response?.data?.res == "success") {
            setShowOtp(false);
            setOtp("");
            alert(response?.data?.message);
            navigate("/");
          } else {
            toastFailed(response?.data?.message);
          }
          setOtpLoading(false);
        })
        .catch(function (response) {
          Data.isDebug && console.log(response);
          toastFailed("Something went wrong");
          setOtpLoading(false);
        });
    } else {
      setOtpLoading(false);
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
      {showOtp ? (
        <div className="otpSection">
          <div className="otpContainer">
            <h1>OTP</h1>
            <p>OTP sent to your registered email address</p>
            <input
              type="text"
              maxLength={6}
              size={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <p className="errorMsg">{otpError}</p>
            {otpLoading ? (
              <div className="otpLoading"></div>
            ) : (
              <div>
                <button
                  className="btnSecondary"
                  onClick={() => (setOtp(""), setShowOtp(false))}
                >
                  Cancel
                </button>
                <button
                  className="btnPrimary"
                  onClick={() => ForgetPasswordFunc()}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
      <Container id="logincontainer">
        <Row>
          <Col>
            <div className="loginContent">
              <div className="loginLogo">
                <img src={Data.logo} alt="logo.png" />
              </div>
              <div className="loginContent_inner">
                <h4>Forget Password?</h4>
                <p>Set new password</p>
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
                      placeholder="Set New Password"
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
                <div className="loginFooter_btn">
                  <button
                    className="btnPrimary mb-2"
                    onClick={SendForgetOtp}
                    id="viewBtn"
                  >
                    Send OTP
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

export default ForgetPassword;
