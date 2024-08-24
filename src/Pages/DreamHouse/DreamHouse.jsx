import React, { useEffect, useState } from "react";
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
import DreamCard from "../../Components/DreamCard/DreamCard";

const DreamHouse = () => {
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
    FetchData();
  }, []);

  function FetchData(load) {
    if (load) {
      setLoading(true);
    }
    let userId = localStorage.getItem("userId");
    axios({
      method: "post",
      url: ApiPaths.dreamHouse,
      data: {
        u_id: userId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log("dreamhouse", response?.data?.data);
        setDashboardData(response?.data?.data);

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
        Dream House Bonus
      </h5>

      <Row style={{ rowGap: "20px" }} className="mt-4">
        {Object.entries(dashboardData, image).map(([key, details]) => (
          <Col md="6" lg="4" sm="6" xs="12">
            <DreamCard
              image={dashboardData?.[key]?.img}
              rank={dashboardData?.[key]?.rank}
              bonus={dashboardData?.[key]?.dhb_bonus}
              status={dashboardData?.[key]?.status}
            />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default DreamHouse;
