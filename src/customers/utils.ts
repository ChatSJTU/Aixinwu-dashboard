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

export interface UserPosition {
  id: string;
  name: string;
}

export const userPositions: UserPosition[] = [
  {"id": "BuiltInFaculty", "name": "教职员工"},
  {"id": "BuiltInService", "name": "在职教职工"},
  {"id": "BuiltInRetired", "name": "离退休教职工"},
  {"id": "BuiltInPostphd", "name": "博士后"},
  {"id": "BuiltInResigned", "name": "离职教职工"},
  {"id": "BuiltInStudent", "name": "学生"},
  {"id": "BuiltInStudentUndergraduate", "name": "本科生"},
  {"id": "BuiltInStudentMaster", "name": "硕士生"},
  {"id": "BuiltInStudentDoctor", "name": "博士生"},
  {"id": "BuiltInStudentInternational", "name": "留学生"},
  {"id": "BuiltInStudentSchoolRoll", "name": "学生(学籍)"},
  {"id": "BuiltInStudentUndergraduateSchoolRoll", "name": "本科生(学籍)"},
  {"id": "BuiltInStudentUndergraduateGraduate", "name": "本科毕业生"},
  {"id": "BuiltInStudentUndergraduateComplete", "name": "本科结业生"},
  {"id": "BuiltInStudentMasterGraduate", "name": "硕士毕业生"},
  {"id": "BuiltInStudentDoctorGraduate", "name": "博士毕业生"},
  {"id": "BuiltInStudentMasterComplete", "name": "硕士结业生"},
  {"id": "BuiltInStudentDoctorComplete", "name": "博士结业生"},
  {"id": "BuiltInFreshman", "name": "本科新生(中国)"},
  {"id": "BuiltInFreshmanMaster", "name": "硕士新生(中国)"},
  {"id": "BuiltInFreshmanDoctor", "name": "博士新生(中国)"},
  {"id": "BuiltInFreshmanInternational", "name": "本科新生(留学生)"},
  {"id": "BuiltInFreshmanMasterInternational", "name": "硕士新生(留学生)"},
  {"id": "BuiltInFreshmanDoctorInternational", "name": "博士新生(留学生)"},
  {"id": "BuiltInFreshmanNonDegreeInternational", "name": "非学位新生(留学生)"},
  {"id": "BuiltInExternal", "name": "外聘教师"},
  {"id": "BuiltInOutside", "name": "校外人员"},
  {"id": "BuiltInTeam", "name": "集体账号"},
  {"id": "BuiltInAffiliated", "name": "附属单位职工"},
  {"id": "BuiltInAffiliatedSchool", "name": "附属中学职工"},
  {"id": "BuiltInAlumni", "name": "校友"},
]

export const transformUserPosition = (
  positionCode: string
): string => {
  return userPositions.find(x=>x.id == positionCode)?.name ?? "未知";
}

export const ParseUserPositions = (
  positions: string
): UserPosition[] => {
  var arr = positions.split(",");
  var res: UserPosition[] = [];
  arr.forEach(x=>{
    var p = userPositions.find(y=>y.id == x.trim());
    if (p) res.push(p);
  })
  return res;
}