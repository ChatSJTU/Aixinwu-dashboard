// @ts-strict-ignore
import CardTitle from "@dashboard/components/CardTitle";
import { AccountErrorFragment, PermissionEnum, useListCertificatesQuery } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { Card, CardContent, TextField } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import React, { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { DonationDetailsPageFormData } from "../DonationDetailsPage";
import CardSpacer from "@dashboard/components/CardSpacer";
import Hr from "@dashboard/components/Hr";
import Grid from "@dashboard/components/Grid";
import { commonMessages } from "@dashboard/intl";
import FormSpacer from "@dashboard/components/FormSpacer";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { Button } from "@saleor/macaw-ui-next";
import { OpenModalFunction } from "@dashboard/utils/handlers/dialogActionHandlers";
import { DonationUrlDialog, DonationUrlQueryParams } from "@dashboard/donations/urls";
import Link from "@dashboard/components/Link";
import { customerUrl } from "@dashboard/customers/urls";
import { Donation } from "@dashboard/donations/types";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { Combobox } from "@dashboard/components/Combobox";

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
    combobox: {
      paddingTop: theme.spacing(4),
      "& > div > label > div": {
        width: "100% !important",
      },
      "& > div > label > div > div > input": {
        flex: "1",
      },
      "& > div > label > div > div > div": {
        marginTop: "-8px",
      },
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

  const { data: certs, loading} = useListCertificatesQuery({
    variables: {
      first: 100,
    },
  });

  const selectedCert = useMemo(()=>{
    if (!certs)
      return undefined;
    var cert = mapEdgesToItems(certs.certificates).find(x => x.id == data.certificate);
    if (!cert)
      return undefined;
    return {
      label: cert.name,
      value: cert.id
    }
  }, [certs, data]);
  
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
              defaultMessage: "学工号",
            })}
            value={data.donator.code}
            onChange={onChange}
            inputProps={{
              spellCheck: false,
            }}
          />
        </Grid>
        <RequirePermissions
          oneOfPermissions={[PermissionEnum.MANAGE_USERS, PermissionEnum.READ_USERS]}
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

    <RequirePermissions
      requiredPermissions={[PermissionEnum.MANAGE_DONATIONS]}
    >
      <Card>
        <CardTitle
          title={
            <FormattedMessage
              id="donation-info-certificate"
              defaultMessage="捐赠证书"
            />
          }
        />
        <CardContent className={classes.combobox}>
          <Combobox
            name="certificate"
            label={intl.formatMessage({
              id: "donation-certificate",
              defaultMessage: "证书模板",
            })}
            options={certs ? mapNodeToChoice(
              mapEdgesToItems(certs.certificates), null
            ) : []}
            value={selectedCert}
            onChange={onChange}
            fetchOptions={() => {}}
            endAdornment={() => 
              <Link onClick={() => {}}>预览证书</Link>
            }
          />
        </CardContent>
      </Card>
    </RequirePermissions>
    
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
