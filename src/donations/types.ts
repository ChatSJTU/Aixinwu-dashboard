import { ListCustomersQuery, ListDonationsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type Donations = RelayToFlat<
  NonNullable<ListDonationsQuery["donations"]>
>;
export type Donation = Donations[number];
