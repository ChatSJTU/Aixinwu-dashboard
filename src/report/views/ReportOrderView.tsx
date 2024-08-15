// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  Granularity,
  OrderReportsQuery,
  useOrderReportsLazyQuery,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import React, { ChangeEvent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Input, Text } from "@saleor/macaw-ui-next";
import Hr from "@dashboard/components/Hr";
import { Card, CardContent, Grid, MenuItem, Slider, TextField, Typography } from "@material-ui/core";
import CardTitle from "@dashboard/components/CardTitle";
import { ConfirmButton, ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from 'recharts';
import dayjs from 'dayjs';
import { reportManageUrl } from "../urls";

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
  { name: "ReportOrderView" },
);

type GranularityType = "DAYLY" | "MONTHLY" | "YEARLY";

const ReportOrderView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const classes = useStyles();

  const [buttonState, setButtonState] = useState<ConfirmButtonTransitionState>("default");
  const [granularity, setGranularity] = useState<GranularityType>("DAYLY");
  const [startDate, setStartDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [drawData, setDrawData] = useState<any[]>([]);
  
  const [orderReportsQuery, orderReportsQueryOpts] = useOrderReportsLazyQuery({
    onCompleted: data => {
      setButtonState("default");
      doDraw(data.orderReports);
    },
    onError: err => {
      setButtonState("default");
      notify({
        status: "error",
        text: `${err.message}`,
        title: "错误",
      })
    },
    fetchPolicy: "no-cache"
  });
  
  const onSubmit = () => { 
    setButtonState("loading");
    orderReportsQuery(
      {
        variables: {
          gte: startDate,
          lte: endDate,
          granularity: granularity.replace('DAYLY', 'DAILY') as Granularity
        }
      }
    );
  }

  const doDraw = (data: OrderReportsQuery['orderReports']) => {
    var addType = granularity.replace('LY', '').toLowerCase();
    var s = dayjs(startDate);
    var e = dayjs(endDate);

    var index = 0;
    var alldata = [];
    while (s < e && index < data.length) {
      var cur = {
        name: s.format('YYYY-MM-DD'),
        amountTotal: data[index].amountTotal ?? 0,
        collectionTotal: data[index].collectionTotal ?? 0,
        quantitiesTotal: data[index].quantitiesTotal ?? 0,
      }
      alldata.push(cur);
      index = index + 1;
      s = s.add(1, addType as dayjs.ManipulateType);
    }
    setDrawData(alldata);
    console.log(alldata);
  }

  function handleGranularityChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    setGranularity(event.target.value as GranularityType);
    if (event.target.value == "MONTHLY" && startDate != "") {
      var d = dayjs(startDate).set("date", 1);
      setStartDate(d.format("YYYY-MM-DD"))
    }
    if (event.target.value == "MONTHLY" && endDate != "") {
      var d = dayjs(endDate).set("date", 1);
      setEndDate(d.format("YYYY-MM-DD"))
    }
    if (event.target.value == "YEARLY" && startDate != "") {
      var d = dayjs(startDate).set("date", 1).set("month", 0);
      setStartDate(d.format("YYYY-MM-DD"))
    }
    if (event.target.value == "YEARLY" && endDate != "") {
      var d = dayjs(endDate).set("date", 1).set("month", 0);
      setEndDate(d.format("YYYY-MM-DD"))
    }
  }

  function handleStartDateChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    if (event.target.value != "") {
      var d = dayjs(event.target.value);
      
      console.log(granularity);
      if (granularity == "MONTHLY") {
        d = d.set("date", 1);
      }
      if (granularity == "YEARLY") {
        d = d.set("date", 1).set("month", 0);
      }
      setStartDate(d.format("YYYY-MM-DD"));
      console.log(d.format("YYYY-MM-DD"));
    }
  }

  function handleEndDateChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    if (event.target.value != "") {
      var d = dayjs(event.target.value);
      
      console.log(granularity);
      if (granularity == "MONTHLY") {
        d = d.set("date", 1);
      }
      if (granularity == "YEARLY") {
        d = d.set("date", 1).set("month", 0);
      }
      setEndDate(d.format("YYYY-MM-DD"));
      console.log(d.format("YYYY-MM-DD"));
    }
  }

  return (
    <>
      <WindowTitle title="数据报表" />
      <TopNav
        title={intl.formatMessage({
          id: "report-order",
          defaultMessage: "订单数据",
        })}
        href={reportManageUrl()}
        isAlignToRight={false}
      >
      </TopNav>
      <Card>
        <CardTitle
          title={
            <FormattedMessage
              id="report-order-setting"
              defaultMessage="统计范围"
            />
          }
        />
        <CardContent className={classes.content}>
          {/* <Typography className={classes.sectionHeader}>
            <FormattedMessage {...commonMessages.generalInformations} />
          </Typography> */}
          <Grid 
            container 
            direction="row" 
            alignItems="flex-start" 
            justifyContent="flex-start" 
            spacing={2}
          >
            <Grid item>
              <TextField
                name="granularity"
                select
                style={{width: '100px'}}
                label={intl.formatMessage({
                  id: "report-order-granularity",
                  defaultMessage: "统计粒度"
                })}
                onChange={handleGranularityChange}
                value={granularity}
              >
                <MenuItem key="DAYLY" value="DAYLY">
                  天
                </MenuItem>
                <MenuItem key="MONTHLY" value="MONTHLY">
                  月
                </MenuItem>
                <MenuItem key="YEARLY" value="YEARLY">
                  年
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                label={intl.formatMessage({
                  id: "report-order-startdate",
                  defaultMessage: "开始时间"
                })}
                name="startdate"
                type="date"
                onChange={handleStartDateChange}
                value={startDate}
              />
            </Grid>
            <Grid item>
              <TextField
                label={intl.formatMessage({
                  id: "report-order-enddate",
                  defaultMessage: "结束时间"
                })}
                name="enddate"
                type="date"
                onChange={handleEndDateChange}
                value={endDate}
              />
            </Grid>
            <Grid item>
              <ConfirmButton
                style={{height: "48px"}}
                disabled={false}
                labels={{error: "确定", confirm: "确定"}}
                onClick={onSubmit}
                transitionState={buttonState}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <div style={{width: '100%', height: '60vh'}}>
        <ResponsiveContainer >
          <ComposedChart
            width={500}
            height={400}
            data={drawData}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" style={{fontSize: '12px'}}/>
            <YAxis yAxisId="y1" style={{fontSize: '12px'}}/>
            <YAxis yAxisId="y2" orientation="right" style={{fontSize: '12px'}}/>
            <Tooltip labelStyle={{fontSize: '16px'}} contentStyle={{fontSize: '14px'}}/>
            <Legend />
            <Bar 
              yAxisId="y1" 
              dataKey="amountTotal" 
              name="总销售额"
              unit={" AXB"}
              fontSize="20px"
              fill="#303F9F" />
            <Line 
              yAxisId="y2" 
              dataKey="collectionTotal" 
              name="总订单数"
              strokeWidth={4}
              stroke="#E64A19"/>
            <Line 
              yAxisId="y2" 
              strokeWidth={4}
              dataKey="quantitiesTotal" 
              name="总售货量"
              stroke="#00796B"/>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ReportOrderView;
