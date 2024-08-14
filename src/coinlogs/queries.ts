import { gql } from "@apollo/client";

export const coinlogList = gql`
  query ListCoinlogs(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: BalanceEventFilterInput
    $sort: BalanceEventSortingInput
  ) {
    balanceEvents(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          account
          balance
          delta
          code
          type
          number
          name
          id
          date
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
