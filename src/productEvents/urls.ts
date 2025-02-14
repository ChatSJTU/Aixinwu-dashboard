import { stringifyQs } from "@dashboard/utils/urls";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  FiltersWithMultipleValues,
  Pagination,
  Sort,
  TabActionDialog,
} from "../types";

export const productEventSection = "/product-events/";

export const productEventListPath = productEventSection;
export enum ProductEventListUrlFiltersEnum {
  dateFrom = "dateFrom",
  dateTo = "dateTo",
  type = "type",
}
export enum ProductEventListUrlFiltersWithMultipleValues {
  // type = "type",
}
export type ProductEventListUrlFilters = Filters<ProductEventListUrlFiltersEnum>
  // & FiltersWithMultipleValues<ProductEventListUrlFiltersWithMultipleValues>
  ;
export type ProductEventListUrlDialog = TabActionDialog;
export enum ProductEventListUrlSortField {
  date = "date",
}
export type ProductEventListUrlSort = Sort<ProductEventListUrlSortField>;
export type ProductEventListUrlQueryParams = ActiveTab &
  BulkAction &
  ProductEventListUrlFilters &
  ProductEventListUrlSort &
  Dialog<ProductEventListUrlDialog> &
  Pagination;
export const productEventListUrl = (params?: ProductEventListUrlQueryParams) =>
  productEventListPath + "?" + stringifyQs(params);