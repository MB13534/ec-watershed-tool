import React from "react";
import { addDecorator } from "@storybook/react";
import { Box, MuiThemeProvider } from "@material-ui/core";
import theme from "../src/theme";

addDecorator((storyFn) => (
  <MuiThemeProvider theme={theme}>
    <Box padding="20px" maxWidth="100%">
      {storyFn()}
    </Box>
  </MuiThemeProvider>
));
