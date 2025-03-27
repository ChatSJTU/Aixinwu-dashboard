import { OrderFieldEnum } from "@dashboard/graphql";
import { defineMessages, useIntl } from "react-intl";

export const OrderExportDialogMessages = defineMessages({
  title: {
    id: "xkjRu5",
    defaultMessage: "Export Information",
    description: "export Orders to csv file, dialog header",
  },
  confirmButtonLabel: {
    id: "order-export-confirm",
    defaultMessage: "导出订单",
    description: "export Orders to csv file, button",
  },
  ordersLabel: {
    id: "dc5KWn",
    defaultMessage: "Orders",
    description: "Orders export type label",
  },
});

function useOrderExportFieldMessages() {
  const intl = useIntl();

  const messages = {
    [OrderFieldEnum.ADDRESS_FIRST_NAME]: intl.formatMessage({
      id: "order-export-field-0",
      defaultMessage: "收货姓名",
      description: "Order field",
    }),
    [OrderFieldEnum.ADDRESS_PHONE]: intl.formatMessage({
      id: "order-export-field-1",
      defaultMessage: "收货电话",
      description: "Order field",
    }),
    [OrderFieldEnum.ADDRESS_STREET_ADDRESS_1]: intl.formatMessage({
      id: "order-export-field-2",
      defaultMessage: "收货地址",
      description: "Order field",
    }),
    [OrderFieldEnum.CHARGE_STATUS]: intl.formatMessage({
      id: "order-export-field-3",
      defaultMessage: "支付状态",
      description: "Order field",
    }),
    [OrderFieldEnum.CREATED_AT]: intl.formatMessage({
      id: "order-export-field-4",
      defaultMessage: "创建时间",
      description: "Order field",
    }),
    [OrderFieldEnum.CUSTOMER_NOTE]: intl.formatMessage({
      id: "order-export-field-5",
      defaultMessage: "用户备注",
      description: "Order field",
    }),
    [OrderFieldEnum.NUMBER]: intl.formatMessage({
      id: "order-export-field-6",
      defaultMessage: "订单号",
      description: "Order field",
    }),
    [OrderFieldEnum.ORDERLINE_PRODUCT_NAME]: intl.formatMessage({
      id: "order-export-field-7",
      defaultMessage: "商品名称",
      description: "Order field",
    }),
    [OrderFieldEnum.ORDERLINE_QUANTITY]: intl.formatMessage({
      id: "order-export-field-8",
      defaultMessage: "商品数量",
      description: "Order field",
    }),
    [OrderFieldEnum.ORDERLINE_TOTAL_PRICE_GROSS_AMOUNT]: intl.formatMessage({
      id: "order-export-field-9",
      defaultMessage: "商品小计",
      description: "Order field",
    }),
    [OrderFieldEnum.STATUS]: intl.formatMessage({
      id: "order-export-field-10",
      defaultMessage: "交付状态",
      description: "Order field",
    }),
    [OrderFieldEnum.TOTAL_GROSS_AMOUNT]: intl.formatMessage({
      id: "order-export-field-11",
      defaultMessage: "订单总价",
      description: "Order field",
    }),
    [OrderFieldEnum.USER_ACCOUNT]: intl.formatMessage({
      id: "order-export-field-12",
      defaultMessage: "用户账号（jAccount）",
      description: "Order field",
    }),
    [OrderFieldEnum.USER_CODE]: intl.formatMessage({
      id: "order-export-field-13",
      defaultMessage: "用户学工号",
      description: "Order field",
    }),
    [OrderFieldEnum.USER_EMAIL]: intl.formatMessage({
      id: "order-export-field-14",
      defaultMessage: "用户邮箱",
      description: "Order field",
    }),
    [OrderFieldEnum.USER_FIRST_NAME]: intl.formatMessage({
      id: "order-export-field-15",
      defaultMessage: "用户姓名",
      description: "Order field",
    }),
    [OrderFieldEnum.USER_TYPE]: intl.formatMessage({
      id: "order-export-field-16",
      defaultMessage: "用户类型",
      description: "Order field",
    }),
  };

  return (field: OrderFieldEnum) => messages[field];
}

export default useOrderExportFieldMessages;
