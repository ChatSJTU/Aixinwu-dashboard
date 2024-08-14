import { dateCell, moneyCell, pillCell, readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Coinlogs } from "@dashboard/coinlogs/types";
import { CoinlogListUrlSortField } from "@dashboard/coinlogs/urls";
import { getStatusColor } from "@dashboard/misc";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape, useIntl } from "react-intl";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui-next";
import { ListCoinlogsQuery } from "@dashboard/graphql";
import { transformCoinlogType } from "@dashboard/coinlogs/utils";

export const coinlogListStaticColumnsAdapter = (
  emptyColumn: AvailableColumn,
  intl: IntlShape,
  sort: Sort<CoinlogListUrlSortField>,
  includeOrders: boolean,
): AvailableColumn[] =>
  [
    emptyColumn,
    {
      id: "number",
      title: intl.formatMessage({
        id: "coinlog-column-id",
        defaultMessage: "记录编号",
      }),
      width: 150,
    },
    {
      id: "user",
      title: intl.formatMessage({
        id: "coinlog-column-user",
        defaultMessage: "用户",
      }),
      width: 200,
    },
    {
      id: "created",
      title: intl.formatMessage({
        id: "coinlog-column-created",
        defaultMessage: "时间",
      }),
      width: 300,
    },
    {
      id: "delta",
      title: intl.formatMessage({
        id: "coinlog-column-delta",
        defaultMessage: "爱心币增减",
      }),
      width: 150,
    },
    {
      id: "balance",
      title: intl.formatMessage({
        id: "coinlog-column-balance",
        defaultMessage: "爱心币余额",
      }),
      width: 150,
    },
    {
      id: "type",
      title: intl.formatMessage({
        id: "coinlog-column-desc",
        defaultMessage: "描述",
      }),
      width: 150,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const useGetCellContent = (
{ coinlogs, columns }: {
  coinlogs: Coinlogs | undefined;
  columns: AvailableColumn[];
}) => {
  const intl = useIntl();
  const { theme } = useTheme();

  return ([column, row]: Item): GridCell => {
    const rowData = coinlogs?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "number":
        return readonlyTextCell(rowData?.number.toString());
      case "user":
        return readonlyTextCell(rowData?.account);
      case "created":
        return dateCell(rowData?.date ?? "");
      case "balance":
        return moneyCell(rowData?.balance, "AXB");
      case "delta":
        return moneyCell(rowData?.delta, "AXB");
      case "type":
        return getTypeCellContent(intl, theme, rowData);
      default:
        return readonlyTextCell("");
    }
  };
}

export function getTypeCellContent(
  intl: IntlShape,
  currentTheme: DefaultTheme,
  rowData: RelayToFlat<ListCoinlogsQuery["balanceEvents"]>[number],
) {
  const paymentStatus = transformCoinlogType(rowData.type, intl);

  if (paymentStatus) {
    const color = getStatusColor({
      status: paymentStatus.status,
      currentTheme,
    });
    return pillCell(paymentStatus.localized, color);
  }

  return readonlyTextCell("-");
}