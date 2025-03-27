// @ts-strict-ignore
import { useUser } from "@dashboard/auth";
import ChannelPickerDialog from "@dashboard/channels/components/ChannelPickerDialog";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import DeleteFilterTabDialog from "@dashboard/components/DeleteFilterTabDialog";
import SaveFilterTabDialog from "@dashboard/components/SaveFilterTabDialog";
import { useShopLimitsQuery } from "@dashboard/components/Shop/queries";
import {
  useOrderCountQuery,
  useOrderDraftCreateMutation,
  useOrderExportMutation,
  useOrderListQuery,
} from "@dashboard/graphql";
import { useFilterHandlers } from "@dashboard/hooks/useFilterHandlers";
import { useFilterPresets } from "@dashboard/hooks/useFilterPresets";
import useListSettings from "@dashboard/hooks/useListSettings";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { usePaginationReset } from "@dashboard/hooks/usePaginationReset";
import usePaginator, {
  createPaginationState,
  PaginatorContext,
} from "@dashboard/hooks/usePaginator";
import { ListViews } from "@dashboard/types";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import createSortHandler from "@dashboard/utils/handlers/sortHandler";
import { mapEdgesToItems, mapNodeToChoice } from "@dashboard/utils/maps";
import { getSortParams } from "@dashboard/utils/sort";
import React from "react";
import { useIntl } from "react-intl";

import OrderListPage from "../../components/OrderListPage/OrderListPage";
import {
  orderListUrl,
  OrderListUrlDialog,
  OrderListUrlQueryParams,
  orderSettingsPath,
  orderUrl,
} from "../../urls";
import {
  getFilterOpts,
  getFilterQueryParam,
  getFilterVariables,
  ORDER_LIST_PRESETS_TAB_KEY,
  storageUtils,
} from "./filters";
import { DEFAULT_SORT_KEY, getSortQueryVariables } from "./sort";
import useBackgroundTask from "@dashboard/hooks/useBackgroundTask";
import { Task } from "@dashboard/containers/BackgroundTasks/types";
import OrderExportDialog from "@dashboard/orders/components/OrderExportDialog";

interface OrderListProps {
  params: OrderListUrlQueryParams;
}

