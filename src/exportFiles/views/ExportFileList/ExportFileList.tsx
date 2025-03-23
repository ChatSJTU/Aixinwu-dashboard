import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useListExportsQuery,
} from "@dashboard/graphql";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { useRowSelection } from "@dashboard/hooks/useRowSelection";
import { sectionNames } from "@dashboard/intl";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createFilterHandlers from "@dashboard/utils/handlers/filterHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import isEqual from "lodash/isEqual";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import {
  exportFileListUrl,
  ExportFileListUrlDialog,
  ExportFileListUrlQueryParams,
} from "../../urls";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFilterVariables,
  storageUtils,
} from "./filters";
import { getSortQueryVariables } from "./sort";
import ExportFileListPage from "@dashboard/exportFiles/components/ExportFileListPage";

interface ExportFileListProps {
  params: ExportFileListUrlQueryParams;
}

export const ExportFileList: React.FC<ExportFileListProps> = ({ params }) => {
  const navigate = useNavigator();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(
    ListViews.EXPORTFILE_LIST,
  );

  usePaginationReset(exportFileListUrl, params, settings.rowNumber);

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
    getUrl: exportFileListUrl,
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
  const { data, loading, refetch } = useListExportsQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const exportLogs = mapEdgesToItems(data?.exportFiles);

  const [changeFilters, resetFilters, handleSearchChange] =
    createFilterHandlers({
      cleanupFn: clearRowSelection,
      createUrl: exportFileListUrl,
      getFilterQueryParam,
      navigate,
      params,
      keepActiveTab: true,
    });

  const [openModal, closeModal] = createDialogActionHandlers<
    ExportFileListUrlDialog,
    ExportFileListUrlQueryParams
  >(navigate, exportFileListUrl, params);

  const paginationValues = usePaginator({
    pageInfo: data?.exportFiles?.pageInfo,
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, exportFileListUrl, params);

  const handleSetSelectedExportlogIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!exportLogs) {
        return;
      }

      const rowsIds = rows.map(row => exportLogs[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [
      exportLogs,
      selectedRowIds,
      setClearDatagridRowSelectionCallback,
      setSelectedRowIds,
    ],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <ExportFileListPage
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
        exportLogs={exportLogs}
        settings={settings}
        disabled={loading}
        loading={loading}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        selectedExportLogIds={selectedRowIds}
        onSelectExportLogIds={handleSetSelectedExportlogIds}
        sort={getSortParams(params)}
        hasPresetsChanged={hasPresetsChanged}
      />
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
export default ExportFileList;
