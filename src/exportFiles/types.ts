import { ListExportsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

export type ExportLogs = RelayToFlat<
  NonNullable<ListExportsQuery["exportFiles"]>
>;
export type ExportLog = ExportLogs[number];
