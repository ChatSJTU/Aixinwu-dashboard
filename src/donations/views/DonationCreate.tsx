// @ts-strict-ignore
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useCreateDonationMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import { extractMutationErrors, maybe } from "../../misc";
import DonationCreatePage, {
  DonationCreatePageSubmitData,
} from "../components/DonationCreatePage";
import { donationUrl } from "../urls";
import { isNineDigitNumber } from "@dashboard/barcodes/utils";

export const DonationCreate: React.FC = () => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const [createDonation, createDonationOpts] = useCreateDonationMutation({
    onCompleted: data => {
      if (data.donationCreate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "donation-created",
            defaultMessage: "捐赠已创建",
          }),
        });
        navigate(donationUrl(data.donationCreate.donation.id));
      }
    },
  });

  const handleSubmit = (formData: DonationCreatePageSubmitData) => {
    if (!isNineDigitNumber(formData.barcode)) {
      notify({
        status: "warning",
        text: intl.formatMessage({
          id: "barcode-codeformat",
          defaultMessage: "条码必须是9位数字（前4位年份月份，后5位序号）",
        }),
      })
      return;
    }
    // if (getCurrentYearMonth() != data.barcode.substring(0,4)) {
    //   setTmpData(data);
    //   setIsBarcodeFormatDialogOpen(true);
    //   return [];
    // }
    return extractMutationErrors(
      createDonation({
        variables: {
          input: {
            barcode: formData.barcode,
            description: formData.description,
            donator: formData.donator,
            name: formData.name,
            price: {
              amount: formData.price,
              currency: "AXB",
            },
            quantity: formData.quantity,
            title: formData.title,
          },
        },
      }),
    );
  }
  
  return (
    <>
      <WindowTitle
        title={intl.formatMessage({
          id: "donation-create",
          defaultMessage: "新增捐赠",
        })}
      />
      <DonationCreatePage
        disabled={createDonationOpts.loading}
        errors={createDonationOpts.data?.donationCreate.errors || []}
        saveButtonBar={createDonationOpts.status}
        onSubmit={handleSubmit}
      />
    </>
  );
};
export default DonationCreate;
