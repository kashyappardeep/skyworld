import React from "react";
import { PieChart } from "react-minimal-pie-chart";
import "./MyChart.css";
import { Data } from "../../Common/Data";

const MyChart = (props) => {
  let myData = props?.data || [];
  let ern = parseFloat(myData?.total_earning ?? 0);
  let cap = parseFloat(myData?.package * 2 ?? 0);

  let remaining = cap - ern;

  const data = [
    {
      title: "Remaining",
      value: remaining > 0 ? remaining : 0.00000000001,
      color: "grey",
    },
    {
      title: "Earning",
      value: ern > 0 ? ern : 0.00000000001,
      color: Data.colorPrimary,
    },
  ];

  return (
    <div className="capping">
      <div className="cappingGraphDiv">
        <div style={{ height: "120px" }}>
          <PieChart
            animate={true}
            animationDuration={2000}
            data={data}
            lineWidth={30}
            paddingAngle={2}
            startAngle={0}
            label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
            labelStyle={{
              fill: "#fff",
              fontSize: "8px",
              fontFamily: "sans-serif",
              fontWeight: "bold",
              background: "red",
              borderRadius: "50%",
            }}
          />
        </div>
      </div>

      <div className="cappingDetails">
        <div>
          <h1>${remaining.toFixed(2)}</h1>
          <p>Pending Rewards</p>
        </div>
        <div>
          <h1>${ern.toFixed(2)}</h1>
          <p>Total Earning</p>
        </div>
      </div>
    </div>
  );
};

export default MyChart;
