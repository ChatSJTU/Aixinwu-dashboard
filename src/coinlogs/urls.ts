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

export const coinlogSection = "/coinlogs/";

export const coinlogListPath = coinlogSection;
export enum CoinlogListUrlFiltersEnum {
  user = "user",
  createdFrom = "createdFrom",
  createdTo = "createdTo",
}
export type CoinlogListUrlFilters = Filters<CoinlogListUrlFiltersEnum>;
export type CoinlogListUrlDialog = TabActionDialog;
export enum CoinlogListUrlSortField {
  created = "created",
}
export type CoinlogListUrlSort = Sort<CoinlogListUrlSortField>;
export type CoinlogListUrlQueryParams = ActiveTab &
  BulkAction &
  CoinlogListUrlFilters &
  CoinlogListUrlSort &
  Dialog<CoinlogListUrlDialog> &
  Pagination;
export const coinlogListUrl = (params?: CoinlogListUrlQueryParams) =>
  coinlogListPath + "?" + stringifyQs(params);