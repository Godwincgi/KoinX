"use client";

import { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "./css/fulltrend.scss";

function PricedCoins() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        // Fetch market data for all coins
        const marketResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true`
        );

        // Check if response is ok
        if (!marketResponse.ok) {
          throw new Error(`HTTP error! Status: ${marketResponse.status}`);
        }

        const marketData = await marketResponse.json();

        // Get the top 10 coins by current price
        const topCoins = marketData
          .sort((a, b) => b.current_price - a.current_price) // Sort by current price descending
          .slice(0, 10) // Get top 10 coins
          .map((coin) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            thumb: coin.image, // Changed to 'image' from 'thumb'
            sparkline_in_7d: coin.sparkline_in_7d || { price: [] },
            price_change_percentage_24h: coin.price_change_percentage_24h || 0,
            current_price: coin.current_price || 0, // Add current price data
          }));

        setCoins(topCoins); // Set top coins
      } catch (error) {
        console.error("Error fetching top coins:", error);

        // Access error message
        setError(
          <span className="error-message">
            Error: Failed to fetch top coins!
          </span>
        );
      } finally {
        setLoading(false); // Stop loading once fetch completes
      }
    };

    fetchTopCoins();
  }, []);

  return (
    <div className="coin-wrapper">
      <h3 className="section-top">You may also like</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="full-list">
          {coins.map((coin) => (
            <li key={coin.id} className="each-list">
              <div className="coin-list-section">
                <img src={coin.thumb} alt={coin.name} />
                <strong className="coin-list-symbol">
                  {coin.symbol.toUpperCase()}{" "}
                </strong>
                <span
                  className="coin-list-span"
                  style={{
                    color:
                      coin.price_change_percentage_24h &&
                      coin.price_change_percentage_24h > 0
                        ? "rgb(0, 235, 0)"
                        : "red",
                  }}>
                  {coin.price_change_percentage_24h &&
                  coin.price_change_percentage_24h > 0
                    ? `+${coin.price_change_percentage_24h.toFixed(2)}%`
                    : `${coin.price_change_percentage_24h?.toFixed(2)}%`}
                </span>
              </div>
              <div className="coin-sparkline-wrapper">
                <span className="coin-list-price">
                  $
                  {coin.current_price?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <div className="coin-sparkline">
                  <Sparklines
                    data={coin.sparkline_in_7d?.price || []}
                    limit={20}>
                    <SparklinesLine color="blue" style={{ fill: "none" }} />
                  </Sparklines>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PricedCoins;
