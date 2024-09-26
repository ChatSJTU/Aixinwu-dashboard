// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import Skeleton from "@dashboard/components/Skeleton";
import { AccountErrorFragment, CustomerDetailsQuery } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { maybe } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import moment from "moment-timezone";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    cardTitle: {
      height: 72,
    },
    checkbox: {
      marginBottom: theme.spacing(),
    },
    content: {
      paddingTop: theme.spacing(),
    },
    subtitle: {
      marginTop: theme.spacing(),
    },
  }),
  { name: "CustomerDetails" },
);

export interface CustomerDetailsProps {
  customer: CustomerDetailsQuery["user"];
  data: {
    isActive: boolean;
    note: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = props => {
  const { customer, data, disabled, errors, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const { locale } = useLocale();

  const formErrors = getFormErrors(["note"], errors);

  return (
    <Card>
      <CardTitle
        className={classes.cardTitle}
        title={
          <>
            {maybe<React.ReactNode>(() => customer.email, <Skeleton />)}
            {customer && customer.dateJoined ? (
              <Typography
                className={classes.subtitle}
                variant="caption"
                component="div"
              >
                <FormattedMessage
                  id="MjUyhA"
                  defaultMessage="Active member since {date}"
                  description="section subheader"
                  values={{
                    date: moment(customer.dateJoined).locale(locale.replace("zh-Hans", "zh-cn")).format("l"),
                  }}
                />
              </Typography>
            ) : (
              <Skeleton style={{ width: "10rem" }} />
            )}
          </>
        }
      />
      <CardContent className={classes.content}>
        <ControlledCheckbox
          checked={data.isActive}
          className={classes.checkbox}
          disabled={disabled}
          label={intl.formatMessage({
            id: "+NUzaQ",
            defaultMessage: "User account active",
            description: "check to mark this account as active",
          })}
          name="isActive"
          onChange={onChange}
        />
        <TextField
          disabled={disabled}
          error={!!formErrors.note}
          fullWidth
          multiline
          helperText={getAccountErrorMessage(formErrors.note, intl)}
          name="note"
          label={intl.formatMessage({
            id: "uUQ+Al",
            defaultMessage: "Note",
            description: "note about customer",
          })}
          value={data.note}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
CustomerDetails.displayName = "CustomerDetails";
export default CustomerDetails;
