"use client";

import { useEffect, useState } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "./css/fulltrend.scss";

function FullTrend() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        // Fetch trending coins
        const trendingResponse = await fetch(
          "https://api.coingecko.com/api/v3/search/trending"
        );

        // Check if response is ok
        if (!trendingResponse.ok) {
          throw new Error(`HTTP error! Status: ${trendingResponse.status}`);
        }

        const trendingData = await trendingResponse.json();

        // Get the top 10 coin IDs
        const topTrendingCoins = trendingData.coins
          .slice(0, 10)
          .map((coin) => ({
            id: coin.item.id,
            name: coin.item.name,
            symbol: coin.item.symbol,
            thumb: coin.item.thumb,
          }));

        // Extract the IDs for the market data fetch
        const coinIds = topTrendingCoins.map((coin) => coin.id).join(",");

        // Fetch market data for the top 10 trending coins
        const marketResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&price_change_percentage=24h&sparkline=true`
        );

        // Check if response is ok
        if (!marketResponse.ok) {
          throw new Error(`HTTP error! Status: ${marketResponse.status}`);
        }

        const marketData = await marketResponse.json();

        // Merge price_change_percentage_24h and current_price into the topTrendingCoins array
        const updatedCoins = topTrendingCoins.map((coin) => {
          const marketCoin = marketData.find((mCoin) => mCoin.id === coin.id);
          return {
            ...coin,
            price_change_percentage_24h:
              marketCoin?.price_change_percentage_24h || 0,
            sparkline_in_7d: marketCoin?.sparkline_in_7d || { price: [] },
            current_price: marketCoin?.current_price || 0, // Add current price data
          };
        });

        setCoins(updatedCoins); // Set updated coins with price change
      } catch (error) {
        console.error("Error fetching trending coins:", error);

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

    fetchTrendingCoins();
  }, []);

  return (
    <div className="coin-wrapper">
      <h3 className="section-top">Trending Coins</h3>
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

export default FullTrend;
