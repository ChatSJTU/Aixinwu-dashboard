// @ts-strict-ignore
import { IFilter } from "@dashboard/components/Filter";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, UserFragment } from "@dashboard/graphql";
import { FilterOpts, MinMax } from "@dashboard/types";
import {
  createDateField,
  createTextField,
} from "@dashboard/utils/filters/fields";
import { IntlShape } from "react-intl";

export enum DonationFilterKeys {
  donator = "donator",
  created = "created",
  number = "number",
  title = "title",
}

export interface DonationListFilterOpts {
  donator: FilterOpts<string>;
  created: FilterOpts<MinMax>;
  number: FilterOpts<string>;
  title: FilterOpts<string>;
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
    {
      ...createTextField(
        DonationFilterKeys.number,
        intl.formatMessage({
          id: "donation-number",
          defaultMessage: "条码"
        }),
        opts.number.value,
      ),
      active: opts.number.active,
      permissions: [PermissionEnum.ADD_DONATIONS],
    },
    {
      ...createTextField(
        DonationFilterKeys.title,
        intl.formatMessage({
          id: "donation-title",
          defaultMessage: "标题"
        }),
        opts.title.value,
      ),
      active: opts.title.active,
      permissions: [PermissionEnum.ADD_DONATIONS],
    },
    {
      ...createDateField(
        DonationFilterKeys.created,
        intl.formatMessage({
          id: "donation-created",
          defaultMessage: "捐赠时间"
        }),
        opts.created.value,
      ),
      active: opts.created.active,
      permissions: [PermissionEnum.ADD_DONATIONS],
    },
  ].filter(filter =>
    hasPermissions(userPermissions ?? [], filter.permissions ?? []),
  );
}
