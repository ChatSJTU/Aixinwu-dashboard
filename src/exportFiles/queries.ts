import { gql } from "@apollo/client";

export const exportFileList = gql`
  query ListExports(
    $after: String, 
    $before: String, 
    $first: Int, 
    $last: Int, 
    $filter: ExportFileFilterInput, 
    $sort: ExportFileSortingInput
  ) {
    exportFiles(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        cursor
        node {
          id
          message
          status
          url
          updatedAt
          createdAt
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
