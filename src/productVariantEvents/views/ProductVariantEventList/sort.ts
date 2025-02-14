// @ts-strict-ignore
import { ProductVariantEventListUrlSortField } from "@dashboard/productVariantEvents/urls";
import { EventSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(
  sort: ProductVariantEventListUrlSortField,
): EventSortField {
  switch (sort) {
    case ProductVariantEventListUrlSortField.date:
      return EventSortField.CREATION_DATE;
    default:
      return undefined;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
