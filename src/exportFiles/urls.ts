import { stringifyQs } from "@dashboard/utils/urls";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  Sort,
  TabActionDialog,
} from "../types";

export const exportFileSection = "/exportfiles/";

export const exportFileListPath = exportFileSection;
export enum ExportFileListUrlFiltersEnum {
  createdFrom = "createdFrom",
  createdTo = "createdTo",
  status = "status",
}
export type ExportFileListUrlFilters = Filters<ExportFileListUrlFiltersEnum>;
export type ExportFileListUrlDialog = TabActionDialog;
export enum ExportFileListUrlSortField {
  createdAt = "createdAt",
}
export type ExportFileListUrlSort = Sort<ExportFileListUrlSortField>;
export type ExportFileListUrlQueryParams = ActiveTab &
  BulkAction &
  ExportFileListUrlFilters &
  ExportFileListUrlSort &
  Dialog<ExportFileListUrlDialog> &
  Pagination;
export const exportFileListUrl = (params?: ExportFileListUrlQueryParams) =>
  exportFileListPath + "?" + stringifyQs(params);