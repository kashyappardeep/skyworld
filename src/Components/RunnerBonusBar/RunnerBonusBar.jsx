import React from "react";
import "./RunnerBonusBar.css";

const RunnerBonusBars = ({ label, achieved, required }) => {
  const progress = Math.min((achieved / required) * 100, 100);
  const containerStyle = {
    height: "10px",
    width: "100%",
    backgroundColor: "#3a3b3c",
    borderRadius: "5px",
    border: "1px solid #555",
  };

  const fillerStyle = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: progress > 70 ? "#4caf50" : "#fbc02d",
    borderRadius: "inherit",
    transition: "width 0.5s ease-in-out",
  };

  const labelStyle = {
    padding: "5px",
    color: "white",
    fontWeight: "bold",
    fontSize: "11px",
  };

  const textStyle = {
    color: "var(--colorPrimary)",
    fontSize: "11px",
    fontWeight: "300",
    lineHeight: "10px",
    margin: "0",
  };

  return (
    <div style={{ marginBottom: "0px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={textStyle}>
          {label} ({achieved}/{required})
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={containerStyle}>
          <div style={fillerStyle}></div>
        </div>
        <span style={labelStyle}>{`${Math.round(progress)}%`}</span>
      </div>
    </div>
  );
};

const RunnerBonusBar = ({ firstLevel, totalDirects }) => {
  return (
    <>
      <div style={{ width: "100%" }}>
        <div className="progressBar" style={{ marginBottom: "0px" }}>
          <RunnerBonusBars
            label="First Level"
            achieved={firstLevel.achieved}
            required={firstLevel.required}
          />
        </div>
        <div className="progressBar" style={{ marginBottom: "0px" }}>
          <RunnerBonusBars
            label="Total Directs"
            achieved={totalDirects.achieved}
            required={totalDirects.required}
          />
        </div>
      </div>
    </>
  );
};

export default RunnerBonusBar;
