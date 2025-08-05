export const setManageAfterSalesPermission = (bool, Type, Key, PermissionList, _disabledList) => {
  const returnData = {
    disabledList: [],
    changeList: [],
  };
  returnData.disabledList = [..._disabledList];
  const PermissionIndex = PermissionList.findIndex(it => it.Type === Type);
  const { List } = PermissionList[PermissionIndex];

  if (Key === 'QueryAll') { // 查看所有列表
    if (bool) {
      ['QueryDepartment', 'QueryOwn'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
    }
    if (List.find(it => (['QueryAllDetail', 'AllOperate'].some(e => e === it.Key) && it.HavePermission))) {
      returnData.disabledList = ['QueryDepartment', 'QueryOwn'].map(it => Type + it);
    } else if (List.find(it => (['QueryDepartmentDetail', 'DepartmentOperate'].some(e => e === it.Key) && it.HavePermission))) {
      returnData.disabledList = ['QueryOwn'].map(it => Type + it);
    } else {
      returnData.disabledList = [];
    }
  }
  if (Key === 'QueryDepartment') { // 查看本部门列表
    const keys = ['QueryAllDetail', 'AllOperate']; // 需要禁用的key
    if (bool) {
      ['QueryAll', 'QueryOwn'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
      returnData.disabledList = keys.map(it => Type + it);
    } else {
      returnData.disabledList = [];
    }
    if (List.find(it => (['QueryDepartmentDetail', 'DepartmentOperate'].some(e => e === it.Key) && it.HavePermission))) {
      returnData.disabledList = [...returnData.disabledList, ...['QueryOwn'].map(it => Type + it)];
    }
  }
  if (Key === 'QueryOwn') { // 查看自己列表
    const keys = ['QueryAllDetail', 'AllOperate', 'QueryDepartmentDetail', 'DepartmentOperate']; // 需要禁用的key
    if (bool) {
      ['QueryAll', 'QueryDepartment'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
      returnData.disabledList = keys.map(it => Type + it);
    } else {
      returnData.disabledList = [];
    }
  }
  if (Key === 'QueryAllDetail') { // 查看所有详情
    const keys = ['QueryDepartment', 'QueryOwn']; // 需要禁用的key
    if (bool) {
      ['QueryDepartmentDetail', 'QueryOwnDetail'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
      returnData.disabledList = keys.map(it => Type + it);
    } else if (List.find(it => it.Key === 'AllOperate').HavePermission) {
      returnData.disabledList = keys.map(it => Type + it);
    } else if (List.find(it => it.Key === 'DepartmentOperate').HavePermission) {
      returnData.disabledList = ['QueryOwn'].map(it => Type + it);
    } else {
      returnData.disabledList = [];
    }
  }
  if (Key === 'QueryDepartmentDetail') { // 查看本部门详情
    if (bool) {
      ['QueryAllDetail', 'QueryOwnDetail'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
      const keys = ['QueryOwn']; // 需要禁用的key
      returnData.disabledList = [...returnData.disabledList, ...keys.map(it => Type + it)];
    } else if (!List.find(it => it.Key === 'DepartmentOperate').HavePermission) {
      returnData.disabledList = returnData.disabledList.filter(it => it !== `${Type}QueryOwn`);
    }
    if (!List.find(it => it.Key === 'AllOperate').HavePermission) {
      returnData.disabledList = returnData.disabledList.filter(it => it !== `${Type}QueryDepartment`);
    }
  }
  if (Key === 'QueryOwnDetail') { // 查看自己详情
    if (bool) {
      ['QueryAllDetail', 'QueryDepartmentDetail'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
    }
    if (!List.find(it => (['AllOperate'].some(e => e === it.Key) && it.HavePermission))) {
      returnData.disabledList = returnData.disabledList.filter(it => it !== `${Type}QueryDepartment`);
    }
    if (!List.find(it => (['DepartmentOperate'].some(e => e === it.Key) && it.HavePermission))
      && !List.find(it => (['AllOperate'].some(e => e === it.Key) && it.HavePermission))) {
      returnData.disabledList = returnData.disabledList.filter(it => it !== `${Type}QueryOwn`);
    }
  }

  if (Key === 'AllOperate') { // 所有操作处理
    const keys = ['QueryDepartment', 'QueryOwn']; // 需要禁用的key
    if (bool) {
      ['DepartmentOperate', 'OwnOperate'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
      returnData.disabledList = keys.map(it => Type + it);
    } else if (List.find(it => it.Key === 'QueryAllDetail').HavePermission) {
      returnData.disabledList = keys.map(it => Type + it);
    } else if (List.find(it => it.Key === 'QueryDepartmentDetail').HavePermission) {
      returnData.disabledList = ['QueryOwn'].map(it => Type + it);
    } else {
      returnData.disabledList = [];
    }
  }
  if (Key === 'DepartmentOperate') { // 本部门操作处理
    if (bool) {
      ['AllOperate', 'OwnOperate'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
      const keys = ['QueryOwn']; // 需要禁用的key
      returnData.disabledList = [...returnData.disabledList, ...keys.map(it => Type + it)];
    } else if (!List.find(it => it.Key === 'QueryDepartmentDetail').HavePermission) {
      returnData.disabledList = returnData.disabledList.filter(it => it !== `${Type}QueryOwn`);
    }
    if (!List.find(it => it.Key === 'QueryAllDetail').HavePermission) {
      returnData.disabledList = returnData.disabledList.filter(it => it !== `${Type}QueryDepartment`);
    }
  }
  if (Key === 'OwnOperate') { // 自己操作处理
    if (bool) {
      ['AllOperate', 'DepartmentOperate'].forEach(PermissionKey => { // 需要取消选中的key 用于同级的单选效果
        const index = PermissionList[PermissionIndex].List.findIndex(it => it.Key === PermissionKey);
        returnData.changeList.push({ PermissionIndex, index });
      });
    }
    if (!List.find(it => (['QueryAllDetail'].some(e => e === it.Key) && it.HavePermission))) {
      returnData.disabledList = returnData.disabledList.filter(it => it !== `${Type}QueryDepartment`);
    }
    if (!List.find(it => (['QueryDepartmentDetail'].some(e => e === it.Key) && it.HavePermission))
    && !List.find(it => (['QueryAllDetail'].some(e => e === it.Key) && it.HavePermission))) {
      returnData.disabledList = returnData.disabledList.filter(it => it !== `${Type}QueryOwn`);
    }
  }
  return returnData;
};
