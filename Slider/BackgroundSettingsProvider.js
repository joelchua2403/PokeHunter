import React, { useState } from "react";
import BackgroundSettingsContext from "./BackgroundSettingsContext";

const BackgroundSettingsProvider = ({ children }) => {
  //HAS TO BE SMALL CASE - ACCORDING TO API
  const [backgroundValue, setBackgroundValue] = useState("");

  return (
    <BackgroundSettingsContext.Provider
      value={{ backgroundValue, setBackgroundValue }}
    >
      {children}
    </BackgroundSettingsContext.Provider>
  );
};

export default BackgroundSettingsProvider;
