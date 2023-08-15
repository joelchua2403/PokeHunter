import React, { useState } from "react";
import SliderContext from "./SliderContext";

const SliderProvider = ({ children }) => {
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <SliderContext.Provider value={{ sliderValue, setSliderValue }}>
      {children}
    </SliderContext.Provider>
  );
};

export default SliderProvider;
