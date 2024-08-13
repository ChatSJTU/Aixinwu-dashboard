// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import { AccountErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { Card, CardContent, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DonationCreatePageFormData } from "../DonationCreatePage";
import FormSpacer from "@dashboard/components/FormSpacer";
import CardSpacer from "@dashboard/components/CardSpacer";
import Hr from "@dashboard/components/Hr";
import Grid from "@dashboard/components/Grid";

const useStyles = makeStyles(
  theme => ({
    root: {
      display: "grid",
      gridColumnGap: theme.spacing(2),
      gridRowGap: theme.spacing(3),
      gridTemplateColumns: "1fr 1fr",
    },
    cardTitle: {
      height: 36,
    },
    checkbox: {
      marginBottom: theme.spacing(),
    },
    subtitle: {
      marginTop: theme.spacing(),
    },
    content: {
      paddingTop: theme.spacing(4),
    },
    hr: {
      margin: theme.spacing(3, 0),
    },
    sectionHeader: {
      marginBottom: theme.spacing(),
    },
  }),
  { name: "DonationCreateDetails" },
);

export interface DonationCreateDetailsProps {
  data: DonationCreatePageFormData;
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

const DonationCreateDetails: React.FC<DonationCreateDetailsProps> = props => {
  const { data, disabled, errors, onChange } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(
    ["donationFirstName", "donationLastName", "email"],
    errors,
  );

  return (
    // <Card>
    //   <CardTitle
    //     title={intl.formatMessage({
    //       id: "fjPWOA",
    //       defaultMessage: "Donation Overview",
    //       description: "header",
    //     })}
    //   />
    //   <CardContent>
    //     <div className={classes.root}>
    //       <TextField
    //         disabled={disabled}
    //         error={!!formErrors.donationFirstName}
    //         fullWidth
    //         name="donationFirstName"
    //         label={intl.formatMessage(commonMessages.firstName)}
    //         helperText={getAccountErrorMessage(
    //           formErrors.donationFirstName,
    //           intl,
    //         )}
    //         type="text"
    //         value={data.donationFirstName}
    //         onChange={onChange}
    //         inputProps={{
    //           spellCheck: false,
    //         }}
    //       />
    //       <TextField
    //         disabled={disabled}
    //         error={!!formErrors.donationLastName}
    //         fullWidth
    //         name="donationLastName"
    //         label={intl.formatMessage(commonMessages.lastName)}
    //         helperText={getAccountErrorMessage(
    //           formErrors.donationLastName,
    //           intl,
    //         )}
    //         type="text"
    //         value={data.donationLastName}
    //         onChange={onChange}
    //         inputProps={{
    //           spellCheck: false,
    //         }}
    //       />
    //       <TextField
    //         disabled={disabled}
    //         error={!!formErrors.email}
    //         fullWidth
    //         name="email"
    //         label={intl.formatMessage(commonMessages.email)}
    //         helperText={getAccountErrorMessage(formErrors.email, intl)}
    //         type="email"
    //         value={data.email}
    //         onChange={onChange}
    //         inputProps={{
    //           spellCheck: false,
    //         }}
    //       />
    //     </div>
    //   </CardContent>
    // </Card>
    <>
    <Card>
      <CardTitle
        title={
          <FormattedMessage
            id="donation-info-donator"
            defaultMessage="捐赠者信息"
          />
        }
      />
      <CardContent className={classes.content}>
        <TextField
            disabled={disabled}
            error={null}
            fullWidth
            // helperText={getAccountErrorMessage(formErrors.lastName, intl)}
            name="donator"
            type="text"
            label={intl.formatMessage({
              id: "donation-donator-code",
              defaultMessage: "学号",
            })}
            value={data.donator}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
      </CardContent>
    </Card>
    <CardSpacer />
    <Card>
      <CardTitle
        title={
          <FormattedMessage
            id="donation-info-goods"
            defaultMessage="物品信息"
          />
        }
      />
      <CardContent className={classes.content}>
        <TextField
          disabled={disabled}
          error={null}
          fullWidth
          // helperText={getAccountErrorMessage(formErrors.firstName, intl)}
          name="title"
          type="text"
          label={intl.formatMessage({
            id: "donation-title",
            defaultMessage: "标题",
          })}
          value={data.title}
          onChange={onChange}
          inputProps={{
            spellCheck: false,
          }}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={null}
          fullWidth
          multiline
          // helperText={getAccountErrorMessage(formErrors.lastName, intl)}
          name="description"
          type="text"
          label={intl.formatMessage({
            id: "donation-desc",
            defaultMessage: "描述",
          })}
          value={data.description}
          onChange={onChange}
          inputProps={{
            spellCheck: false,
          }}
        />
        <FormSpacer />
        <TextField
          disabled={disabled}
          error={null}
          fullWidth
          multiline
          // helperText={getAccountErrorMessage(formErrors.lastName, intl)}
          name="barcode"
          type="text"
          label={intl.formatMessage({
            id: "donation-barcode",
            defaultMessage: "条码",
          })}
          value={data.barcode}
          onChange={onChange}
          inputProps={{
            spellCheck: false,
          }}
        />
        <Hr className={classes.hr} />
        <Grid variant="uniform">
          <TextField
            disabled={disabled}
            helperText={""}
            error={false}
            fullWidth
            name="price"
            onChange={onChange}
            label={intl.formatMessage({
              id: "donation-estimated",
              defaultMessage: "爱心币估值",
            })}
            value={data.price}
            type="number"
          />
          <TextField
            disabled={disabled}
            helperText={""}
            error={false}
            fullWidth
            name="quantity"
            onChange={onChange}
            label={intl.formatMessage({
              id: "donation-quantity",
              defaultMessage: "数量",
            })}
            value={data.quantity}
            type="number"
          />
        </Grid>
      </CardContent>
    </Card>
    </>
  );
};

DonationCreateDetails.displayName = "DonationCreateDetails";
export default DonationCreateDetails;
