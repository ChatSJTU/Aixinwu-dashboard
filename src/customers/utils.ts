import { StatusType } from "@dashboard/types";
import { IntlShape } from "react-intl";

export const transformUserType = (
    userType: string,
    intl: IntlShape,
  ): { localized: string; status: StatusType } => {
    switch (userType) {
      case "faculty":
        return {
          localized: "教职工",
          status: StatusType.INFO,
        };
      case "student":
        return {
          localized: "学生",
          status: StatusType.INFO,
        };
      case "yxy":
        return {
          localized: "医学院教职工",
          status: StatusType.INFO,
        };
      case "faculty":
        return {
          localized: "教职工",
          status: StatusType.INFO,
        };
      case "fs":
        return {
          localized: "附属单位职工",
          status: StatusType.INFO,
        };
      case "vip":
        return {
          localized: "VIP",
          status: StatusType.INFO,
        };
      case "postphd":
        return {
          localized: "博士后",
          status: StatusType.INFO,
        };
      case "external_teacher":
        return {
          localized: "外聘教师",
          status: StatusType.INFO,
        };
      case "summer":
        return {
          localized: "暑期生",
          status: StatusType.INFO,
        };
      case "alumni":
        return {
          localized: "校友",
          status: StatusType.INFO,
        };
      case "green":
        return {
          localized: "绿色通道",
          status: StatusType.INFO,
        };
      case "outside":
        return {
          localized: "合作交流",
          status: StatusType.INFO,
        };
      case "fszxjs":
        return {
          localized: "附属中学教师",
          status: StatusType.INFO,
        };
      case "freshman":
        return {
          localized: "新生",
          status: StatusType.INFO,
        };
      case "team":
        return {
          localized: "集体账号",
          status: StatusType.INFO,
        };
      case "":
        return {
          localized: "无身份信息",
          status: StatusType.INFO,
        };
    }
    return {
      localized: userType,
      status: StatusType.INFO,
    };
  };