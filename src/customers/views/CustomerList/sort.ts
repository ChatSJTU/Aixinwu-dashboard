// @ts-strict-ignore
import { CustomerListUrlSortField } from "@dashboard/customers/urls";
import { UserSortField } from "@dashboard/graphql";
import { createGetSortQueryVariables } from "@dashboard/utils/sort";

export function getSortQueryField(
  sort: CustomerListUrlSortField,
): UserSortField {
  switch (sort) {
    case CustomerListUrlSortField.email:
      return UserSortField.EMAIL;
    case CustomerListUrlSortField.name:
      return UserSortField.LAST_NAME;
    case CustomerListUrlSortField.orders:
      return UserSortField.ORDER_COUNT;
    case CustomerListUrlSortField.date_joined:
      return UserSortField.CREATED_AT;
    case CustomerListUrlSortField.last_login:
      return UserSortField.LAST_LOGIN;
    default:
      return undefined;
  }
}

export const getSortQueryVariables =
  createGetSortQueryVariables(getSortQueryField);
