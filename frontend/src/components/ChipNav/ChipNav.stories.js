import React from "react";
import { withKnobs, text, object } from "@storybook/addon-knobs/react";
import { default as ChipNav } from "./ChipNav";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";

export default {
  title: "Components/ChipNav",
  parameters: {
    component: ChipNav,
    componentSubtitle:
      "Component for rendering a chip navigation bar. The ChipNav component can be useful for rendering a list of related links.",
  },
  decorators: [
    // (storyFn) => <Paper style={{ padding: 20 }}>{storyFn()}</Paper>,
    withKnobs,
  ],
};

const MenuItems = [
  { id: 1, title: "Edit Projects", path: "/item-1" },
  { id: 2, title: "Edit Structures", path: "/item-2" },
  { id: 3, title: "Edit Sources", path: "/item-3" },
];

export const Default = () => (
  <div>
    <CssBaseline />
    <BrowserRouter>
      <ChipNav title="Related Tables" menuItems={MenuItems} />
    </BrowserRouter>
  </div>
);

export const Playground = () => (
  <div>
    <CssBaseline />
    <BrowserRouter>
      <ChipNav
        title={text("title", "Related Tables")}
        menuItems={object("menuItems", MenuItems)}
      />
    </BrowserRouter>
  </div>
);

Playground.story = {
  parameters: {
    docs: {
      storyDescription:
        "You can explore the different props available to the TopNav component by selecting the Playground story and selecting the Canvas tab.",
    },
  },
};
