// @ts-strict-ignore
import { ProductEventListUrlSortField } from "@dashboard/productEvents/urls";
import { EventSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(
  sort: ProductEventListUrlSortField,
): EventSortField {
  switch (sort) {
    case ProductEventListUrlSortField.date:
      return EventSortField.CREATION_DATE;
    default:
      return undefined;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
