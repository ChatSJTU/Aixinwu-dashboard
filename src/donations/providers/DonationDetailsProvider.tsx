// @ts-strict-ignore
import {
  DonationDetailQuery,
  useDonationDetailQuery,
} from "@dashboard/graphql";
import React, { createContext } from "react";

export interface DonationDetailsProviderProps {
  id: string;
}

interface DonationDetailsConsumerProps {
  donation: DonationDetailQuery | null;
  loading: boolean | null;
}

export const DonationDetailsContext =
  createContext<DonationDetailsConsumerProps>(null);

export const DonationDetailsProvider: React.FC<
  DonationDetailsProviderProps
> = ({ children, id }) => {
  
  const { data, loading } = useDonationDetailQuery({
    displayLoader: true,
    variables: {
      id,
    },
  });

  const providerValues: DonationDetailsConsumerProps = {
    donation: data,
    loading,
  };

  return (
    <DonationDetailsContext.Provider value={providerValues}>
      {children}
    </DonationDetailsContext.Provider>
  );
};
