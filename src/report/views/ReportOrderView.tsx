// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
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

type GranularityType = "DAILY" | "MONTHLY" | "YEARLY";

const ReportOrderView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const classes = useStyles();

  const [orderReportsQuery, orderReportsQueryOpts] = useOrderReportsLazyQuery();
  const [buttonState, setButtonState] = useState<ConfirmButtonTransitionState>("default");
  const [granularity, setGranularity] = useState<GranularityType>("DAILY");
  const [startDate, setStartDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState<string>(dayjs().format("YYYY-MM-DD"));
  
  const onSubmit = () => { 

  }

  const data = [
    {
      name: 'Page A',
      uv: 590,
      pv: 800,
      amt: 1400,
      cnt: 490,
    },
    {
      name: 'Page B',
      uv: 868,
      pv: 967,
      amt: 1506,
      cnt: 590,
    },
    {
      name: 'Page C',
      uv: 1397,
      pv: 1098,
      amt: 989,
      cnt: 350,
    },
    {
      name: 'Page D',
      uv: 1480,
      pv: 1200,
      amt: 1228,
      cnt: 480,
    },
    {
      name: 'Page E',
      uv: 1520,
      pv: 1108,
      amt: 1100,
      cnt: 460,
    },
    {
      name: 'Page F',
      uv: 1400,
      pv: 680,
      amt: 1700,
      cnt: 380,
    },
  ];

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
                <MenuItem key="DAILY" value="DAILY">
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
            data={data}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" scale="band" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
            <Bar dataKey="pv" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="uv" stroke="#ff7300" />
            <Scatter dataKey="cnt" fill="red" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default ReportOrderView;
