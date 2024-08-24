import React, { useEffect, useState } from "react";
import "./Register.css";
import Slide from "./../../Images/side.png";
import { Container } from "react-bootstrap";
import {
  AiFillEye,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlinePhone,
  AiFillEyeInvisible,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import { RiLockPasswordFill } from "react-icons/ri";
import axios from "axios";
import { ApiPaths } from "../../Config";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
// --------------------------------
import { IoCopyOutline } from "react-icons/io5";
import CopyFromtag from "../../Common/CopyFromtag";
import { Data } from "../../Common/Data";
// import ConnectButton from "../../Components/ConnectButton";
import { useSelector } from "react-redux";
import OtpInput from "react-otp-input";

const Register = () => {
  const acc = useSelector((state) => state.account.value);
  const navigate = useNavigate();
  const [sponsorLoading, setSponsorLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [sponsorId, setSponsorId] = useState("");
  const [checkSponsorExist, setCheckSponsorExist] = useState([]);
  const [sponsorError, setSponsorError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setconfirmPasswordError] = useState("");
  const [termCheck, setTermCheck] = useState(false);
  const [passwordVisility, setPasswordVisiblity] = useState(false);
  const [confirmPasswordVisility, setConfirmPasswordVisiblity] =
    useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerSuccessData, setRegisterSuccessData] = useState([]);
  const [isShowOTP, setISShowOTP] = useState(false);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };
  useEffect(() => {
    const after = window.location.search.slice(
      window.location.search.indexOf("=") + 1
    );
    setSponsorId(after);
    if (after.length > 0) {
      onUserStoppedTyping(after);
    }
  }, []);

  const toastCopy = (msg) =>
    toast.success(msg, {
      autoClose: 1000, // duration in milliseconds
    });
  const toastSuccess = (msg) => toast.success(msg);
  const toastFailed = (msg) => toast.error(msg);

  const onUserStoppedTyping = (sponID) => {
    // console.log(sponID);
    setSponsorLoading(true);
    axios({
      method: "post",
      url: ApiPaths.checkSponsor,
      data: {
        referrer_id: sponID,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        // console.log("response", response)
        setCheckSponsorExist(response?.data);
        setLoading(false);
        setSponsorLoading(false);
      })
      .catch(function (response) {
        setLoading(false);
        setSponsorLoading(false);
      });
    // console.log("User stopped typing. Do something here.");
  };
  const handleInputChange = (e) => {
    setSponsorError("");
    const value = e.target.value;
    setSponsorId(value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    setTypingTimeout(
      setTimeout(() => {
        if (value.length > 0) {
          onUserStoppedTyping(value);
        } else {
          setCheckSponsorExist([]);
        }
      }, 500)
    );
  };
  function resetError() {
    setSponsorError("");
    setNameError("");
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    setconfirmPasswordError("");
  }
  async function CheckValidation() {
    resetError();
    let x = 0;
    if (sponsorId.length === 0) {
      setSponsorError("Sponsor cannot be empty");
    } else {
      if (checkSponsorExist?.res == "success") {
        x++;
      }
    }
    if (registerData.name.length === 0) {
      setNameError("Name cannot be empty");
    } else if (registerData.name.length >= 3) {
      const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
      if (regex.test(registerData.name)) {
        x++;
      } else {
        setNameError("Invalid name");
      }
    } else {
      setNameError("Name should be atleast 3 characters");
    }

    if (registerData.email.length === 0) {
      setEmailError("Email cannot be empty");
    } else {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (regex.test(registerData.email)) {
        x++;
      } else {
        setEmailError("Invalid email");
      }
    }

    if (registerData.mobile.length === 0) {
      setMobileError("Mobile number cannot be empty");
    } else {
      const regex = /^[0-9]{10}$/; // Validates 10 digits only
      if (regex.test(registerData.mobile)) {
        x++;
      } else {
        setMobileError("Invalid mobile number");
      }
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (registerData.password.length === 0) {
      setPasswordError("Password cannot be empty");
    } else if (!passwordRegex.test(registerData.password)) {
      setPasswordError(
        "Password should contain at least one lowercase letter, one uppercase letter, one digit, one special character, and should be at least 8 characters long"
      );
    } else {
      x++;
    }

    if (registerData.confirmPassword.length === 0) {
      setconfirmPasswordError("Confirm password cannot be empty");
    } else {
      if (registerData.password === registerData.confirmPassword) {
        x++;
      } else {
        setconfirmPasswordError("Password does not match");
      }
    }
    if (x === 6) {
      return true;
    } else {
      return false;
    }
  }

  async function GenerateOtp() {
    let valid = await CheckValidation();

    if (valid) {
      setLoading(true);
      axios({
        method: "post",
        url: ApiPaths.generateOtp,
        data: {
          referrer_id: sponsorId,
          reg_full_name: registerData.name,
          reg_mob_number: registerData.mobile,
          reg_email: registerData.email,
          reg_password: registerData.password,
          confirm_password: registerData.confirmPassword,
          country_code: "91",
          country: "india",
          device_token: "token",
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(function (response) {
        console.log(response);
        let res = response?.data?.res;
        console.log(res);
        if (res == "success") {
          setISShowOTP(true);
          toastSuccess(response?.data?.message);
          setLoading(false);
        } else {
          toastFailed(response?.data?.error.replace(/<\/?p>/g, ""));
          setISShowOTP(false);
          setLoading(false);
        }
      });
    }
  }
  function VerifyOtp() {
    if (otp.length === 6) {
      setLoading(true);
      console.log(otp);
      axios({
        method: "post",
        url: ApiPaths.verifyOtp,
        data: {
          reg_email: registerData.email,
          otp: otp,
        },
        headers: {
          "Content-Type": "multipart/form-data",
          // token: "token",
        },
      }).then(function (response) {
        console.log(response);
        if (response?.data?.res == "success") {
          setISShowOTP(false);
          LoginRegister();
        } else {
          setLoading(false);
          toastFailed(response?.data?.message);
        }
      });
    }
  }
  function LoginRegister() {
    localStorage.clear();
    let valid = CheckValidation();
    if (valid) {
      setLoading(true);
      axios({
        method: "post",
        url: ApiPaths.register,
        data: {
          referrer_id: sponsorId,
          reg_full_name: registerData.name,
          reg_mob_number: registerData.mobile,
          reg_email: registerData.email,
          reg_password: registerData.password,
          confirm_password: registerData.confirmPassword,
          otp: otp,
          country_code: "91",
          country: "india",
          device_token: "token",
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(function (response) {
        Data.isDebug && console.log(response);
        if (response?.data?.res == "success") {
          localStorage.setItem("userId", response?.data?.u_id);
          localStorage.setItem("token", response?.data?.token);
          // navigate('/dashboard');
          setLoading(false);
          setRegisterSuccess(true);
          setRegisterSuccessData(response?.data);
        } else {
          toastFailed(response?.data?.error.replace(/<\/?p>/g, ""));
          setLoading(false);
        }
        setLoading(false);
      });
    }
  }

  return (
    <>
      {loading ? <Loader /> : null}
      <ToastContainer />
      {registerSuccess ? (
        <section className="registerSuccessDetails">
          <div>
            <div id="successIcon">
              <i>
                <AiOutlineCheckCircle />
              </i>
              <h1>Success</h1>
            </div>
            <div id="successDetails">
              <p className="mb-4">
                Congratulations {registerSuccessData?.name ?? ""}, your account
                has been successfully created
              </p>

              <div>
                <p style={{ marginRight: "10px" }}>Name</p>
                <div>
                  <p>{registerSuccessData?.name}</p>
                </div>
              </div>
              <div>
                <p style={{ marginRight: "10px" }}>Username</p>
                <div>
                  <p id="registerSuccessUsername">
                    {registerSuccessData?.username}
                  </p>
                  <i
                    onClick={() => (
                      CopyFromtag("registerSuccessUsername"),
                      toastCopy("Text Copied !")
                    )}
                  >
                    <IoCopyOutline />
                  </i>
                </div>
              </div>
              <div>
                <p style={{ marginRight: "10px" }}>Password</p>
                <div>
                  <p id="registerSuccessPassword">
                    {registerSuccessData?.password}
                  </p>
                  <i
                    onClick={() => (
                      CopyFromtag("registerSuccessPassword"),
                      toastCopy("Text Copied !")
                    )}
                  >
                    <IoCopyOutline />
                  </i>
                </div>
              </div>

              <button
                onClick={() => (
                  setRegisterSuccess(false),
                  navigate(`/?ref=${registerSuccessData?.username ?? ""}`)
                )}
              >
                Continue
              </button>
            </div>
          </div>
        </section>
      ) : null}
      <Container id="logincontainer">
        <div className="loginContent">
          {/* <div className="loginLogo">
                        <img src={Data.logo} alt="logo.png" />
                    </div> */}

          <div className="loginLogo">
            <img src={Data.logo} alt="logo.png" />
          </div>

          <div className="loginContent_inner">
            <h4>Welcome!</h4>
            <p>Create an account to get started.</p>
            <form>
              <div className="loginInputs">
                ?
                {checkSponsorExist?.res == "success" ? (
                  <p id="sponsorVerified">{checkSponsorExist?.u_f_name}</p>
                ) : (
                  <p id="sponsorVerified" style={{ color: "red" }}>
                    {checkSponsorExist?.msg}
                  </p>
                )}
                <p className="registerInputError">{sponsorError}</p>
                <div className="loginInput_inner">
                  <input
                    type="text"
                    id="sponsorId"
                    name="sponsorId"
                    placeholder="Sponsor ID"
                    value={sponsorId}
                    onChange={(e) => handleInputChange(e)}
                  />
                  {sponsorLoading ? (
                    <i id="sponsorLoading"></i>
                  ) : (
                    <i>
                      <AiOutlineUser />
                    </i>
                  )}
                </div>
                <p className="registerInputError">{nameError}</p>
                <div className="loginInput_inner">
                  <input
                    type="text"
                    placeholder="Name"
                    id="name"
                    name="name"
                    value={registerData.name}
                    onChange={(e) => handleRegisterChange(e)}
                  />
                  <i>
                    <RiLockPasswordFill />
                  </i>
                </div>
                <p className="registerInputError">{emailError}</p>
                <div className="loginInput_inner">
                  <input
                    type="text"
                    placeholder="Email Id"
                    id="email"
                    name="email"
                    value={registerData.email}
                    onChange={(e) => handleRegisterChange(e)}
                  />
                  <i>
                    <AiOutlineMail />
                  </i>
                </div>
                <p className="registerInputError">{mobileError}</p>
                <div className="loginInput_inner">
                  <input
                    type="text"
                    size={10}
                    maxLength={10}
                    placeholder="Mobile No"
                    id="mobile"
                    name="mobile"
                    value={registerData.mobile}
                    onChange={(e) => handleRegisterChange(e)}
                  />
                  <i>
                    <AiOutlinePhone />
                  </i>
                </div>
                <p className="registerInputError">{passwordError}</p>
                <div className="loginInput_inner">
                  <input
                    type={passwordVisility ? "text" : "password"}
                    placeholder="Password"
                    id="password"
                    name="password"
                    value={registerData.password}
                    onChange={(e) => handleRegisterChange(e)}
                  />
                  <i onClick={() => setPasswordVisiblity(!passwordVisility)}>
                    {passwordVisility ? <AiFillEye /> : <AiFillEyeInvisible />}
                  </i>
                </div>
                <p className="registerInputError">{confirmPasswordError}</p>
                <div className="loginInput_inner">
                  <input
                    type={confirmPasswordVisility ? "text" : "password"}
                    placeholder="Confirm Password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={(e) => handleRegisterChange(e)}
                  />
                  <i
                    onClick={() =>
                      setConfirmPasswordVisiblity(!confirmPasswordVisility)
                    }
                  >
                    {confirmPasswordVisility ? (
                      <AiFillEye />
                    ) : (
                      <AiFillEyeInvisible />
                    )}
                  </i>
                </div>
              </div>
            </form>

            <div className="form_check_data mb-3">
              <input
                value={termCheck}
                className="form_check_input"
                type="checkbox"
                id="rememberme"
                onChange={(e) => setTermCheck(e.target.checked)}
              />
              <label className="form_check_label" for="rememberme">
                I agree to the terms of service
              </label>
            </div>

            <div className="loginFooter_btn">
              <button
                disabled={!termCheck}
                className="btnPrimary mt-3"
                onClick={GenerateOtp}
              >
                Register
              </button>

              {isShowOTP && (
                <div className="registerOtp">
                  <div
                    className="otpPopup"
                    style={{
                      background: "white",
                      height: "170px",
                      padding: "15px",
                      margin: "5px 0 22px 0",
                      border: "none",
                      //   alignContent: "center",
                      //   justifyContent: "center",
                      alignSelf: "center",
                      zIndex: "1",
                    }}
                  >
                    <div style={{ margin: "10px", justifyContent: "center" }}>
                      <h4
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                      >
                        Enter OTP
                      </h4>
                    </div>
                    <div>
                      <div className="otpInputBox">
                        <OtpInput
                          value={otp}
                          onChange={setOtp}
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          containerStyle={{ width: "100%" }}
                          renderInput={(props) => (
                            <input type="number" {...props} />
                          )}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          marginTop: "20px",
                          gap: "10px",
                        }}
                      >
                        <button
                          style={{ color: "black", borderColor: "black" }}
                          className="btnSecondary"
                          onClick={(e) => setISShowOTP(false)}
                        >
                          cancel
                        </button>

                        <button className="btnPrimary" onClick={VerifyOtp}>
                          Verify
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="sign_log">Already have an account?</p>
              <Link to="/" className="btnPrimary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Register;
