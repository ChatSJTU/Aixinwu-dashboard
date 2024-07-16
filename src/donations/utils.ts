import { DonationListUrlSortField } from "./urls";

export function canBeSorted(sort: DonationListUrlSortField) {
    switch (sort) {
      case DonationListUrlSortField.created:
        return true;
      default:
        return false;
    }
  }
  