import React from "react";
import { withKnobs, select } from "@storybook/addon-knobs/react";
import { default as Flex } from "./Flex";
import { Typography, TextField, Box } from "@material-ui/core";

export default {
  title: "Components/Flex",
  // component: Flex,
  parameters: {
    component: Flex,
    componentSubtitle:
      "Component used to render content in a row using flexbox.",
  },
  decorators: [
    // (storyFn) => <Paper style={{ padding: 20 }}>{storyFn()}</Paper>,
    withKnobs,
  ],
};

const justifyContentOptions = {
  start: "start",
  center: "center",
  end: "end",
  "space-evenly": "space-evenly",
  "space-between": "space-between",
  "space-around": "space-around",
};

const alignItemsOptions = {
  start: "start",
  center: "center",
  end: "end",
  stretch: "stretch",
};

export const Default = () => (
  <Box width="100%">
    <Flex justifyContent="start" alignItems="start">
      <Typography variant="h6">Example Page Header</Typography>
      <Box marginLeft={2}>
        <TextField variant="outlined" value="Search" />
      </Box>
    </Flex>
  </Box>
);

export const NestedFlex = () => (
  <Box width="100%">
    <Flex justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Example Page Header</Typography>
      <Flex justifyContent="start" alignItems="center">
        <Box marginLeft={2}>
          <TextField variant="outlined" value="Search" label="Search" />
        </Box>
        <Box marginLeft={2}>
          <TextField type="number" variant="outlined" value="28" label="Age" />
        </Box>
      </Flex>
    </Flex>
  </Box>
);

export const Playground = () => (
  <Box width="100%">
    <Flex
      justifyContent={select("justifyContent", justifyContentOptions, "start")}
      alignItems={select("alignItems", alignItemsOptions, "start")}
    >
      <Typography variant="h6">Example Page Header</Typography>
      <Box marginLeft={2}>
        <TextField variant="outlined" value="Search" />
      </Box>
    </Flex>
  </Box>
);

NestedFlex.story = {
  parameters: {
    docs: {
      storyDescription:
        "You can nest the Flex component within other Flex components for even more control over layout.",
    },
  },
};

Playground.story = {
  parameters: {
    docs: {
      storyDescription:
        "You can explore the different props available to the Flex component by selecting the Playground story and selecting the Canvas tab.",
    },
  },
};
