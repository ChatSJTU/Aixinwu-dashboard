// @ts-strict-ignore
import { IFilter } from "@dashboard/components/Filter";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, UserFragment } from "@dashboard/graphql";
import { FilterOpts } from "@dashboard/types";
import {
  createTextField,
} from "@dashboard/utils/filters/fields";
import { IntlShape } from "react-intl";

export enum DonationFilterKeys {
  donator = "donator",
}

export interface DonationListFilterOpts {
  donator: FilterOpts<string>;
}

export function createFilterStructure(
  intl: IntlShape,
  opts: DonationListFilterOpts,
  userPermissions: UserFragment["userPermissions"],
): IFilter<DonationFilterKeys> {
  return [
    {
      ...createTextField(
        DonationFilterKeys.donator,
        intl.formatMessage({
          id: "donation-donator",
          defaultMessage: "捐赠者"
        }),
        opts.donator.value,
      ),
      active: opts.donator.active,
      permissions: [PermissionEnum.ADD_DONATIONS],
    },
  ].filter(filter =>
    hasPermissions(userPermissions ?? [], filter.permissions ?? []),
  );
}
