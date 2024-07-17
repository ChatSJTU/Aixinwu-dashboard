import { dateCell, moneyCell, pillCell, readonlyTextCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { Donations } from "@dashboard/donations/types";
import { DonationListUrlSortField } from "@dashboard/donations/urls";
import { getStatusColor, getUserName } from "@dashboard/misc";
import { RelayToFlat, Sort, StatusType } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape, useIntl } from "react-intl";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui-next";
import { columnsMessages } from "./messages";
import { ListDonationsQuery } from "@dashboard/graphql";
import { transformDonationStatus } from "@dashboard/donations/utils";

export const donationListStaticColumnsAdapter = (
  intl: IntlShape,
  sort: Sort<DonationListUrlSortField>,
  includeOrders: boolean,
): AvailableColumn[] =>
  [
    {
      id: "barcode",
      title: intl.formatMessage({
        id: "donation-column-barcode",
        defaultMessage: "条码",
      }),
      width: 150,
    },
    {
      id: "title",
      title: intl.formatMessage({
        id: "donation-column-title",
        defaultMessage: "标题",
      }),
      width: 300,
    },
    {
      id: "value",
      title: intl.formatMessage({
        id: "donation-column-value",
        defaultMessage: "价值",
      }),
      width: 150,
    },
    {
      id: "donator",
      title: intl.formatMessage({
        id: "donation-column-donator",
        defaultMessage: "捐赠者",
      }),
      width: 150,
    },
    {
      id: "created",
      title: intl.formatMessage({
        id: "donation-column-date",
        defaultMessage: "捐赠时间",
      }),
      width: 250,
    },
    {
      id: "status",
      title: intl.formatMessage({
        id: "donation-column-status",
        defaultMessage: "捐赠状态",
      }),
      width: 150,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const useGetCellContent = (
{ donations, columns }: {
  donations: Donations | undefined;
  columns: AvailableColumn[];
}) => {
  const intl = useIntl();
  const { theme } = useTheme();

  return ([column, row]: Item): GridCell => {
    const rowData = donations?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      case "id":
        return readonlyTextCell(rowData?.id);
      case "created":
        return dateCell(rowData?.createdAt ?? "");
      case "title":
        return readonlyTextCell(rowData?.title ?? "");
      case "barcode":
        return readonlyTextCell(rowData?.barcode ?? "");
      case "donator":
        return readonlyTextCell(rowData?.donator?.account ?? "/");
      case "value":
        return moneyCell(rowData?.price.amount, "AXB");
      case "status":
        return getStatusCellContent(intl, theme, rowData);
      default:
        return readonlyTextCell("");
    }
  };
}

export function getStatusCellContent(
  intl: IntlShape,
  currentTheme: DefaultTheme,
  rowData: RelayToFlat<ListDonationsQuery["donations"]>[number],
) {
  const paymentStatus = transformDonationStatus(rowData.status, intl);

  if (paymentStatus) {
    const color = getStatusColor({
      status: paymentStatus.status,
      currentTheme,
    });
    return pillCell(paymentStatus.localized, color);
  }

  return readonlyTextCell("-");
}