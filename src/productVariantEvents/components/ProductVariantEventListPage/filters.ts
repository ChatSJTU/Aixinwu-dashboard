// @ts-strict-ignore
import { IFilter } from "@dashboard/components/Filter";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, ProductVariantEventsEnum, UserFragment } from "@dashboard/graphql";
import { FilterOpts, MinMax } from "@dashboard/types";
import {
  createDateField,
  createOptionsField,
  createTextField,
} from "@dashboard/utils/filters/fields";
import { IntlShape } from "react-intl";

export enum ProductVariantEventFilterKeys {
  date = "date",
  type = "type",
}

export interface ProductVariantEventListFilterOpts {
  date: FilterOpts<MinMax>;
  // type: FilterOpts<ProductVariantEventsEnum[]>;
  type: FilterOpts<ProductVariantEventsEnum>;
}

export function createFilterStructure(
  intl: IntlShape,
  opts: ProductVariantEventListFilterOpts,
  userPermissions: UserFragment["userPermissions"],
): IFilter<ProductVariantEventFilterKeys> {
  return [
    {
      ...createDateField(
        ProductVariantEventFilterKeys.date,
        intl.formatMessage({
          id: "product-variant-event-date",
          defaultMessage: "时间"
        }),
        opts.date.value,
      ),
      active: opts.date.active,
    },
    {
      ...createOptionsField(
        ProductVariantEventFilterKeys.type,
        intl.formatMessage({
          id: "product-variant-event-type",
          defaultMessage: "类型"
        }),
        [opts.type.value],
        false,
        [
          {
            label: intl.formatMessage({
              id: "product-variant-event-type-PRODUCT_VARIANT_CREATED",
              defaultMessage: "品种创建"
            }),
            value: ProductVariantEventsEnum.PRODUCT_VARIANT_CREATED,
          },
          {
            label: intl.formatMessage({
              id: "product-variant-event-type-PRODUCT_VARIANT_DELETED",
              defaultMessage: "品种删除"
            }),
            value: ProductVariantEventsEnum.PRODUCT_VARIANT_DELETED,
          },
          {
            label: intl.formatMessage({
              id: "product-variant-event-type-PRODUCT_VARIANT_UPDATED",
              defaultMessage: "品种更新"
            }),
            value: ProductVariantEventsEnum.PRODUCT_VARIANT_UPDATED,
          },
          {
            label: intl.formatMessage({
              id: "product-variant-event-type-PRODUCT_VARIANT_PRICE_UPDATED",
              defaultMessage: "价格更新"
            }),
            value: ProductVariantEventsEnum.PRODUCT_VARIANT_PRICE_UPDATED,
          },
          {
            label: intl.formatMessage({
              id: "product-variant-event-type-PRODUCT_VARIANT_STOCK_CHANGED",
              defaultMessage: "库存变化"
            }),
            value: ProductVariantEventsEnum.PRODUCT_VARIANT_STOCK_CHANGED,
          },
        ],
      ),
      active: opts.type.active,
    },
  ].filter(filter =>
    hasPermissions(userPermissions ?? [], filter.permissions ?? []),
  );
}
