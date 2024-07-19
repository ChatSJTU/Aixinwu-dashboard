// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import Skeleton from "@dashboard/components/Skeleton";
import { AccountErrorFragment, DonationDetailQuery, PermissionEnum } from "@dashboard/graphql";
import { maybe } from "@dashboard/misc";
import { getFormErrors } from "@dashboard/utils/errors";
import getAccountErrorMessage from "@dashboard/utils/errors/account";
import { Card, CardContent, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import moment from "moment-timezone";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DonationDetailsPageFormData } from "../DonationDetailsPage";
import CardSpacer from "@dashboard/components/CardSpacer";
import Hr from "@dashboard/components/Hr";
import Grid from "@dashboard/components/Grid";
import { commonMessages } from "@dashboard/intl";
import { DateTime } from "@dashboard/components/Date";
import FormSpacer from "@dashboard/components/FormSpacer";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Button } from "@saleor/macaw-ui-next";
import { OpenModalFunction } from "@dashboard/utils/handlers/dialogActionHandlers";
import { DonationUrlDialog, DonationUrlQueryParams } from "@dashboard/donations/urls";
import Link from "@dashboard/components/Link";
import { customerUrl } from "@dashboard/customers/urls";
import { Donation } from "@dashboard/donations/types";

const useStyles = makeStyles(
  theme => ({
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
    profileLink: {
      marginTop: theme.spacing(),
    },
    sectionHeader: {
      marginBottom: theme.spacing(),
    },
  }),
  { name: "DonationDetails" },
);

export interface DonationDetailsProps {
  donation: Donation;
  data: DonationDetailsPageFormData;
  disabled: boolean;
  errors: AccountErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
  onOpenModal: OpenModalFunction<DonationUrlDialog, DonationUrlQueryParams>;
  onProfileView: () => void;
}

const DonationDetails: React.FC<DonationDetailsProps> = props => {
  const { donation, data, disabled, errors, onChange, onOpenModal, onProfileView } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(["note"], errors);

  return (
    <>
    {/* <Card>
      <CardContent style={{fontSize: "14px"}} className={classes.content}>
        <Typography className={classes.sectionHeader}>
          <FormattedMessage id= "donation-info-date" defaultMessage="捐赠日期" />
        </Typography>
        <DateTime date={data.created} plain />
      </CardContent>
    </Card> */}
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
        <Grid variant="uniform">
          <TextField
            disabled={disabled}
            error={null}
            fullWidth
            // helperText={getAccountErrorMessage(formErrors.firstName, intl)}
            name="firstName"
            type="text"
            label={intl.formatMessage(commonMessages.firstName)}
            value={data.donator.firstName}
            // onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
          <TextField
            disabled={disabled}
            error={null}
            fullWidth
            // helperText={getAccountErrorMessage(formErrors.lastName, intl)}
            name="code"
            type="text"
            label={intl.formatMessage({
              id: "donation-donator-code",
              defaultMessage: "学号",
            })}
            value={data.donator.code}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
        </Grid>
        <RequirePermissions
          requiredPermissions={[PermissionEnum.MANAGE_USERS]}
        >
          <div className={classes.profileLink}>
            <Link
              underline={false}
              href={customerUrl(data.donator.id)}
              onClick={onProfileView}
            >
              <FormattedMessage
                id="VCzrEZ"
                defaultMessage="View Profile"
                description="link"
              />
            </Link>
          </div>
        </RequirePermissions>
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
      </CardContent>
    </Card>
    <RequirePermissions
      requiredPermissions={[PermissionEnum.MANAGE_DONATIONS]}
    >
      <Card>
        <CardTitle
          title={
            <FormattedMessage
              id="donation-action"
              defaultMessage="操作"
            />
          }
        />
        <CardContent className={classes.content}>
          <div style={{display: "flex"}}>
            <Button onClick={()=>onOpenModal("accept")}>
              确认捐赠
            </Button>
            <Button onClick={()=>onOpenModal("reject")} marginLeft={2} variant="secondary">
              拒绝捐赠
            </Button>
          </div>
        </CardContent>
      </Card>
    </RequirePermissions>
    </>
  );
};
DonationDetails.displayName = "DonationDetails";
export default DonationDetails;
