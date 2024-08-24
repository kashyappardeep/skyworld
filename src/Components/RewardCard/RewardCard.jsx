import React, { useState } from "react";
import "./RewardCard.css";
import { GiTrophyCup } from "react-icons/gi";
import rankGold from "./../../Images/rankGold.png";
import { Data } from "../../Common/Data";
const RewardCard = (props) => {
  return (
    <div
      className="rewardCard"
      id={props.status == "Achieved" ? "rewardCardActive" : ""}
    >
      <div className="card1">
        <div>
          <img src={props.image} alt="" />
        </div>
        <div>
          <h1 style={{ textTransform: "uppercase", fontSize: "16px" }}>
            {props.tour}
          </h1>
        </div>
      </div>

      <div>
        <h5 style={{ color: "white", marginBottom: "20px" }}>
          {props.bonus} Bonus
        </h5>
      </div>

      <div className="rewardCardDiv">
        <p>Tour Target</p>
        <h5>{props.targetDate} </h5>
      </div>
      <div className="rewardCardDiv">
        <p>PSV</p>

        <h5>{props.psv}</h5>
      </div>
      <div className="rewardCardDiv">
        <p>TSV</p>

        <h5>{props.tsv}TSV</h5>
      </div>
      <div className="rewardCardDiv">
        <p>Joining Date</p>

        <h5>{props.joiningDate}</h5>
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
  );
};

export default RewardCard;
