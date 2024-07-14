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

export const carouselUpload = gql`
  mutation SingleFileUpload($file: Upload!) {
    fileUpload(file: $file) {
      uploadedFile {
        url
        contentType
      }
      errors {
        code
        field
        message
      }
    }
  }
`;