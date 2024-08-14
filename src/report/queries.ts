import { gql } from "@apollo/client";

export const ReportOrder = gql`
  query orderReports($gte: DateTime!, $lte: DateTime!, $granularity: Granularity!) {
    orderReports(date: {gte: $gte, lte: $lte}, granularity: $granularity) {
        amountTotal
        collectionTotal
        quantitiesTotal
    }
  }
`;

export const ReportUser = gql`
  query customerReports($gte: DateTime!, $lte: DateTime!, $granularity: Granularity!) {
    customerReports(date: {gte: $gte, lte: $lte}, granularity: $granularity)
  }
`;

export const ReportDonation = gql`
  query donationReports($gte: DateTime!, $lte: DateTime!, $granularity: Granularity!) {
    donationReports(date: {gte: $gte, lte: $lte}, granularity: $granularity) {
        amountTotal
        collectionTotal
        quantitiesTotal
    }
  }
`;
