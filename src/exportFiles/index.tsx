import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  exportFileListPath,
  ExportFileListUrlQueryParams,
  ExportFileListUrlSortField,
} from "./urls";
import ExportFileListViewComponent from "./views/ExportFileList";

const ExportFileListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: ExportFileListUrlQueryParams = asSortParams(
    qs,
    ExportFileListUrlSortField,
    ExportFileListUrlSortField.createdAt,
    false
  );

  return <ExportFileListViewComponent params={params} />;
};

export const ExportFileSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage({
        id: "exportfile-title",
        defaultMessage: "数据导出",
      })} />
      <Switch>
        <Route exact path={exportFileListPath} component={ExportFileListView} />
      </Switch>
    </>
  );
};
