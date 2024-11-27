// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import Grid from "@dashboard/components/Grid";
import Hr from "@dashboard/components/Hr";
import { AccountErrorFragment, CustomerDetailsQuery, MetadataInput } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CustomerDetailsPageFormData } from "../CustomerDetailsPage";
import { transformUserPosition } from "@dashboard/customers/utils";
import { Pill } from "@dashboard/components/Pill";
import { Box } from "@saleor/macaw-ui-next";
import ControlledCheckbox from "@dashboard/components/ControlledCheckbox";
import { updateAtIndex } from "@dashboard/utils/lists";
import { EventDataField } from "@dashboard/components/Metadata";

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
  customer: CustomerDetailsQuery["user"];
  data: CustomerDetailsPageFormData;
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onChangeMetadata: FormChange;
}

const CustomerInfo: React.FC<CustomerInfoProps> = props => {
  const { customer, data, disabled, errors, onChange, onChangeMetadata } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["firstName", "lastName", "email"], errors);
  
  const onPoorChange = (e: any) => {
    const value = String(e.target.value);
    const key = "privateMetadata";
    const dataToUpdate: MetadataInput[] = data.privateMetadata;

    var dataCopy = (
      dataToUpdate.some(x=>x.key == "is_poor") ? (
        dataToUpdate.map(x=>(x.key == "is_poor" ? {...x, value: value} : x))
      ) : dataToUpdate.concat({ key: "is_poor", value: value })
    );
    onChangeMetadata({
      target: {
        name: key,
        value: dataCopy,
      },
    });
  }

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
              defaultMessage: "学工号"
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
        <Hr className={classes.hr} />
        <Typography className={classes.sectionHeader}>
          <FormattedMessage
            id="axb-position"
            defaultMessage="身份"
          />
        </Typography>
        <Box display="flex" gap={1} alignItems='center' paddingTop={2}>
          <Typography style={{fontSize: '14px'}}>
            固定身份：
          </Typography>
          {
            customer?.positions
              .map(x=>transformUserPosition(x))
              .map(x=>(
                <Pill label={x} color='generic'/>
              ))
          }
        </Box>
        <Box display="flex" gap={1} alignItems='center' paddingTop={2}>
          <Typography style={{fontSize: '14px'}}>
            特殊身份：
          </Typography>
          <ControlledCheckbox
            checked={data?.privateMetadata?.find(x=>x.key=='is_poor')?.value == 'true'}
            label={"贫困生"}
            name="is_poor"
            onChange={onPoorChange}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
CustomerInfo.displayName = "CustomerInfo";
export default CustomerInfo;
