import { ListProductEventsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type ProductEvents = RelayToFlat<
  NonNullable<ListProductEventsQuery["productEvents"]>
>;
export type ProductEvent = ProductEvents[number];
