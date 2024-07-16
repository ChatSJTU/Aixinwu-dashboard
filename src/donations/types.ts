import { ListCustomersQuery, ListDonationsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export interface AddressTypeInput {
  city: string;
  cityArea?: string;
  companyName?: string;
  country: string;
  countryArea?: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  postalCode: string;
  streetAddress1: string;
  streetAddress2?: string;
}

export interface AddressType {
  id: string;
  city: string;
  cityArea?: string;
  companyName?: string;
  country: {
    code: string;
    country: string;
  };
  countryArea?: string;
  firstName: string;
  lastName: string;
  phone: string;
  postalCode: string;
  streetAddress1: string;
  streetAddress2?: string;
}

export type Donations = RelayToFlat<
  NonNullable<ListDonationsQuery["donations"]>
>;
export type Donation = Donations[number];
