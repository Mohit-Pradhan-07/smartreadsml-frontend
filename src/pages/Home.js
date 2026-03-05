import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import MainNavbar from "../components/Navbar";
import BookCard from "../components/BookCard";

import book1 from "../assets/harry.webp";
import book2 from "../assets/harry1.webp";
import book3 from "../assets/123.webp";
import book4 from "../assets/rectangle-3.webp";
import book5 from "../assets/rectangle-4.webp";
import book6 from "../assets/1.webp";
import book7 from "../assets/2.webp";
import book8 from "../assets/3.webp";
import book9 from "../assets/1984.webp";

import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    document.title = "SmartReadsML - Home";
  }, []);

  const [data, setData] = useState({ status: 1, books: [] });
  const [BookName, setBookName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Autocomplete states
  const [allBookNames, setAllBookNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  // Fetch all book names once on mount
  useEffect(() => {
    fetch("https://smartreadsml-backend.onrender.com/book_names")
      .then((res) => res.json())
      .then((data) => setAllBookNames(data.BookNames || []))
      .catch(() => {});
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setBookName(value);
    setError("");

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allBookNames
      .filter((name) => name.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 8);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSuggestionClick = (name) => {
    setBookName(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const images = [
    book1,
    book2,
    book3,
    book4,
    book5,
    book6,
    book7,
    book8,
    book9,
  ];

  const slideLeft = () =>
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  const slideRight = () =>
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  const getVisibleBooks = () =>
    [0, 1, 2].map((offset) => images[(currentIndex + offset) % images.length]);

  const fetchReccomendations = async (e) => {
    e.preventDefault();
    if (!BookName.trim()) return;

    setLoading(true);
    setError("");
    setShowSuggestions(false);
    setData({ status: 1, books: [] });
    setSearched(true);

    try {
      const response = await fetch(
        "https://smartreadsml-backend.onrender.com/reccomendations_api",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: BookName }),
        },
      );

      if (!response.ok) throw new Error("Server error");

      const result = await response.json();

      if (result.status === 0) {
        setError(`No recommendations found for "${BookName}".`);
        setData({ status: 0, books: [] });
      } else {
        setData({ status: 1, books: result.books });
      }
    } catch (err) {
      setError("Could not connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const highlightMatch = (text, query) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong style={{ color: "#f5c518" }}>
          {text.slice(idx, idx + query.length)}
        </strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <>
      <MainNavbar />

      <div className="dark-hero">
        {/* LEFT SIDE */}
        <motion.div
          className="hero-left"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="main-heading">
            Start Your Reading <br />
            <span className="highlight">Adventure</span> Today
          </h1>

          <p className="description">
            SmartReadsML uses ML-powered content-based filtering to recommend
            books tailored to your interests.
          </p>

          {/* Search with autocomplete */}
          <div className="search-wrapper" ref={searchRef}>
            <form className="search-box" onSubmit={fetchReccomendations}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search book here..."
                value={BookName}
                onChange={handleInputChange}
                onFocus={() =>
                  suggestions.length > 0 && setShowSuggestions(true)
                }
                autoComplete="off"
              />
              <button type="submit" disabled={loading}>
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.ul
                  className="suggestions-dropdown"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {suggestions.map((name, idx) => (
                    <li
                      key={idx}
                      className="suggestion-item"
                      onMouseDown={() => handleSuggestionClick(name)}
                    >
                      📖 {highlightMatch(name, BookName)}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Feedback messages */}
          <AnimatePresence>
            {loading && (
              <motion.p
                className="search-feedback loading-text"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ✨ Finding recommendations for "{BookName}"...
              </motion.p>
            )}
            {error && (
              <motion.p
                className="search-feedback error-text"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ⚠️ {error}
              </motion.p>
            )}
            {!loading && searched && data.books.length === 0 && !error && (
              <motion.p
                className="search-feedback no-results-text"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                No results found for "{BookName}". Try another title!
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* RIGHT SIDE - TRENDING NOW */}
        <motion.div
          className="hero-right"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="trending-label">Trending Now</h3>

          <div className="multi-book-slider">
            {getVisibleBooks().map((img, i) => (
              <motion.img
                key={currentIndex + i}
                src={img}
                alt={`book-${i}`}
                className={`slider-image ${i === 1 ? "center-book" : "side-book"}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              />
            ))}
          </div>

          <div className="slider-nav">
            <button className="nav-arrow" onClick={slideLeft}>
              ←
            </button>
            <button className="nav-arrow" onClick={slideRight}>
              →
            </button>
          </div>
        </motion.div>
      </div>

      {/* RESULTS SECTION — dark themed, matches hero */}
      <AnimatePresence>
        {data.books.length > 0 && (
          <motion.div
            className="recommend-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
          >
            {/* Section header */}
            <div className="recommend-header">
              <div className="recommend-header-line" />
              <h2 className="recommend-heading">
                Picks for <span className="highlight">"{BookName}"</span>
              </h2>
              <div className="recommend-header-line" />
            </div>

            <BookCard Books={data.books} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
