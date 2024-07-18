// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import { AccountErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    content: {
      paddingTop: theme.spacing(2),
    },
    hr: {
      margin: theme.spacing(3, 0),
    },
    sectionHeader: {
      marginBottom: theme.spacing(),
    },
  }),
  { name: "CustomerInfo" },
);

export interface CustomerInfoProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    balance: number;
    code: string;
    userType: string;
  };
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = props => {
  const { data, disabled, errors, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["firstName", "lastName", "email"], errors);

  return (
    <Card>
      <CardTitle
        title={
          <FormattedMessage
            id="4v5gfh"
            defaultMessage="Account Information"
            description="account information, header"
          />
        }
      />
      <CardContent className={classes.content}>
        <Typography className={classes.sectionHeader}>
          <FormattedMessage {...commonMessages.generalInformations} />
        </Typography>
        <Grid variant="uniform">
          <TextField
            disabled={disabled}
            error={!!formErrors.firstName}
            fullWidth
            helperText={getAccountErrorMessage(formErrors.firstName, intl)}
            name="firstName"
            type="text"
            label={intl.formatMessage(commonMessages.firstName)}
            value={data.firstName}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
          <TextField
            disabled={disabled}
            fullWidth
            name="code"
            type="text"
            label={intl.formatMessage({
              id: "user-code",
              defaultMessage: "学号"
            })}
            value={data.code}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
        </Grid>
        <Hr className={classes.hr} />
        <Typography className={classes.sectionHeader}>
          <FormattedMessage
            id="SMakqb"
            defaultMessage="Contact Information"
            description="customer contact section, header"
          />
        </Typography>
        <TextField
          disabled={disabled}
          error={!!formErrors.email}
          fullWidth
          helperText={getAccountErrorMessage(formErrors.email, intl)}
          name="email"
          type="email"
          label={intl.formatMessage(commonMessages.email)}
          value={data.email}
          onChange={onChange}
          inputProps={{
            spellCheck: false,
          }}
        />
        <Hr className={classes.hr} />
        <Typography className={classes.sectionHeader}>
          <FormattedMessage
            id="axb-number"
            defaultMessage="爱心币"
          />
        </Typography>
        <TextField
          disabled={disabled}
          helperText={""}
          error={false}
          name="balance"
          onChange={onChange}
          label={intl.formatMessage({
            id: "axb-balance",
            defaultMessage: "爱心币余额",
          })}
          value={data.balance}
          type="number"
        />
      </CardContent>
    </Card>
  );
};
CustomerInfo.displayName = "CustomerInfo";
export default CustomerInfo;
