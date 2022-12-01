<template>
  <section class="mp-erp-period-manage-new-special-manage-log-list-page">
    <header>
      <p class="mp-common-title-wrap">
        <span>{{title}}</span>
        <i class="s" v-if="ItemName"> - </i>
        <span v-if="ItemName">{{ItemName}}</span>
      </p>
    </header>
    <main>
      <NewSpecialLogListTable :loading='loading' :dataList='data' />
    </main>
    <footer>
      <CountComp
        :count='dataNumber'
        :watchPage='condition.Page'
        :handlePageChange='getLogListData'
        :pageSize='condition.PageSize'
        center
      >
      </CountComp>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import CountComp from '@/components/common/Count.vue';
import NewSpecialLogListTable from '../../../components/ProducePeriodComps/NewSpecialComps/NewSpecialLogListTable.vue';

export default {
  name: 'SpecialLogListPage',
  components: {
    CountComp,
    NewSpecialLogListTable,
  },
  data() {
    return {
      title: '操作记录',
      ItemName: '',
      loading: false,
      condition: {
        Page: 1,
        PageSize: 30,
        LogType: 3,
      },
      data: [],
      dataNumber: 0,
    };
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    init() {
      // LogType：3为删除记录  4为操作记录  SituationID
      const { LogType, SituationID, ItemName } = this.$route.params;
      this.condition.LogType = LogType;
      if (SituationID !== 'null') {
        this.condition.SituationID = SituationID;
        this.title = '操作记录';
        this.ItemName = ItemName;
      } else {
        this.title = '删除记录';
        this.ItemName = '';
      }

      this.getLogListData();
    },
    async getLogListData(page = 1) {
      this.condition.Page = page;
      this.data = [];

      this.loading = true;
      const resp = await this.api.getPeriodSpecialSituationLogList(this.condition).catch(() => null);
      this.loading = false;

      if (resp && resp.data.Status === 1000) {
        this.data = resp.data.Data || [];
        this.dataNumber = resp.data.DataNumber;
      }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-new-special-manage-log-list-page {
  background-color: #fff;
  padding: 0 18px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  font-size: 14px;
  min-width: 1000px;
  > header {
    flex: none;
    height: 60px;
    display: flex;
    align-items: center;
    .s {
      margin: 0 6px;
    }
    button {
      margin-right: 18px;
    }
    .mp-common-title-wrap {
      &::before {
        height: 19px;
        vertical-align: -19%;
      }
      line-height: 19px;
    }
  }
  > main {
    flex: 1;
    // margin: 0 -1px;
  }
  > footer {
    flex: none;
    height: 85px;
    padding-bottom: 10px;
    padding-top: 2px;
    text-align: center;
    color: #585858;
    // display: flex;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      &:last-of-type {
        color: #26BCF9;
        margin-left: 30px;
      }
    }
  }
}
</style>
