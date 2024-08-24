import React, { useState, useEffect, useRef } from "react";
import Tree from "react-d3-tree";
import "./Genealogy.css";
import { ApiPaths } from "../../Config";
import axios from "axios";
import CardSO from "../../Components/CardSO/CardSO";
// import UserData from "./UserData.json";
// This is a simplified example of an org chart with a depth of 2.
// Note how deeper levels are defined recursively via the `children` property.
// const orgChart = UserData;

export default function Genealogy() {
  const nodeSize = { x: 200, y: 200 };
  const treeWrapperRef = useRef(null);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [centeredNodeId, setCenteredNodeId] = useState(null);
  const [orgChart, setOrgChart] = useState([]);
  useEffect(() => {
    GenerateTreeApi();
  }, []);
  useEffect(() => {
    if (treeWrapperRef.current) {
      const { width, height } = treeWrapperRef.current.getBoundingClientRect();
      setDimensions({ width, height });
      setTranslate({ x: width / 2, y: height / 2 });
    }
  }, [treeWrapperRef]);
  async function GenerateTreeApi() {
    const token = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    console.log(userId);
    axios({
      method: "post",
      url: ApiPaths.genealogyTree,
      data: {
        u_id: userId,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(function (response) {
        console.log("response s", response?.data);
        setOrgChart(response?.data?.data);
      })
      .catch(function (response) {
        console.log("response", response);
      });
  }
  const Link = ({ linkData }) => (
    <path
      stroke="green"
      strokeWidth="2"
      fill="white"
      d={`M${linkData.source.x},${linkData.source.y}L${linkData.target.x},${linkData.target.y}`}
    />
  );
  return (
    <div className="dashboard">
      <div
        id="treeWrapper"
        ref={treeWrapperRef}
        style={{ width: "100vw", height: "100vh" }}
      >
        {orgChart?.length > 0 && (
          <Tree
            data={orgChart}
            orientation="vertical"
            centeringTransitionDuration={500}
            enableLegacyTransitions={true}
            draggable={true}
            nodeSize={nodeSize}
            dimensions={dimensions}
            centeredNodeId={centeredNodeId}
            translate={translate}
            separation={{ siblings: 2, nonSiblings: 2 }}
            linkSvgShape={{ strokeWidth: "2", stroke: "white" }}
          />
        )}
      </div>
    </div>
  );
}
