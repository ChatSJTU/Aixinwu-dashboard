// @ts-strict-ignore
import {
  extensionMountPoints,
  mapToMenuItems,
  useExtensions,
} from "@dashboard/apps/hooks/useExtensions";
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { Donations } from "@dashboard/donations/types";
import {
  donationAddUrl,
  DonationListUrlSortField,
  donationUrl,
} from "@dashboard/donations/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  FilterPagePropsWithPresets,
  PageListProps,
  SortPage,
} from "@dashboard/types";
import { Box, Button, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { DonationListDatagrid } from "../DonationListDatagrid/DonationListDatagrid";
import {
  createFilterStructure,
  DonationFilterKeys,
  DonationListFilterOpts,
} from "./filters";

export interface DonationListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<DonationFilterKeys, DonationListFilterOpts>,
    SortPage<DonationListUrlSortField> {
  donations: Donations | undefined;
  selectedDonationIds: string[];
  loading: boolean;
  onSelectDonationIds: (rows: number[], clearSelection: () => void) => void;
  onDonationsDelete: () => void;
}

const DonationListPage: React.FC<DonationListPageProps> = ({
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
  selectedDonationIds,
  hasPresetsChanged,
  onDonationsDelete,
  ...donationListProps
}) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const userPermissions = useUserPermissions();
  const structure = createFilterStructure(intl, filterOpts, userPermissions);
  const [isFilterPresetOpen, setFilterPresetOpen] = useState(false);

  const { CUSTOMER_OVERVIEW_CREATE, CUSTOMER_OVERVIEW_MORE_ACTIONS } =
    useExtensions(extensionMountPoints.CUSTOMER_LIST);
  // const extensionMenuItems = mapToMenuItemsForDonationOverviewActions(
  //   CUSTOMER_OVERVIEW_MORE_ACTIONS,
  //   selectedDonationIds,
  // );
  const extensionMenuItems = [];
  const extensionCreateButtonItems = mapToMenuItems(CUSTOMER_OVERVIEW_CREATE);

  return (
    <>
      <TopNav
        title={intl.formatMessage({
          id: "donation-topnav",
          defaultMessage: "捐赠管理",
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
                id: "donation-all",
                defaultMessage: "所有捐赠",
              })}
            />
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {extensionMenuItems.length > 0 && (
              <TopNav.Menu items={extensionMenuItems} />
            )}
            {extensionCreateButtonItems.length > 0 ? (
              <ButtonWithDropdown
                options={extensionCreateButtonItems}
                data-test-id="create-donation"
                onClick={() => navigate(donationAddUrl)}
              >
                <FormattedMessage
                  id="donation-create"
                  defaultMessage="新增捐赠"
                />
              </ButtonWithDropdown>
            ) : (
              <Button
                data-test-id="create-donation"
                onClick={() => navigate(donationAddUrl)}
              >
                <FormattedMessage
                  id="donation-create"
                  defaultMessage="新增捐赠"
                />
              </Button>
            )}
          </Box>
        </Box>
      </TopNav>
      <Box>
        <ListFilters
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "donation-search",
            defaultMessage: "搜索捐赠...",
          })}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          actions={
            <Box display="flex" gap={4}>
              {selectedDonationIds.length > 0 && (
                <BulkDeleteButton onClick={onDonationsDelete}>
                  <FormattedMessage
                    defaultMessage="删除捐赠"
                    id="donation-delete"
                  />
                </BulkDeleteButton>
              )}
            </Box>
          }
        />
        <DonationListDatagrid
          {...donationListProps}
          hasRowHover={!isFilterPresetOpen}
          rowAnchor={donationUrl}
          onRowClick={id => navigate(donationUrl(id))}
        />
      </Box>
    </>
  );
};
DonationListPage.displayName = "DonationListPage";
export default DonationListPage;
