import { gql } from "@apollo/client";

export const donationList = gql`
  query ListDonations(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: DonationFilterInput
    $sort: DonationSortingInput
  ) {
    donations(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
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
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const donationDetails = gql`
  query DonationDetail {
    donations(
      first: 1
    ) {
      edges {
        node {
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
      }
    }
  }
`;

// export const donationAddresses = gql`
//   query CustomerAddresses($id: ID!) {
//     user(id: $id) {
//       ...CustomerAddresses
//     }
//   }
// `;

// export const donationCreateData = gql`
//   query CustomerCreateData {
//     shop {
//       countries {
//         code
//         country
//       }
//     }
//   }
// `;
