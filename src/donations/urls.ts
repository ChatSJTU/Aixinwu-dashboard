import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

import {
  ActiveTab,
  BulkAction,
  Dialog,
  Filters,
  Pagination,
  SingleAction,
  Sort,
  TabActionDialog,
} from "../types";

export const donationSection = "/donations/";

export const donationListPath = donationSection;
export enum DonationListUrlFiltersEnum {
  donator = "donator",
  createdFrom = "createdFrom",
  createdTo = "createdTo",
  number = "number",
  title = "title",
}
export type DonationListUrlFilters = Filters<DonationListUrlFiltersEnum>;
export type DonationListUrlDialog = "remove" | TabActionDialog;
export enum DonationListUrlSortField {
  created = "created",
}
export type DonationListUrlSort = Sort<DonationListUrlSortField>;
export type DonationListUrlQueryParams = ActiveTab &
  BulkAction &
  DonationListUrlFilters &
  DonationListUrlSort &
  Dialog<DonationListUrlDialog> &
  Pagination;
export const donationListUrl = (params?: DonationListUrlQueryParams) =>
  donationListPath + "?" + stringifyQs(params);

export const donationPath = (id: string) => urlJoin(donationSection, id);
export type DonationUrlDialog = "accept" | "reject";
export type DonationUrlQueryParams = Dialog<DonationUrlDialog>;
export const donationUrl = (id: string, params?: DonationUrlQueryParams) =>
  donationPath(encodeURIComponent(id)) + "?" + stringifyQs(params);

export const donationAddPath = urlJoin(donationSection, "add");
export const donationAddUrl = donationAddPath;

// export const donationAddressesPath = (id: string) =>
//   urlJoin(donationPath(id), "addresses");
// export type donationAddressesUrlDialog = "add" | "edit" | "remove";
// export type donationAddressesUrlQueryParams =
//   Dialog<donationAddressesUrlDialog> & SingleAction;
// export const donationAddressesUrl = (
//   id: string,
//   params?: donationAddressesUrlQueryParams,
// ) => donationAddressesPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
