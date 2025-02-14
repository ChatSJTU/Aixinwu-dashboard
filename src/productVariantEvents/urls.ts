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

export const productVariantEventSection = "/product-variant-events/";

export const productVariantEventListPath = productVariantEventSection;
export enum ProductVariantEventListUrlFiltersEnum {
  dateFrom = "dateFrom",
  dateTo = "dateTo",
  type = "type",
}
export enum ProductVariantEventListUrlFiltersWithMultipleValues {
  // type = "type",
}
export type ProductVariantEventListUrlFilters = Filters<ProductVariantEventListUrlFiltersEnum>
  // & FiltersWithMultipleValues<ProductVariantEventListUrlFiltersWithMultipleValues>
  ;
export type ProductVariantEventListUrlDialog = TabActionDialog;
export enum ProductVariantEventListUrlSortField {
  date = "date",
}
export type ProductVariantEventListUrlSort = Sort<ProductVariantEventListUrlSortField>;
export type ProductVariantEventListUrlQueryParams = ActiveTab &
  BulkAction &
  ProductVariantEventListUrlFilters &
  ProductVariantEventListUrlSort &
  Dialog<ProductVariantEventListUrlDialog> &
  Pagination;
export const productVariantEventListUrl = (params?: ProductVariantEventListUrlQueryParams) =>
  productVariantEventListPath + "?" + stringifyQs(params);