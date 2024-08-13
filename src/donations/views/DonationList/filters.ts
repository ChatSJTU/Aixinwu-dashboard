import { FilterElement } from "@dashboard/components/Filter";
// import {
//   DonationFilterKeys,
//   DonationListFilterOpts,
// } from "@dashboard/donations/components/DonationListPage";
import { DonationFilterInput } from "@dashboard/graphql";

import {
  createFilterTabUtils,
  createFilterUtils,
  getGteLteVariables,
  getKeyValueQueryParam,
  getMinMaxQueryParam,
  getSingleValueQueryParam,
} from "../../../utils/filters";
import {
  DonationListUrlFilters,
  DonationListUrlFiltersEnum,
  DonationListUrlQueryParams,
} from "../../urls";
import { DonationFilterKeys, DonationListFilterOpts } from "@dashboard/donations/components/DonationListPage/filters";

export const DONATION_FILTERS_KEY = "donationFilters";

export function getFilterOpts(
  params: DonationListUrlFilters,
): DonationListFilterOpts {
  return {
    donator: {
      active: !!params?.donator,
      value: params?.donator,
    },
    title: {
      active: !!params?.title,
      value: params?.title,
    },
    number: {
      active: !!params?.number,
      value: params?.number,
    },
    created: {
      active:
        [params.createdFrom, params.createdTo].some(
          field => field !== undefined,
        ) ?? false,
      value: {
        max: params.createdTo ?? "",
        min: params.createdFrom ?? "",
      },
    },
  };
}

export function getFilterVariables(
  params: DonationListUrlFilters,
): DonationFilterInput {
  return {
    created: getGteLteVariables({
      gte: params.createdFrom,
      lte: params.createdTo,
    }),
    title: params.title,
    number: params.number,
    donator: params.donator,
  };
}

export function getFilterQueryParam(
  filter: FilterElement<DonationFilterKeys>,
): DonationListUrlFilters {
  const { name } = filter;

  switch (name) {
    case DonationFilterKeys.created:
      return getMinMaxQueryParam(
        filter,
        DonationListUrlFiltersEnum.createdFrom,
        DonationListUrlFiltersEnum.createdTo,
      );

    case DonationFilterKeys.title:
      return getSingleValueQueryParam(filter, DonationListUrlFiltersEnum.title);

    case DonationFilterKeys.number:
      return getSingleValueQueryParam(filter, DonationListUrlFiltersEnum.number);

    case DonationFilterKeys.donator:
      return getSingleValueQueryParam(filter, DonationListUrlFiltersEnum.donator);
  }
  
}

export const storageUtils = createFilterTabUtils<string>(DONATION_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } =
  createFilterUtils<DonationListUrlQueryParams, DonationListUrlFilters>(
    DonationListUrlFiltersEnum,
  );
