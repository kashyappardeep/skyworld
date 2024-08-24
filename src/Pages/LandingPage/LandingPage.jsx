import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Header from "../../Components/Header/Header";
import "./LandingPage.css";
import { RxDashboard } from "react-icons/rx";
import { BsGraphUp } from "react-icons/bs";
import { FaFileInvoiceDollar } from "react-icons/fa6";
import { TbReportAnalytics, TbReport, TbLogout } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi";
import { AiOutlineHistory } from "react-icons/ai";
import { GiDiamondTrophy } from "react-icons/gi";
import { RiRefund2Line } from "react-icons/ri";
import { BiNews } from "react-icons/bi";
import { FaRegStar } from "react-icons/fa";
import { MdInfoOutline, MdOutlineSupport } from "react-icons/md";
import { BiUser } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import NavPages from "../../NavPages";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarDisplay } from "./../../Redux/SideDisplaySlice";
import { IoIosArrowUp } from "react-icons/io";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Footer from "../../Components/Footer/Footer";
import { ApiPaths } from "../../Config";
import axios from "axios";
import ScrollToTop from "../../Common/ScrollToTop";
import { Data, MyDelay } from "../../Common/Data";
import founderClub from "../../Images/FounderClubIncome.svg";
import clubIncome from "../../Images/ClubIncome.svg";
import fastIncome from "../../Images/FastMovingIncome.svg";
import { CiHome } from "react-icons/ci";

