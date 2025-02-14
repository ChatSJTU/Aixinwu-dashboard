import { gql } from "@apollo/client";

export const productVariantEventsList = gql`
  query ListProductVariantEvents(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: ProductVariantEventFilterInput
    $sort: ProductVariantEventSortingInput
  ) {
    productVariantEvents(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      totalCount
      edges {
        node {
          date
          id
          message
          productVariantName
          stockChanged
          type
          user {
            id
            firstName
            account
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
