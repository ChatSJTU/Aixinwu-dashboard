// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import {
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
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import DonationDetailsPage, {
  DonationDetailsPageFormData,
} from "../components/DonationDetailsPage";
import { useDonationDetails } from "../hooks/useDonationDetails";
import { DonationDetailsProvider } from "../providers/DonationDetailsProvider";
import { donationListUrl, donationUrl, DonationUrlQueryParams } from "../urls";

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
  const donation = donationDetails?.donation?.donations.edges[0].node;
  const donationDetailsLoading = donationDetails?.loading;

  // const [removeDonation, removeDonationOpts] = useRemoveDonationMutation({
  //   onCompleted: data => {
  //     if (data.donationDelete.errors.length === 0) {
  //       notify({
  //         status: "success",
  //         text: intl.formatMessage({
  //           id: "PXatmC",
  //           defaultMessage: "Donation Removed",
  //         }),
  //       });
  //       navigate(donationListUrl());
  //     }
  //   },
  // });

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

  const updateData = async (data: DonationDetailsPageFormData) => null;
    // extractMutationErrors(
    //   updateDonation({
    //     variables: {
    //       id,
    //       input: {
    //         email: data.email,
    //         firstName: data.firstName,
    //         isActive: data.isActive,
    //         lastName: data.lastName,
    //         note: data.note,
    //         balance: data.balance,
    //       },
    //     },
    //   }),
    // );

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
        onSubmit={handleSubmit}
        onDelete={() => {}
          // navigate(
          //   donationUrl(id, {
          //     action: "remove",
          //   }),
          // )
        }
      />
      {/* <ActionDialog
        confirmButtonState={removeDonationOpts.status}
        onClose={() => navigate(donationUrl(id), { replace: true })}
        onConfirm={() =>
          removeDonation({
            variables: {
              id,
            },
          })
        }
        title={intl.formatMessage({
          id: "ey0lZj",
          defaultMessage: "Delete Donation",
          description: "dialog header",
        })}
        variant="delete"
        open={params.action === "remove"}
      >
        <DialogContentText>
          <FormattedMessage
            id="2p0tZx"
            defaultMessage="Are you sure you want to delete {email}?"
            description="delete donation, dialog content"
            values={{
              email: <strong>{getStringOrPlaceholder(donation?.email)}</strong>,
            }}
          />
        </DialogContentText>
      </ActionDialog> */}
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
