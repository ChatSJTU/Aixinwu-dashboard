import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { Coinlog, Coinlogs } from "@dashboard/coinlogs/types";
import { CoinlogListUrlSortField } from "@dashboard/coinlogs/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  useGetCellContent,
  coinlogListStaticColumnsAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { canBeSorted } from "@dashboard/coinlogs/utils";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";

interface CoinlogListDatagridProps
  extends ListProps,
    SortPage<CoinlogListUrlSortField> {
  coinlogs: Coinlogs | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectCoinlogIds: (
    rowsIndex: number[],
    clearSelection: () => void,
  ) => void;
  onRowClick?: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const CoinlogListDatagrid = ({
  coinlogs,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  onRowClick,
  rowAnchor,
  disabled,
  onSelectCoinlogIds,
  onSort,
}: CoinlogListDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const userPermissions = useUserPermissions();
  const hasManageOrdersPermission =
    userPermissions?.some(perm => perm.code === PermissionEnum.MANAGE_ORDERS) ??
    false;

  const emptyColumn = useEmptyColumn();
  const coinlogListStaticColumns = useMemo(
    () =>
      coinlogListStaticColumnsAdapter(emptyColumn, intl, sort, hasManageOrdersPermission),
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

  const {
    handlers,
    visibleColumns,
    staticColumns,
    selectedColumns,
    recentlyAddedColumn,
  } = useColumns({
    staticColumns: coinlogListStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: onColumnChange,
  });

  const getCellContent = useGetCellContent({
    columns: visibleColumns,
    coinlogs,
  });

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick || !coinlogs) {
        return;
      }
      const rowData: Coinlog = coinlogs[row];
      onRowClick(rowData.id);
    },
    [onRowClick, coinlogs],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor || !coinlogs) {
        return "";
      }
      const rowData: Coinlog = coinlogs[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, coinlogs],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as CoinlogListUrlSortField;

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
        rows={coinlogs?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectCoinlogIds}
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
