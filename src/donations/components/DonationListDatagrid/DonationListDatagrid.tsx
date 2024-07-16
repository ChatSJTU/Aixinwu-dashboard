import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeStateContext,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { Donation, Donations } from "@dashboard/donations/types";
import { DonationListUrlSortField } from "@dashboard/donations/urls";
import { PermissionEnum } from "@dashboard/graphql";
import { ListProps, SortPage } from "@dashboard/types";
import { Item } from "@glideapps/glide-data-grid";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { useIntl } from "react-intl";

import {
  useGetCellContent,
  donationListStaticColumnsAdapter,
} from "./datagrid";
import { messages } from "./messages";
import { canBeSorted } from "@dashboard/donations/utils";

interface DonationListDatagridProps
  extends ListProps,
    SortPage<DonationListUrlSortField> {
  donations: Donations | undefined;
  loading: boolean;
  hasRowHover?: boolean;
  onSelectDonationIds: (
    rowsIndex: number[],
    clearSelection: () => void,
  ) => void;
  onRowClick: (id: string) => void;
  rowAnchor?: (id: string) => string;
}

export const DonationListDatagrid = ({
  donations,
  sort,
  loading,
  settings,
  onUpdateListSettings,
  hasRowHover,
  onRowClick,
  rowAnchor,
  disabled,
  onSelectDonationIds,
  onSort,
}: DonationListDatagridProps) => {
  const intl = useIntl();
  const datagrid = useDatagridChangeState();

  const userPermissions = useUserPermissions();
  const hasManageOrdersPermission =
    userPermissions?.some(perm => perm.code === PermissionEnum.MANAGE_ORDERS) ??
    false;

  const donationListStaticColumns = useMemo(
    () =>
      donationListStaticColumnsAdapter(intl, sort, hasManageOrdersPermission),
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
    staticColumns: donationListStaticColumns,
    selectedColumns: settings?.columns ?? [],
    onSave: onColumnChange,
  });

  const getCellContent = useGetCellContent({
    columns: visibleColumns,
    donations,
  });

  const handleRowClick = useCallback(
    ([_, row]: Item) => {
      if (!onRowClick || !donations) {
        return;
      }
      const rowData: Donation = donations[row];
      onRowClick(rowData.id);
    },
    [onRowClick, donations],
  );

  const handleRowAnchor = useCallback(
    ([, row]: Item) => {
      if (!rowAnchor || !donations) {
        return "";
      }
      const rowData: Donation = donations[row];
      return rowAnchor(rowData.id);
    },
    [rowAnchor, donations],
  );

  const handleHeaderClick = useCallback(
    (col: number) => {
      const columnName = visibleColumns[col].id as DonationListUrlSortField;

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
        rowMarkers="checkbox-visible"
        columnSelect="single"
        hasRowHover={hasRowHover}
        onColumnMoved={handlers.onMove}
        onColumnResize={handlers.onResize}
        verticalBorder={col => col > 0}
        rows={donations?.length ?? 0}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        onRowSelectionChange={onSelectDonationIds}
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
