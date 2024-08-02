// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
  useCompleteDonationMutation,
  useUpdateDonationMutation,
  useUpdateMetadataMutation,
  useUpdatePrivateMetadataMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import createMetadataUpdateHandler from "@dashboard/utils/handlers/metadataUpdateHandler";
import { DialogContentText } from "@material-ui/core";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import DonationDetailsPage, {
  DonationDetailsPageFormData,
} from "../components/DonationDetailsPage";
import { useDonationDetails } from "../hooks/useDonationDetails";
import { DonationDetailsProvider } from "../providers/DonationDetailsProvider";
import { donationListUrl, donationUrl, DonationUrlDialog, DonationUrlQueryParams } from "../urls";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";

interface DonationDetailsViewProps {
  id: string;
  params: DonationUrlQueryParams;
}

const DonationDetailsViewInner: React.FC<DonationDetailsViewProps> = ({
  id,
  params,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const donationDetails = useDonationDetails();
  const donation = donationDetails?.donation?.donation;
  const donationDetailsLoading = donationDetails?.loading;

  const [openModal, closeModal] = createDialogActionHandlers<
    DonationUrlDialog,
    DonationUrlQueryParams
  >(navigate, params => donationUrl(id, params), params, ["action"]);

  const [completeDonation, completeDonationOpts] = useCompleteDonationMutation({
    onCompleted: data => {
      if (data.donationComplete.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "donation-complete-notify",
            defaultMessage: "操作成功",
          }),
        });
        navigate(donationListUrl());
      }
    },
  });

  const [updateDonation, updateDonationOpts] = useUpdateDonationMutation({
    onCompleted: data => {
      if (data.donationUpdate.errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
      }
    },
  });

  const [updateMetadata] = useUpdateMetadataMutation({});
  const [updatePrivateMetadata] = useUpdatePrivateMetadataMutation({});

  if (donation === null) {
    return <NotFoundPage backHref={donationListUrl()} />;
  }

  const updateData = async (data: DonationDetailsPageFormData) => 
    extractMutationErrors(
      updateDonation({
        variables: {
          id,
          input: {
            title: data.title,
            description: data.description,
            barcode: data.barcode,
            price: {
              amount: data.price,
              currency: "AXB"
            },
            quantity: data.quantity
          },
        },
      }),
    );

  // const handleSubmit = createMetadataUpdateHandler(
  //   donation,
  //   updateData,
  //   variables => updateMetadata({ variables }),
  //   variables => updatePrivateMetadata({ variables }),
  // );
  const handleSubmit = updateData;

  return (
    <>
      <WindowTitle title={donation?.title} />
      <DonationDetailsPage
        donationId={id}
        donation={donation}
        disabled={
          donationDetailsLoading ||
          updateDonationOpts.loading
        }
        errors={updateDonationOpts.data?.donationUpdate.errors || []}
        saveButtonBar={updateDonationOpts.status}
        onOpenModal={openModal}
        onSubmit={handleSubmit}
        onDelete={() => {}
          // navigate(
          //   donationUrl(id, {
          //     action: "remove",
          //   }),
          // )
        }
      />
      <ActionDialog
        confirmButtonState={completeDonationOpts.status}
        onClose={() => navigate(donationUrl(id), { replace: true })}
        onConfirm={() =>
          completeDonation({
            variables: {
              id: id,
              accepted: true
            },
          })
        }
        title={intl.formatMessage({
          id: "donation-complete-action",
          defaultMessage: "捐赠操作",
        })}
        variant="default"
        open={params.action === "accept"}
      >
        <DialogContentText>
          <FormattedMessage
            id="donation-complete-accept"
            defaultMessage="确认接受该捐赠？"
          />
        </DialogContentText>
      </ActionDialog>
      <ActionDialog
        confirmButtonState={completeDonationOpts.status}
        onClose={() => navigate(donationUrl(id), { replace: true })}
        onConfirm={() =>
          completeDonation({
            variables: {
              id: id,
              accepted: false
            },
          })
        }
        title={intl.formatMessage({
          id: "donation-complete-action",
          defaultMessage: "捐赠操作",
        })}
        variant="default"
        open={params.action === "reject"}
      >
        <DialogContentText>
          <FormattedMessage
            id="donation-complete-reject"
            defaultMessage="确认拒绝该捐赠？"
          />
        </DialogContentText>
      </ActionDialog>
    </>
  );
};

export const DonationDetailsView: React.FC<DonationDetailsViewProps> = ({
  id,
  params,
}) => (
  <DonationDetailsProvider id={id}>
    <DonationDetailsViewInner id={id} params={params} />
  </DonationDetailsProvider>
);
export default DonationDetailsView;
