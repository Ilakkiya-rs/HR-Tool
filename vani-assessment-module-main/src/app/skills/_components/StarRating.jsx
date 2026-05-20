'use client';

import React, { useState } from 'react';

const StarRating = ({ maxStars = 4, rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  const handleMouseEnter = (starIndex) => {
    setHover(starIndex);
  };

  const handleMouseLeave = () => {
    setHover(0);
  };

  const handleClick = (starIndex) => {
    onRatingChange(starIndex);
  };

  return (
    <div>
      {[...Array(maxStars)].map((_, index) => {
        const starIndex = index + 1;
        return (
          <span
            key={starIndex}
            className={`star ${starIndex <= (hover || rating) ? 'filled' : ''}`}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            style={{
              cursor: 'pointer',
              color: starIndex <= (hover || rating) ? '#FFD700' : '#ADD8E6',
              fontSize: '30px',
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;