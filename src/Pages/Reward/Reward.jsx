import React, { useEffect, useState } from "react";
import "./Reward.css";
import { ApiPaths } from "../../Config";
import axios from "axios";
import { GiDiamondTrophy } from "react-icons/gi";
import Loader from "../../Components/Loader/Loader";
import RewardCard from "../../Components/RewardCard/RewardCard";
import { Col, Row } from "react-bootstrap";
import RankStatar from "./../../Images/rankStatar.png";
import RankSilver from "./../../Images/rankSilver.png";
import RankPearl from "./../../Images/rankPearl.png";
import RankGold from "./../../Images/rankGold.png";
import RankEmerald from "./../../Images/rankEmerald.png";
import RankDiamond from "./../../Images/rankDiamond.png";
import RankCrowdDiamond from "./../../Images/rankCrowdDiamond.png";
import RankRoyalDiamond from "./../../Images/rankRoyalDiamond.png";
import { Data } from "../../Common/Data";
const Reward = () => {
  var imageArray = [
    RankStatar,
    RankSilver,
    RankPearl,
    RankGold,
    RankEmerald,
    RankDiamond,
    RankCrowdDiamond,
    RankRoyalDiamond,
  ];
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [image, setImage] = useState("");
  useEffect(() => {
    checkData();
  }, []);

  function checkData() {
    let jsondata = localStorage.getItem("rewardData");
    console.log(jsondata);
    const data = "";
    // console.log("data", data)
    if (data) {
      setDashboardData(data);
      FetchData();
    } else {
      FetchData(true);
    }
  }
  function FetchData(load) {
    if (load) {
      setLoading(true);
    }
    let userId = localStorage.getItem("userId");
    axios({
      method: "post",
      url: ApiPaths.reward,
      data: {
        u_id: userId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log("reward", response);
        setDashboardData(response?.data?.data?.data);

        localStorage.setItem(
          "rewardData",
          JSON.stringify(response?.data?.data?.data)
        );
        setLoading(false);
      })
      .catch(function (response) {
        setLoading(false);
      });
  }
  return (
    <section className="dashboard">
      {loading ? <Loader /> : null}
      <h5
        id="developmentBonusHeading"
        className="d-flex align-items-center justify-content-center"
      >
        {" "}
        <i className="d-flex">
          <GiDiamondTrophy />
        </i>
        Retreat Bonus
      </h5>

      <Row style={{ rowGap: "20px" }} className="mt-4">
        {Object.entries(dashboardData, image).map(([key, details]) => (
          <Col md="6" lg="4" sm="6" xs="12">
            <RewardCard
              image={dashboardData?.[key]?.img}
              tour={dashboardData?.[key]?.tour}
              bonus={dashboardData?.[key]?.bonus}
              targetDate={dashboardData?.[key]?.target_date}
              status={dashboardData?.[key]?.status}
              psv={dashboardData?.[key]?.psv}
              tsv={dashboardData?.[key]?.tsv}
              joiningDate={dashboardData?.[key]?.joining_date}
            />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Reward;
