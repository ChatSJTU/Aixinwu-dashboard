// @ts-strict-ignore
import { IFilter } from "@dashboard/components/Filter";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, ProductEventsEnum, UserFragment } from "@dashboard/graphql";
import { FilterOpts, MinMax } from "@dashboard/types";
import {
  createDateField,
  createOptionsField,
  createTextField,
} from "@dashboard/utils/filters/fields";
import { IntlShape } from "react-intl";

export enum ProductEventFilterKeys {
  date = "date",
  type = "type",
}

export interface ProductEventListFilterOpts {
  date: FilterOpts<MinMax>;
  // type: FilterOpts<ProductEventsEnum[]>;
  type: FilterOpts<ProductEventsEnum>;
}

export function createFilterStructure(
  intl: IntlShape,
  opts: ProductEventListFilterOpts,
  userPermissions: UserFragment["userPermissions"],
): IFilter<ProductEventFilterKeys> {
  return [
    {
      ...createDateField(
        ProductEventFilterKeys.date,
        intl.formatMessage({
          id: "product-event-date",
          defaultMessage: "时间"
        }),
        opts.date.value,
      ),
      active: opts.date.active,
    },
    {
      ...createOptionsField(
        ProductEventFilterKeys.type,
        intl.formatMessage({
          id: "product-event-type",
          defaultMessage: "类型"
        }),
        [opts.type.value],
        false,
        [
          {
            label: intl.formatMessage({
              id: "product-event-type-PRODUCT_CREATED",
              defaultMessage: "商品创建"
            }),
            value: ProductEventsEnum.PRODUCT_CREATED,
          },
          {
            label: intl.formatMessage({
              id: "product-event-type-PRODUCT_DELETED",
              defaultMessage: "商品删除"
            }),
            value: ProductEventsEnum.PRODUCT_DELETED,
          },
          {
            label: intl.formatMessage({
              id: "product-event-type-PRODUCT_UPDATED",
              defaultMessage: "商品更新"
            }),
            value: ProductEventsEnum.PRODUCT_UPDATED,
          },
        ],
      ),
      active: opts.type.active,
    },
  ].filter(filter =>
    hasPermissions(userPermissions ?? [], filter.permissions ?? []),
  );
}
