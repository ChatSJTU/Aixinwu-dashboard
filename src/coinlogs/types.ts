import { ListCoinlogsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type Coinlogs = RelayToFlat<
  NonNullable<ListCoinlogsQuery["balanceEvents"]>
>;
export type Coinlog = Coinlogs[number];
