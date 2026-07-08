import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import categories from "../../data/categories";

const Navbar = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item nav-all" onClick={() => navigate("/")}>All Books</li>
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
                <div 
                  key={i} 
                  className="dropdown-item"
                  onClick={() => navigate(`/?category=${item}`)
                  }
                >
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
