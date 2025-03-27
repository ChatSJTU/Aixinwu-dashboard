import { buttonCell, dateCell, pillCell, readonlyTextCell, textCell, urlCell } from "@dashboard/components/Datagrid/customCells/cells";
import { AvailableColumn } from "@dashboard/components/Datagrid/types";
import { ExportFileListUrlSortField } from "@dashboard/exportFiles/urls";
import { getStatusColor } from "@dashboard/misc";
import { RelayToFlat, Sort } from "@dashboard/types";
import { getColumnSortDirectionIcon } from "@dashboard/utils/columns/getColumnSortDirectionIcon";
import { GridCell, Item } from "@glideapps/glide-data-grid";
import { IntlShape, useIntl } from "react-intl";
import { DefaultTheme, useTheme } from "@saleor/macaw-ui-next";
import { ListExportsQuery } from "@dashboard/graphql";
import { transformExportFileType } from "@dashboard/exportFiles/utils";
import { ExportLogs } from "@dashboard/exportFiles/types";

export const exportFileListStaticColumnsAdapter = (
  emptyColumn: AvailableColumn,
  intl: IntlShape,
  sort: Sort<ExportFileListUrlSortField>,
  includeOrders: boolean,
): AvailableColumn[] =>
  [
    emptyColumn,
    /*
    {
      id: "number",
      title: intl.formatMessage({
        id: "exportfile-column-number",
        defaultMessage: "编号",
      }),
      width: 200,
    },
    */
    {
      id: "createdAt",
      title: intl.formatMessage({
        id: "exportfile-column-created",
        defaultMessage: "创建时间",
      }),
      width: 240,
    },
    {
      id: "status",
      title: intl.formatMessage({
        id: "exportfile-column-status",
        defaultMessage: "状态",
      }),
      width: 150,
    },
    {
      id: "url",
      title: intl.formatMessage({
        id: "exportfile-column-url",
        defaultMessage: "文件",
      }),
      width: 120,
    },
    {
      id: "message",
      title: intl.formatMessage({
        id: "exportfile-column-message",
        defaultMessage: "描述",
      }),
      width: 200,
    },
  ].map(column => ({
    ...column,
    icon: getColumnSortDirectionIcon(sort, column.id),
  }));

export const useGetCellContent = (
{ exportLogs, columns, onClickUrl }: {
  exportLogs: ExportLogs | undefined;
  columns: AvailableColumn[];
  onClickUrl?: () => void;
}) => {
  const intl = useIntl();
  const { theme } = useTheme();

  return ([column, row]: Item): GridCell => {
    const rowData = exportLogs?.[row];
    const columnId = columns[column]?.id;

    if (!columnId || !rowData) {
      return readonlyTextCell("");
    }

    switch (columnId) {
      // case "number":
      //  return readonlyTextCell(rowData?.number.toString());
      case "createdAt":
        return dateCell(rowData?.createdAt ?? "");
      case "message":
        return readonlyTextCell(rowData?.message ?? "");
      case "status":
        return getTypeCellContent(intl, theme, rowData);
      case "url":
        return rowData?.url ? urlCell(rowData?.url, onClickUrl) : readonlyTextCell("")
      default:
        return readonlyTextCell("");
    }
  };
}

export function getTypeCellContent(
  intl: IntlShape,
  currentTheme: DefaultTheme,
  rowData: RelayToFlat<ListExportsQuery["exportFiles"]>[number],
) {
  const exportStatus = transformExportFileType(rowData.status, intl);
  if (exportStatus) {
    const color = getStatusColor({
      status: exportStatus.status,
      currentTheme,
    });
    return pillCell(exportStatus.localized, color);
  }

  return readonlyTextCell("-");
}