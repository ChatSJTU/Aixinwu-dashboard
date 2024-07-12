import { gql } from "@apollo/client";

export const carouselUpdate = gql`
  mutation CarouselUpdate($urls: [String!]!) {
    carouselSettingsUpdate(input: {urls: $urls}) {
      carousel {
        urls
      }
      errors {
        code
        field
        message
      }
    }
  }
`;