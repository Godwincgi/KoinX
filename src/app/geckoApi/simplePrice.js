"use client";

import { useEffect, useState } from "react";
import { BsCaretUpFill } from "react-icons/bs";
import { BsCaretDownFill } from "react-icons/bs";
import { FaBitcoin } from "react-icons/fa";
import "./css/simpleprice.scss";

function SimplePrice() {
  const [data, setData] = useState(null);

  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr%2Cusd&include_24hr_change=true";
  const options = { method: "GET", headers: { accept: "application/json" } };

  useEffect(() => {
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="api-price">
      {data ? (
        <div className="top-price">
          <div>
            <p className="bitcoin-text">
              <FaBitcoin className="bitcoin-logo" />
              <strong>Bitcoin</strong>
              <span className="symbol">BTC</span>
            </p>
          </div>
          <div className="usd-section">
            <p className="usd-price">
              <strong>
                $
                {Number(data.bitcoin.usd).toLocaleString(undefined, {
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
                    data.bitcoin.usd_24h_change > 0 ? "rgb(0, 235, 0)" : "red",
                }}>
                {data.bitcoin.usd_24h_change &&
                data.bitcoin.usd_24h_change > 0 ? (
                  <BsCaretUpFill
                    style={{
                      color: "rgb(0, 235, 0)",
                    }}
                  />
                ) : data.bitcoin.usd_24h_change &&
                  data.bitcoin.usd_24h_change < 0 ? (
                  <BsCaretDownFill
                    style={{
                      color: "red",
                    }}
                  />
                ) : null}
                {data.bitcoin.usd_24h_change && data.bitcoin.usd_24h_change > 0
                  ? `+${data.bitcoin.usd_24h_change.toFixed(2)}%`
                  : `${data.bitcoin.usd_24h_change.toFixed(2)}%`}
              </span>
            </p>
            <p className="place-holder">(24h)</p>
          </div>
          <div>
            <p className="inr-price">
              <strong>₹{data.bitcoin.inr.toLocaleString()}</strong>
            </p>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default SimplePrice;
