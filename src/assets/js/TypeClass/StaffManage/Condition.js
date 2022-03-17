/**
 * 获取员工列表数据的条件类
 *
 * @export
 * @class StaffListContion
 */
export default class StaffListContion {
  FieldType = 3

  Page = 1

  PageSize = 30

  Sex = '' // 性别

  Education = '' // 学历

  Status = '' // 账号状态

  Location = { // 省 市
    First: '',
    Second: '',
  }

  Department = { // 管理部门
    FirstDepartmentID: '',
    SecondDepartmentID: '',
    ThirdDepartmentID: '',
  }

  PositionID = '' // 岗位

  KeyWords = '' // 关键字搜索
}
