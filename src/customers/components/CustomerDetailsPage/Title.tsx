import { Pill } from "@dashboard/components/Pill";
import { Customer } from "@dashboard/customers/types";
import { transformUserType } from "@dashboard/customers/utils";
import { getUserName } from "@dashboard/misc";
import { makeStyles } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

export interface TitleProps {
  customer?: Customer;
}

const useStyles = makeStyles(
  theme => ({
    container: {
      alignItems: "center",
      display: "flex",
      gap: theme.spacing(2),
    },
    statusContainer: {
      marginLeft: theme.spacing(2),
    },
  }),
  { name: "CustomerDetailsTitle" },
);

const Title: React.FC<TitleProps> = props => {
  const intl = useIntl();
  const classes = useStyles(props);
  const { customer } = props;

  if (!customer) {
    return null;
  }

  const { localized, status } = transformUserType(customer.userType, intl);

  return (
    <div className={classes.container}>
      <Box display="flex" justifyContent="center" alignItems="center">
        {getUserName(customer, true)}
        <div className={classes.statusContainer}>
          <Pill label={localized} color={status} />
        </div>
      </Box>
    </div>
  );
};

export default Title;
