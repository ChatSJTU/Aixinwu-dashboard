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
      active: false,
      value: ""
    }
    // joined: {
    //   active:
    //     [params.joinedFrom, params.joinedTo].some(
    //       field => field !== undefined,
    //     ) ?? false,
    //   value: {
    //     max: params.joinedTo ?? "",
    //     min: params.joinedFrom ?? "",
    //   },
    // },
    // numberOfOrders: {
    //   active:
    //     [params.numberOfOrdersFrom, params.numberOfOrdersTo].some(
    //       field => field !== undefined,
    //     ) ?? false,
    //   value: {
    //     max: params.numberOfOrdersTo ?? "",
    //     min: params.numberOfOrdersFrom ?? "",
    //   },
    // },
  };
}

export function getFilterVariables(
  params: DonationListUrlFilters,
): DonationFilterInput {
  return {
    donator: params.donator
  };
}

export function getFilterQueryParam(
  filter: FilterElement<DonationFilterKeys>,
): DonationListUrlFilters {
  const { name } = filter;
  return getSingleValueQueryParam(filter, DonationListUrlFiltersEnum.donator);
}

export const storageUtils = createFilterTabUtils<string>(DONATION_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } =
  createFilterUtils<DonationListUrlQueryParams, DonationListUrlFilters>(
    DonationListUrlFiltersEnum,
  );
