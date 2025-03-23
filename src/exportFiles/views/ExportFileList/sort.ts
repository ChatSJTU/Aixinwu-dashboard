// @ts-strict-ignore
import { ExportFileListUrlSortField } from "@dashboard/exportFiles/urls";
import { ExportFileSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(
  sort: ExportFileListUrlSortField,
): ExportFileSortField {
  switch (sort) {
    case ExportFileListUrlSortField.createdAt:
      return ExportFileSortField.CREATED_AT;
    default:
      return undefined;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