export const OrderList: React.FC<OrderListProps> = ({ params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const { updateListSettings, settings } = useListSettings(
    ListViews.ORDER_LIST,
  );

  const {
    hasPresetsChanged,
    onPresetChange,
    onPresetDelete,
    onPresetSave,
    onPresetUpdate,
    onPresetClear,
    getPresetNameToDelete,
    presets,
    selectedPreset,
    setPresetIdToDelete,
  } = useFilterPresets({
    params,
    getUrl: orderListUrl,
    storageUtils,
    reset: () => "",
    storageKey: ORDER_LIST_PRESETS_TAB_KEY
  });

  usePaginationReset(orderListUrl, params, settings.rowNumber);

  const intl = useIntl();
  const { channel, availableChannels } = useAppChannel(false);
  const user = useUser();
  const channels = user?.user?.accessibleChannels ?? [];
  const { queue } = useBackgroundTask();

  const [createOrder] = useOrderDraftCreateMutation({
    onCompleted: data => {
      notify({
        status: "success",
        text: intl.formatMessage({
          id: "6udlH+",
          defaultMessage: "Order draft successfully created",
        }),
      });
      navigate(orderUrl(data.draftOrderCreate.order.id));
    },
  });

  const limitOpts = useShopLimitsQuery({
    variables: {
      orders: true,
    },
  });

  const noChannel = !channel && typeof channel !== "undefined";
  const channelOpts = availableChannels ? mapNodeToChoice(channels) : null;

  const [changeFilters, resetFilters, handleSearchChange] = useFilterHandlers({
    createUrl: orderListUrl,
    getFilterQueryParam,
    params,
    defaultSortField: DEFAULT_SORT_KEY,
    hasSortWithRank: true,
    keepActiveTab: true,
    cleanupFn: () => { onPresetClear(); }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    OrderListUrlDialog,
    OrderListUrlQueryParams
  >(navigate, orderListUrl, params);

  const paginationState = createPaginationState(settings.rowNumber, params);
  const filterVariables = getFilterVariables(params);
  const queryVariables = React.useMemo(
    () => ({
      ...paginationState,
      filter: filterVariables,
      sort: getSortQueryVariables(params),
    }),
    [params, settings.rowNumber],
  );
  const { data, loading } = useOrderListQuery({
    displayLoader: true,
    variables: queryVariables,
  });

  const paginationValues = usePaginator({
    pageInfo: data?.orders?.pageInfo,
    paginationState,
    queryString: params,
  });

  const handleSort = createSortHandler(navigate, orderListUrl, params);

  const [exportOrders, exportOrdersOpts] = useOrderExportMutation({
    onCompleted: data => {
      if (data.exportOrders.errors.length === 0) {
        notify({
          text: intl.formatMessage({
            id: "dPYqy0",
            defaultMessage:
              "We are currently exporting your requested CSV. As soon as it is available it will be sent to your email address",
          }),
          title: intl.formatMessage({
            id: "5QKsu+",
            defaultMessage: "Exporting CSV",
            description: "waiting for export to end, header",
          }),
        });
        queue(Task.EXPORT, {
          id: data.exportOrders.exportFile.id,
        });
        closeModal();
      }
    },
  });

  const countAllOrders = useOrderCountQuery({
    skip: params.action !== "export",
  });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <OrderListPage
        settings={settings}
        currentTab={selectedPreset}
        disabled={loading}
        filterOpts={getFilterOpts(params, channelOpts)}
        limits={limitOpts.data?.shop.limits}
        orders={mapEdgesToItems(data?.orders)}
        sort={getSortParams(params)}
        onAdd={() => openModal("create-order")}
        onUpdateListSettings={updateListSettings}
        onSort={handleSort}
        onSearchChange={handleSearchChange}
        onFilterChange={changeFilters}
        onTabSave={() => openModal("save-search")}
        onTabDelete={(tabIndex: number) => {
          setPresetIdToDelete(tabIndex);
          openModal("delete-search");
        }}
        onTabChange={onPresetChange}
        onTabUpdate={onPresetUpdate}
        initialSearch={params.query || ""}
        tabs={presets.map(tab => tab.name)}
        onAll={resetFilters}
        onSettingsOpen={() => navigate(orderSettingsPath)}
        params={params}
        hasPresetsChanged={hasPresetsChanged()}
        onExport={() => openModal("export")}
      />
      <OrderExportDialog
        // attributes={
        //   mapEdgesToItems(searchAttributes?.result?.data?.search) || []
        // }
        // hasMore={data.orders.pageInfo.hasNextPage}
        // loading={
        //   loading
        // }
        // onFetch={data.search}
        // onFetchMore={searchAttributes.loadMore}
        currentFilterVars={filterVariables}
        open={params.action === "export"}
        confirmButtonState={exportOrdersOpts.status}
        errors={exportOrdersOpts.data?.exportOrders.errors || []}
        // orderQuantity={{
        //   all: exportOrdersOpts.data?.exportOrders?.totalCount,
        //   filter: data?.orders?.totalCount,
        // }}
        orderQuantity={{
          all: countAllOrders.data?.orders?.totalCount,
          filter: data?.orders?.totalCount,
        }}
        // channels={availableChannels}
        onClose={closeModal}
        onSubmit={data =>
          exportOrders({
            variables: {
              input: {
                ...data,
              },
            },
          })
        }
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
      {!noChannel && (
        <ChannelPickerDialog
          channelsChoices={channelOpts}
          confirmButtonState="success"
          defaultChoice={channel.id}
          open={params.action === "create-order"}
          onClose={closeModal}
          onConfirm={channelId =>
            createOrder({
              variables: {
                input: { channelId },
              },
            })
          }
        />
      )}
    </PaginatorContext.Provider>
  );
};

export default OrderList;
