import React from "react";
import AppBar from "./AppBar";
import AutoSuggest from "./AutoSuggest";

function Header(props) {
  return (
    <AppBar>
      <AutoSuggest handlePhotoChange={props.handlePhotoChange} />
    </AppBar>
  );
}

export default Header;
