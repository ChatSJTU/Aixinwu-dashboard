import { IntlShape } from "react-intl";
import { CoinlogListUrlSortField } from "./urls";
import { StatusType } from "@dashboard/types";

export function canBeSorted(sort: CoinlogListUrlSortField) {
    switch (sort) {
      case CoinlogListUrlSortField.created:
        return true;
      default:
        return false;
    }
  }
  
export const transformCoinlogType = (
    status: string,
    intl: IntlShape,
  ): { localized: string; status: StatusType } => {
    switch (status) {
      case "donation_granted":
        return {
          localized: intl.formatMessage({
            id: "donation-status-donation_granted",
            defaultMessage: "已获批捐赠",
          }),
          status: StatusType.SUCCESS,
        };
      case "manually_updated":
        return {
          localized: intl.formatMessage({
            id: "donation-status-manually_updated",
            defaultMessage: "手动更新",
          }),
          status: StatusType.SUCCESS,
        };
      case "first_login":
        return {
          localized: intl.formatMessage({
            id: "donation-status-first_login",
            defaultMessage: "首次登录",
          }),
          status: StatusType.SUCCESS,
        };
      case "consecutive_login":
        return {
          localized: intl.formatMessage({
            id: "donation-status-consecutive_login",
            defaultMessage: "连续登录",
          }),
          status: StatusType.SUCCESS,
        };
      case "consumed":
        return {
          localized: intl.formatMessage({
            id: "donation-status-consumed",
            defaultMessage: "已消费",
          }),
          status: StatusType.ERROR,
        };
      case "refunded":
        return {
          localized: intl.formatMessage({
            id: "donation-status-refunded",
            defaultMessage: "已退款",
          }),
          status: StatusType.WARNING,
        };
    }
    return {
      localized: status,
      status: StatusType.ERROR,
    };
  };