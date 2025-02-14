import { gql } from "@apollo/client";

export const productEventsList = gql`
  query ListProductEvents(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: ProductEventFilterInput
    $sort: ProductEventSortingInput
  ) {
    productEvents(
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
          productName
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
