import React from "react";
import { Box, CircularProgress } from "@mui/material";
// import "../assets/style/profile.css";

const CircleRating = ({ rating, colors }) => {
  return (
    <Box display="flex" alignItems="center" className="rating-box">
      <CircularProgress
        className="rating-circular-progress"
        variant="determinate"
        value={rating * 20}
        size={20}
        thickness={5}
        sx={{ color: colors ? colors : "#1976d2" }}
      />
      {rating}/5 Rating
    </Box>
  );
};

export default CircleRating;
