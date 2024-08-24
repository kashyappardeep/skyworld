import React, { useState } from "react";
// import "./RewardCard.css";
import { GiTrophyCup } from "react-icons/gi";
import rankGold from "./../../Images/rankGold.png";
import { Data } from "../../Common/Data";
import { CiHome } from "react-icons/ci";

import "./DreamCard.css";
const DreamCard = (props) => {
  return (
    <div
      className="rewardCard"
      id={props.status == "Achieved" ? "rewardCardActive" : ""}
    >
      <div className="card1">
        <img src={props.image} alt="" />
      </div>
      <div style={{ padding: "20px" }}>
        {" "}
        <div className="rewardCardDiv">
          <p>Bonus</p>
          <h5>${props.bonus}</h5>
        </div>
        <div className="rewardCardDiv">
          <p>Rank</p>
          <h5 style={{ color: "var(--colorPrimary)" }}>{props.rank}</h5>
        </div>
        <div className="rewardCardDiv">
          <p>Status</p>

          <h5
            style={{
              color: props.status == "Pending" ? "orange" : Data.colorSuccess,
            }}
          >
            {props.status}
          </h5>
        </div>
      </div>
    </div>
  );
};

export default DreamCard;
