import React from "react";
import { Box } from "grommet";

function AppBar(props) {
  return (
    <Box
      tag="header"
      direction="row"
      align="center"
      justify="between"
      background="light-1"
      pad={{ vertical: "small", horizontal: "medium" }}
      elevation="medium"
      {...props}
    />
  );
}

export default AppBar;
