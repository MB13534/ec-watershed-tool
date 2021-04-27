import React from "react";
import { Box } from "@material-ui/core";

const InfoCard = ({ children, ...other }) => {
  return (
    <Box
      p={2}
      mt={2}
      mb={2}
      bgcolor="rgb(215, 240, 217)"
      borderRadius={4}
      {...other}
    >
      {children}
    </Box>
  );
};

export default InfoCard;
