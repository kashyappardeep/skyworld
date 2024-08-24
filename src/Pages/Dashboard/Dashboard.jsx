import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import "./Slot.css";
import { Row, Col } from "react-bootstrap";
import { FaTelegramPlane } from "react-icons/fa";
import Wallet from "./../../Images/wallet.png";
import Team from "./../../Images/team.png";
import Runner from "./../../Images/runnerBonus.png";
import { ApiPaths } from "../../Config";
import axios from "axios";
import Loader from "../../Components/Loader/Loader";
import InfoPage from "../../Components/InfoPage/InfoPage";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Data } from "../../Common/Data";
import CoinLiveRate from "../../Common/CoinLiveRate";
import MyChart from "../../Components/MyChart/MyChart";
import ProgressBars from "../../Components/RankProgressBar/ProgressBars";
import fastIncome from "./../../Images/FastMovingIncome.svg";
import RunnerBonusBar from "../../Components/RunnerBonusBar/RunnerBonusBar";
import Timer from "../../Components/Timer";
import { RxLapTimer } from "react-icons/rx";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [myRank, setMyRank] = useState();
  const [incomeInfo, setIncomeInfo] = useState(false);
  const [incomeHeading, setIncomeHeading] = useState(false);
  const [infoData, setInfoData] = useState();
  const [coinLiveRate, setCoinLiveRate] = useState();
  const [runnerBonusData, setRunnerBonusdata] = useState();

  const topLeg = {
    achieved: dashboardData?.rank?.next_rank?.topLegAch ?? 0,
    required: dashboardData?.rank?.next_rank?.topLegReq ?? 0,
  };
  const otherLeg = {
    achieved: dashboardData?.rank?.next_rank?.otherLegAch ?? 0,
    required: dashboardData?.rank?.next_rank?.otherLegReq ?? 0,
  };
  const directReferrals = {
    achieved: dashboardData?.rank?.next_rank?.directAch ?? 0,
    required: dashboardData?.rank?.next_rank?.directReq ?? 0,
  };
  const firstLevel = {
    achieved: runnerBonusData?.[0]?.team_business ?? 0,
    required: runnerBonusData?.[0]?.target ?? 0,
  };
  const totalDirects = {
    achieved: runnerBonusData?.[0]?.directs ?? 0,
    required: runnerBonusData?.[0]?.direct_req ?? 0,
  };

  let myArray = Array.from({ length: 8 });

  let x = 0;
  useEffect(() => {
    if (x === 0) {
      FetchRunnerBonus();
      getCoinRate();
      checkData();
      x = 1;
    }
  }, []);

  function IncomeInfoState(newstate) {
    setIncomeInfo(newstate);
  }

  function InfoPageData(heading, data) {
    Data.isDebug && console.log(heading);
    setIncomeHeading(heading);
    setInfoData(data);
    setIncomeInfo(true);
  }

  function checkData() {
    let jsondata = localStorage.getItem("dashboardData");
    let userId = localStorage.getItem("userId");
    const data = JSON.parse(jsondata);
    Data.isDebug && console.log("data", data);
    if (data) {
      setDashboardData(data);
      setMyRank(data?.profile?.[0]?.my_rank);
      FetchData();
    } else {
      FetchData(true);
    }
  }
  function FetchRunnerBonus() {
    let userId = localStorage.getItem("userId");
    axios({
      method: "post",
      url: ApiPaths.runnerBonus,
      data: {
        u_id: userId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log("runnerbonus", response);
        setRunnerBonusdata(response?.data?.data);
      })
      .catch(function (response) {
        console.log("....", response);
      });
  }
  function FetchData(checkload) {
    if (checkload) {
      setLoading(true);
    }
    let userId = localStorage.getItem("userId");
    Data.isDebug && console.log("user id", userId);
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
        console.log("..", response);
        setDashboardData(response?.data);
        Data.isDebug &&
          console.log("first", response?.data?.profile?.[0]?.my_rank);
        setMyRank(response?.data?.profile?.[0]?.my_rank);
        localStorage.setItem("dashboardData", JSON.stringify(response?.data));
        setLoading(false);
      })
      .catch(function (response) {
        Data.isDebug && console.log(response);
        setLoading(false);
      });
  }

  async function getCoinRate() {
    let rate = await CoinLiveRate();
    setCoinLiveRate(rate);
  }

  return (
    <>
      {loading ? <Loader /> : null}
      {incomeInfo ? (
        <InfoPage
          updateState={IncomeInfoState}
          heading={incomeHeading}
          data={infoData}
        />
      ) : null}
      <ToastContainer />
      <section className="dashboard">
        <h1 className="textHeading">Dashboard</h1>
        <Row>
          <Col lg="6">
            <Row style={{ height: "100%" }}>
              <Col md="6" className="mb">
                <div className="dashboardMainAccountCard d-flex flex-column justify-content-between">
                  {dashboardData != null && dashboardData ? (
                    <MyChart className="dashboardChart" data={dashboardData} />
                  ) : (
                    ""
                  )}

                  <div className="metaDiv"></div>
                  <div>
                    <div className="d-flex gap-2">
                      <Link
                        to="plans"
                        className="flex-1"
                        style={{ width: "100%" }}
                      >
                        <button className="btnPrimary">Investment</button>
                      </Link>
                      <Link
                        to="withdraw"
                        className="flex-1"
                        style={{ width: "100%" }}
                      >
                        <button className="btnPrimary">Withdraw</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md="6" className="mb">
                <div className="dashboardRankCard">
                  <h6 style={{ color: "#3eab95" }}>Profile</h6>

                  <div className="d-flex align-items-center justify-content-between mb-2"></div>
                  <div className="aboutDetails">
                    <p>Username</p>
                    <h5>{dashboardData?.profile?.[0]?.username ?? "0"}</h5>
                  </div>
                  <div className="aboutDetails">
                    <p>Name</p>
                    <h5>{dashboardData?.profile?.[0]?.name ?? "0"}</h5>
                  </div>
                  <div className="aboutDetails">
                    <p>Investment</p>
                    <h5>{dashboardData?.package ?? "0"}</h5>
                  </div>

                  <div className="aboutDetails">
                    <p>My Rank</p>
                    <h5
                      style={{
                        color: "var(--colorPrimary)",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {dashboardData?.profile?.[0]?.my_rank ?? "0"}
                    </h5>
                  </div>
                  <ProgressBars
                    topLeg={topLeg}
                    otherLeg={otherLeg}
                    directReferrals={directReferrals}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col
            lg="6"
            className="gap-2 d-flex flex-column justify-content-between"
          >
            <Row>
              {dashboardData?.incomes != null
                ? dashboardData?.incomes?.map((x, i) => {
                    return (
                      <Col md="6" className="mb-2">
                        <div className="dashboardIncomeCard">
                          <div className="dashboardData">
                            <div>
                              <h5
                                className="dashboardCardHeading"
                                style={{ textTransform: "capitalize" }}
                              >
                                {x?.name}
                              </h5>
                              <h1>{parseFloat(x?.value).toFixed(2) ?? "0"}</h1>
                            </div>
                            <div>
                              <img
                                src={x?.icons}
                                style={{ height: 30, width: 30 }}
                              />
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })
                : myArray?.map((x, i) => {
                    return (
                      <Col md="6" className="mb-2">
                        <div className="dashboardIncomeCard">
                          <div>
                            <div>
                              <h5 className="dashboardCardHeading">
                                ................
                              </h5>
                            </div>
                          </div>
                          <h1>0.00</h1>
                          <div></div>
                        </div>
                      </Col>
                    );
                  })}
            </Row>
          </Col>
        </Row>
        <section className="mt-3">
          <Row>
            <Col lg="3" className="mb-2">
              <div className="wallets">
                <div className="walletsIconDiv">
                  <div className="walletsImg">
                    {" "}
                    <img src={Wallet} alt="" />
                    <h1>Wallets</h1>
                  </div>
                </div>
                <div className="walletsData">
                  <p>Main Wallet</p>
                  <p>
                    ${" "}
                    {parseFloat(dashboardData?.wallets?.main_wallet).toFixed(2)}
                  </p>
                </div>

                <div className="walletsData">
                  <p>Offset</p>
                  <p>$ {dashboardData?.wallets?.offset}</p>
                </div>

                {/* <div className="walletsData">
                  <p>Repurchase Staked</p>
                  <p>
                    {parseFloat(
                      dashboardData?.wallets?.repurchase_coin_wallet
                    ).toFixed(2)}
                  </p>
                </div> */}
                {/* <div className="walletsData">
                  <p>Staked Wallet</p>
                  <p>
                    ${" "}
                    {parseFloat(dashboardData?.wallets?.coin_wallet).toFixed(2)}
                  </p>
                </div> */}
              </div>
            </Col>
            <Col lg="3" className="mb-2">
              <div className="wallets">
                <div className="walletsIconDiv">
                  <div className="walletsImg">
                    {" "}
                    <img src={Team} alt="" />
                    <h1>Team</h1>
                  </div>
                </div>
                <div className="walletsData">
                  <p>My Directs</p>
                  <p>
                    {dashboardData?.teams?.active_directs}/
                    {dashboardData?.teams?.total_directs}
                  </p>
                </div>

                <div className="walletsData">
                  <p>My Team</p>
                  <p>
                    {dashboardData?.teams?.active_gen}/
                    {dashboardData?.teams?.total_gen}
                  </p>
                </div>
              </div>
            </Col>
            <Col lg="3" className="mb-2">
              <div className="wallets">
                <div className="walletsIconDiv">
                  <div className="walletsImg">
                    {" "}
                    {/* <img src={Runner} alt="" height="25px" width="10px" /> */}
                    <p>Runner Bonus</p>
                  </div>
                </div>
                <div className="walletsData">
                  <RunnerBonusBar
                    firstLevel={firstLevel}
                    totalDirects={totalDirects}
                  />
                </div>
                <div className="planDivItems">
                  <p>Days left</p>

                  <h1>
                    {runnerBonusData?.[0]?.target_date && (
                      <Timer time={runnerBonusData?.[0]?.target_date} />
                    )}
                  </h1>
                </div>
              </div>
            </Col>

            <Col lg="3" className="mb-2">
              <div className="wallets">
                <div className="walletsIconDiv">
                  <div className="walletsImg">
                    <img src={fastIncome} height="25px" width="20px" />

                    <h1>Pools</h1>
                  </div>
                </div>
                <div className="walletsData">
                  <p>Runner Pool</p>
                  <p>{Math.round(dashboardData?.level_pool)}</p>
                </div>

                <div className="walletsData">
                  <p>VIP GLOBAL POOLS BONUS</p>
                  <p>{Math.round(dashboardData?.runner_pool)}</p>
                </div>
              </div>
            </Col>
          </Row>
        </section>

        <h1 className="textHeadingWithMargin">Telegram</h1>
        <div className="telegramBotDiv">
          <Row className="align-items-center">
            <Col md="6">
              <div id="telegramBotDivText">
                <i>
                  <FaTelegramPlane />
                </i>
                <div>
                  <h5>{Data.projectName} Notifier</h5>
                  <p>New partners and transactions notifications</p>
                </div>
              </div>
            </Col>
            <Col md="6">
              <button
                onClick={() =>
                  window.open(dashboardData?.telegram_link, "_blank")
                }
                className="btnPrimary"
              >
                Connect
              </button>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
