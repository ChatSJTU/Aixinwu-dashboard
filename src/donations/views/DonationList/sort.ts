// @ts-strict-ignore
import { DonationListUrlSortField } from "@dashboard/donations/urls";
import { DonationSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(
  sort: DonationListUrlSortField,
): DonationSortField {
  switch (sort) {
    case DonationListUrlSortField.created:
      return DonationSortField.CREATION_DATE;
    default:
      return undefined;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
