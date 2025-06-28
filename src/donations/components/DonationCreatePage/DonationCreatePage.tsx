// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { donationListUrl } from "@dashboard/donations/urls";
import {
  AccountErrorFragment,
  useBarcodeCreateNextMutation,
  useListCertificatesQuery,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { extractMutationErrors } from "@dashboard/misc";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import DonationCreateDetails from "../DonationCreateDetails";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export interface DonationCreatePageFormData {
  barcode: string,
  description: string,
  donator: string,
  name: string,
  price: number,
  quantity: number,
  title: string,
  certificate: string,
}
export interface DonationCreatePageSubmitData
  extends DonationCreatePageFormData {
}

export interface DonationCreatePageProps {
  disabled: boolean;
  errors: AccountErrorFragment[];
  saveButtonBar: ConfirmButtonTransitionState;
  onSubmit: (data: DonationCreatePageSubmitData) => SubmitPromise;
}

const DonationCreatePage: React.FC<DonationCreatePageProps> = ({
  disabled,
  errors: apiErrors,
  saveButtonBar,
  onSubmit,
}: DonationCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  const [initialForm, setInitialForm] = useState<DonationCreatePageFormData>({
    barcode: "",
    description: "",
    donator: "",
    name: "",
    price: 0,
    quantity: 0,
    title: "",
    certificate: "",
  });

  const { data: certs, loading} = useListCertificatesQuery({
    variables: {
      first: 100,
    },
  });

  const [nextBarcode, nextBarcodeOpts] = useBarcodeCreateNextMutation({
    onCompleted: resp => {
      if (resp.barcodeBatchCreate.errors.length === 0) {
        var copy = {...initialForm}
        copy.barcode = resp.barcodeBatchCreate.barcodes[0].number.toString();
        setInitialForm(copy);
      }
    },
  });

  useEffect(()=>{
    if (!nextBarcodeOpts.called && !nextBarcodeOpts.loading)
      nextBarcode();
    if (!initialForm.certificate && certs?.certificates?.totalCount) {
      setInitialForm({
        ...initialForm, 
        certificate: 
          mapEdgesToItems(certs.certificates).sort((x,y) => x.number - y.number)[0].id
      });
    }
  }, [nextBarcodeOpts.called, nextBarcodeOpts.loading, initialForm, certs]);

  // const [countryDisplayName, setCountryDisplayName] = React.useState("");
  // const countryChoices = mapCountriesToChoices(countries);
  // const { errors: validationErrors, submit: handleSubmitWithAddress } =
  //   useAddressValidation<DonationCreatePageFormData, void>(formData =>
  //     onSubmit({
  //       address: {
  //         city: formData.city,
  //         cityArea: formData.cityArea,
  //         companyName: formData.companyName,
  //         country: formData.country,
  //         countryArea: formData.countryArea,
  //         firstName: formData.firstName,
  //         lastName: formData.lastName,
  //         phone: formData.phone,
  //         postalCode: formData.postalCode,
  //         streetAddress1: formData.streetAddress1,
  //         streetAddress2: formData.streetAddress2,
  //       },
  //       donationFirstName: formData.donationFirstName,
  //       donationLastName: formData.donationLastName,
  //       email: formData.email,
  //       note: formData.note,
  //     }),
  //   );

  const errors = [...apiErrors];

  const handleSubmit = (
    formData: DonationCreatePageFormData,
  ) => {
    return extractMutationErrors(
      onSubmit(formData),
    );
  };

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={handleSubmit}
      disabled={disabled || nextBarcodeOpts.loading}
    >
      {({ change, set, data, isSaveDisabled, submit }) => {
        return (
          <DetailPageLayout gridTemplateColumns={1}>
            <TopNav
              href={donationListUrl()}
              title={intl.formatMessage({
                id: "donation-create",
                defaultMessage: "新增捐赠",
              })}
            />
            <DetailPageLayout.Content>
              <div>
                <DonationCreateDetails
                  data={data}
                  disabled={disabled}
                  errors={errors}
                  certs={certs?.certificates}
                  onChange={change}
                />
              </div>
              <Savebar
                disabled={isSaveDisabled}
                state={saveButtonBar}
                onSubmit={submit}
                onCancel={() => navigate(donationListUrl())}
              />
            </DetailPageLayout.Content>
          </DetailPageLayout>
        );
      }}
    </Form>
  );
};
DonationCreatePage.displayName = "DonationCreatePage";
export default DonationCreatePage;
