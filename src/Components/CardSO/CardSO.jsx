import React from "react";

export default function CardSO(props) {
  const { nodeData } = props;
  return <div className="card-so-wrapper">{nodeData.name}</div>;
}
