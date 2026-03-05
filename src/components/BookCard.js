import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BookCard({ Books }) {
  const userEmail = localStorage.getItem("user");

  if (!Books || Books.length === 0) return null;

  return (
    <div className="bookcard-grid">
      {Books.map((book, idx) => (
        <SingleBookCard key={idx} book={book} idx={idx} userEmail={userEmail} />
      ))}
    </div>
  );
}

function SingleBookCard({ book, idx, userEmail }) {
  const [hoverStar, setHoverStar] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");

  const bookTitle = book["Book-title"];

  // Load this user's existing rating for this book on mount
  useEffect(() => {
    if (!userEmail || !bookTitle) return;
    fetch(
      `https://smartreadsml-backend.onrender.com/get_rating?email=${encodeURIComponent(userEmail)}&book_title=${encodeURIComponent(bookTitle)}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.rating) setUserRating(data.rating);
      })
      .catch(() => {});
  }, [userEmail, bookTitle]);

  const handleRate = async (star) => {
    if (!userEmail) return;
    setSubmitting(true);
    try {
      const res = await fetch("https://smartreadsml-backend.onrender.com/rate_book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          book_title: bookTitle,
          rating: star,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserRating(star);
        setToast(data.updated ? "✅ Rating updated!" : "✅ Rating saved!");
      } else {
        setToast("⚠️ Could not save rating.");
      }
    } catch {
      setToast("⚠️ Server error.");
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <motion.div
      className="bookcard"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.07 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      {/* Book Cover */}
      <div className="bookcard-cover-wrap">
        <img
          src={book["Image-URL-M"]}
          alt={bookTitle}
          className="bookcard-cover"
        />
        <div className="bookcard-glow" />
      </div>

      {/* Info */}
      <div className="bookcard-info">
        <h4 className="bookcard-title">{bookTitle}</h4>
        <p className="bookcard-author">✍️ {book["Book-author"]}</p>

        {/* Avg rating row */}
        <div className="bookcard-meta">
          <span className="bookcard-rating">
            ⭐{" "}
            {(() => {
              const v = book["avg_rating"] || book["avg_ratings"];
              const n = Number(v);
              return isNaN(n) ? "N/A" : n.toFixed(2);
            })()}
            <span className="bookcard-rating-max">/10</span>
          </span>
          <span className="bookcard-ratings-count">
            {Number(book["num_ratings"]).toLocaleString()} ratings
          </span>
        </div>

        {/* User star rating */}
        <div className="bookcard-user-rating">
          <p className="bookcard-rate-label">
            {userRating > 0
              ? `Your rating: ${userRating}/5`
              : "Rate this book:"}
          </p>
          <div className="star-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`star-btn ${
                  (hoverStar || userRating) >= star ? "star-active" : ""
                } ${submitting ? "star-disabled" : ""}`}
                onMouseEnter={() => setHoverStar(star)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => handleRate(star)}
                disabled={submitting}
                title={`Rate ${star} out of 5`}
              >
                ★
              </button>
            ))}
          </div>

          {/* Toast notification */}
          <AnimatePresence>
            {toast && (
              <motion.p
                className="rating-toast"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {toast}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
