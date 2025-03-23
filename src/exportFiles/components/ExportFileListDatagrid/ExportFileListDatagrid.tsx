import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { PermissionEnum } from "@dashboard/graphql";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  useGetCellContent,
  exportFileListStaticColumnsAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { canBeSorted } from "@dashboard/exportFiles/utils";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";
import { ExportFileListUrlSortField } from "@dashboard/exportFiles/urls";
import { ExportLog, ExportLogs } from "@dashboard/exportFiles/types";
import useNotifier from "@dashboard/hooks/useNotifier";
import { assert } from "console";

interface ExportFileListDatagridProps
  extends ListProps,
  SortPage<ExportFileListUrlSortField> {
  exportLogs: ExportLogs | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectExportLogIds: (
    rowsIndex: number[],
    clearSelection: () => void,
  ) => void;
  onRowClick?: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const ExportFileListDatagrid = ({
  exportLogs,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  onRowClick,
  rowAnchor,
  disabled,
  onSelectExportLogIds,
  onSort,
}: ExportFileListDatagridProps) => {
  const intl = useIntl();
  const notify = useNotifier();
  const datagrid = useDatagridChangeState();
  const userPermissions = useUserPermissions();
  const hasManageOrdersPermission =
    userPermissions?.some(perm => perm.code === PermissionEnum.MANAGE_ORDERS) ??
    false;

  const emptyColumn = useEmptyColumn();
  const exportFileListStaticColumns = useMemo(
    () =>
      exportFileListStaticColumnsAdapter(emptyColumn, intl, sort, hasManageOrdersPermission),
    [intl, sort, hasManageOrdersPermission],
  );

  const onColumnChange = useCallback(
    (picked: string[]) => {
      if (onUpdateListSettings) {
        onUpdateListSettings("columns", picked.filter(Boolean));
      }
    },
    [onUpdateListSettings],
  );

  const onClickUrl = function () {
    const link = document.createElement('a');
    link.target = "_blank"
    link.href = this?.data.url;
    link.download = this?.data.url.split('/').pop() || "download.csv";
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    /*
    navigator.clipboard.writeText(this?.copyData).then(() => notify({
      status: "success",
      text: intl.formatMessage({
        id: "url-click-msg",
        defaultMessage: "URL已复制到剪贴板"
      })
    }))
    */
  }

  const {
    handlers,
    visibleColumns,
    staticColumns,
    selectedColumns,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: exportFileListStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: onColumnChange,
  });

  const getCellContent = useGetCellContent({
    columns: visibleColumns,
    exportLogs,
    onClickUrl
  });

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick || !exportLogs) {
        return;
      }
      const rowData: ExportLog = exportLogs[row];
      onRowClick(rowData.id);
    },
    [onRowClick, exportLogs],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor || !exportLogs) {
        return "";
      }
      const rowData: ExportLog = exportLogs[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, exportLogs],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as ExportFileListUrlSortField;

      if (canBeSorted(columnName)) {
        onSort(columnName);
      }
    },
    [visibleColumns, onSort],
  );

  return (
    <DatagridChangeStateContext.Provider value={datagrid}>
      <Datagrid
        readonly
        loading={loading}
        rowMarkers="none"
        columnSelect="single"
        hasRowHover={hasRowHover}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={col => col > 1}
        rows={exportLogs?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectExportLogIds}
        getCellContent={getCellContent}
        getCellError={() => false}
        selectionActions={() => null}
        menuItems={() => []}
        onRowClick={handleRowClick}
        onHeaderClicked={handleHeaderClick}
        rowAnchor={handleRowAnchor}
        recentlyAddedColumn={recentlyAddedColumn}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            selectedColumns={selectedColumns}
            onToggle={handlers.onToggle}
          />
        )}
      />

      <Box paddingX={6}>
        <TablePaginationWithContext
          component="div"
          settings={settings}
          disabled={disabled}
          onUpdateListSettings={onUpdateListSettings}
        />
      </Box>
    </DatagridChangeStateContext.Provider>
  );
};
