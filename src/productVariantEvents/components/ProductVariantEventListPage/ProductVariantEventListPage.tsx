// @ts-strict-ignore
import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { ListFilters } from "@dashboard/components/AppLayout/ListFilters";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { FilterPresetsSelect } from "@dashboard/components/FilterPresetsSelect";
import { ProductVariantEvents } from "@dashboard/productVariantEvents/types";
import {
  ProductVariantEventListUrlSortField,
} from "@dashboard/productVariantEvents/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import {
  FilterPagePropsWithPresets,
  PageListProps,
  SortPage,
} from "@dashboard/types";
import { Box, ChevronRightIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { ProductVariantEventListDatagrid } from "../ProductVariantEventListDatagrid/ProductVariantEventListDatagrid";
import {
  createFilterStructure,
  ProductVariantEventFilterKeys,
  ProductVariantEventListFilterOpts,
} from "./filters";

export interface ProductVariantEventListPageProps
  extends PageListProps,
    FilterPagePropsWithPresets<ProductVariantEventFilterKeys, ProductVariantEventListFilterOpts>,
    SortPage<ProductVariantEventListUrlSortField> {
  productVariantEvents: ProductVariantEvents | undefined;
  selectedProductVariantEventIds: string[];
  loading: boolean;
  onSelectProductVariantEventIds: (rows: number[], clearSelection: () => void) => void;
  onProductVariantEventsDelete?: () => void;
}

const ProductVariantEventListPage: React.FC<ProductVariantEventListPageProps> = ({
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
  selectedProductVariantEventIds,
  hasPresetsChanged,
  onProductVariantEventsDelete,
  ...productVariantEventListProps
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
          id: "product-variant-event-topnav",
          defaultMessage: "商品品种日志",
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
                id: "product-variant-event-all",
                defaultMessage: "所有商品品种日志",
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
            id: "product-variant-event-search",
            defaultMessage: "搜索商品品种日志...",
          })}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
        />
        <ProductVariantEventListDatagrid
          {...productVariantEventListProps}
          hasRowHover={!isFilterPresetOpen}
          // rowAnchor={productVariantEventUrl}
          // onRowClick={id => navigate(productVariantEventUrl(id))}
        />
      </Box>
    </>
  );
};
ProductVariantEventListPage.displayName = "ProductVariantEventListPage";
export default ProductVariantEventListPage;
