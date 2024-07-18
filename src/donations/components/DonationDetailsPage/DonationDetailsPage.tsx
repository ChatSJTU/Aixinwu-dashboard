// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Backlink } from "@dashboard/components/Backlink";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import {
  DonationUrlDialog,
  DonationUrlQueryParams,
  donationListUrl,
} from "@dashboard/donations/urls";
import {
  AccountErrorFragment,
  DonationDetailQuery,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import DonationDetails from "../DonationDetails";
import Title from "./Title";
import { OpenModalFunction } from "@dashboard/utils/handlers/dialogActionHandlers";
import { customerUrl } from "@dashboard/customers/urls";

export interface DonationDetailsPageFormData {
  barcode: string;
  description: string;
  status: string;
  title: string;
  price: number;
  donator: {
    firstName: string;
    code: string;
    id: string;
  };
  quantity: number;
  created: string;
}

export interface DonationDetailsPageProps {
  donationId: string;
  donation: DonationDetailQuery["donations"]["edges"][0]["node"];
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onOpenModal: OpenModalFunction<DonationUrlDialog, DonationUrlQueryParams>;
  onSubmit: (
    data: DonationDetailsPageFormData,
  ) => SubmitPromise<AccountErrorFragment[]>;
  onDelete: () => void;
}

const DonationDetailsPage: React.FC<DonationDetailsPageProps> = ({
  donationId,
  donation,
  disabled,
  errors,
  saveButtonBar,
  onSubmit,
  onDelete,
  onOpenModal
}: DonationDetailsPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: DonationDetailsPageFormData = {
    barcode: donation?.barcode || "",
    description: donation?.description || "",
    status: donation?.status || "",
    title: donation?.title || "",
    price: donation?.price.amount || 0,
    donator: donation?.donator || "/",
    quantity: donation?.quantity || 0,
    created: donation?.createdAt || ""
  };

  // const { makeChangeHandler: makeMetadataChangeHandler } =
  //   useMetadataChangeTrigger();

  // const { CUSTOMER_DETAILS_MORE_ACTIONS } = useExtensions(
  //   extensionMountPoints.CUSTOMER_DETAILS,
  // );

  // const extensionMenuItems = mapToMenuItemsForDonationDetails(
  //   CUSTOMER_DETAILS_MORE_ACTIONS,
  //   donationId,
  // );

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ change, data, isSaveDisabled, submit }) => {
        // const changeMetadata = makeMetadataChangeHandler(change);

        return (
          <DetailPageLayout>
            <TopNav
              href={donationListUrl()}
              title={<Title doantion={donation}/>}
            >
              {/* {extensionMenuItems.length > 0 && (
                <CardMenu menuItems={extensionMenuItems} />
              )} */}
            </TopNav>
            <DetailPageLayout.Content>
              <Backlink href={donationListUrl()}>
                {intl.formatMessage({
                  id: "donation-backlink",
                  defaultMessage: "返回",
                })}
              </Backlink>
              <DonationDetails
                donation={donation}
                data={data}
                disabled={disabled}
                errors={errors}
                onOpenModal={onOpenModal}
                onChange={change}
                onProfileView={() => navigate(customerUrl(donation.donator.id))}
              />
              {/* <CardSpacer />
              <DonationInfo
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <RequirePermissions
                requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}
              >
                <DonationOrders
                  orders={mapEdgesToItems(donation?.orders)}
                  viewAllHref={orderListUrl({
                    donation: donation?.email,
                  })}
                />
                <CardSpacer />
              </RequirePermissions> */}
              {/* <Metadata data={data} onChange={changeMetadata} /> */}
            </DetailPageLayout.Content>
            <DetailPageLayout.RightSidebar>
              {/* <DonationAddresses
                donation={donation}
                disabled={disabled}
                manageAddressHref={donationAddressesUrl(donationId)}
              />
              <CardSpacer />
              <DonationStats donation={donation} />
              <CardSpacer />
              <RequirePermissions
                requiredPermissions={[PermissionEnum.MANAGE_GIFT_CARD]}
              >
                <DonationGiftCardsCard />
              </RequirePermissions> */}
              {" "}
            </DetailPageLayout.RightSidebar>
            <Savebar
              disabled={isSaveDisabled}
              state={saveButtonBar}
              onSubmit={submit}
              onCancel={() => navigate(donationListUrl())}
              // onDelete={onDelete}
            />
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
DonationDetailsPage.displayName = "DonationDetailsPage";
export default DonationDetailsPage;
