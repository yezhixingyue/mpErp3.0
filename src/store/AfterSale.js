import api from '@/api/index';
import ClassType from '@/store/CommonClassType';

export default {
  namespaced: true,
  state: {
    QuestionClassList: [], // 售后问题列表
    AfterSalesList: [], // 售后列表
    AfterSalesDataNumber: 0,
    AfterSalesCondition: {
      ProductClass: {
        ClassID: '',
        TypeID: '',
        ProductID: '',
      },
      DateType: 'today',
      SellArea: {
        RegionalID: '',
        RegionalName: '',
        CityID: '',
        CityName: '',
        CountyID: '',
        CountyName: '',
      },
      CustomerType: {
        First: '',
      },
      Date: {
        First: '',
        Second: '',
      },
      SelectTime: {
        First: '',
        Second: '',
      },
      IsAllowHandle: false,
      Source: 1,
      ChannelType: 0,
      OperaterID: '',
      ID: '',
      FieldType: 1,
      Status: '',
      KeyWords: '',
      Page: 1,
      PageSize: 20,
    },

    ResponsibilityMeasureList: [],
    ResponsibilityMeasureDataNumber: 0,
    ResponsibilityMeasureCondition: {
      ProductClass: {
        ClassID: 0,
        TypeID: 0,
        ProductID: '',
      },
      DateType: 'today',
      SellArea: {
        RegionalID: 0,
        RegionalName: '',
        CityID: 0,
        CityName: '',
        CountyID: 0,
        CountyName: '',
      },
      CustomerType: {
        First: '',
      },
      Date: {
        First: '',
        Second: '',
      },
      SelectTime: {
        First: '',
        Second: '',
      },
      Status: '',
      IsAllowHandle: false,
      AfterSaleChannels: [],
      ID: '',
      FieldType: 1,
      KeyWords: '',
      Page: 1,
      PageSize: 20,
    },
    // 责任确认
    ResponsibilityConfirmList: [],
    ResponsibilityConfirmDataNumber: 0,
    ResponsibilityConfirmCondition: {
      ProductClass: {
        ClassID: 0,
        TypeID: 0,
        ProductID: '',
      },
      DateType: 'today',
      SellArea: {
        RegionalID: 0,
        RegionalName: '',
        CityID: 0,
        CityName: '',
        CountyID: 0,
        CountyName: '',
      },
      CustomerType: {
        First: '',
      },
      Date: {
        First: '',
        Second: '',
      },
      SelectTime: {
        First: '',
        Second: '',
      },
      Status: '',
      IsAllowHandle: false,
      AfterSaleChannels: [],
      ID: '',
      FieldType: 1,
      KeyWords: '',
      Page: 1,
      PageSize: 20,
    },
  },
  getters: {
  },
  mutations: {
    setOrderAfterSaleQuestionClassList(state, list) {
      state.QuestionClassList = list;
    },
    // 售后列表
    setAfterSalesList(state, list) {
      state.AfterSalesList = list;
    },
    setAfterSalesDataNumber(state, number) {
      state.AfterSalesDataNumber = number;
    },
    setClearAfterSalesCondition(state) {
      state.AfterSalesCondition = {
        ProductClass: {
          ClassID: '',
          TypeID: '',
          ProductID: '',
        },
        DateType: 'today',
        SellArea: {
          RegionalID: '',
          RegionalName: '',
          CityID: '',
          CityName: '',
          CountyID: '',
          CountyName: '',
        },
        CustomerType: {
          First: '',
        },
        Date: {
          First: '',
          Second: '',
        },
        SelectTime: {
          First: '',
          Second: '',
        },
        IsAllowHandle: false,
        Source: 1,
        ChannelType: 0,
        OperaterID: '',
        ID: '',
        FieldType: 1,
        Status: '',
        KeyWords: '',
        Page: 1,
        PageSize: 20,
      };
    },
    setAfterSalesCondition(state, [[key1, key2], value]) {
      if (!key1) return;
      if (key2) {
        state.AfterSalesCondition[key1][key2] = value;
      } else {
        state.AfterSalesCondition[key1] = value;
      }
    },
    beginAfterSale(state, AfterSaleCode) {
      const index = state.AfterSalesList.findIndex(it => it.AfterSaleCode === AfterSaleCode);
      if (index !== -1) {
        state.AfterSalesList[index].Status === 10;
      }
    },
    // 责任划分
    setResponsibilityMeasureList(state, list) {
      state.ResponsibilityMeasureList = list;
    },
    setResponsibilityMeasureDataNumber(state, number) {
      state.ResponsibilityMeasureDataNumber = number;
    },
    setClearResponsibilityMeasureCondition(state) {
      state.ResponsibilityMeasureCondition = {
        ProductClass: {
          ClassID: 0,
          TypeID: 0,
          ProductID: '',
        },
        DateType: 'today',
        SellArea: {
          RegionalID: 0,
          RegionalName: '',
          CityID: 0,
          CityName: '',
          CountyID: 0,
          CountyName: '',
        },
        CustomerType: {
          First: '',
        },
        Date: {
          First: '',
          Second: '',
        },
        SelectTime: {
          First: '',
          Second: '',
        },
        Status: '',
        IsAllowHandle: false,
        AfterSaleChannels: [],
        ID: '',
        FieldType: 1,
        KeyWords: '',
        Page: 1,
        PageSize: 20,
      };
    },
    setResponsibilityMeasureCondition(state, [[key1, key2], value]) {
      if (!key1) return;
      if (key2) {
        state.ResponsibilityMeasureCondition[key1][key2] = value;
      } else {
        state.ResponsibilityMeasureCondition[key1] = value;
      }
    },

    // 责任确认
    setResponsibilityConfirmList(state, list) {
      state.ResponsibilityConfirmList = list;
    },
    setResponsibilityConfirmDataNumber(state, number) {
      state.ResponsibilityConfirmDataNumber = number;
    },
    setClearResponsibilityConfirmCondition(state) {
      state.ResponsibilityConfirmCondition = {
        ProductClass: {
          ClassID: 0,
          TypeID: 0,
          ProductID: '',
        },
        DateType: 'today',
        SellArea: {
          RegionalID: 0,
          RegionalName: '',
          CityID: 0,
          CityName: '',
          CountyID: 0,
          CountyName: '',
        },
        CustomerType: {
          First: '',
        },
        Date: {
          First: '',
          Second: '',
        },
        SelectTime: {
          First: '',
          Second: '',
        },
        Status: '',
        IsAllowHandle: false,
        AfterSaleChannels: [],
        ID: '',
        FieldType: 1,
        KeyWords: '',
        Page: 1,
        PageSize: 20,
      };
    },
    setResponsibilityConfirmCondition(state, [[key1, key2], value]) {
      if (!key1) return;
      if (key2) {
        state.ResponsibilityConfirmCondition[key1][key2] = value;
      } else {
        state.ResponsibilityConfirmCondition[key1] = value;
      }
    },
  },
  actions: {
    async getOrderAfterSaleQuestionClassList({ commit }, data) {
      const res = await api.getOrderAfterSaleQuestionClassList(data);
      if (!res.data.Data && res.data.Status !== 1000) return;
      commit('setOrderAfterSaleQuestionClassList', res.data.Data);
    },
    // 售后列表
    async getOrderAfterSaleManageList({ commit, state }, page = 1) {
      commit('setAfterSalesCondition', [['Page', ''], page]);
      const temp = JSON.parse(JSON.stringify(state.AfterSalesCondition));
      ClassType.setDate(temp);
      const _obj = ClassType.filter(temp, true);
      if (_obj.Date) {
        _obj.SelectTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      const res = await api.getOrderAfterSaleManageList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        commit('setAfterSalesList', res.data.Data);
        commit('setAfterSalesDataNumber', res.data.DataNumber);
      }
    },
    // 责任划分
    async getOrderAfterSaleResponsibilityDivideList({ commit, state }, page = 1) {
      commit('setResponsibilityMeasureCondition', [['Page', ''], page]);
      const temp = JSON.parse(JSON.stringify(state.ResponsibilityMeasureCondition));
      ClassType.setDate(temp);
      const _obj = ClassType.filter(temp, true);
      if (_obj.Date) {
        _obj.SelectTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      const res = await api.getOrderAfterSaleResponsibilityDivideList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        commit('setResponsibilityMeasureList', res.data.Data);
        commit('setResponsibilityMeasureDataNumber', res.data.DataNumber);
      }
    },
    // 责任确认
    async getOrderAfterSaleResponsibilityConfirmList({ commit, state }, page = 1) {
      commit('setResponsibilityConfirmCondition', [['Page', ''], page]);
      const temp = JSON.parse(JSON.stringify(state.ResponsibilityConfirmCondition));
      ClassType.setDate(temp);
      const _obj = ClassType.filter(temp, true);
      if (_obj.Date) {
        _obj.SelectTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      const res = await api.getOrderAfterSaleResponsibilityConfirmList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        commit('setResponsibilityConfirmList', res.data.Data);
        commit('setResponsibilityConfirmDataNumber', res.data.DataNumber);
      }
    },
  },
};
