"use client";

import { useEffect, useState } from "react";
import "./css/trending.scss";
import { BsCaretUpFill } from "react-icons/bs";
import { BsCaretDownFill } from "react-icons/bs";

function Trending() {
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

        // Get the top 3 coin IDs
        const topTrendingCoins = trendingData.coins.slice(0, 3).map((coin) => ({
          id: coin.item.id,
          name: coin.item.name,
          symbol: coin.item.symbol,
          thumb: coin.item.thumb,
        }));

        // Extract the IDs for the market data fetch
        const coinIds = topTrendingCoins.map((coin) => coin.id).join(",");

        // Fetch market data for the top 3 trending coins
        const marketResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds}&price_change_percentage=24h`
        );

        // Check if market response is ok
        if (!marketResponse.ok) {
          throw new Error(`HTTP error! Status: ${marketResponse.status}`);
        }

        const marketData = await marketResponse.json();

        // Merge price_change_percentage_24h into the topTrendingCoins array
        const updatedCoins = topTrendingCoins.map((coin) => {
          const marketCoin = marketData.find((mCoin) => mCoin.id === coin.id);
          return {
            ...coin,
            price_change_percentage_24h:
              marketCoin?.price_change_percentage_24h || 0,
          };
        });

        setCoins(updatedCoins); // Set updated coins with price change
      } catch (error) {
        console.error("Error fetching trending coins:", error);

        // Access error message
        const errorMessage = error.message || "An unknown error occurred.";
        setError("Failed to fetch trending coins. " + errorMessage);
      } finally {
        setLoading(false); // Stop loading once fetch completes
      }
    };

    fetchTrendingCoins();
  }, []);

  return (
    <div className="coins">
      <h3>Trending Coins(24h)</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className="list-holder">
          {coins.map((coin) => (
            <li key={coin.id} className="list">
              <div className="coin-section">
                <img src={coin.thumb} alt={coin.name} />
                <strong className="coin-name">{coin.name}</strong>
                <strong className="coin-name">
                  ({coin.symbol.toUpperCase()}){" "}
                </strong>
              </div>
              <div className="coin-right-section">
                <span
                  className="right-span"
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
                  {coin.price_change_percentage_24h &&
                  coin.price_change_percentage_24h > 0 ? (
                    <BsCaretUpFill
                      style={{ marginLeft: "5px", color: "rgb(0, 235, 0)" }}
                    />
                  ) : coin.price_change_percentage_24h &&
                    coin.price_change_percentage_24h < 0 ? (
                    <BsCaretDownFill
                      style={{
                        marginLeft: "5px",
                        color: "red",
                      }}
                    />
                  ) : null}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Trending;
