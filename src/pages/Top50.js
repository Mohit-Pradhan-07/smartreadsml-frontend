import React, { useState, useEffect } from "react";
import MainNavbar from "../components/Navbar";
import BookCard from "../components/BookCard";
import axios from "axios";
import { api_address } from "../config/pythonAPI.js";
import { motion } from "framer-motion";
import "./Top50.css";

export default function Top50() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTop50 = async () => {
    try {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: api_address + "/top50_api",
        headers: {},
      };
      const res = await axios.request(config);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch top 50", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "SmartReadsML - Curated 50";
    fetchTop50();
    return () => {};
  }, []);

  return (
    <>
      <MainNavbar />

      <div className="top50-page">
        {/* Starfield background */}
        <div className="top50-stars" />
        <div className="top50-glow" />

        {/* Header */}
        <motion.div
          className="top50-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="top50-subtitle">hand-picked by our algorithm</p>
          <h1 className="top50-title">
            Curated <span className="top50-highlight">50</span> ⭐
          </h1>
          <p className="top50-desc">
            The highest-rated books across all genres, ranked by reader ratings
            and reviews.
          </p>
          <div className="top50-divider" />
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="top50-loading">
            <div className="top50-spinner" />
            <p>Loading top books...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BookCard Books={data} />
          </motion.div>
        )}
      </div>
    </>
  );
}
