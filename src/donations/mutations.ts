import { gql } from "@apollo/client";

export const updateDonation = gql`
  mutation UpdateDonation($id: ID!, $input: DonationUpdateInput!) {
    donationUpdate(id: $id, input: $input) {
      errors {
        code
        field
        message
      }
      donation {
        ...DonationDetails
      }
    }
  }
`;

export const createDonation = gql`
  mutation CreateDonation($input: DonationCreateInput!) {
    donationCreate(input: $input) {
      errors {
        code
        field
        message
      }
      donation {
        ...DonationDetails
      }
    }
  }
`;

export const completeDonation = gql`
  mutation CompleteDonation($id: ID!, $accepted: Boolean!) {
    donationComplete(id: $id, input: {accepted: $accepted}) {
      donation {
        ...DonationDetails
      }
      errors {
        code
        field
        message
      }
    }
  }
`;

export const bulkCompleteDonations = gql`
  mutation BulkCompleteDonations($ids: [ID!]!, $accepted: Boolean!) {
    donationBulkComplete(accepted: $accepted, ids: $ids) {
      count
      errors {
        code
        message
        path
      }
    }
  }
`;

export const barcodeCreateNext = gql`
  mutation BarcodeCreateNext {
    barcodeBatchCreate(count: 1) {
      errors {
        code
        message
        field
      }
      barcodes {
        createdAt
        id
        number
        used
      }
    }
  }
`;