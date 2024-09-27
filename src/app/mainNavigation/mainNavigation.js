"use client";

import { useState } from "react";
import Image from "next/image";
import "./css/mainnavigation.scss";

function MainNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [addMargin, setAddMargin] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setAddMargin(!addMargin);
  };

  return (
    <>
      <header className={`header ${addMargin ? "margin-added" : ""}`}>
        <nav className="main-nav">
          <div className="left-nav">
            <Image
              src="/images/KoinX_logo.png"
              alt="KoinX Logo"
              width={80}
              height={20}
            />
          </div>
          <div className="right-nav">
            {/* Hamburger Icon */}
            <div className="menu-icon" onClick={toggleMenu}>
              <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
              <div className={`line ${isMenuOpen ? "open" : ""}`}></div>
            </div>
            <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
              <li>
                <p>Crypto Taxes</p>
              </li>
              <li>
                <p>Free Tools</p>
              </li>
              <li>
                <p>Resource Center</p>
              </li>
              <li>
                <button>Get Started</button>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}

export default MainNavigation;
