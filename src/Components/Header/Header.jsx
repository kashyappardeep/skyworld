import React, { useState } from "react";
import "./Header.css";
import User from "./../../Images/user.png";
import { FiCopy } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { setSidebarDisplay } from "./../../Redux/SideDisplaySlice";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import CopyFromtag from "../../Common/CopyFromtag";
import { Data } from "../../Common/Data";
import ConnectButton from "../ConnectButton";
const Header = (props) => {
  const navigate = useNavigate();
  const [alertmsg, setAlertmsg] = useState("-130px");
  const dispatch = useDispatch();
  const [themeDarkLight, setThemeDarkLight] = useState(true);
  const Dark = () => {
    let ThemeColor = document.querySelector(":root");
    var rs = getComputedStyle(ThemeColor);
    ThemeColor.style.setProperty("--bodyColor", "#151515");
    ThemeColor.style.setProperty("--containerColor", "#1D1D1D");
    ThemeColor.style.setProperty("--textHeading", "#FFFFFF");
    ThemeColor.style.setProperty("--sideActiveColor", "#FFFFFF");
    ThemeColor.style.setProperty("--lightColor", "#252525");
    ThemeColor.style.setProperty("--borderColor", "#fff");
    ThemeColor.style.setProperty("--darkLightText", "#fff");
    ThemeColor.style.setProperty("--darkLightBackground", "#181818");
    ThemeColor.style.setProperty("--activeTextColor", "#FFFFFF");
    ThemeColor.style.setProperty("--textColor", "#838383 ");
    ThemeColor.style.setProperty("--rewardCardActive", "#73ba3f2b ");
    ThemeColor.style.setProperty("--rewardCardInactive", "#72ba3f0c ");
    ThemeColor.style.setProperty("--colorPrimary", "#3eab95 ");
  };
  const Light = () => {
    let ThemeColor = document.querySelector(":root");
    ThemeColor.style.setProperty("--bodyColor", "#F4F4F4");
    ThemeColor.style.setProperty("--containerColor", "#FFFFFF");
    ThemeColor.style.setProperty("--textHeading", "#151515");
    ThemeColor.style.setProperty("--sideActiveColor", "#3eab95");
    ThemeColor.style.setProperty("--lightColor", "#e7ede7");
    ThemeColor.style.setProperty("--borderColor", "#000");
    ThemeColor.style.setProperty("--darkLightText", "#000");
    ThemeColor.style.setProperty("--darkLightBackground", "#EFEFEF");
    ThemeColor.style.setProperty("--activeTextColor", "#73BA3F");
    ThemeColor.style.setProperty("--textColor", "#272727 ");
    ThemeColor.style.setProperty("--rewardCardActive", "#73ba3f8f ");
    ThemeColor.style.setProperty("--rewardCardInactive", "#73ba3f61 ");
    ThemeColor.style.setProperty("--colorPrimary", "#3eab95 ");
  };
  return (
    <>
      <ToastContainer />
      <div className="header">
        <div className="alertMsg" id="CopiedMsg" style={{ top: alertmsg }}>
          Link Copied!
        </div>
        <div>
          <Link to="/dashboard">
            <img id="logoicon" src={Data.logo} alt="logo.png" />
          </Link>
          <div className="headerLogoLink headerLinkHeader">
            <div
              className="headerLinkDiv"
              onClick={() => CopyFromtag("headerLink1")}
            >
              <div className="linktext">
                <p>your referral link</p>
                <h2 id="headerLink1">{props.link}</h2>
              </div>
              <i>
                <FiCopy />
              </i>
            </div>
          </div>
        </div>

        <div className="headerProfileColorDiv">
          <div
            style={{ margin: "0px 10px" }}
            onClick={() => (themeDarkLight == true ? Light() : Dark())}
          >
            <input
              type="checkbox"
              class="checkbox"
              id="checkbox"
              checked={themeDarkLight}
              onChange={(e) => setThemeDarkLight(!themeDarkLight)}
            />
            <label for="checkbox" class="checkbox-label">
              <i class="fas fa-moon"></i>
              <i class="fas fa-sun"></i>
              <span class="ball"></span>
            </label>
          </div>
          <div
            className="headerProfile"
            onClick={() => navigate("/dashboard/profile")}
          >
            <img src={User} alt="" />
            <h5>{props.username}</h5>
          </div>
          <i
            className="menuIcon"
            onClick={() => dispatch(setSidebarDisplay("block"))}
          >
            <FiMenu />
          </i>
        </div>
      </div>
    </>
  );
};

export default Header;
