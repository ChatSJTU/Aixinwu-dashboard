import { FilterElement, FilterElementRegular } from "@dashboard/components/Filter";
import { ExportFileFilterInput, JobStatusEnum } from "@dashboard/graphql";

import {
  createFilterTabUtils,
  createFilterUtils,
  getGteLteDateTimeVariables,
  getMinMaxQueryParam,
  getSingleEnumValueQueryParam,
} from "../../../utils/filters";
import {
  ExportFileListUrlFilters,
  ExportFileListUrlFiltersEnum,
  ExportFileListUrlQueryParams,
} from "../../urls";
import { ExportFileFilterKeys, ExportFileListFilterOpts } from "@dashboard/exportFiles/components/ExportFileListPage/filters";

export const EXPORTFILE_FILTERS_KEY = "exportFileFilters";

export function getFilterOpts(
  params: ExportFileListUrlFilters,
): ExportFileListFilterOpts {
  return {
    created: {
      active: [params?.createdFrom, params?.createdTo].some(
        field => field !== undefined,
      ),
      value: {
        max: params?.createdTo || "",
        min: params?.createdFrom || "",
      },
    },
    status: {
      active: !!params.status,
      value: Array.isArray(params) ? params[0] : params
    },
  };
}

export function getFilterVariables(
  params: ExportFileListUrlFilters,
): ExportFileFilterInput {
  return {
    createdAt: getGteLteDateTimeVariables({
      gte: params.createdFrom,
      lte: params.createdTo,
    }),
    status: params.status as JobStatusEnum,
  };
}

export function getFilterQueryParam(
  filter: FilterElement<ExportFileFilterKeys>,
): ExportFileListUrlFilters {
  const { name } = filter;
  switch (name) {
    case ExportFileFilterKeys.created:
      return getMinMaxQueryParam(
        filter,
        ExportFileListUrlFiltersEnum.createdFrom,
        ExportFileListUrlFiltersEnum.createdTo,
      );
    case ExportFileFilterKeys.status:
      return getSingleEnumValueQueryParam(
        filter as FilterElementRegular<ExportFileFilterKeys.status>,
        ExportFileListUrlFiltersEnum.status,
        JobStatusEnum
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(EXPORTFILE_FILTERS_KEY);

export const { areFiltersApplied, getActiveFilters, getFiltersCurrentTab } =
  createFilterUtils<ExportFileListUrlQueryParams, ExportFileListUrlFilters>(
    ExportFileListUrlFiltersEnum,
  );
