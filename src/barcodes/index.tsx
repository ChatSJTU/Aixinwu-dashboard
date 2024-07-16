import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  barcodeManagePath,
} from "./urls";

export const BarcodeSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage({
        id: "barcode-title",
        defaultMessage: "条形码打印",
      })} />
      <Switch>
        <Route exact path={barcodeManagePath} component={BarcodeView} />
      </Switch>
    </>
  );
};
