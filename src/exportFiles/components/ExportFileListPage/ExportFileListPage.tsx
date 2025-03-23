// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import {
  ExportFileListUrlSortField,
} from "@dashboard/exportFiles/urls";

import {
  FilterPagePropsWithPresets,
  PageListProps,
  SortPage,
} from "@dashboard/types";
import { Box, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { ExportFileListDatagrid } from "../ExportFileListDatagrid/ExportFileListDatagrid";
import {
  createFilterStructure,
  ExportFileFilterKeys,
  ExportFileListFilterOpts,
} from "./filters";
import { ExportLogs } from "@dashboard/exportFiles/types";
import useNavigator from "@dashboard/hooks/useNavigator";

export interface ExportFileListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<ExportFileFilterKeys, ExportFileListFilterOpts>,
    SortPage<ExportFileListUrlSortField> {
  exportLogs: ExportLogs | undefined;
  selectedExportLogIds: string[];
  loading: boolean;
  onSelectExportLogIds: (rows: number[], clearSelection: () => void) => void;
  onExportlogsDelete?: () => void;
}

const ExportFileListPage: React.FC<ExportFileListPageProps> = ({
  selectedFilterPreset,
  filterOpts,
  initialSearch,
  onFilterPresetsAll,
  onFilterChange,
  onFilterPresetDelete,
  onFilterPresetUpdate,
  onSearchChange,
  onFilterPresetChange,
  onFilterPresetPresetSave,
  filterPresets,
  selectedExportLogIds,
  hasPresetsChanged,
  onExportlogsDelete,
  ...exportFileListProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const userPermissions = useUserPermissions();
  const structure = createFilterStructure(intl, filterOpts, userPermissions);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  return (
    <>
      <TopNav
        title={intl.formatMessage({
          id: "export-topnav",
          defaultMessage: "数据导出",
        })}
        withoutBorder
        isAlignToRight={false}
      >
        <Box
          __flex={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box display="flex">
            <Box marginX={5} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>
            <FilterPresetsSelect
              presetsChanged={hasPresetsChanged()}
              onSelect={onFilterPresetChange}
              onRemove={onFilterPresetDelete}
              onUpdate={onFilterPresetUpdate}
              savedPresets={filterPresets}
              activePreset={selectedFilterPreset}
              onSelectAll={onFilterPresetsAll}
              onSave={onFilterPresetPresetSave}
              isOpen={isFilterPresetOpen}
              onOpenChange={setFilterPresetOpen}
              selectAllLabel={intl.formatMessage({
                id: "exportfile-all",
                defaultMessage: "所有导出日志",
              })}
            />
          </Box>
        </Box>
      </TopNav>
      <Box>
        <ListFilters
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "exportfile-search",
            defaultMessage: "搜索导出日志...",
          })}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          actions={
            <Box display="flex" gap={4}>
              {/* {selectedExportlogIds.length > 0 && (
                <BulkDeleteButton onClick={onExportlogsDelete}>
                  <FormattedMessage
                    defaultMessage="删除捐赠"
                    id="Exportlog-delete"
                  />
                </BulkDeleteButton>
              )} */}
            </Box>
          }
        />
        <ExportFileListDatagrid
        {...exportFileListProps}
        hasRowHover={!isFilterPresetOpen}          // rowAnchor={ExportlogUrl}
          // onRowClick={id => navigate(ExportlogUrl(id))}
        />
      </Box>
    </>
  );
};
ExportFileListPage.displayName = "ExportFileListPage";
export default ExportFileListPage;
