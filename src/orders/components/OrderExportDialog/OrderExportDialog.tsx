// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import {
  ConfirmButton,
  ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import makeCreatorSteps, { Step } from "@dashboard/components/CreatorSteps";
import { MultiAutocompleteChoiceType } from "@dashboard/components/MultiAutocompleteSelectField";
import {
  ChannelFragment,
  ExportErrorFragment,
  ExportOrdersInput,
  OrderFilterInput,
  SearchAttributesQuery,
  WarehouseFragment,
} from "@dashboard/graphql";
import useForm, { FormChange } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useWizard from "@dashboard/hooks/useWizard";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import getExportErrorMessage from "@dashboard/utils/errors/export";
import { toggle } from "@dashboard/utils/lists";
import { mapNodeToChoice } from "@dashboard/utils/maps";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ExportDialogSettings, {
  ExportItemsQuantity,
} from "./ExportDialogSettings";
import { OrderExportDialogMessages as messages } from "./messages";
import OrderExportDialogInfo, {
  attributeNamePrefix,
  warehouseNamePrefix,
} from "./OrderExportDialogInfo";
import { exportSettingsInitialFormData } from "./types";

export enum OrderExportStep {
  INFO = 0,
  SETTINGS = 1,
}

function useSteps(): Array<Step<OrderExportStep>> {
  const intl = useIntl();

  return [
    {
      label: intl.formatMessage({
        id: "/68iG8",
        defaultMessage: "Information exported",
        description: "Order export to csv file, header",
      }),
      value: OrderExportStep.INFO,
    },
    {
      label: intl.formatMessage({
        id: "ki7Mr8",
        defaultMessage: "Export Settings",
        description: "Order export to csv file, header",
      }),
      value: OrderExportStep.SETTINGS,
    },
  ];
}

const OrderExportSteps = makeCreatorSteps<OrderExportStep>();

export interface OrderExportDialogProps extends DialogProps {
  // attributes: RelayToFlat<SearchAttributesQuery["search"]>;
  // channels: ChannelFragment[];
  currentFilterVars: OrderFilterInput;
  confirmButtonState: ConfirmButtonTransitionState;
  errors: ExportErrorFragment[];
  orderQuantity: ExportItemsQuantity;
  // selectedOrders: number;
  // warehouses: WarehouseFragment[];
  // onFetch: (query: string) => void;
  onSubmit: (data: ExportOrdersInput) => void;
}

