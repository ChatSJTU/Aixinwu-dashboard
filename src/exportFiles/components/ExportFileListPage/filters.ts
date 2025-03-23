// @ts-strict-ignore
import { IFilter } from "@dashboard/components/Filter";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { JobStatusEnum, PermissionEnum, UserFragment } from "@dashboard/graphql";
import { FilterOpts, MinMax } from "@dashboard/types";
import {
  createDateField,
  createOptionsField,
  createTextField,
} from "@dashboard/utils/filters/fields";
import { IntlShape } from "react-intl";

export enum ExportFileFilterKeys {
  created = "created",
  status = "status",
  type = "type"
}

export interface ExportFileListFilterOpts {
  created: FilterOpts<MinMax>;
  status: FilterOpts<string>;
}

export function createFilterStructure(
  intl: IntlShape,
  opts: ExportFileListFilterOpts,
  userPermissions: UserFragment["userPermissions"],
): IFilter<ExportFileFilterKeys> {
  return [
    {
      ...createDateField(
        ExportFileFilterKeys.created,
        intl.formatMessage({
          id: "exportfile-date",
          defaultMessage: "时间"
        }),
        opts.created.value,
      ),
      active: opts.created.active,
    },
    {
      ...createOptionsField(
        ExportFileFilterKeys.status,
        intl.formatMessage({
          id: "exportfile-status",
          defaultMessage: "状态"
        }),
        [],
        false,
        [
          {
            value: JobStatusEnum.SUCCESS,
            label: intl.formatMessage({
              id: "export-file-success",
              defaultMessage: "导出成功",
            }),
          },
          {
            value: JobStatusEnum.FAILED,
            label: intl.formatMessage({
              id: "export-file-failed",
              defaultMessage: "导出失败",
            }),
          },          {
            value: JobStatusEnum.PENDING,
            label: intl.formatMessage({
              id: "export-file-pending",
              defaultMessage: "导出处理中",
            }),
          },
          {
            value: JobStatusEnum.DELETED,
            label: intl.formatMessage({
              id: "export-file-deleted",
              defaultMessage: "已删除",
            }),
          },
        ],
      ),
      active: opts.status.active,
    },
  ].filter(filter =>
    hasPermissions(userPermissions ?? [], filter.permissions ?? []),
  );
}
