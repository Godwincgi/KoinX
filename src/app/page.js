"use client";

import React, { useState, useEffect } from "react";
import TradingViewWidget from "./chartPages/tradingviewWidget";
import Trending from "./geckoApi/trending";
import MainNavigation from "./mainNavigation/mainNavigation";
import SignIn from "./other/signin";
import "./mainNavigation/css/mainpage.scss";
import FullTrend from "./geckoApi/fulltrend";
import PricedCoins from "./geckoApi/pricedcoins";

// Example loading GIF
const loadingGifURL = "/images/gear.gif";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}>
        <img
          src={loadingGifURL}
          alt="Loading..."
          style={{ width: "150px", height: "150px" }}
        />
      </div>
    );
  }

  return (
    <>
      <MainNavigation />
      <div className="widget">
        <TradingViewWidget />
        <div className="right-side-small">
          <SignIn />
          <Trending />
        </div>
      </div>
      <div className="device-large">
        <PricedCoins />
        <FullTrend />
      </div>
      <div className="right-side">
        <SignIn />
        <Trending />
      </div>
    </>
  );
}
