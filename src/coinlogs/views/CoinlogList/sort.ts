// @ts-strict-ignore
import { CoinlogListUrlSortField } from "@dashboard/coinlogs/urls";
import { EventSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(
  sort: CoinlogListUrlSortField,
): EventSortField {
  switch (sort) {
    case CoinlogListUrlSortField.created:
      return EventSortField.CREATION_DATE;
    default:
      return undefined;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
