import { MessageBox } from 'element-ui';
import api from '../../api';
import messageBox from '../../assets/js/utils/message';

export default {
  namespaced: true,
  state: {
    /* 岗位管理相关
    -------------------------------*/
    JobPermissionsDataList: [], // 岗位列表数据
    /* 花名管理相关
    -------------------------------*/
    RosterDataList: [], // 花名列表数据
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
    /* 花名管理相关
    -------------------------------*/
    setRosterDataList(state, list) { // 设置列表数据
      state.RosterDataList = list || [];
    },
    setRosterDataItemAdd(state, itemData) { // 添加一行花名
      state.RosterDataList.push(itemData);
    },
    setRosterDataItemNameChange(state, [value, index]) { // 修改花名
      if (state.RosterDataList[index]) {
        state.RosterDataList[index].Nickname = value;
      }
    },
    setRosterDataItemRemove(state, index) { // 从列表中删除花名
      state.RosterDataList.splice(index, 1);
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

    async getRosterDataList({ commit }) { // 获取花名数据列表
      commit('setRosterDataList', []);
      const resp = await api.getRosterDataList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        commit('setRosterDataList', resp.data.Data);
      }
    },
    async getRosterDataSave({ state, dispatch }, createNode) { // 保存花名 createNode: 由组件创建VNode作为弹出内容 字段直接放到这不会自动换行 只能自行处理
      const resp = await api.getRosterDataSave(state.RosterDataList).catch(() => null);
      const cb = () => {
        dispatch('getRosterDataList');
      };
      if (resp && resp.data.Status === 1000) {
        messageBox.successSingle('保存成功', cb, cb);
      }
      if (resp && resp.data.Status === 1001) {
        dispatch('getRosterDataList');
      }
      if (resp && resp.data.Status === 1100) {
        MessageBox({
          showClose: true,
          message: createNode(resp.data.Message),
          type: 'warning',
          confirmButtonText: '关闭',
          title: '提示',
          customClass: 'mp-order-del-pop-reverse-warn message-box-left',
        }).then(() => cb() && cb()).catch(() => cb && cb());
      }
    },
    async getRosterDataItemRemove({ dispatch }, index) { // 删除花名
      const resp = await api.getRosterDataRemove(index).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          dispatch('getRosterDataList');
        };
        messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
};
