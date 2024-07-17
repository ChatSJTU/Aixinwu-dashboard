import { DateTime } from "@dashboard/components/Date";
import { Pill } from "@dashboard/components/Pill";
import { Donation } from "@dashboard/donations/types";
import { transformDonationStatus } from "@dashboard/donations/utils";
import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { makeStyles } from "@saleor/macaw-ui";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

export interface TitleProps {
  doantion?: Donation;
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
  { name: "DonationDetailsTitle" },
);

const Title: React.FC<TitleProps> = props => {
  const intl = useIntl();
  const classes = useStyles(props);
  const { doantion } = props;

  if (!doantion) {
    return null;
  }

  const { localized, status } = transformDonationStatus(doantion.status, intl);

  return (
    <div className={classes.container}>
      <Box display="flex" justifyContent="center" alignItems="center">
        {intl.formatMessage(
          { id: "donation-title", defaultMessage: "捐赠 #{orderNumber}" },
          { orderNumber: doantion?.id },
        )}
        <div className={classes.statusContainer}>
          <Pill label={localized} color={status} />
        </div>
      </Box>

      <div>
        {doantion && doantion.createdAt ? (
          <Typography variant="body2">
            <DateTime date={doantion.createdAt} plain />
          </Typography>
        ) : (
          <Skeleton style={{ width: "10em" }} />
        )}
      </div>
    </div>
  );
};

export default Title;
