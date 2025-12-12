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
      case "donation_rejected":
        return {
          localized: intl.formatMessage({
            id: "donation-status-donation_rejected",
            defaultMessage: "已拒绝捐赠",
          }),
          status: StatusType.ERROR,
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
      case "invite_new_user":
        return {
          localized: intl.formatMessage({
            id: "donation-status-invite_new_user",
            defaultMessage: "邀请新用户",
          }),
          status: StatusType.SUCCESS,
        };
      case "special_event":
        return {
          localized: intl.formatMessage({
            id: "donation-status-special_event",
            defaultMessage: "特殊活动",
          }),
          status: StatusType.WARNING,
        };
      case "bonus":
        return {
          localized: intl.formatMessage({
            id: "donation-status-bonus",
            defaultMessage: "特殊奖励",
          }),
          status: StatusType.WARNING,
        };
      case "poor_sign":
        return {
          localized: intl.formatMessage({
            id: "donation-status-poor_sign",
            defaultMessage: "困难生奖励",
          }),
          status: StatusType.WARNING,
        };
      case "other":
        return {
          localized: intl.formatMessage({
            id: "donation-status-other",
            defaultMessage: "其他",
          }),
          status: StatusType.INFO,
        };
    }
    return {
      localized: status,
      status: StatusType.ERROR,
    };
  };