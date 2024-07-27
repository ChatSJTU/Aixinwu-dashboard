import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  donationAddPath,
  donationListPath,
  DonationListUrlQueryParams,
  DonationListUrlSortField,
  donationPath,
  DonationUrlQueryParams,
} from "./urls";
import DonationListViewComponent from "./views/DonationList";
import DonationDetailsViewComponent from "./views/DonationDetails";
import DonationCreateView from "./views/DonationCreate";

const DonationListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: DonationListUrlQueryParams = asSortParams(
    qs,
    DonationListUrlSortField,
    DonationListUrlSortField.created,
    false
  );

  return <DonationListViewComponent params={params} />;
};

interface DonationDetailsRouteParams {
  id: string;
}
const DonationDetailsView: React.FC<
  RouteComponentProps<DonationDetailsRouteParams>
> = ({ location, match }) => {
  const qs = parseQs(location.search.substr(1));
  const params: DonationUrlQueryParams = qs;

  return (
    <DonationDetailsViewComponent
      id={decodeURIComponent(match.params.id)}
      params={params}
    />
  );
};

export const DonationSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage({
        id: "donation-title",
        defaultMessage: "捐赠管理",
      })} />
      <Switch>
        <Route exact path={donationListPath} component={DonationListView} />
        <Route exact path={donationAddPath} component={DonationCreateView} />
        <Route path={donationPath(":id")} component={DonationDetailsView} />
      </Switch>
    </>
  );
};
