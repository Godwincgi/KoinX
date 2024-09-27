"use client";

import SimplePrice from "../geckoApi/simplePrice";
import "./css/tradingview.scss";
import React, { useEffect, useState } from "react";

const TradingViewWidget = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Function to update the theme based on system preference
    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    // Check system theme preference
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setTheme(darkModeMediaQuery.matches ? "dark" : "light");

    // Add listener for theme changes
    darkModeMediaQuery.addEventListener("change", handleThemeChange);

    // Dynamically load the TradingView script
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      height: "400",
      symbol: "BITSTAMP:BTCUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme,
      style: "2",
      locale: "en",
      hide_top_toolbar: true,
      backgroundColor:
        theme === "dark" ? "rgba(36, 36, 36, 1)" : "rgba(255, 255, 255, 1)",
      allow_symbol_change: true,
      calendar: false,
      hide_volume: true,
      support_host: "https://www.tradingview.com",
    });

    document
      .getElementById("tradingview-widget-container")
      ?.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      const widgetContainer = document.getElementById(
        "tradingview-widget-container"
      );
      if (widgetContainer) {
        while (widgetContainer.firstChild) {
          widgetContainer.removeChild(widgetContainer.firstChild);
        }
      }
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [theme]);

  return (
    <>
      <div className="simple-price-container">
        <div className="price-div">
          <SimplePrice />
        </div>
        <div className="main-container">
          <div className="section-one">
            <div className="tradingview-widget-container">
              <div className="tradingview-widget-container__widget"></div>
              <div className="tradingview-widget-copyright">
                <a
                  href="https://www.tradingview.com/"
                  rel="noopener nofollow"
                  target="_blank">
                  <span className="blue-text"></span>
                </a>
              </div>
              <div id="tradingview-widget-container"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradingViewWidget;
