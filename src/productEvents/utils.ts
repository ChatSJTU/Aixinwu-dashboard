import { IntlShape } from "react-intl";
import { ProductEventListUrlSortField } from "./urls";
import { StatusType } from "@dashboard/types";

export function canBeSorted(sort: ProductEventListUrlSortField) {
    switch (sort) {
      case ProductEventListUrlSortField.date:
        return true;
      default:
        return false;
    }
  }
  
export const transformProductEventType = (
    status: string,
    intl: IntlShape,
  ): { localized: string; status: StatusType } => {
    switch (status) {
      case "product_created":
        return {
          localized: intl.formatMessage({
            id: "product-event-type-product_created",
            defaultMessage: "商品创建",
          }),
          status: StatusType.SUCCESS,
        };
      case "product_deleted":
        return {
          localized: intl.formatMessage({
            id: "product-event-type-product_deleted",
            defaultMessage: "商品删除",
          }),
          status: StatusType.ERROR,
        };
      case "product_updated":
        return {
          localized: intl.formatMessage({
            id: "product-event-type-product_updated",
            defaultMessage: "商品更新",
          }),
          status: StatusType.INFO,
        };
    }
    return {
      localized: status,
      status: StatusType.INFO,
    };
  };