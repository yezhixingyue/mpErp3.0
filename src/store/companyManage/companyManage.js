import api from '../../api';
import messageBox from '../../assets/js/utils/message';

export default {
  namespaced: true,
  state: {
    /* 岗位管理相关
    -------------------------------*/
    JobPermissionsDataList: [], // 岗位列表数据
  },
  getters: {
  },
  mutations: {
    /* 岗位管理相关
    -------------------------------*/
    setJobPermissionsDataList(state, list) { // 设置列表数据
      state.JobPermissionsDataList = list || [];
    },
    setJobPermissionsItemNameChange(state, [value, index]) { // 修改权限列表岗位名称
      if (state.JobPermissionsDataList[index]) {
        state.JobPermissionsDataList[index].PositionName = value;
      }
    },
    setJobPermissionsItemRemove(state, index) { // 从列表中删除岗位
      state.JobPermissionsDataList.splice(index, 1);
    },
    setJobPermissionsItemAdd(state, itemData) { // 添加一行
      state.JobPermissionsDataList.push(itemData);
    },
  },
  actions: {
    /* 岗位管理相关
    -------------------------------*/
    async getJobPermissionsDataList({ commit }) { // 获取岗位数据列表
      commit('setJobPermissionsDataList', []);
      const resp = await api.getJobPermissionsList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        commit('setJobPermissionsDataList', resp.data.Data);
      }
    },
    async getJobSave({ state, commit }) { // 保存岗位
      const resp = await api.getJobSave(state.JobPermissionsDataList).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          commit('setJobPermissionsDataList', resp.data.Data);
        };
        messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
};
