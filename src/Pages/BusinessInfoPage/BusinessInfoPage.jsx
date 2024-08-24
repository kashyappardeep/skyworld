import React, { useEffect, useState } from "react";
import "./BusinessInfoPage.css";
import axios from "axios";
import { ApiPaths } from "../../Config";

const BusinessInfoPage = () => {
  const [loading, setLoading] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(null);

  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = async () => {
    setLoading(true);
    let userId = localStorage.getItem("userId");
    try {
      const response = await axios({
        method: "post",
        url: ApiPaths.getBusinessInfo,
        data: {
          u_id: userId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("res", response);
      setBusinessInfo(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !businessInfo) {
    return <div>Loading...</div>;
  }

  const profile = businessInfo.profile[0];
  const rank = businessInfo.rank;

  // Ensure numerical addition
  const topLegVolume = parseInt(rank.top_leg, 10);
  const otherLegVolume = parseInt(rank.other_leg, 10);
  const totalTurnover = topLegVolume + otherLegVolume;
  return (
    <section className="dashboard position-relative">
      <div className="businessInfo">
        <div>
          <p>Member Detail</p>
          <p>
            {profile.name}({profile.username})
          </p>
        </div>
        <div>
          <p>Rank</p>
          <p>{profile.my_rank}</p>
        </div>
        <div>
          <p>Status</p>
          <p>{profile.active_status === "1" ? "Active" : "Inactive"}</p>
        </div>
        <div>
          <p>Member Since</p>
          <p>{new Date(profile.added_on).toLocaleDateString()}</p>
        </div>
        <div>
          <p>Community Size</p>
          <p>{rank.active_directs}</p>
        </div>
        <div>
          <p>Strong Leg Volume</p>
          <p>{rank.top_leg}</p>
        </div>
        <div>
          <p>Weaker Leg Volume</p>
          <p>{rank.other_leg}</p>
        </div>
        <div>
          <p>Total Turnover</p>
          <p>{totalTurnover}</p>
        </div>
        <div>
          <p>Next Rank SLV</p>
          <p>{rank?.next_rank.topLegReq}</p>
        </div>
        <div>
          <p>Next Rank OLV</p>
          <p>{rank?.next_rank.otherLegReq}</p>
        </div>
      </div>
    </section>
  );
};

export default BusinessInfoPage;
