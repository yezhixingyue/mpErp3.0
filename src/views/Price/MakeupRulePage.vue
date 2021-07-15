<template>
  <section class="mp-price-manage-page-makeup-rule-page-wrap">
    <header>
      <el-button type="primary" size="small" @click="onMakeupRuleSet(null)">添加拼版规则</el-button>
      <div @click="drawer = true">
        <i>?</i>
        <span>说明</span>
      </div>
    </header>
    <main class="mp-scroll-wrap">
      <ExplainDrawer :visible.sync='drawer' />
      <MakeupRuleSetupDialog :visible.sync="visible" :EditData='curEditData' @submit='onSaveSubmit' />
      <ul>
        <li v-for="(it,i) in MakeupRuleList" :key="it.ID">
          <div class="content">{{getContent(it)}}</div>
          <CtrlMenus @edit="onMakeupRuleSet(it)" @remove='onRemoveClick(it,i)' />
        </li>
        <li class="empty-box" v-if="!loading && MakeupRuleList.length === 0">
          <img src="@/assets/images/null.png" alt="">
          <p>暂无数据</p>
        </li>
      </ul>
    </main>
    <footer>
      <el-button class="goback" @click="onGobackClick"> <i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
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
      loading: true,
    };
  },
  methods: {
    onMakeupRuleSet(data) {
      this.curEditData = data;
      this.visible = true;
    },
    onSaveSubmit(data) {
      const { ColumnNumber, RowNumber, ID } = data;
      const _ColumnSameList = this.MakeupRuleList.filter(it => it.ColumnNumber === ColumnNumber);
      if (_ColumnSameList.length > 0) {
        const t = _ColumnSameList.find(it => it.RowNumber === RowNumber && it.ID !== ID);
        if (t) {
          this.messageBox.failSingleError('保存失败', '已存在相同的拼版规则');
          return;
        }
      }
      this.getRuleDataSave(data);
    },
    async getRuleDataSave(data) {
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
      this.loading = false;
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
    onRemoveClick(it, i) {
      this.messageBox.warnCancelBox('确定删除该条拼版规则吗', `拼版规则：[ ${this.getContent(it)} ]`, () => {
        this.handleMakeupRuleRemove(it, i);
      });
    },
    async handleMakeupRuleRemove({ ID }, i) {
      const resp = await this.api.getMakeupRuleRemove(ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.MakeupRuleList.splice(i, 1);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    onGobackClick() {
      this.$goback();
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
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  > header {
    padding: 35px 0;
    padding-bottom: 50px;
    flex: none;
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
  > main {
    flex: 1;
    overflow-y: auto;
    width: 860px;
    > ul {
      width: 750px;
      > li {
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 20px;
        padding: 12px 32px 10px 16px;
        > .content {
          color: #585858;
          font-size: 14px;
        }
        &:hover {
          background-color: #f5f5f5;
        }
        &.empty-box {
          border: none;
          height: 200px;
          background-color: #fff;
          text-align: center;
          width: 100%;
          display: block;
          padding-top: 80px;
          padding-right: 50px;
          box-sizing: border-box;
          > p {
            font-size: 12px;
            color: #a2a2a2;
          }
        }
      }
    }
  }
  > footer {
    height: 60px;
    width: 750px;
    text-align: center;
    flex: none;
    padding-top: 15px;
  }
}
</style>
