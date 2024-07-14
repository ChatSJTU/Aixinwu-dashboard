import { WindowTitle } from "@dashboard/components/WindowTitle";
import { CarouselSettingsPage } from "../components/CarouselSettingsPage";
import React from "react";
import { useIntl } from "react-intl";

export const CarouselSettings: React.FC = () => {
  const intl = useIntl();

  return(
    <>
      <WindowTitle title={intl.formatMessage({ id: "e57itX", defaultMessage: "主页轮播图设置",})} />
      <CarouselSettingsPage/>
    </>
  );
}