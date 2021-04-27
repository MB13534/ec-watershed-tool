import React from "react";
import { default as Loading } from "./Loading";
import { CssBaseline } from "@material-ui/core";

export default {
  title: "Components/Loading",
  parameters: {
    component: Loading,
    componentSubtitle: "Component used to render a spinning loading icon.",
  },
};

export const Default = () => (
  <>
    <CssBaseline />
    <Loading />
  </>
);
