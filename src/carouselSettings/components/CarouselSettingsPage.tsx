import React from "react"
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { configurationMenuUrl } from "@dashboard/configuration";
import { Box, Divider, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";
import { sectionNames } from "@dashboard/intl";

interface CarouselSettingsPageProps {
  onSubmit: () => void;
}

export const CarouselSettingsPage: React.FC<CarouselSettingsPageProps> = ({ onSubmit }) => {
  const intl = useIntl();

  return (
    <DetailPageLayout gridTemplateColumns={1}>
      <TopNav href={configurationMenuUrl} title={intl.formatMessage(sectionNames.carouselSettings)} />
    </DetailPageLayout>
  );
}