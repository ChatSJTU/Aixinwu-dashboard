import { FilterElement } from "@dashboard/components/Filter";
// import {
//   ProductVariantEventFilterKeys,
//   ProductVariantEventListFilterOpts,
// } from "@dashboard/productVariantEvents/components/ProductVariantEventListPage";
import { BalanceEventFilterInput, ProductVariantEventFilterInput, ProductVariantEventsEnum } from "@dashboard/graphql";

import {
  createFilterTabUtils,
  createFilterUtils,
  dedupeFilter,
  getGteLteVariables,
  getKeyValueQueryParam,
  getMinMaxQueryParam,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  ProductVariantEventListUrlFilters,
  ProductVariantEventListUrlFiltersEnum,
  ProductVariantEventListUrlQueryParams,
} from "../../urls";
import { ProductVariantEventFilterKeys, ProductVariantEventListFilterOpts } from "@dashboard/productVariantEvents/components/ProductVariantEventListPage/filters";
import { findInEnum, findValueInEnum, maybe } from "@dashboard/misc";

export const COINLOG_FILTERS_KEY = "productVariantEventFilters";

export function getFilterOpts(
  params: ProductVariantEventListUrlFilters,
): ProductVariantEventListFilterOpts {
  return {
    type: {
      active: !!maybe(() => params.type),
      // value: dedupeFilter(
      //   params.type?.map(t =>
      //     findValueInEnum(t, ProductVariantEventsEnum),
      //   ) || [],
      // ),
      value: maybe(() => findValueInEnum(params.type, ProductVariantEventsEnum)),
    },
    date: {
      active: [params?.dateFrom, params?.dateTo].some(
        field => field !== undefined,
      ),
      value: {
        max: params?.dateTo || "",
        min: params?.dateFrom || "",
      },
    },
  };
}

export function getFilterVariables(
  params: ProductVariantEventListUrlFilters,
): ProductVariantEventFilterInput {
  return {
    // type: params?.type?.map(t =>
    //   findInEnum(t, ProductVariantEventsEnum),
    // ),
    type: params.type && findValueInEnum(params.type, ProductVariantEventsEnum),
    date: getGteLteVariables({
      gte: params.dateFrom,
      lte: params.dateTo,
    }),
  };
}

export function getFilterQueryParam(
  filter: FilterElement<ProductVariantEventFilterKeys>,
): ProductVariantEventListUrlFilters {
  const { name } = filter;
  switch (name) {
    case ProductVariantEventFilterKeys.date:
      return getMinMaxQueryParam(
        filter,
        ProductVariantEventListUrlFiltersEnum.dateFrom,
        ProductVariantEventListUrlFiltersEnum.dateTo,
      );
    case ProductVariantEventFilterKeys.type:
      return getSingleValueQueryParam(
        filter,
        ProductVariantEventListUrlFiltersEnum.type,
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(COINLOG_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } =
  createFilterUtils<ProductVariantEventListUrlQueryParams, ProductVariantEventListUrlFilters>(
    ProductVariantEventListUrlFiltersEnum,
  );
