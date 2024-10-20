import sideBarDefaultLogoDarkMode from "@assets/images/sidebar-deafult-logo-darkMode.png";
import sideBarDefaultLogo from "@assets/images/axw-logo.png";
import { useLegacyThemeHandler } from "@dashboard/components/Sidebar/user/Controls";
import { Avatar, Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

export const MountingPoint = () => {
  const { theme } = useLegacyThemeHandler();
  const logo =
    theme === "defaultLight" ? sideBarDefaultLogo : sideBarDefaultLogoDarkMode;

  return (
    <Box display="flex" gap={3} paddingX={4} paddingY={5} alignItems="center">
      <Avatar.Store src={logo} size="small" backgroundColor="transparent" />
      <Text variant="bodyStrong" size="small">
        爱心屋管理后台
      </Text>
    </Box>
  );
};
