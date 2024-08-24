import React from "react";
import { Route, Routes } from "react-router-dom";
import BinarySystem from "./Pages/BinarySystem/BinarySystem";
import BonusSystem from "./Pages/BonusSystem/BonusSystem";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Finance from "./Pages/Finance/Finance";
import MyTeam from "./Pages/MyTeam/MyTeam";
import News from "./Pages/News/News";
import Plans from "./Pages/Plans/Plans";
import Support from "./Pages/Support/Support";
import Profile from "./Pages/Profile/Profile";
import Incomes from "./Pages/Incomes/Incomes";
import Transactions from "./Pages/Transactions/Transactions";
import DirectTeam from "./Pages/DirectTeam/DirectTeam";
import GenerationTeam from "./Pages/GenerationTeam/GenerationTeam";
import GameDevelopmentBonus from "./Pages/GameDevelopmentBonus/GameDevelopmentBonus";
import Withdraw from "./Pages/Withdraw/Withdraw";
import Blog from "./Pages/Blog/Blog";
import Reward from "./Pages/Reward/Reward";
import WithdrawalHistory from "./Pages/WithdrawalHistory/WithdrawalHistory";
import NotificationPage from "./Pages/NotificationPage/NotificationPage";
import Market from "./Pages/Market/Market";
import ActivationHistory from "./Pages/ActivationHistory/ActivationHistory";
import AllCapping from "./Pages/AllCapping/AllCapping";
import VipPool from "./Pages/VipPool/VipPool";
import ClubIncome from "./Pages/ClubIncome/ClubIncome";
import FounderClubIncome from "./Pages/FounderClubIncome/FounderClubIncome";
import Google2FA from "./../src/Pages/Google2FA/Google2FA";
import Genealogy from "./Pages/Genealogy/Genealogy";
import DreamHouse from "./Pages/DreamHouse/DreamHouse";
import BusinessInfoPage from "./Pages/BusinessInfoPage/BusinessInfoPage";
import FundTransfer from "./Pages/FundPages/FundTransfer/FundTransfer";
const NavPages = () => {
  return (
    <Routes>
      <Route exact={true} path="/*" element={<Dashboard />}></Route>
      <Route exact={true} path="/finance" element={<Finance />}></Route>
      <Route exact={true} path="/my_team" element={<MyTeam />}></Route>
      <Route
        exact={true}
        path="/bonus_system"
        element={<BonusSystem />}
      ></Route>
      <Route exact={true} path="/plans" element={<Plans />}></Route>
      <Route exact={true} path="/news" element={<News />}></Route>
      {/* <Route exact={true} path="/promo" element={<Promo />}></Route> */}
      <Route exact={true} path="/support" element={<Support />}></Route>
      <Route
        exact={true}
        path="/binary_system"
        element={<BinarySystem />}
      ></Route>
      <Route exact={true} path="/profile" element={<Profile />}></Route>
      <Route exact={true} path="/incomes" element={<Incomes />}></Route>
      <Route
        exact={true}
        path="/transactions"
        element={<Transactions />}
      ></Route>
      <Route exact={true} path="/direct_team" element={<DirectTeam />}></Route>
      <Route
        exact={true}
        path="/generation_team"
        element={<GenerationTeam />}
      ></Route>
      <Route
        exact={true}
        path="/development_bonus"
        element={<GameDevelopmentBonus />}
      ></Route>
      <Route exact={true} path="/withdraw" element={<Withdraw />}></Route>
      {/* <Route exact={true} path="/set_account" element={<EditAccount />}></Route> */}
      <Route exact={true} path="/blog" element={<Blog />}></Route>
      <Route exact={true} path="/reward" element={<Reward />}></Route>
      <Route
        exact={true}
        path="/withdrawal_history"
        element={<WithdrawalHistory />}
      ></Route>
      <Route
        exact={true}
        path="/notification"
        element={<NotificationPage />}
      ></Route>
      <Route exact={true} path="/market" element={<Market />}></Route>
      <Route
        exact={true}
        path="/activation_history"
        element={<ActivationHistory />}
      ></Route>
      <Route exact={true} path="/capping" element={<AllCapping />}></Route>
      <Route exact={true} path="/fund_transfer" element={<FundTransfer />}></Route>
      <Route exact={true} path="/vip-pool" element={<VipPool />}></Route>
      <Route exact={true} path="/club-income" element={<ClubIncome />}></Route>
      <Route exact={true} path="/2fa" element={<Google2FA />}></Route>
      <Route
        exact={true}
        path="/founder-club-income"
        element={<FounderClubIncome />}
      ></Route>
      <Route exact={true} path="/genealogy" element={<Genealogy />}></Route>
      <Route exact={true} path="/dream_house" element={<DreamHouse />}></Route>
      <Route exact={true} path="/business_info" element={<BusinessInfoPage />}></Route>
    </Routes>
  );
};

export default NavPages;
