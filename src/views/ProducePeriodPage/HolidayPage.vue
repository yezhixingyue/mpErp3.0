<template>
  <section class="mp-erp-period-holiday-page-wrap">
    <header>
      <el-button type="primary" @click="onHolidaySaveClick(null)" v-if="localPermission.HolidaySetup">添加节假日</el-button>
      <div>
        <label class="title">时间筛选：</label>
        <el-date-picker
          v-model="Condition.YearMonth"
          type="month"
          size="small"
          value-format='yyyyMM'
          format='yyyy-MM'
          @change='getTableDataList(1)'
          placeholder="选择月">
        </el-date-picker>
      </div>
    </header>
    <main>
      <HolidayTableComp :loading='loading' :dataList='DataList' @edit="onHolidaySaveClick" @remove="onRemoveClick" :dateSetList='dateSetList' />
      <HolidaySetupDialogComp :visible.sync='visible' :dateSetList='dateSetList' :ItemID='curEditItemID' @submitSuccess="handleItemSubmitSuccess" />
    </main>
    <footer>
      <CountComp :count='DataListNumber' :watchPage='Condition.Page' :handlePageChange='getTableDataList' :pageSize='20' center />
    </footer>
  </section>
</template>

<script>
import HolidaySetupDialogComp from '@/components/ProducePeriodComps/HolidayComps/HolidaySetupDialogComp';
import HolidayConditionClass from '@/store/Period/ConditionClass/HolidayConditionClass';
import CommonClassType from '@/store/CommonClassType';
import CountComp from '@/components/common/Count.vue';
import { mapState } from 'vuex';
import HolidayTableComp from '../../components/ProducePeriodComps/HolidayComps/HolidayTableComp.vue';

export default {
  name: 'HolidayManagePage',
  components: {
    HolidaySetupDialogComp,
    HolidayTableComp,
    CountComp,
  },
  computed: {
    ...mapState('common', ['Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionProducePeriod?.Obj) {
        return this.Permission.PermissionList.PermissionProducePeriod.Obj;
      }
      return {};
    },
  },
  data() {
    return {
      visible: false,
      curEditItemID: null,
      dateSetList: [
        { Name: '固定时间', ID: 1 },
        { Name: '时间推移', ID: 2 },
      ],
      loading: false,
      DataList: [],
      DataListNumber: 0,
      Condition: new HolidayConditionClass(),
    };
  },
  methods: {
    onHolidaySaveClick(item) { // 添加 | 编辑
      this.curEditItemID = item ? item.ItemID : '';
      this.visible = true;
    },
    handleItemSubmitSuccess([itemData, ItemID]) { // 节假日编辑或添加成功后的处理
      // console.log(itemData, itemData.ItemID);
      if (!itemData || !ItemID) return;
      if (!itemData.ItemID) { // 添加
        this.DataList.unshift({ ...itemData, ItemID });
        this.DataListNumber += 1;
      } else {
        const i = this.DataList.findIndex(it => it.ItemID === ItemID);
        if (i > -1) this.DataList.splice(i, 1, itemData);
      }
    },
    // eslint-disable-next-line no-unused-vars
    async onRemoveClick({ ItemID }) {
      const resp = await this.api.getRestDayRemove(ItemID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const i = this.DataList.findIndex(it => it.ItemID === ItemID);
          if (i > -1) this.DataList.splice(i, 1);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    async getTableDataList(Page = 1) { // 获取列表数据
      this.Condition.Page = Page;
      this.DataList = [];
      const temp = CommonClassType.filter(this.Condition);
      this.loading = true;
      const resp = await this.api.getRestDayList(temp).catch(() => null);
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.DataList = resp.data.Data;
        this.DataListNumber = resp.data.DataNumber;
      }
    },
  },
  mounted() {
    this.getTableDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-holiday-page-wrap {
  display: flex;
  flex-direction: column;
  padding: 0 6px;
  background-color: #f5f5f5;
  height: 100%;
  min-width: 800px;
  > header {
    flex: none;
    height: 60px;
    background-color: #fff;
    padding-left: 20px;
    display: flex;
    align-items: center;
    button {
      width: 120px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      margin-right: 43px;
    }
    > div {
      color: #444;
      font-size: 14px;
      > label {
        font-weight: 700;
      }
      .el-input {
        width: 140px;
        height: 30px;
        line-height: 30px;
        input {
          height: 30px;
          line-height: 30px;
          border-radius: 3px;
          border-color: #e5e5e5;
          position: relative;
          top: -2px;
          font-size: 13px;
          color: #444;
        }
        .el-input__icon {
          line-height: 30px;
        }
      }
      > .el-date-editor {
        position: relative;
        top: 1px;
      }
    }
  }
  > main {
    margin-top: 10px;
    flex: 1;
    background-color: #fff;
  }
  > footer {
    flex: none;
    height: 60px;
    background-color: #fff;
  }
}
</style>
