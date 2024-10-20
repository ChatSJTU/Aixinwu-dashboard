import ActionDialog from "@dashboard/components/ActionDialog";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useBulkCompleteDonationsMutation,
  useListDonationsQuery,
} from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { commonMessages, sectionNames } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import { DialogContentText } from "@material-ui/core";
import isEqual from "lodash/isEqual";
import React, { useCallback, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  donationListUrl,
  DonationListUrlDialog,
  DonationListUrlQueryParams,
} from "../../urls";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFilterVariables,
  storageUtils,
} from "./filters";
import { getSortQueryVariables } from "./sort";
import DonationListPage from "@dashboard/donations/components/DonationListPage";
import { Text, Box, Combobox, RadioGroup } from "@saleor/macaw-ui-next";

interface DonationListProps {
  params: DonationListUrlQueryParams;
}

export const DonationList: React.FC<DonationListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(
    ListViews.DONATION_LIST,
  );

  usePaginationReset(donationListUrl, params, settings.rowNumber);

  const {
    clearRowSelection,
    selectedRowIds,
    setClearDatagridRowSelectionCallback,
    setSelectedRowIds,
  } = useRowSelection(params);

  const {
    selectedPreset,
    presets,
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    setPresetIdToDelete,
    getPresetNameToDelete,
  } = useFilterPresets({
    params,
    reset: clearRowSelection,
    getUrl: donationListUrl,
    storageUtils,
  });

  const paginationState = createPaginationState(settings.rowNumber, params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: getFilterVariables(params),
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading, refetch } = useListDonationsQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const donations = mapEdgesToItems(data?.donations);
  const [bulkState, setBulkState] = useState<boolean>(true);

  const [changeFilters, resetFilters, handleSearchChange] =
    createFilterHandlers({
      cleanupFn: clearRowSelection,
      createUrl: donationListUrl,
      getFilterQueryParam,
      navigate,
      params,
      keepActiveTab: true,
    });

  const [openModal, closeModal] = createDialogActionHandlers<
    DonationListUrlDialog,
    DonationListUrlQueryParams
  >(navigate, donationListUrl, params);

  const paginationValues = usePaginator({
    pageInfo: data?.donations?.pageInfo,
    paginationState,
    queryString: params,
  });

  const [bulkCompleteDonations, bulkCompleteDonationsOpts] =
    useBulkCompleteDonationsMutation({
      onCompleted: data => {
        if (data.donationBulkComplete?.errors.length === 0) {
          notify({
            status: "success",
            text: intl.formatMessage(commonMessages.savedChanges),
          });
          refetch();
          clearRowSelection();
          closeModal();
        }
      },
    });

  const handleSort = createSortHandler(navigate, donationListUrl, params);

  const handleSetSelectedDonationIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!donations) {
        return;
      }

      const rowsIds = rows.map(row => donations[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [
      donations,
      selectedRowIds,
      setClearDatagridRowSelectionCallback,
      setSelectedRowIds,
    ],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <DonationListPage
        selectedFilterPreset={selectedPreset}
        filterOpts={getFilterOpts(params)}
        initialSearch={""}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onFilterPresetsAll={resetFilters}
        onFilterPresetChange={onPresetChange}
        onFilterPresetDelete={(id: number) => {
          setPresetIdToDelete(id);
          openModal("delete-search");
        }}
        onFilterPresetPresetSave={() => openModal("save-search")}
        onFilterPresetUpdate={onPresetUpdate}
        filterPresets={presets.map(preset => preset.name)}
        donations={donations}
        settings={settings}
        disabled={loading}
        loading={loading}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        selectedDonationIds={selectedRowIds}
        onSelectDonationIds={handleSetSelectedDonationIds}
        sort={getSortParams(params)}
        hasPresetsChanged={hasPresetsChanged}
        onDonationsBulkAction={() => openModal("remove", { ids: selectedRowIds })}
      />
      <ActionDialog
        open={params.action === "remove" && selectedRowIds?.length > 0}
        onClose={closeModal}
        confirmButtonState={bulkCompleteDonationsOpts.status}
        onConfirm={() =>
          bulkCompleteDonations({
            variables: {
              ids: selectedRowIds,
              accepted: bulkState
            },
          })
        }
        variant="default"
        title={intl.formatMessage({
          id: "donation-bulk-complete",
          defaultMessage: "批量完成捐赠",
        })}
      >
        <DialogContentText>
          <FormattedMessage
            id="donation-bulk-action-tip"
            defaultMessage="{counter,plural,one{请选择要设置捐赠的状态：} other{请设置已选中 {displayQuantity} 个捐赠的状态：}}"
            values={{
              counter: selectedRowIds?.length,
              displayQuantity: <strong>{selectedRowIds?.length}</strong>,
            }}
          />
          <RadioGroup
            marginTop={3}
            value={bulkState ? "completed" : "rejected"}
            onValueChange={(v)=>{setBulkState(v == "completed")}}
            disabled={false}
            display="flex"
            flexDirection="row"
            gap={3}
          >
            <RadioGroup.Item
              id={`donation-completed`}
              value="completed"
              name="completed"
            >
              <Box display="flex" alignItems="baseline" gap={2}>
                <Text>已完成</Text>
              </Box>
            </RadioGroup.Item>
            <RadioGroup.Item
              id={`donation-rejected`}
              value="rejected"
              name="rejected"
            >
              <Box display="flex" alignItems="baseline" gap={2}>
                <Text>已拒绝</Text>
              </Box>
            </RadioGroup.Item>
          </RadioGroup>
        </DialogContentText>
      </ActionDialog>
      <SaveFilterTabDialog
        open={params.action === "save-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetSave}
      />
      <DeleteFilterTabDialog
        open={params.action === "delete-search"}
        confirmButtonState="default"
        onClose={closeModal}
        onSubmit={onPresetDelete}
        tabName={getPresetNameToDelete()}
      />
    </PaginatorContext.Provider>
  );
};
export default DonationList;
