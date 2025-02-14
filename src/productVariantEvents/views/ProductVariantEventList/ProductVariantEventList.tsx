import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useListProductVariantEventsQuery,
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
  productVariantEventListUrl,
  ProductVariantEventListUrlDialog,
  ProductVariantEventListUrlQueryParams,
} from "../../urls";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFilterVariables,
  storageUtils,
} from "./filters";
import { getSortQueryVariables } from "./sort";
import ProductVariantEventListPage from "@dashboard/productVariantEvents/components/ProductVariantEventListPage";

interface ProductVariantEventListProps {
  params: ProductVariantEventListUrlQueryParams;
}

export const ProductVariantEventList: React.FC<ProductVariantEventListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const { updateListSettings, settings } = useListSettings(
    ListViews.PRODUCT_VARIANT_EVENT_LIST,
  );

  usePaginationReset(productVariantEventListUrl, params, settings.rowNumber);

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
    getUrl: productVariantEventListUrl,
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
  const { data, loading, refetch } = useListProductVariantEventsQuery({
    displayLoader: true,
    variables: queryVariables,
  });
  const productVariantEvents = mapEdgesToItems(data?.productVariantEvents);

  const [changeFilters, resetFilters, handleSearchChange] =
    createFilterHandlers({
      cleanupFn: clearRowSelection,
      createUrl: productVariantEventListUrl,
      getFilterQueryParam,
      navigate,
      params,
      keepActiveTab: true,
    });

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductVariantEventListUrlDialog,
    ProductVariantEventListUrlQueryParams
  >(navigate, productVariantEventListUrl, params);

  const paginationValues = usePaginator({
    pageInfo: data?.productVariantEvents?.pageInfo,
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, productVariantEventListUrl, params);

  const handleSetSelectedProductVariantEventIds = useCallback(
    (rows: number[], clearSelection: () => void) => {
      if (!productVariantEvents) {
        return;
      }

      const rowsIds = rows.map(row => productVariantEvents[row].id);
      const haveSaveValues = isEqual(rowsIds, selectedRowIds);

      if (!haveSaveValues) {
        setSelectedRowIds(rowsIds);
      }

      setClearDatagridRowSelectionCallback(clearSelection);
    },
    [
      productVariantEvents,
      selectedRowIds,
      setClearDatagridRowSelectionCallback,
      setSelectedRowIds,
    ],
  );

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <ProductVariantEventListPage
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
        productVariantEvents={productVariantEvents}
        settings={settings}
        disabled={loading}
        loading={loading}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        selectedProductVariantEventIds={selectedRowIds}
        onSelectProductVariantEventIds={handleSetSelectedProductVariantEventIds}
        sort={getSortParams(params)}
        hasPresetsChanged={hasPresetsChanged}
      />
      {/* <ActionDialog
        open={params.action === "remove" && selectedRowIds?.length > 0}
        onClose={closeModal}
        confirmButtonState={bulkRemoveProductVariantEventsOpts.status}
        onConfirm={() =>
          bulkRemoveProductVariantEvents({
            variables: {
              ids: selectedRowIds,
            },
          })
        }
        variant="delete"
        title={intl.formatMessage({
          id: "q8ep2I",
          defaultMessage: "Delete Customers",
          description: "dialog header",
        })}
      >
        <DialogContentText>
          <FormattedMessage
            id="N2SbNc"
            defaultMessage="{counter,plural,one{Are you sure you want to delete this customer?} other{Are you sure you want to delete {displayQuantity} customers?}}"
            values={{
              counter: selectedRowIds?.length,
              displayQuantity: <strong>{selectedRowIds?.length}</strong>,
            }}
          />
        </DialogContentText>
      </ActionDialog> */}
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
export default ProductVariantEventList;
