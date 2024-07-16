import { gql } from "@apollo/client";

export const updateDonation = gql`
  mutation UpdateDonation($id: ID!, $input: DonationUpdateInput!) {
    donationUpdate(id: $id, input: $input) {
      errors {
        code
        field
        message
      }
      donation {
        ...DonationDetails
      }
    }
  }
`;

export const createDonation = gql`
  mutation CreateDonation($input: DonationCreateInput!) {
    donationCreate(input: $input) {
      errors {
        code
        field
        message
      }
      donation {
        ...DonationDetails
      }
    }
  }
`;

export const removeCustomer = gql`
  mutation RemoveCustomer($id: ID!) {
    customerDelete(id: $id) {
      errors {
        ...AccountError
      }
    }
  }
`;

export const setCustomerDefaultAddress = gql`
  mutation SetCustomerDefaultAddress(
    $addressId: ID!
    $userId: ID!
    $type: AddressTypeEnum!
  ) {
    addressSetDefault(addressId: $addressId, userId: $userId, type: $type) {
      errors {
        ...AccountError
      }
      user {
        ...CustomerAddresses
      }
    }
  }
`;

export const createCustomerAddress = gql`
  mutation CreateCustomerAddress($id: ID!, $input: AddressInput!) {
    addressCreate(userId: $id, input: $input) {
      errors {
        ...AccountError
      }
      address {
        ...Address
      }
      user {
        ...CustomerAddresses
      }
    }
  }
`;

export const updateCustomerAddress = gql`
  mutation UpdateCustomerAddress($id: ID!, $input: AddressInput!) {
    addressUpdate(id: $id, input: $input) {
      errors {
        ...AccountError
      }
      address {
        ...Address
      }
    }
  }
`;

export const removeCustomerAddress = gql`
  mutation RemoveCustomerAddress($id: ID!) {
    addressDelete(id: $id) {
      errors {
        ...AccountError
      }
      user {
        ...CustomerAddresses
      }
    }
  }
`;

export const bulkRemoveCustomers = gql`
  mutation BulkRemoveCustomers($ids: [ID!]!) {
    customerBulkDelete(ids: $ids) {
      errors {
        ...AccountError
      }
    }
  }
`;
