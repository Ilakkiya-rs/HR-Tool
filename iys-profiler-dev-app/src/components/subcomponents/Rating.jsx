'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = () => {
  // eslint-disable-next-line no-unused-vars
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);

  return (
    <>
      {[...Array(4)].map((star, index) => {
        const ratingValue = index + 1;

        return (
          <div key={index}>
            <FaStar
              className="star"
              color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(ratingValue)}
            />
          </div>
        );
      })}
    </>
  );
};

export default Rating;
