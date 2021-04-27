import React from "react";
import { withKnobs, text, object, boolean } from "@storybook/addon-knobs/react";
import { default as FormSnackbar } from "./FormSnackbar";
import { CssBaseline } from "@material-ui/core";

export default {
  title: "Components/FormSnackbar",
  parameters: {
    component: FormSnackbar,
    componentSubtitle:
      "Component used to render a helpful Snackbar to provide the user with important feedback on operations such as a form submit.",
  },
  decorators: [withKnobs],
};

const errorMessage = "There was an error. Please contact a site administrator";
const successMessage = "Success! All good here";

export const Success = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <CssBaseline />
      <FormSnackbar
        open={open}
        error={false}
        handleClose={() => setOpen(false)}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
    </>
  );
};

export const Error = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <CssBaseline />
      <FormSnackbar
        open={open}
        error={true}
        handleClose={() => setOpen(false)}
        errorMessage={errorMessage}
        successMessage={successMessage}
      />
    </>
  );
};

export const Playground = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <>
      <CssBaseline />
      <FormSnackbar
        open={boolean("open", open)}
        error={boolean("error", false)}
        handleClose={() => setOpen(false)}
        errorMessage={text("errorMessage", errorMessage)}
        successMessage={text("successMessage", successMessage)}
      />
    </>
  );
};

Playground.story = {
  parameters: {
    docs: {
      storyDescription:
        "You can explore the different props available to the FormSnackbar component by selecting the Playground story and selecting the Canvas tab.",
    },
  },
};
