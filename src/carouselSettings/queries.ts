import { gql } from "@apollo/client";

export const carouselUrls = gql`
  query CarouselUrls {
    carousel {
        urls
    }
  }
`;