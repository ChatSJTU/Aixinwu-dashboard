import { dateCell, moneyCell, pillCell, readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { ProductVariantEvents } from "@dashboard/productVariantEvents/types";
import { ProductVariantEventListUrlSortField } from "@dashboard/productVariantEvents/urls";
import { getStatusColor } from "@dashboard/misc";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape, useIntl } from "react-intl";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui-next";
import { ListProductVariantEventsQuery } from "@dashboard/graphql";
import { transformProductVariantEventType } from "@dashboard/productVariantEvents/utils";

export const productVariantEventListStaticColumnsAdapter = (
  emptyColumn: AvailableColumn,
  intl: IntlShape,
  sort: Sort<ProductVariantEventListUrlSortField>,
): AvailableColumn[] =>
  [
    emptyColumn,
    {
      id: "number",
      title: intl.formatMessage({
        id: "productVariantEvent-column-id",
        defaultMessage: "记录编号",
      }),
      width: 100,
    },
    {
      id: "user",
      title: intl.formatMessage({
        id: "productVariantEvent-column-user",
        defaultMessage: "用户",
      }),
      width: 100,
    },
    {
      id: "date",
      title: intl.formatMessage({
        id: "productVariantEvent-column-date",
        defaultMessage: "时间",
      }),
      width: 240,
    },
    {
      id: "type",
      title: intl.formatMessage({
        id: "productVariantEvent-column-type",
        defaultMessage: "操作类型",
      }),
      width: 120,
    },
    {
      id: "product-name",
      title: intl.formatMessage({
        id: "productVariantEvent-column-product-name",
        defaultMessage: "品种名称",
      }),
      width: 200,
    },
    {
      id: "message",
      title: intl.formatMessage({
        id: "productVariantEvent-column-message",
        defaultMessage: "描述",
      }),
      width: 500,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const useGetCellContent = (
{ productVariantEvents, columns }: {
  productVariantEvents: ProductVariantEvents | undefined;
  columns: AvailableColumn[];
}) => {
  const intl = useIntl();
  const { theme } = useTheme();

  return ([column, row]: Item): GridCell => {
    const rowData = productVariantEvents?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "number":
        return readonlyTextCell(rowData?.id.toString());
      case "user":
        return readonlyTextCell(rowData?.user.firstName);
      case "date":
        return dateCell(rowData?.date ?? "");
      case "type":
        return getTypeCellContent(intl, theme, rowData);
      case "variant-name":
        return readonlyTextCell(rowData?.productVariantName ?? "");
      case "message":
        return readonlyTextCell(rowData?.message ?? "");
      default:
        return readonlyTextCell("");
    }
  };
}

export function getTypeCellContent(
  intl: IntlShape,
  currentTheme: DefaultTheme,
  rowData: RelayToFlat<ListProductVariantEventsQuery["productVariantEvents"]>[number],
) {
  const paymentStatus = transformProductVariantEventType(rowData.type, intl);

  if (paymentStatus) {
    const color = getStatusColor({
      status: paymentStatus.status,
      currentTheme,
    });
    return pillCell(paymentStatus.localized, color);
  }

  return readonlyTextCell("-");
}