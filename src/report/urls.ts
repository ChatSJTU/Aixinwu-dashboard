import urlJoin from "url-join";

export const reportSection = "/reports/";
export const reportManagePath = reportSection;
export const reportManageUrl = (params?) =>
  reportManagePath;

export const reportOrderPath = urlJoin(reportSection, "order");
export const reportOrderUrl = reportOrderPath;

export const reportUserPath = urlJoin(reportSection, "user");
export const reportUserUrl = reportUserPath;

export const reportDonationPath = urlJoin(reportSection, "donation");
export const reportDonationUrl = reportDonationPath;