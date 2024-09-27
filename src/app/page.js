import TradingViewWidget from "./chartPages/tradingviewWidget";
import Trending from "./geckoApi/trending";
import MainNavigation from "./mainNavigation/mainNavigation";
import SignIn from "./other/signin";
import "./mainNavigation/css/mainpage.scss";
import FullTrend from "./geckoApi/fulltrend";
import PricedCoins from "./geckoApi/pricedcoins";

export default function Home() {
  return (
    <>
      <MainNavigation />
      <div className="widget">
        <TradingViewWidget />
        <div className="right-side">
          <SignIn />
          <Trending />
        </div>
      </div>
      <PricedCoins />
      <FullTrend />
    </>
  );
}
