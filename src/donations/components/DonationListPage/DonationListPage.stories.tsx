// @ts-strict-ignore
import {
  filterPageProps,
  filterPresetsProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import { MockedUserProvider } from "../../../../.storybook/helpers";
import { DonationListUrlSortField } from "../../urls";
import DonationListPageComponent, {
  DonationListPageProps,
} from "./DonationListPage";

const props: DonationListPageProps = {
  ...filterPageProps,
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPresetsProps,
  customers: [],
  selectedDonationIds: ["123"],
  filterOpts: {
    joined: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
    numberOfOrders: {
      active: false,
      value: {
        max: undefined,
        min: undefined,
      },
    },
  },
  sort: {
    ...sortPageProps.sort,
    sort: DonationListUrlSortField.created,
  },
  loading: false,
  hasPresetsChanged: () => false,
  onSelectDonationIds: () => undefined,
  onDonationsBulkAction: () => undefined,
};

const DonationListPage = (props: DonationListPageProps) => (
  <MockedUserProvider>
    <DonationListPageComponent {...props} />
  </MockedUserProvider>
);

const meta: Meta<typeof DonationListPage> = {
  title: "Donations / Donation list",
  decorators: [PaginatorContextDecorator],
  component: DonationListPage,
};
export default meta;
type Story = StoryObj<typeof DonationListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const Loading: Story = {
  args: {
    ...props,
    customers: undefined,
    disabled: true,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoData: Story = {
  args: {
    ...props,
    customers: [],
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
