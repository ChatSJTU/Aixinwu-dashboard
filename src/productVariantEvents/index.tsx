import { sectionNames } from "@dashboard/intl";
import { asSortParams } from "@dashboard/utils/sort";
import { parse as parseQs } from "qs";
import React from "react";
import { useIntl } from "react-intl";
import { Route, RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  productVariantEventListPath,
  ProductVariantEventListUrlQueryParams,
  ProductVariantEventListUrlSortField,
} from "./urls";
import ProductVariantEventListViewComponent from "./views/ProductVariantEventList";

const ProductVariantEventListView: React.FC<RouteComponentProps<{}>> = ({ location }) => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: ProductVariantEventListUrlQueryParams = asSortParams(
    qs,
    ProductVariantEventListUrlSortField,
    ProductVariantEventListUrlSortField.date,
    false
  );

  return <ProductVariantEventListViewComponent params={params} />;
};

export const ProductVariantEventSection: React.FC<{}> = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage({
        id: "product-variant-event-title",
        defaultMessage: "商品品种日志",
      })} />
      <Switch>
        <Route exact path={productVariantEventListPath} component={ProductVariantEventListView} />
      </Switch>
    </>
  );
};
