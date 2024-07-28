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

export enum CoinlogFilterKeys {
  created = "created",
  user = "user",
}

export interface CoinlogListFilterOpts {
  created: FilterOpts<MinMax>;
  user: FilterOpts<string>;
}

export function createFilterStructure(
  intl: IntlShape,
  opts: CoinlogListFilterOpts,
  userPermissions: UserFragment["userPermissions"],
): IFilter<CoinlogFilterKeys> {
  return [
    {
      ...createDateField(
        CoinlogFilterKeys.created,
        intl.formatMessage({
          id: "coinlog-date",
          defaultMessage: "时间"
        }),
        opts.created.value,
      ),
      active: opts.created.active,
    },
    {
      ...createTextField(
        CoinlogFilterKeys.user,
        intl.formatMessage({
          id: "coinlog-user",
          defaultMessage: "用户"
        }),
        opts.user.value,
      ),
      active: opts.user.active,
      // permissions: [PermissionEnum.ADD_DONATIONS],
    },
  ].filter(filter =>
    hasPermissions(userPermissions ?? [], filter.permissions ?? []),
  );
}
