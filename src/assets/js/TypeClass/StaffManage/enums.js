import getEnumList from '../../utils/getEnumList';

export const SexEnumObj = {
  male: {
    ID: 1,
    Name: '男',
  },
  female: {
    ID: 2,
    Name: '女',
  },
};

export const EducationEnumObj = {
  AssociateDegree: {
    ID: 0,
    Name: '大专',
  },
  university: {
    ID: 1,
    Name: '本科',
  },
  masterDegree: {
    ID: 2,
    Name: '硕士',
  },
  doctorDegree: {
    ID: 3,
    Name: '博士',
  },
  other: {
    ID: 4,
    Name: '其它',
  },
};

export const StaffStatusEnumObj = {
  pending: {
    ID: 1,
    Name: '待审核',
  },
  approved: {
    ID: 2,
    Name: '审核通过',
  },
  leaved: {
    ID: 3,
    Name: '离职',
  },
};

export const SexEnumList = getEnumList(SexEnumObj);
export const StaffStatusEnumList = getEnumList(StaffStatusEnumObj);
export const EducationEnumList = getEnumList(EducationEnumObj);
