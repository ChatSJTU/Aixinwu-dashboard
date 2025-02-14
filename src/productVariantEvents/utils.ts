import { IntlShape } from "react-intl";
import { ProductVariantEventListUrlSortField } from "./urls";
import { StatusType } from "@dashboard/types";

export function canBeSorted(sort: ProductVariantEventListUrlSortField) {
    switch (sort) {
      case ProductVariantEventListUrlSortField.date:
        return true;
      default:
        return false;
    }
  }
  
export const transformProductVariantEventType = (
    status: string,
    intl: IntlShape,
  ): { localized: string; status: StatusType } => {
    switch (status) {
      case "product_variant_created":
        return {
          localized: intl.formatMessage({
            id: "product-event-type-product_variant_created",
            defaultMessage: "品种创建",
          }),
          status: StatusType.SUCCESS,
        };
      case "product_variant_deleted":
        return {
          localized: intl.formatMessage({
            id: "product-event-type-product_variant_deleted",
            defaultMessage: "品种删除",
          }),
          status: StatusType.ERROR,
        };
      case "product_variant_updated":
        return {
          localized: intl.formatMessage({
            id: "product-event-type-product_variant_updated",
            defaultMessage: "品种更新",
          }),
          status: StatusType.INFO,
        };
      case "product_variant_price_updated":
        return {
          localized: intl.formatMessage({
            id: "product-event-type-product_variant_price_updated",
            defaultMessage: "价格更新",
          }),
          status: StatusType.INFO,
        };
      case "product_variant_stock_changed":
        return {
          localized: intl.formatMessage({
            id: "product-event-type-product_variant_stock_changed",
            defaultMessage: "库存变化",
          }),
          status: StatusType.INFO,
        };
    }
    return {
      localized: status,
      status: StatusType.INFO,
    };
  };