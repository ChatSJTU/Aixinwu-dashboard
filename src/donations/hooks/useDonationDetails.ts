import { DonationDetailsContext } from "@dashboard/donations/providers/DonationDetailsProvider";
import { useContext } from "react";

export const useDonationDetails = () => {
  const donationDetails = useContext(DonationDetailsContext);

  return donationDetails;
};
