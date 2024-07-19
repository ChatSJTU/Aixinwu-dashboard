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
          ...DonationDetails
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
  query DonationDetail($id: ID!) {
    donation(id: $id) {
      ...DonationDetails
    }
  }
`;
