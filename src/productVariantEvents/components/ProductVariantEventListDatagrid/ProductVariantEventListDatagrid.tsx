import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { ProductVariantEvent, ProductVariantEvents } from "@dashboard/productVariantEvents/types";
import { ProductVariantEventListUrlSortField } from "@dashboard/productVariantEvents/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  useGetCellContent,
  productVariantEventListStaticColumnsAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { canBeSorted } from "@dashboard/productVariantEvents/utils";
import { useEmptyColumn } from "@dashboard/components/Datagrid/hooks/useEmptyColumn";

interface ProductVariantEventListDatagridProps
  extends ListProps,
    SortPage<ProductVariantEventListUrlSortField> {
  productVariantEvents: ProductVariantEvents | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectProductVariantEventIds: (
    rowsIndex: number[],
    clearSelection: () => void,
  ) => void;
  onRowClick?: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const ProductVariantEventListDatagrid = ({
  productVariantEvents,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  onRowClick,
  rowAnchor,
  disabled,
  onSelectProductVariantEventIds,
  onSort,
}: ProductVariantEventListDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const userPermissions = useUserPermissions();

  const emptyColumn = useEmptyColumn();
  const productVariantEventListStaticColumns = useMemo(
    () =>
      productVariantEventListStaticColumnsAdapter(emptyColumn, intl, sort),
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
    staticColumns: productVariantEventListStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: onColumnChange,
  });

  const getCellContent = useGetCellContent({
    columns: visibleColumns,
    productVariantEvents,
  });

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick || !productVariantEvents) {
        return;
      }
      const rowData: ProductVariantEvent = productVariantEvents[row];
      onRowClick(rowData.id);
    },
    [onRowClick, productVariantEvents],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor || !productVariantEvents) {
        return "";
      }
      const rowData: ProductVariantEvent = productVariantEvents[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, productVariantEvents],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as ProductVariantEventListUrlSortField;
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
        rows={productVariantEvents?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectProductVariantEventIds}
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
