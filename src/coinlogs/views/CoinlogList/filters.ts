import { FilterElement } from "@dashboard/components/Filter";
// import {
//   CoinlogFilterKeys,
//   CoinlogListFilterOpts,
// } from "@dashboard/coinlogs/components/CoinlogListPage";
import { BalanceEventFilterInput } from "@dashboard/graphql";

import {
  createFilterTabUtils,
  createFilterUtils,
  getGteLteVariables,
  getKeyValueQueryParam,
  getMinMaxQueryParam,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  CoinlogListUrlFilters,
  CoinlogListUrlFiltersEnum,
  CoinlogListUrlQueryParams,
} from "../../urls";
import { CoinlogFilterKeys, CoinlogListFilterOpts } from "@dashboard/coinlogs/components/CoinlogListPage/filters";

export const COINLOG_FILTERS_KEY = "coinlogFilters";

export function getFilterOpts(
  params: CoinlogListUrlFilters,
): CoinlogListFilterOpts {
  return {
    user: {
      active: !!params?.user,
      value: params?.user,
    },
    created: {
      active: [params?.createdFrom, params?.createdTo].some(
        field => field !== undefined,
      ),
      value: {
        max: params?.createdTo || "",
        min: params?.createdFrom || "",
      },
    },
  };
}

export function getFilterVariables(
  params: CoinlogListUrlFilters,
): BalanceEventFilterInput {
  return {
    user: params.user,
    date: getGteLteVariables({
      gte: params.createdFrom,
      lte: params.createdTo,
    }),
  };
}

export function getFilterQueryParam(
  filter: FilterElement<CoinlogFilterKeys>,
): CoinlogListUrlFilters {
  const { name } = filter;
  switch (name) {
    case CoinlogFilterKeys.created:
      return getMinMaxQueryParam(
        filter,
        CoinlogListUrlFiltersEnum.createdFrom,
        CoinlogListUrlFiltersEnum.createdTo,
      );
    case CoinlogFilterKeys.user:
      return getSingleValueQueryParam(
        filter,
        CoinlogListUrlFiltersEnum.user,
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(COINLOG_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } =
  createFilterUtils<CoinlogListUrlQueryParams, CoinlogListUrlFilters>(
    CoinlogListUrlFiltersEnum,
  );
