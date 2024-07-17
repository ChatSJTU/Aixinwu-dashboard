import { createSvgIcon } from "@material-ui/core/utils";
import React from "react";

const StatIcon = createSvgIcon(
    <path d="M3 12H7V21H3V12ZM17 8H21V21H17V8ZM10 2H14V21H10V2Z" fill="currentColor" opacity={0.5}></path>
  , "stat"
);

export default StatIcon;
