import { StatusType } from "@dashboard/types";
import { IntlShape } from "react-intl";
import { CustomerListUrlSortField } from "./urls";

export function canBeSorted(sort: string) {
  switch (sort) {
    case CustomerListUrlSortField.date_joined:
    case CustomerListUrlSortField.email:
    case CustomerListUrlSortField.last_login:
    case CustomerListUrlSortField.name:
    case CustomerListUrlSortField.orders:
      return true;
    default:
      return false;
  }
}

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
      case "fsyyjzg":
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
      case "team":
        return {
          localized: "集体账号",
          status: StatusType.INFO,
        };
      case "schoolFellow":
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
  {"id": "BuiltInAffiliated", "name": "附属单位职工"},
  {"id": "BuiltInAffiliatedSchool", "name": "附属中学职工"},
  {"id": "BuiltInAlumni", "name": "校友"},
  {"id": "BuiltInAnonymous", "name": "匿名用户"},
  {"id": "BuiltInCpcBranchAdmin", "name": "二级党组织管理员"},
  {"id": "BuiltInCpcBranchDeputySecretary", "name": "基层党支部副书记"},
  {"id": "BuiltInCpcBranchSecretary", "name": "基层党支部书记"},
  {"id": "BuiltInCpcCommittee", "name": "二级党组织及基层党支部委员"},
  {"id": "BuiltInCpcDeputySecretary", "name": "二级党组织及基层党支部副书记"},
  {"id": "BuiltInCpcMember", "name": "中共党员"},
  {"id": "BuiltInCpcSecretary", "name": "二级党组织及基层党支部书记"},
  {"id": "BuiltInCpcTeamLeader", "name": "党小组长"},
  {"id": "BuiltInExternal", "name": "外聘教师"},
  {"id": "BuiltInFaculty", "name": "教职员工"},
  {"id": "BuiltInFreshman", "name": "本科新生(中国)"},
  {"id": "BuiltInFreshmanDoctor", "name": "博士新生(中国)"},
  {"id": "BuiltInFreshmanDoctorInternational", "name": "博士新生(留学生)"},
  {"id": "BuiltInFreshmanInternational", "name": "本科新生(留学生)"},
  {"id": "BuiltInFreshmanMaster", "name": "硕士新生(中国)"},
  {"id": "BuiltInFreshmanMasterInternational", "name": "硕士新生(留学生)"},
  {"id": "BuiltInFreshmanNonDegreeInternational", "name": "非学位新生(留学生)"},
  {"id": "BuiltInLeader", "name": "领导干部岗"},
  {"id": "BuiltInNewStudent", "name": "尚未分配学号的新生"},
  {"id": "BuiltInOutside", "name": "校外人员"},
  {"id": "BuiltInPostphd", "name": "博士后"},
  {"id": "BuiltInResigned", "name": "离职教职工"},
  {"id": "BuiltInRetired", "name": "离退休"},
  {"id": "BuiltInService", "name": "在职教职工"},
  {"id": "BuiltInStudent", "name": "学生"},
  {"id": "BuiltInStudentDoctor", "name": "博士生"},
  {"id": "BuiltInStudentDoctorComplete", "name": "博士结业生"},
  {"id": "BuiltInStudentDoctorGraduate", "name": "博士毕业生"},
  {"id": "BuiltInStudentInternational", "name": "留学生"},
  {"id": "BuiltInStudentMaster", "name": "硕士生"},
  {"id": "BuiltInStudentMasterComplete", "name": "硕士结业生"},
  {"id": "BuiltInStudentMasterGraduate", "name": "硕士毕业生"},
  {"id": "BuiltInStudentNonSchoolRoll", "name": "非学籍学生"},
  {"id": "BuiltInStudentSchoolRoll", "name": "学生(学籍)"},
  {"id": "BuiltInStudentUndergraduate", "name": "本科生"},
  {"id": "BuiltInStudentUndergraduateComplete", "name": "本科结业生"},
  {"id": "BuiltInStudentUndergraduateGraduate", "name": "本科毕业生"},
  {"id": "BuiltInStudentUndergraduateSchoolRoll", "name": "本科生(学籍)"},
  {"id": "BuiltInTeam", "name": "集体账号"},
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