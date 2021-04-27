import React from "react";
import { default as NotFound } from "./NotFound";
import { CssBaseline } from "@material-ui/core";
import { BrowserRouter } from "react-router-dom";

export default {
  title: "Components/NotFound",
  parameters: {
    component: NotFound,
    componentSubtitle: "Component used to render a 404 Not Found message.",
  },
};

export const Default = () => (
  <>
    <BrowserRouter>
      <CssBaseline />
      <NotFound />
    </BrowserRouter>
  </>
);
