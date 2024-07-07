import { SiteSettingsQuery } from "@dashboard/graphql";

export const shop: SiteSettingsQuery["shop"] = {
  __typename: "Shop",
  companyAddress: {
    __typename: "Address",
    city: "上海市",
    cityArea: "闵行区",
    companyName: "爱心屋",
    country: {
      __typename: "CountryDisplay",
      code: "CN",
      country: "中国",
    },
    countryArea: "",
    firstName: "",
    id: "1",
    lastName: "",
    phone: "+86 021-54745672",
    postalCode: "200240",
    streetAddress1: "东川路800号",
    streetAddress2: "",
  },
  countries: [
    {
      __typename: "CountryDisplay",
      code: "CN",
      country: "中国",
    },
  ],
  customerSetPasswordUrl: "https://example.com/reset-password",
  defaultMailSenderAddress: "noreply@example.com",
  defaultMailSenderName: "Saleor",
  description: "Lorem ipsum dolor sit amet",
  domain: {
    __typename: "Domain",
    host: "localhost:8000",
  },
  name: "爱心屋管理面板",
  reserveStockDurationAnonymousUser: 10,
  reserveStockDurationAuthenticatedUser: 10,
  limitQuantityPerCheckout: 50,
  enableAccountConfirmationByEmail: false,
};
