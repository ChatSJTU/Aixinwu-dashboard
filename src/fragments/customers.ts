import { gql } from "@apollo/client";

export const customerFragment = gql`
  fragment Customer on User {
    id
    email
    firstName
    lastName
    note
    balance
    userType
    code
  }
`;

export const customerDetailsFragment = gql`
  fragment CustomerDetails on User {
    ...Customer
    ...Metadata
    dateJoined
    lastLogin
    defaultShippingAddress {
      ...Address
    }
    defaultBillingAddress {
      ...Address
    }
    note
    isActive
    balance
    userType
    code
  }
`;

export const customerAddressesFragment = gql`
  fragment CustomerAddresses on User {
    ...Customer
    addresses {
      ...Address
    }
    defaultBillingAddress {
      id
    }
    defaultShippingAddress {
      id
    }
  }
`;
