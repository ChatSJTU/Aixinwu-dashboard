import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { ProductEvent, ProductEvents } from "@dashboard/productEvents/types";
import { ProductEventListUrlSortField } from "@dashboard/productEvents/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  useGetCellContent,
  productEventListStaticColumnsAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { canBeSorted } from "@dashboard/productEvents/utils";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";

interface ProductEventListDatagridProps
  extends ListProps,
    SortPage<ProductEventListUrlSortField> {
  productEvents: ProductEvents | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectProductEventIds: (
    rowsIndex: number[],
    clearSelection: () => void,
  ) => void;
  onRowClick?: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const ProductEventListDatagrid = ({
  productEvents,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  onRowClick,
  rowAnchor,
  disabled,
  onSelectProductEventIds,
  onSort,
}: ProductEventListDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const userPermissions = useUserPermissions();

  const emptyColumn = useEmptyColumn();
  const productEventListStaticColumns = useMemo(
    () =>
      productEventListStaticColumnsAdapter(emptyColumn, intl, sort),
    [intl, sort],
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
    staticColumns: productEventListStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: onColumnChange,
  });

  const getCellContent = useGetCellContent({
    columns: visibleColumns,
    productEvents,
  });

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick || !productEvents) {
        return;
      }
      const rowData: ProductEvent = productEvents[row];
      onRowClick(rowData.id);
    },
    [onRowClick, productEvents],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor || !productEvents) {
        return "";
      }
      const rowData: ProductEvent = productEvents[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, productEvents],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as ProductEventListUrlSortField;
      console.log(columnName)
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
        rows={productEvents?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectProductEventIds}
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
