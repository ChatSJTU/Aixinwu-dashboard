import { gql } from "@apollo/client";

export const donationDetailsFragment = gql`
  fragment DonationDetails on Donation {
    id
    barcode
    createdAt
    description
    quantity
    status
    title
    updatedAt
    price {
      amount
      currency
    }
    donator {
      id
      account
      firstName
      code
    }
  }
`;