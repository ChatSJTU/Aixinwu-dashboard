import Hr from "@dashboard/components/Hr";
import RadioGroupField, {
  RadioGroupFieldChoice,
} from "@dashboard/components/RadioGroupField";
import {
  ExportErrorFragment,
  ExportOrdersInput,
  ExportScope,
  FileTypesEnum,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { getFormErrors } from "@dashboard/utils/errors";
import getExportErrorMessage from "@dashboard/utils/errors/export";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ExportSettingsInput } from "./types";

const useStyles = makeStyles(
  theme => ({
    hr: {
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(3),
    },
  }),
  {
    name: "ExportDialogSettings",
  },
);

export type ExportItemsQuantity = Record<"all" | "filter", number>;

export interface ExportScopeLabels {
  allItems: string;
  selectedItems: string;
}

export interface ExportDialogSettingsProps {
  data: ExportSettingsInput;
  errors: ExportErrorFragment[];
  itemsQuantity: ExportItemsQuantity;
  selectedItems: number;
  exportScopeLabels: ExportScopeLabels;
  onChange: (event: ChangeEvent) => void;
  allowScopeSelection?: boolean;
}

const formFields: Array<keyof ExportSettingsInput> = ["fileType", "scope"];

const ExportDialogSettings: React.FC<ExportDialogSettingsProps> = ({
  data,
  errors,
  onChange,
  selectedItems,
  itemsQuantity,
  exportScopeLabels,
  allowScopeSelection = true,
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const formErrors = getFormErrors(formFields, errors);

  const OrderExportTypeChoices: Array<RadioGroupFieldChoice<FileTypesEnum>> =
    [
      {
        label: intl.formatMessage({
          id: "9Tl/bT",
          defaultMessage: "Spreadsheet for Excel, Numbers etc.",
          description: "export items as spreadsheet",
        }),
        value: FileTypesEnum.XLSX,
      },
      {
        label: intl.formatMessage({
          id: "li1BBk",
          defaultMessage: "Plain CSV file",
          description: "export items as csv file",
        }),
        value: FileTypesEnum.CSV,
      },
    ];

  const exportScopeChoices = [
    {
      label: exportScopeLabels.allItems,
      value: ExportScope.ALL,
    },
    {
      disabled: selectedItems === 0,
      label: exportScopeLabels.selectedItems,
      value: ExportScope.IDS,
    },
    {
      label: intl.formatMessage(
        {
          id: "order-export-setting-search",
          defaultMessage: "当前搜索的订单 ({number})",
        },
        {
          number: itemsQuantity.filter || "...",
        },
      ),
      value: ExportScope.FILTER,
    },
  ];

  return (
    <>
      {allowScopeSelection && (
        <>
          <RadioGroupField
            choices={exportScopeChoices}
            error={!!formErrors.scope}
            hint={getExportErrorMessage(formErrors.scope, intl)}
            label={intl.formatMessage({
              id: "g6yuk2",
              defaultMessage: "Export information for:",
              description: "export items to csv file, choice field label",
            })}
            name={"scope" as keyof ExportOrdersInput}
            onChange={onChange}
            value={data.scope}
          />
          <Hr className={classes.hr} />
        </>
      )}
      <RadioGroupField
        choices={OrderExportTypeChoices}
        error={!!formErrors.fileType}
        hint={getExportErrorMessage(formErrors.fileType, intl)}
        label={intl.formatMessage({
          id: "z1puMb",
          defaultMessage: "Export as:",
          description: "export items as csv or spreadsheet file",
        })}
        name={"fileType" as keyof ExportOrdersInput}
        onChange={onChange}
        value={data.fileType}
      />
    </>
  );
};

export default ExportDialogSettings;
