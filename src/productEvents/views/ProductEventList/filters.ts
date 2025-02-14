import { FilterElement } from "@dashboard/components/Filter";
// import {
//   ProductEventFilterKeys,
//   ProductEventListFilterOpts,
// } from "@dashboard/productEvents/components/ProductEventListPage";
import { BalanceEventFilterInput, ProductEventFilterInput, ProductEventsEnum } from "@dashboard/graphql";

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
  ProductEventListUrlFilters,
  ProductEventListUrlFiltersEnum,
  ProductEventListUrlQueryParams,
} from "../../urls";
import { ProductEventFilterKeys, ProductEventListFilterOpts } from "@dashboard/productEvents/components/ProductEventListPage/filters";
import { findInEnum, findValueInEnum, maybe } from "@dashboard/misc";

export const COINLOG_FILTERS_KEY = "productEventFilters";

export function getFilterOpts(
  params: ProductEventListUrlFilters,
): ProductEventListFilterOpts {
  return {
    type: {
      active: !!maybe(() => params.type),
      // value: dedupeFilter(
      //   params.type?.map(t =>
      //     findValueInEnum(t, ProductEventsEnum),
      //   ) || [],
      // ),
      value: maybe(() => findValueInEnum(params.type, ProductEventsEnum)),
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
  params: ProductEventListUrlFilters,
): ProductEventFilterInput {
  return {
    // type: params?.type?.map(t =>
    //   findInEnum(t, ProductEventsEnum),
    // ),
    type: params.type && findValueInEnum(params.type, ProductEventsEnum),
    date: getGteLteVariables({
      gte: params.dateFrom,
      lte: params.dateTo,
    }),
  };
}

export function getFilterQueryParam(
  filter: FilterElement<ProductEventFilterKeys>,
): ProductEventListUrlFilters {
  const { name } = filter;
  switch (name) {
    case ProductEventFilterKeys.date:
      return getMinMaxQueryParam(
        filter,
        ProductEventListUrlFiltersEnum.dateFrom,
        ProductEventListUrlFiltersEnum.dateTo,
      );
    case ProductEventFilterKeys.type:
      return getSingleValueQueryParam(
        filter,
        ProductEventListUrlFiltersEnum.type,
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(COINLOG_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } =
  createFilterUtils<ProductEventListUrlQueryParams, ProductEventListUrlFilters>(
    ProductEventListUrlFiltersEnum,
  );