const LandingPage = () => {
  const sideDisplay = useSelector((state) => state.sideDisplay.value);
  const [alertmsg, setAlertmsg] = useState("-130px");
  const [partnerSideIcon, setPartnerSideIcon] = useState("180deg");
  const [partnerDropdown, setPartnerDropdown] = useState("0px");
  const [partnerDropdownVisi, setPartnerDropdownVisi] = useState("hidden");
  const [fundIcon, setFundIcon] = useState("180deg");
  const [fundDropdown, setFundDropdown] = useState("0px");
  const [fundDropdownVisi, setFundDropdownVisi] = useState("hidden");
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    ScrollToTop();
  }, [location.pathname]);

  async function LogoutFunc() {
    localStorage.clear();
    await MyDelay(500);
    navigate("/");
  }
  useEffect(() => {
    window.addEventListener("load", () => { });
  });
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    });
    return windowDimensions;
  }
  const { height, width } = useWindowDimensions();
  useEffect(() => {
    if (width > 800) {
      dispatch(setSidebarDisplay("block"));
    } else {
      dispatch(setSidebarDisplay("none"));
    }
  }, [width]);

  useEffect(() => {
    checkData();
  }, []);

  function checkData() {
    let jsondata = localStorage.getItem("dashboardData");
    const data = JSON.parse(jsondata);
    // console.log("data", data)
    if (data) {
      setDashboardData(data);
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
        localStorage.setItem("dashboardData", JSON.stringify(response?.data));
        setLoading(false);
      })
      .catch(function (response) {
        // console.log(response);
        setLoading(false);
      });
  }

  return (
    <>
      {confirmLogout ? (
        <div className="otpSection" style={{ zIndex: "999" }}>
          <div className="otpContainer">
            <h1>Logout</h1>
            <p>Are you sure you want to log out?</p>
            {
              <div>
                <button
                  className="btnSecondary"
                  onClick={() => setConfirmLogout(false)}
                >
                  No
                </button>
                <button className="btnPrimary" onClick={() => LogoutFunc()}>
                  Yes
                </button>
              </div>
            }
          </div>
        </div>
      ) : null}
      <section className="landingPage">
        <div className="alertMsg" style={{ top: alertmsg }}>
          Link Copied!
        </div>
        <Container>
          <section className="landingPageContent">
            <div className="sidebar" style={{ display: sideDisplay }}>
              <div className="sidebarlogoDiv">
                <Link to="/dashboard">
                  {" "}
                  <img src={Data.logo} alt="" />
                </Link>
                <i onClick={() => dispatch(setSidebarDisplay("none"))}>
                  <RxCross2 />
                </i>
              </div>

              <div id="sideItems">
                <NavLink
                  to="/dashboard"
                  end
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <RxDashboard />
                    </i>
                    <h5>Dashboard</h5>
                  </div>
                </NavLink>
                <NavLink
                  to="profile"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <BiUser />
                    </i>
                    <h5>Profile</h5>
                  </div>
                </NavLink>
                <NavLink
                  to="business_info"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <MdInfoOutline />
                    </i>
                    <h5>Business Info</h5>
                  </div>
                </NavLink>
                <NavLink
                  to="plans"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <BsGraphUp />
                    </i>
                    <h5>Investment</h5>
                  </div>
                </NavLink>
                <NavLink
                  to="fund_transfer"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <FaFileInvoiceDollar />
                    </i>
                    <h5>Fund Transfer</h5>
                  </div>
                </NavLink>
                <NavLink
                  to="vip-pool"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <img src={fastIncome} height="20" width="20" />
                    </i>

                    <h5>VIP GLOBAL POOLS BONUS</h5>
                  </div>
                </NavLink>
                <NavLink
                  to="club-income"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <img style={{}} src={clubIncome} height="20" width="20" />
                    </i>

                    <h5>Ranks</h5>
                  </div>
                </NavLink>
                {/* <NavLink
                  to="founder-club-income"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      {" "}
                      <img src={founderClub} height="20" width="20" />
                    </i>
                    <h5>Founder Club Income</h5>
                  </div>
                </NavLink> */}
                <NavLink
                  to="activation_history"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <AiOutlineHistory />
                    </i>
                    <h5>Activation History</h5>
                  </div>
                </NavLink>
                <NavLink
                  to="withdrawal_history"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <AiOutlineHistory />
                    </i>
                    <h5>Withdrawal History</h5>
                  </div>
                </NavLink>
                <div id="partnershipSideFullDiv">
                  <div
                    className="sideLink"
                    onClick={() => (
                      partnerSideIcon === "180deg"
                        ? setPartnerSideIcon("0deg")
                        : setPartnerSideIcon("180deg"),
                      partnerDropdown === "0px"
                        ? setPartnerDropdown("70px")
                        : setPartnerDropdown("0px"),
                      partnerDropdownVisi === "hidden"
                        ? setPartnerDropdownVisi("visible")
                        : setPartnerDropdownVisi("hidden")
                    )}
                  >
                    <i>
                      <HiOutlineUserGroup />
                    </i>
                    <div id="partnershipSideDiv">
                      <h5>Partnership </h5>
                      <i style={{ transform: `rotate(${partnerSideIcon})` }}>
                        <IoIosArrowUp />
                      </i>
                    </div>
                  </div>
                  <div
                    id="sideDropdown"
                    style={{
                      height: partnerDropdown,
                      visibility: partnerDropdownVisi,
                    }}
                  >
                    <NavLink
                      to="direct_team"
                      exact={true}
                      activeClassName="activeTab"
                      onClick={() =>
                        width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                      }
                    >
                      <p>Direct Team</p>
                    </NavLink>
                    <NavLink
                      to="generation_team"
                      exact={true}
                      activeClassName="activeTab"
                      onClick={() =>
                        width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                      }
                    >
                      <p>Level Team</p>
                    </NavLink>
                    <NavLink
                      to="genealogy"
                      exact={true}
                      activeClassName="activeTab"
                      onClick={() =>
                        width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                      }
                    >
                      <p>Genealogy</p>
                    </NavLink>
                  </div>
                </div>
                <NavLink
                  to="incomes"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <TbReportAnalytics />
                    </i>
                    <h5>Incomes</h5>
                  </div>
                </NavLink>

                <NavLink
                  to="transactions"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <TbReport />
                    </i>
                    <h5>Transactions</h5>
                  </div>
                </NavLink>

                <NavLink
                  to="dream_house"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <CiHome />{" "}
                    </i>
                    <h5>Dream House Bonus</h5>
                  </div>
                </NavLink>

                <NavLink
                  to="reward"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <GiDiamondTrophy />
                    </i>
                    <h5>Retreat Bonus</h5>
                  </div>
                </NavLink>

                {/* <NavLink
                  to="promo"
                  exact={true}
                  activeClassName='activeTab'

                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <FaRegStar />
                    </i>
                    <h5>Promo</h5>
                  </div></NavLink> */}
                <NavLink
                  to="support"
                  exact={true}
                  activeClassName="activeTab"
                  onClick={() =>
                    width < 800 ? dispatch(setSidebarDisplay("none")) : ""
                  }
                >
                  <div className="sideLink">
                    <i>
                      <MdOutlineSupport />
                    </i>
                    <h5>Support</h5>
                  </div>
                </NavLink>
                <a
                  onClick={() => (
                    width < 800 ? dispatch(setSidebarDisplay("none")) : "",
                    setConfirmLogout(true)
                  )}
                >
                  <div className="sideLink">
                    <i>
                      <TbLogout />
                    </i>
                    <h5>Logout</h5>
                  </div>
                </a>
              </div>
            </div>
            <div className="dashboardPages">
              <Header
                link={
                  window.location.origin +
                  "/register?ref=" +
                  dashboardData?.profile?.[0]?.username
                }
                username={dashboardData?.profile?.[0]?.username}
              />
              {/* <div className="headerLogoLink headerLinkDash">
                <div
                  className="headerLinkDiv"
                  onClick={() => (CopyToClipboard('headerLink'), AlertMsg())}
                >
                  <div className="linktext">
                    <p>your refferal link</p>
                    <h2 id="headerLink">{window.location.origin +
                      "/?ref=" +
                      dashboardData?.profile?.[0]?.username}</h2>
                  </div>
                  <i>
                    <FiCopy />
                  </i>
                </div>
              </div> */}
              {/* <div id="topNotification">
                <div className="planTopImg">
                  <div>
                    <p>Official Launch Dubai</p>
                    <button
                      className="btnPrimary m-0"
                      style={{
                        width: "150px",
                        background: "#F1C455",
                        boxShadow: "0px 0px 10px 0 #F1C455",
                      }}
                    >
                      More info
                    </button>
                  </div>
                </div>
              </div> */}
              <NavPages />
            </div>
          </section>
          <Footer />
        </Container>
      </section>
    </>
  );
};

export default LandingPage;
