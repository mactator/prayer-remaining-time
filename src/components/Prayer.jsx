/* eslint-disable no-unused-vars */
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import PropTypes from "prop-types";

export default function ImgMediaCard({ prayer, time, image }) {
  return (
    <Card sx={{ width: "18vw" }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image={`src/assets/${image}`}
      />
      <CardContent>
        <h2>{prayer}</h2>
        <h1>{time}</h1>
      </CardContent>
    </Card>
  );
}

ImgMediaCard.propTypes = {
  prayer: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  image: PropTypes.string,
};
