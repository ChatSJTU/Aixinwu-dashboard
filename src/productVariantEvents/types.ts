import { ListProductVariantEventsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type ProductVariantEvents = RelayToFlat<
  NonNullable<ListProductVariantEventsQuery["productVariantEvents"]>
>;
export type ProductVariantEvent = ProductVariantEvents[number];
