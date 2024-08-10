// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useBarcodeBatchCreateMutation,
  useBarcodeSingleCreateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Text } from "@saleor/macaw-ui-next";
import Hr from "@dashboard/components/Hr";
import { Card, CardContent, Grid, Slider, TextField, Typography } from "@material-ui/core";
import CardTitle from "@dashboard/components/CardTitle";
import { makeStyles } from "@saleor/macaw-ui";
import BarcodePrinter, { BarcodeProps } from "@dashboard/components/BarcodePrinter/BarcodePrinter";
import { isNineDigitNumber } from "../utils"

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

  const [count1, setCount1] = useState<number>(10);
  const [singleCode, setSingleCode] = useState<string>("");
  const [print, setPrint] = useState<boolean>(false);
  const [barcodes, setBarcodes] = useState<BarcodeProps[]>([]);

  const [barcodeBatchCreate, barcodeBatchCreateOpts] = useBarcodeBatchCreateMutation({
    onCompleted: data => {
      if (data.barcodeBatchCreate.errors.length === 0) {
        setBarcodes(data.barcodeBatchCreate.barcodes.map(x=>({value:x.number.toString()}) as BarcodeProps));
        setPrint(true);
      }
    },
    onError: err => {
      notify({
        status: "error",
        text: err.message,
      });
    }
  });

  const [barcodeSingleCreate, barcodeSingleCreateOpts] = useBarcodeSingleCreateMutation({
    onCompleted: data => {
      if (data.barcodeDefaultCreate.errors.length === 0) {
        setBarcodes([data.barcodeDefaultCreate.barcode].map(x=>({value:x.number.toString()}) as BarcodeProps));
        setPrint(true);
      }
    },
    onError: err => {
      notify({
        status: "error",
        text: err.message,
      });
    }
  });

  const handleButtonBatchClick = () => {
    barcodeBatchCreate({
      variables:{
        count: count1
      }
    })
  };

  const handleButtonSingleClick = () => {
    if (!isNineDigitNumber(singleCode)) {
      notify({
        status: "warning",
        text: intl.formatMessage({
          id: "barcode-codeformat",
          defaultMessage: "条形码必须是9位数字（前4位年份月份，后5位序号）",
        }),
      })
      return
    }

    barcodeSingleCreate({
      variables:{
        number: Number(singleCode)
      }
    })
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
