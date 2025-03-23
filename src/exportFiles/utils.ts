import { IntlShape } from "react-intl";
import { ExportFileListUrlSortField } from "./urls";
import { StatusType } from "@dashboard/types";

export function canBeSorted(sort: ExportFileListUrlSortField) {
    switch (sort) {
      case ExportFileListUrlSortField.createdAt:
        return true;
      default:
        return false;
    }
  }
  
export const transformExportFileType = (
    status: string,
    intl: IntlShape,
  ): { localized: string; status: StatusType } => {
    switch (status) {
      case "SUCCESS":
        return {
          localized: intl.formatMessage({
            id: "export-file-success",
            defaultMessage: "导出成功",
          }),
          status: StatusType.SUCCESS,
        };
      case "FAILED":
        return {
          localized: intl.formatMessage({
            id: "export-file-failed",
            defaultMessage: "导出失败",
          }),
          status: StatusType.ERROR,
        };
        case "PENDING":
          return {
            localized: intl.formatMessage({
              id: "export-file-pending",
              defaultMessage: "导出处理中",
            }),
            status: StatusType.ERROR,
          };
        case "FAILED":
          return {
            localized: intl.formatMessage({
              id: "export-file-deleted",
              defaultMessage: "已删除",
            }),
            status: StatusType.ERROR,
          };
    }
    return {
      localized: status,
      status: StatusType.ERROR,
    };
  };