// @ts-strict-ignore
import { IFilter } from "@dashboard/components/Filter";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, UserFragment } from "@dashboard/graphql";
import { FilterOpts, MinMax } from "@dashboard/types";
import {
  createDateField,
  createNumberField,
} from "@dashboard/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum DonationFilterKeys {
  donator = "donator",
}

export interface DonationListFilterOpts {
  donator: FilterOpts<string>;
}

const messages = defineMessages({
  joinDate: {
    id: "icz/jb",
    defaultMessage: "Join Date",
    description: "customer",
  },
  numberOfOrders: {
    id: "fhksPD",
    defaultMessage: "Number of Orders",
  },
});

export function createFilterStructure(
  intl: IntlShape,
  opts: DonationListFilterOpts,
  userPermissions: UserFragment["userPermissions"],
): IFilter<DonationFilterKeys> {
  // return [
  //   {
  //     ...createDateField(
  //       DonationFilterKeys.joined,
  //       intl.formatMessage(messages.joinDate),
  //       opts.joined.value,
  //     ),
  //     active: opts.joined.active,
  //   },
  //   {
  //     ...createNumberField(
  //       DonationFilterKeys.numberOfOrders,
  //       intl.formatMessage(messages.numberOfOrders),
  //       opts.numberOfOrders.value,
  //     ),
  //     active: opts.numberOfOrders.active,
  //     permissions: [PermissionEnum.MANAGE_ORDERS],
  //   },
  // ].filter(filter =>
  //   hasPermissions(userPermissions ?? [], filter.permissions ?? []),
  // );
  return [];
}