const OrderExportDialog: React.FC<OrderExportDialogProps> = ({
  // attributes,
  // channels,
  currentFilterVars,
  confirmButtonState,
  errors,
  orderQuantity,
  onClose,
  onSubmit,
  open,
  // selectedOrders,
  // warehouses,
  // ...fetchMoreProps
}) => {
  const [step, { next, prev, set: setStep }] = useWizard(
    OrderExportStep.INFO,
    [OrderExportStep.INFO, OrderExportStep.SETTINGS],
  );
  const steps = useSteps();
  const dialogErrors = useModalDialogErrors(errors, open);
  const notFormErrors = dialogErrors.filter(err => !err.field);
  const intl = useIntl();
  // const [selectedAttributes, setSelectedAttributes] = React.useState<
  //   MultiAutocompleteChoiceType[]
  // >([]);
  // const [selectedChannels, setSelectedChannels] = React.useState([]);
  const initialForm: ExportOrdersInput = {
    fields: [],
    filter: currentFilterVars,
    ...exportSettingsInitialFormData,
  };
  const { change, data, reset, submit } = useForm(initialForm, onSubmit);
  useModalDialogOpen(open, {
    onClose: () => {
      reset();
      setStep(OrderExportStep.INFO);
    },
  });

  // const attributeChoices = mapNodeToChoice(attributes);
  // const warehouseChoices = mapNodeToChoice(warehouses);

  // const handleAttributeSelect: FormChange = event => {
  //   const id = event.target.name.substr(attributeNamePrefix.length);

  //   change({
  //     target: {
  //       name: "fields",
  //       value: {
  //         // ...data.fields,
  //         fields: toggle(id, data.fields, (a, b) => a === b),
  //       },
  //     },
  //   });

  //   const choice = attributeChoices.find(choice => choice.value === id);

  //   setSelectedAttributes(
  //     toggle(choice, selectedAttributes, (a, b) => a.value === b.value),
  //   );
  // };

  // const handleChannelSelect = (option: ChannelFragment) => {
  //   change({
  //     target: {
  //       name: "exportInfo",
  //       value: {
  //         ...data.exportInfo,
  //         channels: toggle(
  //           option.id,
  //           data.exportInfo.channels,
  //           (a, b) => a === b,
  //         ),
  //       },
  //     },
  //   });
  //   const choice = channels.find(choice => choice.id === option.id);

  //   setSelectedChannels(
  //     toggle(choice, selectedChannels, (a, b) => a.id === b.id),
  //   );
  // };

  // const handleToggleAllChannels = (
  //   items: ChannelFragment[],
  //   selected: number,
  // ) => {
  //   setSelectedChannels(selected === items.length ? [] : channels);

  //   change({
  //     target: {
  //       name: "exportInfo",
  //       value: {
  //         ...data.exportInfo,
  //         channels:
  //           selected === items.length
  //             ? []
  //             : channels.map(channel => channel.id),
  //       },
  //     },
  //   });
  // };

  // const handleWarehouseSelect: FormChange = event =>
  //   change({
  //     target: {
  //       name: "exportInfo",
  //       value: {
  //         ...data.exportInfo,
  //         warehouses: toggle(
  //           event.target.name.substr(warehouseNamePrefix.length),
  //           data.exportInfo.warehouses,
  //           (a, b) => a === b,
  //         ),
  //       },
  //     },
  //   });

  // const handleToggleAllWarehouses: FormChange = () =>
  //   change({
  //     target: {
  //       name: "exportInfo",
  //       value: {
  //         ...data.exportInfo,
  //         warehouses:
  //           data.exportInfo.warehouses.length === warehouses.length
  //             ? []
  //             : warehouses.map(warehouse => warehouse.id),
  //       },
  //     },
  //   });

  const exportScopeLabels = {
    allItems: intl.formatMessage(
      {
        id: "order-export-setting-all",
        defaultMessage: "所有订单 ({number})",
        description: "export all items to csv file",
      },
      {
        number: orderQuantity.all || "...",
      },
    ),
    selectedItems: intl.formatMessage(
      {
        id: "order-export-setting-selected",
        defaultMessage: "选中的订单 ({number})",
        description: "export selected items to csv file",
      },
      {
        number: 0,
      },
    ),
  };

  return (
    <Dialog onClose={onClose} open={open} maxWidth="sm" fullWidth>
      <>
        <DialogTitle disableTypography>
          <FormattedMessage {...messages.title} />
        </DialogTitle>
        <DialogContent>
          <OrderExportSteps
            currentStep={step}
            steps={steps}
            onStepClick={setStep}
          />
          {step === OrderExportStep.INFO && (
            <OrderExportDialogInfo
              // attributes={attributeChoices}
              // channels={channels}
              data={data}
              // selectedChannels={selectedChannels}
              // selectedAttributes={selectedAttributes}
              // onAttrtibuteSelect={handleAttributeSelect}
              // onWarehouseSelect={handleWarehouseSelect}
              onChange={change}
              // warehouses={warehouseChoices}
              // onChannelSelect={handleChannelSelect}
              // onSelectAllChannels={handleToggleAllChannels}
              // onSelectAllWarehouses={handleToggleAllWarehouses}
              // {...fetchMoreProps}
            />
          )}
          {step === OrderExportStep.SETTINGS && (
            <ExportDialogSettings
              data={data}
              errors={dialogErrors}
              onChange={change}
              itemsQuantity={orderQuantity}
              selectedItems={0}
              exportScopeLabels={exportScopeLabels}
            />
          )}
        </DialogContent>

        {notFormErrors.length > 0 && (
          <DialogContent>
            {notFormErrors.map(err => (
              <Typography color="error" key={err.field + err.code}>
                {getExportErrorMessage(err, intl)}
              </Typography>
            ))}
          </DialogContent>
        )}

        <DialogActions>
          {step === OrderExportStep.INFO && (
            <Button
              variant="secondary"
              color="text"
              onClick={onClose}
              data-test-id="cancel"
            >
              <FormattedMessage {...buttonMessages.cancel} />
            </Button>
          )}
          {step === OrderExportStep.SETTINGS && (
            <Button
              variant="secondary"
              color="text"
              onClick={prev}
              data-test-id="back"
            >
              <FormattedMessage {...buttonMessages.back} />
            </Button>
          )}
          {step === OrderExportStep.INFO && (
            <Button variant="primary" onClick={next} data-test-id="next">
              <FormattedMessage {...buttonMessages.nextStep} />
            </Button>
          )}
          {step === OrderExportStep.SETTINGS && (
            <ConfirmButton
              transitionState={confirmButtonState}
              type="submit"
              data-test-id="submit"
              onClick={submit}
            >
              <FormattedMessage {...messages.confirmButtonLabel} />
            </ConfirmButton>
          )}
        </DialogActions>
      </>
    </Dialog>
  );
};

OrderExportDialog.displayName = "OrderExportDialog";
export default OrderExportDialog;
