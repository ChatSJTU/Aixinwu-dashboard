import React from "react";
import { Route } from "react-router-dom";
import { CarouselSettings } from "./views";


const carouselSettingsPath = "/carousel-settings";

export const CarouselSettingsSection: React.FC = () => (
  <Route path={carouselSettingsPath} component={CarouselSettings} />
);
export default CarouselSettingsSection;