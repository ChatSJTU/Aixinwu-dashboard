// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { Coinlogs } from "@dashboard/coinlogs/types";
import {
  CoinlogListUrlSortField,
} from "@dashboard/coinlogs/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  FilterPagePropsWithPresets,
  PageListProps,
  SortPage,
} from "@dashboard/types";
import { Box, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { CoinlogListDatagrid } from "../CoinlogListDatagrid/CoinlogListDatagrid";
import {
  createFilterStructure,
  CoinlogFilterKeys,
  CoinlogListFilterOpts,
} from "./filters";

export interface CoinlogListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<CoinlogFilterKeys, CoinlogListFilterOpts>,
    SortPage<CoinlogListUrlSortField> {
  coinlogs: Coinlogs | undefined;
  selectedCoinlogIds: string[];
  loading: boolean;
  onSelectCoinlogIds: (rows: number[], clearSelection: () => void) => void;
  onCoinlogsDelete?: () => void;
}

const CoinlogListPage: React.FC<CoinlogListPageProps> = ({
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
  selectedCoinlogIds,
  hasPresetsChanged,
  onCoinlogsDelete,
  ...coinlogListProps
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
          id: "coinlog-topnav",
          defaultMessage: "爱心币日志",
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
                id: "coinlog-all",
                defaultMessage: "所有爱心币日志",
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
            id: "coinlog-search",
            defaultMessage: "搜索爱心币日志...",
          })}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          actions={
            <Box display="flex" gap={4}>
              {/* {selectedCoinlogIds.length > 0 && (
                <BulkDeleteButton onClick={onCoinlogsDelete}>
                  <FormattedMessage
                    defaultMessage="删除捐赠"
                    id="coinlog-delete"
                  />
                </BulkDeleteButton>
              )} */}
            </Box>
          }
        />
        <CoinlogListDatagrid
          {...coinlogListProps}
          hasRowHover={!isFilterPresetOpen}
          // rowAnchor={coinlogUrl}
          // onRowClick={id => navigate(coinlogUrl(id))}
        />
      </Box>
    </>
  );
};
CoinlogListPage.displayName = "CoinlogListPage";
export default CoinlogListPage;
