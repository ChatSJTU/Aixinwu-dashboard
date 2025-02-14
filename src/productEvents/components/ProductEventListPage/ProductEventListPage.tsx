// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ProductEvents } from "@dashboard/productEvents/types";
import {
  ProductEventListUrlSortField,
} from "@dashboard/productEvents/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  FilterPagePropsWithPresets,
  PageListProps,
  SortPage,
} from "@dashboard/types";
import { Box, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { ProductEventListDatagrid } from "../ProductEventListDatagrid/ProductEventListDatagrid";
import {
  createFilterStructure,
  ProductEventFilterKeys,
  ProductEventListFilterOpts,
} from "./filters";

export interface ProductEventListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<ProductEventFilterKeys, ProductEventListFilterOpts>,
    SortPage<ProductEventListUrlSortField> {
  productEvents: ProductEvents | undefined;
  selectedProductEventIds: string[];
  loading: boolean;
  onSelectProductEventIds: (rows: number[], clearSelection: () => void) => void;
  onProductEventsDelete?: () => void;
}

const ProductEventListPage: React.FC<ProductEventListPageProps> = ({
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
  selectedProductEventIds,
  hasPresetsChanged,
  onProductEventsDelete,
  ...productEventListProps
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
          id: "product-event-topnav",
          defaultMessage: "商品日志",
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
                id: "product-event-all",
                defaultMessage: "所有商品日志",
              })}
            />
          </Box>
        </Box>
      </TopNav>
      <Box>
        <ListFilters
          filterStructure={structure}
          searchDisabled
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            id: "product-event-search",
            defaultMessage: "搜索商品日志...",
          })}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
        />
        <ProductEventListDatagrid
          {...productEventListProps}
          hasRowHover={!isFilterPresetOpen}
          // rowAnchor={productEventUrl}
          // onRowClick={id => navigate(productEventUrl(id))}
        />
      </Box>
    </>
  );
};
ProductEventListPage.displayName = "ProductEventListPage";
export default ProductEventListPage;
