import React, { useState } from "react";
import "./Navbar.css";
import categories from "../../data/categories";

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {categories.map((cat, index) => (
          
          <li
            key={index}
            className="nav-item-wrapper"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="nav-item">
              {cat.name}
            </div>

            {/* Dropdown */}
            <div className={`dropdown ${activeIndex === index ? "show" : ""}`}>
              {cat.sub.map((item, i) => (
                <div key={i} className="dropdown-item">
                  {item}
                </div>
              ))}
            </div>

          </li>

        ))}
      </ul>
    </nav>
  );
};

export default Navbar;