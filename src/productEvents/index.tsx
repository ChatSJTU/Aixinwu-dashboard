import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  productEventListPath,
  ProductEventListUrlQueryParams,
  ProductEventListUrlSortField,
} from "./urls";
import ProductEventListViewComponent from "./views/ProductEventList";

const ProductEventListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: ProductEventListUrlQueryParams = asSortParams(
    qs,
    ProductEventListUrlSortField,
    ProductEventListUrlSortField.date,
    false
  );

  return <ProductEventListViewComponent params={params} />;
};

export const ProductEventSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage({
        id: "productEvent-title",
        defaultMessage: "商品日志",
      })} />
      <Switch>
        <Route exact path={productEventListPath} component={ProductEventListView} />
      </Switch>
    </>
  );
};
