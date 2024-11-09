"use client";

import React, { useState, useEffect } from "react";
import Trending from "../geckoApi/trending";
import MainNavigation from "../mainNavigation/mainNavigation";
import SignIn from "../other/signin";
import "../mainNavigation/css/mainpage.scss";
import FullTrend from "../geckoApi/fulltrend";
import PricedCoins from "../geckoApi/pricedcoins";
import "./css/style.scss";
import { BsCaretUpFill } from "react-icons/bs";
import { BsCaretDownFill } from "react-icons/bs";
import TradingView from "./tradingChart";
import "../chartPages/css/tradingview.scss";

export default function TokenPage({ params }) {
  const token = params.token;
  const [data, setData] = useState(null);
  const [symbol, setSymbol] = useState("");
  const [logo, setLogo] = useState("");
  const [error, setError] = useState(null); // New state for error handling

  const priceUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=inr%2Cusd&include_24hr_change=true`;
  const symbolUrl = `https://api.coingecko.com/api/v3/coins/${token}`;

  useEffect(() => {
    // Reset error state before fetching
    setError(null);

    // Fetch price data
    fetch(priceUrl)
      .then((response) => response.json())
      .then((priceData) => setData(priceData[token]))
      .catch((error) => {
        console.error("Error fetching price data:", error);
        setError("Failed to load price data");
      });

    // Fetch symbol and logo data
    fetch(symbolUrl)
      .then((response) => response.json())
      .then((symbolData) => {
        setSymbol(symbolData.symbol.toUpperCase());
        setLogo(symbolData.image.small); // or `symbolData.image.large` for a larger logo
      })
      .catch((error) => {
        console.error("Error fetching symbol data:", error);
        setError("Failed to load symbol data");
      });
  }, [token]);

  return (
    <>
      <MainNavigation />
      <div className="widget">
        <div className="simple-price-container">
          <div className="crypto-section">
            <div className="crypto-header">
              {logo && (
                <img src={logo} alt={`${token} logo`} className="crypto-logo" />
              )}
              <p className="crypto-text">
                <strong>
                  {token.charAt(0).toUpperCase() + token.slice(1).toLowerCase()}
                </strong>
                <span className="crypto-symbol">{symbol}</span>
              </p>
            </div>
            {error ? (
              <p>{error}</p> // Display the error if there's one
            ) : data ? (
              <>
                <div className="crypto-usd">
                  <p className="usd-price">
                    <strong>
                      $
                      {Number(data.usd).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </p>
                  <p>
                    <span
                      className="price-change-top"
                      style={{
                        color:
                          data.usd_24h_change > 0 ? "rgb(0, 235, 0)" : "red",
                      }}>
                      {data.usd_24h_change && data.usd_24h_change > 0 ? (
                        <BsCaretUpFill
                          style={{
                            color: "rgb(0, 235, 0)",
                          }}
                        />
                      ) : data.usd_24h_change && data.usd_24h_change < 0 ? (
                        <BsCaretDownFill
                          style={{
                            color: "red",
                          }}
                        />
                      ) : null}
                      {data.usd_24h_change && data.usd_24h_change > 0
                        ? `+${data.usd_24h_change.toFixed(2)}%`
                        : `${data.usd_24h_change.toFixed(2)}%`}
                    </span>
                  </p>
                  <p className="place-holder">(24h)</p>
                </div>
                <p className="inr-section">
                  <strong>₹{data.inr.toLocaleString()}</strong>
                </p>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </div>
          <TradingView selectedToken={token} />
        </div>
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
