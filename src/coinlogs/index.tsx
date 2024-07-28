import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  coinlogListPath,
  CoinlogListUrlQueryParams,
  CoinlogListUrlSortField,
} from "./urls";
import CoinlogListViewComponent from "./views/CoinlogList";

const CoinlogListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: CoinlogListUrlQueryParams = asSortParams(
    qs,
    CoinlogListUrlSortField,
    CoinlogListUrlSortField.created,
    false
  );

  return <CoinlogListViewComponent params={params} />;
};

export const CoinlogSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage({
        id: "coinlog-title",
        defaultMessage: "爱心币日志",
      })} />
      <Switch>
        <Route exact path={coinlogListPath} component={CoinlogListView} />
      </Switch>
    </>
  );
};
