// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@saleor/macaw-ui";
import { Link } from "react-router-dom";
import { reportDonationUrl, reportOrderUrl, reportUserUrl } from "../urls";
import { LargeCard } from "@dashboard/components/LargeCard/LargeCard";
import OrderLargeIcon from "@dashboard/icons/OrderLarge";
import UserLargeIcon from "@dashboard/icons/UserLarge";
import DonationLargeIcon from "@dashboard/icons/DonationLarge";

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
    link: {
      display: "contents",
      marginBottom: theme.spacing(4),
    },
  }),
  { name: "ReportIndexView" },
);

const ReportIndexView: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const classes = useStyles();

  return (
    <>
      <WindowTitle title="数据报表" />
      <TopNav
        title={intl.formatMessage({
          id: "report-topnav",
          defaultMessage: "数据报表",
        })}
        withoutBorder
        isAlignToRight={false}
      >
      </TopNav>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh"
      }}>
        <Typography>
          <h2>
            请选择统计类型：
          </h2>
        </Typography>
        <Link
          className={classes.link}
          to={reportOrderUrl}
          key={"order"}
        >
          <LargeCard
            key="order"
            icon={<OrderLargeIcon />}
            title="订单数据"
            description="查询订单数量、总售货量与总金额"
          />
        </Link>
        <Link
          className={classes.link}
          to={reportUserUrl}
          key={"user"}
        >
          <LargeCard
            key="user"
            icon={<UserLargeIcon />}
            title="用户数据"
            description="查询新增用户数量"
          />
        </Link>
        <Link
          className={classes.link}
          to={reportDonationUrl}
          key={"donation"}
        >
          <LargeCard
            key="donation"
            icon={<DonationLargeIcon />}
            title="捐赠数据"
            description="查询新增捐赠数量"
          />
        </Link>
      </div>
    </>
  );
};

export default ReportIndexView;
