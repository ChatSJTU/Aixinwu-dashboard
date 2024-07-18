import CardSpacer from "@dashboard/components/CardSpacer";
import CardTitle from "@dashboard/components/CardTitle";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import { Card, CardContent } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { OrderSettingsFormData } from "../OrderSettingsPage/types";

export interface OrderSettingsProps {
  data: OrderSettingsFormData;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const OrderSettings: React.FC<OrderSettingsProps> = ({
  data,
  disabled,
  onChange,
}) => {
  const intl = useIntl();

  return (
    <Card data-test-id="order-settings">
      <CardTitle
        title={intl.formatMessage({
          id: "kn7jjd",
          defaultMessage: "General settings",
          description: "section header",
        })}
      />
      <CardContent>
        <ControlledCheckbox
          name="automaticallyConfirmAllNewOrders"
          label={
            <Box display="flex" flexDirection="column">
              <Text>
                <FormattedMessage
                  id="RLYfMF"
                  defaultMessage="Automatically confirm all orders"
                  description="checkbox label"
                />
              </Text>
              <Text variant="caption" color="default2">
                <FormattedMessage
                  id="wpAXKX"
                  defaultMessage="All orders will be automatically confirmed and all payments will be captured."
                  description="checkbox label description"
                />
              </Text>
            </Box>
          }
          checked={data.automaticallyConfirmAllNewOrders}
          onChange={onChange}
          disabled={disabled}
          data-test-id="automatically-confirm-all-new-orders-checkbox"
        />
        <CardSpacer />

      </CardContent>
    </Card>
  );
};
OrderSettings.displayName = "OrderSettings";
export default OrderSettings;
