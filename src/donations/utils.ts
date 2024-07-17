import { IntlShape } from "react-intl";
import { DonationListUrlSortField } from "./urls";
import { StatusType } from "@dashboard/types";

export function canBeSorted(sort: DonationListUrlSortField) {
    switch (sort) {
      case DonationListUrlSortField.created:
        return true;
      default:
        return false;
    }
  }
  
export const transformDonationStatus = (
    status: string,
    intl: IntlShape,
  ): { localized: string; status: StatusType } => {
    switch (status) {
      case "unreviewed":
        return {
          localized: intl.formatMessage({
            id: "donation-status-unreviewed",
            defaultMessage: "未确认",
          }),
          status: StatusType.WARNING,
        };
      case "completed":
        return {
          localized: intl.formatMessage({
            id: "donation-status-completed",
            defaultMessage: "已完成",
          }),
          status: StatusType.SUCCESS,
        };
      case "rejected":
        return {
          localized: intl.formatMessage({
            id: "donation-status-rejected",
            defaultMessage: "已拒绝",
          }),
          status: StatusType.ERROR,
        };
    }
    return {
      localized: status,
      status: StatusType.ERROR,
    };
  };