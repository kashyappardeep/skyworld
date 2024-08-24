import { configureStore } from "@reduxjs/toolkit";
import SideDisplaySlice from "./../Redux/SideDisplaySlice";
import Accounts from "./Accounts";

export default configureStore({
  reducer: {
    sideDisplay: SideDisplaySlice,
    account:Accounts
  },
});
