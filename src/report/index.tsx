import React from "react";
import { useIntl } from "react-intl";
import { Route, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  reportDonationPath,
  reportManagePath,
  reportOrderPath,
  reportUserPath,
} from "./urls";
import ReportIndexView from "./views/ReportIndexView";
import ReportOrderView from "./views/ReportOrderView";
import ReportUserView from "./views/ReportUserView";
import ReportDonationView from "./views/ReportDonationView";

export const ReportSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage({
        id: "report-title",
        defaultMessage: "数据报表",
      })} />
      <Switch>
        <Route exact path={reportManagePath} component={ReportIndexView} />
        <Route exact path={reportOrderPath} component={ReportOrderView} />
        <Route exact path={reportUserPath} component={ReportUserView} />
        <Route exact path={reportDonationPath} component={ReportDonationView} />
      </Switch>
    </>
  );
};
