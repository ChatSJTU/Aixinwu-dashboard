// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useUpdateDonationMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, Button, ChevronRightIcon, Text } from "@saleor/macaw-ui-next";
import Hr from "@dashboard/components/Hr";
import { Card, CardContent, Grid, Slider, TextField, Typography } from "@material-ui/core";
import CardTitle from "@dashboard/components/CardTitle";
import { makeStyles } from "@saleor/macaw-ui";
import BarcodePrinter, { BarcodeProps } from "@dashboard/components/BarcodePrinter/BarcodePrinter";

const useStyles = makeStyles(
  theme => ({
    content: {
      paddingTop: theme.spacing(2),
    },
    hr: {
      margin: theme.spacing(3, 0),
    },
    sectionHeader: {
      marginBottom: theme.spacing(4),
    },
    button: {
      margin: theme.spacing(2, 0),
    },
    slider: {
      width: "20%",
      fontSize: "16px",
    },
  }),
  { name: "BarcodeView" },
);

const BarcodeView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const classes = useStyles();

  const [count1, setCount1] = useState<number>(1);
  const [singleCode, setSingleCode] = useState<string>("");
  const [print, setPrint] = useState<boolean>(false);
  const [barcodes, setBarcodes] = useState<BarcodeProps[]>([]);

  const [updateDonation, updateDonationOpts] = useUpdateDonationMutation({
    onCompleted: data => {
      if (data.donationUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const updateData = async (data) => null;
    // extractMutationErrors(
    //   updateDonation({
    //     variables: {
    //       id,
    //       input: {
    //         email: data.email,
    //         firstName: data.firstName,
    //         isActive: data.isActive,
    //         lastName: data.lastName,
    //         note: data.note,
    //         balance: data.balance,
    //       },
    //     },
    //   }),
    // );

  // const handleSubmit = createMetadataUpdateHandler(
  //   donation,
  //   updateData,
  //   variables => updateMetadata({ variables }),
  //   variables => updatePrivateMetadata({ variables }),
  // );
  const handleSubmit = updateData;

  const handleButtonBatchClick = () => {
    setBarcodes([{value:"1111111"}]);
    setPrint(true);
  };

  const handleButtonSingleClick = () => {
    setBarcodes([{value:singleCode}]);
    setPrint(true);
  };

  return (
    <>
      <WindowTitle title="条形码生成" />
      <TopNav
        title={intl.formatMessage({
          id: "barcode-topnav",
          defaultMessage: "条形码生成",
        })}
        withoutBorder
        isAlignToRight={false}
      >
      </TopNav>
      <Hr></Hr>
      <Card>
        <CardTitle
          title={
            <FormattedMessage
              id="barcode-sequential"
              defaultMessage="顺序条码打印"
            />
          }
        />
        <CardContent className={classes.content}>
          <Typography className={classes.sectionHeader}>
            <FormattedMessage id="barcode-count" defaultMessage="生成数量" />
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <Text size="large">{count1}</Text>
            </Grid>
            <Grid item xs>
              <Slider 
                className={classes.slider}
                disabled={false} 
                defaultValue={10} 
                step={1}
                min={1}
                max={50}
                name="count"
                value={count1}
                onChange={(e, v)=>{setCount1(v as number);}}
              />
            </Grid>
          </Grid>
          <Button className={classes.button} onClick={handleButtonBatchClick}>生成并打印</Button>
        </CardContent>
      </Card>
      <Hr></Hr>
      <Card>
        <CardTitle
          title={
            <FormattedMessage
              id="barcode-single"
              defaultMessage="单一条码打印"
            />
          }
        />
        <CardContent className={classes.content}>
          <TextField
            disabled={false}
            error={null}
            name="code"
            type="text"
            label={"条码"}
            value={singleCode}
            onChange={(v)=>{setSingleCode(v.target.value);}}
          />
          <Button className={classes.button} onClick={handleButtonSingleClick}>生成并打印</Button>
        </CardContent>
      </Card>
      <BarcodePrinter barcodes={barcodes} print={print} onPrint={()=>{setPrint(false);}}/>
    </>
  );
};

export default BarcodeView;
