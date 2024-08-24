import Logo from "./../Images/logo.png";
import LogoIcon from "./../Images/logoIcon.png";

const root = document.documentElement;
const rootStyles = getComputedStyle(root);
const rootColor = rootStyles.getPropertyValue("--colorPrimary");
const colorSec = rootStyles.getPropertyValue("--colorSuccess");
const walletAdd = localStorage.getItem("walletAddress");
export const Data = {
  isDebug: true,
  colorPrimary: rootColor,
  colorSuccess: colorSec,
  projectName: "SkyWorld",
  website: "",
  logo: Logo,
  logoIcon: LogoIcon,
  walletAddress: walletAdd,
  providerLink: "https://data-seed-prebsc-1-s1.binance.org:8545",
};
export const MyDelay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};
