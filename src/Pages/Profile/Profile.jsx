import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./Profile.css";
import User from "./../../Images/user.png";
import { ApiPaths } from "../../Config";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import CopyFromtag from "../../Common/CopyFromtag";
import { FiCopy } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Data } from "../../Common/Data";
const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("password");
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [profileData, setProfileData] = useState([]);
  const [accountType, setAccoutType] = useState("BEP20");
  const [accountAddress, setAccountAddress] = useState("");
  const [accountTypeError, setAccoutTypeError] = useState();
  const [accountAddressError, setAccountAddressError] = useState("");
  const [profileName, setProfileName] = useState();
  const [profileEmail, setProfileEmail] = useState();
  const [profileMobile, setProfileMobile] = useState();
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [oldPasswordError, setOldPasswordError] = useState();
  const [newPasswordError, setNewPasswordError] = useState();
  const [confirmPasswordError, setConfirmPasswordError] = useState();

  const toastSuccess = (msg) => toast.success(msg);
  const toastFailed = (msg) => toast.error(msg);
  useEffect(() => {
    // FetchData();
    checkData();
  }, []);

  function checkData() {
    let jsondata = localStorage.getItem("dashboardData");
    const data = JSON.parse(jsondata);
    // console.log("data", data)
    if (data) {
      setDashboardData(data);
      setProfileData(data?.profile?.[0]);
      setProfileName(data?.profile?.[0]?.name);
      setProfileEmail(data?.profile?.[0]?.email);
      setProfileMobile(data?.profile?.[0]?.mobile);
      FetchData();
    } else {
      FetchData();
    }
  }
  function FetchData() {
    // setLoading(true);
    let userId = localStorage.getItem("userId");
    axios({
      method: "post",
      url: ApiPaths.dashboard,
      data: {
        u_id: userId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        // console.log(response);
        setDashboardData(response?.data);
        setProfileData(response?.data?.profile?.[0]);
        Data.isDebug &&
          console.log("act info ", dashboardData?.account_info[0]?.btc_address);
        localStorage.setItem("dashboardData", JSON.stringify(response?.data));
        setLoading(false);
      })
      .catch(function (response) {
        // console.log(response);
        setLoading(false);
      });
  }

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  function resetError() {
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmPasswordError("");
  }
  function resetAccountError() {
    setAccountAddressError("");
    setAccoutTypeError("");
  }

  return (
    <section className="dashboard" style={{ paddingTop: "10px" }}>
      {loading ? <Loader /> : null}
      {loading ? <Loader /> : null}
      <ToastContainer />
      <div className="topProfile">
        <img src={User} alt="" />
        <h5>{profileData?.username}</h5>
        <p>-{profileData?.name}</p>
      </div>

      <Row className="mt-5">
        <Col lg="6" className="mb-2">
          {activeTab == "password" ? (
            <div className="passwordDiv">
              <h3>Change Password</h3>
              <div className="passwordItems">
                <label htmlFor="oldPassword">Old Password</label>
                <div>
                  <input
                    autoComplete="off"
                    id="oldPassword"
                    type="password"
                    name="oldPassword"
                    placeholder="Old Password"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                  />
                  <p className="errorMsg">{oldPasswordError}</p>
                </div>
              </div>
              <div className="passwordItems">
                <label htmlFor="newPassword">New Password</label>
                <div>
                  <input
                    autoComplete="off"
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                  <p className="errorMsg">{newPasswordError}</p>
                </div>
              </div>
              <div className="passwordItems">
                <label htmlFor="confirmPassword">Retype New Password</label>
                <div>
                  <input
                    autoComplete="off"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-Type New Password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                  <p className="errorMsg">{confirmPasswordError}</p>
                </div>
              </div>
              <button className="btnPrimary mt-5" onClick={ChnagePassword}>
                Update
              </button>
            </div>
          ) : activeTab == "profile" ? (
            <div className="editProfile inputPrimary">
              <h3>Edit Profile</h3>
              <label htmlFor="">User Id</label>
              <input
                contentEditable={false}
                type="text"
                placeholder="User Id"
                value={profileData?.username}
              />

              <label htmlFor="">Name</label>
              <input
                type="text"
                placeholder="Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />

              <label htmlFor="">Email</label>
              <input
                type="text"
                placeholder="Email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
              />

              <label htmlFor="">Contact Number</label>
              <input
                type="text"
                placeholder="Contact Number"
                value={profileMobile}
                onChange={(e) => setProfileMobile(e.target.value)}
              />
              <button
                className="btnPrimary"
                onClick={() => EditProfileFunction()}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            // -------------------------Set Account-----------------------------

            <div className="addAccountDiv inputPrimary editProfile">
              <h3>Edit Account Details</h3>
              <label htmlFor="">Select Payment Type</label>
              <select
                name=""
                id=""
                value={accountType}
                onChange={(e) => setAccoutType(e.target.value)}
              >
                {/* <option value="1">Select Account Type</option> */}
                <option value="BEP20">BEP20 USDT Address</option>
                {/* <option value="TRC20">TRC20 USDT Address</option> */}
              </select>
              <p className="errorMsg">{accountTypeError}</p>
              <label htmlFor="">Address</label>
              <input
                type="text"
                placeholder="Your Address"
                value={accountAddress}
                onChange={(e) => setAccountAddress(e.target.value)}
              />
              <p className="errorMsg">{accountAddressError}</p>
              <button className="btnPrimary mt-3" onClick={() => SaveAccount()}>
                Add Account
              </button>
            </div>
          )}
        </Col>
        <Col lg="6" className="mb-2">
          {activeTab == "account" ? null : (
            <div className="basicInfo mb-3">
              <h3>Basic Info</h3>

              <div className="basicInfoDetails">
                <p>Sponsor</p>
                <h1>:</h1>
                <p>
                  {dashboardData?.sponsor_username}(
                  {dashboardData?.sponsor_name})
                </p>
              </div>
              <div className="basicInfoDetails">
                <p>Name</p>
                <h1>:</h1>
                <p>{profileData?.name}</p>
              </div>
              <div className="basicInfoDetails">
                <p>Mobile No.</p>
                <h1>:</h1>
                <p>{profileData?.mobile}</p>
              </div>
              <div className="basicInfoDetails">
                <p>Email</p>
                <h1>:</h1>
                <p>{profileData?.email}</p>
              </div>
              <div className="basicInfoDetails">
                <p>Joining Date</p>
                <h1>:</h1>
                <p>{profileData?.added_on}</p>
              </div>
              <div className="basicInfoDetails">
                <p>Activation Date</p>
                <h1>:</h1>
                <p>{profileData?.active_date}</p>
              </div>
              <div className="basicInfoDetails">
                <p>Website</p>
                <h1>:</h1>
                <a>{Data.website}</a>
              </div>
              <div
                style={{ border: "1px solid #252525" }}
                className="headerLinkDiv"
                onClick={() => CopyFromtag("profileLink")}
              >
                <div className="linktext">
                  <p>your referral link</p>
                  <h2 id="profileLink">{`${window.location.origin}/register?ref=${dashboardData?.profile?.[0]?.username}`}</h2>
                </div>
                <i>
                  <FiCopy />
                </i>
              </div>
            </div>
          )}

          {/* <div className="basicInfo">
                        <h3>Account Info</h3>
                        <div className='basicInfoDetails'>
                            <p>Account Type</p>
                            <h1>:</h1>
                            <p>{dashboardData?.account_info?.[0]?.account_type}</p>
                        </div>
                        <div className='basicInfoDetails'>
                            <p>Address</p>
                            <h1>:</h1>
                            {
                                dashboardData?.account_info?.[0]?.account_type == "TRC20" ?
                                    <p>{dashboardData?.account_info?.[0]?.tron_address}</p> :
                                    <p>{dashboardData?.account_info?.[0]?.btc_address}</p>
                            }
                        </div>
                        <div className='basicInfoDetails'>
                            <p>Date&Time</p>
                            <h1>:</h1>
                            <p>{dashboardData?.account_info?.[0]?.bank_kyc_date}</p>
                        </div>
                        <div className='basicInfoDetails'>
                            <p>Status</p>
                            <h1>:</h1>
                            <p>{dashboardData?.account_info?.[0]?.bank_kyc_status}</p>
                        </div>
                    </div> */}
          <div className="basicInfo">
            <h3>Wallet Address</h3>
            {dashboardData?.account_info?.[0]?.btc_address == null ? (
              <p id="noAccountAdded">No Account Added Yet</p>
            ) : (
              <p style={{ color: Data.colorPrimary }}>
                {dashboardData?.account_info?.[0]?.btc_address}
              </p>
            )}

            <div className="addAccountDiv inputPrimary editProfile">
              <h3>Edit Account Details</h3>
              <label htmlFor="">Select Payment Type</label>
              <select
                name=""
                id=""
                value={accountType}
                onChange={(e) => setAccoutType(e.target.value)}
              >
                {/* <option value="1">Select Account Type</option> */}
                <option value="BEP20">BEP20 USDT Address</option>
                {/* <option value="TRC20">TRC20 USDT Address</option> */}
              </select>
              <p className="errorMsg">{accountTypeError}</p>
              <label htmlFor="">Address</label>
              <input
                type="text"
                placeholder="Your Address"
                value={accountAddress}
                onChange={(e) => setAccountAddress(e.target.value)}
              />
              <p className="errorMsg">{accountAddressError}</p>
              <button className="btnPrimary mt-3" onClick={() => SaveAccount()}>
                Add Account
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </section>
  );
  function ChnagePassword() {
    resetError();
    let count = 0;
    let valid = false;
    if (passwordData.oldPassword.length === 0) {
      setOldPasswordError("Old password cannot be empty");
    } else {
      count++;
    }
    if (passwordData.newPassword.length === 0) {
      setNewPasswordError("New password cannot be empty");
      count++;
    } else {
      count++;
    }
    if (passwordData.confirmPassword.length === 0) {
      setConfirmPasswordError("Confirm password cannot be empty");
      count++;
    } else {
      count++;
    }

    // console.log(count)
    if (count === 3) {
      resetError();
      setLoading(true);
      let userId = localStorage.getItem("userId");
      axios({
        method: "post",
        url: ApiPaths.changePassword,

        data: {
          u_id: userId,
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then(function (response) {
          if (response?.data?.res === "success") {
            setPasswordData({
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
            toastSuccess(response?.data?.message);
          } else {
            toastFailed(response?.data?.message);
          }
          setLoading(false);
        })
        .catch(function (response) {
          setLoading(false);
        });
    }
  }

  function SaveAccount() {
    // console.log("accountType", accountType);
    // console.log("accountAddress", accountAddress);
    resetAccountError();
    let count = 0;

    if (accountType == "1") {
      setAccoutTypeError("Please select payment type");
    } else {
      count++;
    }
    if (accountAddress.length == 0) {
      setAccountAddressError("Account address cannot be empty");
    } else {
      count++;
    }

    if (count === 2) {
      resetAccountError();
      setLoading(true);
      let token = localStorage.getItem("token");
      axios({
        method: "post",
        url: ApiPaths.setAccount,

        data: {
          account: accountAddress,
          account_type: accountType,
        },
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      })
        .then(function (response) {
          if (response?.data?.res === "success") {
            setAccountAddress("");
            toastSuccess(response?.data?.message);
            FetchData();
          } else {
            toastFailed(response?.data?.message);
          }
          setLoading(false);
        })
        .catch(function (response) {
          setLoading(false);
        });
    }
  }
  function EditProfileFunction() {
    setLoading(true);
    let userId = localStorage.getItem("userId");
    // console.log("first", profileName)
    axios({
      method: "post",
      url: ApiPaths.editProfile,
      data: {
        u_id: userId,
        name: profileName,
        email: profileEmail,
        mobile: profileMobile,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        // console.log("editProfile", response);
        if (response?.data?.res === "success") {
          FetchData();
          toastSuccess(response?.data?.message);
        } else {
          toastFailed(response?.data?.message);
        }
        setLoading(false);
      })
      .catch(function (response) {
        setLoading(false);
      });
  }
};

export default Profile;
