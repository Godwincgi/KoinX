"use client";

import "../chartPages/css/tradingview.scss";
import React, { useEffect, useState } from "react";

const TradingView = ({ selectedToken }) => {
  const [theme, setTheme] = useState("light");
  const [symbol, setSymbol] = useState(null); // state to store the symbol
  const [exchange, setExchange] = useState("BITSTAMP"); // Default exchange

  // Fetch symbol and exchanges from CoinGecko API based on selected token
  useEffect(() => {
    const fetchTokenDetails = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${selectedToken}`
        );
        const data = await response.json();

        // Check if the token exists in the data
        if (data.symbol) {
          // Set the symbol and convert to uppercase
          setSymbol(data.symbol.toUpperCase());
        } else {
          console.error("Symbol not found for token:", selectedToken);
        }

        // Get the supported exchanges for this token (if available)
        if (data.tickers && data.tickers.length > 0) {
          // Find the first valid exchange from a predefined list
          const validExchange = data.tickers.find(
            (ticker) =>
              ticker.market &&
              [
                "bitstamp",
                "binance",
                "coinbase",
                "kraken",
                "bittrex",
                "kucoin",
                "pyth",
              ].includes(ticker.market.identifier)
          );

          if (validExchange) {
            setExchange(validExchange.market.identifier.toUpperCase());
          } else {
            setExchange("PYTH");
          }
        }
      } catch (error) {
        console.error("Error fetching token details:", error);
      }
    };

    if (selectedToken) {
      fetchTokenDetails();
    }
  }, [selectedToken]); // Re-fetch when selectedToken changes

  // Handle theme changes
  useEffect(() => {
    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    setTheme(darkModeMediaQuery.matches ? "dark" : "light");

    darkModeMediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  // Load TradingView widget only if symbol is set
  useEffect(() => {
    if (symbol) {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        height: "500",
        symbol: `${exchange}:${symbol}USD`,
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

      // Clean up script on component unmount
      return () => {
        const widgetContainer = document.getElementById(
          "tradingview-widget-container"
        );
        if (widgetContainer) {
          while (widgetContainer.firstChild) {
            widgetContainer.removeChild(widgetContainer.firstChild);
          }
        }
      };
    }
  }, [theme, symbol, exchange]);

  return (
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
  );
};

export default TradingView;
