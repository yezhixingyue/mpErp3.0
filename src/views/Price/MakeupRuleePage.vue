<template>
  <section class="mp-price-manage-page-makeup-rule-page-wrap">
    <header>
      <el-button type="primary" size="small" @click="onMakeupRuleSet(null)">添加拼版规则</el-button>
      <div @click="drawer = true">
        <i>?</i>
        <span>说明</span>
      </div>
    </header>
    <main>
      <ExplainDrawer :visible.sync='drawer' />
      <MakeupRuleSetupDialog :visible.sync="visible" :EditData='curEditData' @submit='onSaveSubmit' />
      <ul>
        <li v-for="it in MakeupRuleList" :key="it.ID">
          <div>{{getContent(it)}}</div>
          <CtrlMenus />
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
import ExplainDrawer from '../../components/PriceComps/MakeupRule/ExplainDrawer.vue';
import MakeupRuleSetupDialog from '../../components/PriceComps/MakeupRule/MakeupRuleSetupDialog.vue';
import CtrlMenus from '../../components/common/NewComps/CtrlMenus';

export default {
  components: {
    ExplainDrawer,
    MakeupRuleSetupDialog,
    CtrlMenus,
  },
  data() {
    return {
      drawer: false,
      visible: false,
      curEditData: null,
      MakeupRuleList: [],
    };
  },
  methods: {
    onMakeupRuleSet(data) {
      this.curEditData = data;
      this.visible = true;
    },
    async onSaveSubmit(data) {
      const resp = await this.api.getMakeupRuleSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const isEdit = !!this.curEditData;
        const cb = () => {
          const newItem = { ...data, ID: resp.data.Data };
          if (!isEdit) { // 新增
            this.MakeupRuleList.unshift(newItem);
          } else {
            const i = this.MakeupRuleList.findIndex(it => it.ID === data.ID);
            if (i > -1) this.MakeupRuleList.splice(i, 1, newItem);
          }
          this.visible = false;
        };
        const title = isEdit ? '编辑成功' : '添加成功';
        this.messageBox.successSingle(title, cb, cb);
      }
    },
    async getMakeupRuleList() {
      const resp = await this.api.getMakeupRuleList().catch(() => {});
      if (resp && resp.data.Status === 1000) this.MakeupRuleList = resp.data.Data;
    },
    getContent(item) {
      if (!item) return '';
      const { ColumnNumber, RowNumber } = item;
      if (ColumnNumber && RowNumber) {
        return `${ColumnNumber}列 X ${RowNumber}行`;
      }
      return '';
    },
  },
  mounted() {
    this.getMakeupRuleList();
  },
};
</script>
<style lang='scss'>
.mp-price-manage-page-makeup-rule-page-wrap {
  padding-left: 20px;
  > header {
    padding: 35px 0;
    > button {
      width: 125px;
      height: 35px;
      padding: 0;
    }
    > div {
      display: inline-block;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      border-left: 1px solid #eee;
      padding-left: 15px;
      margin-left: 30px;
      padding-right: 5px;
      cursor: pointer;
      user-select: none;
      > i {
        display: inline-block;
        width: 13px;
        height: 13px;
        line-height: 13px;
        text-align: center;
        border: 1px solid #ff3769;
        border-radius: 50%;
        color: #ff3769;
        margin-right: 6px;
        transition: 0.1s ease-in-out;
      }
      > span {
        color: #a2a2a2;
        transition: color 0.1s ease-in-out;
      }
      &:hover {
        > span {
          color: #444;
        }
        > i {
          background-color: #f873943a;
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
