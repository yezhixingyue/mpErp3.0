<template>
  <section class="mp-statistic-summary-add-edit-page-wrap">
    <header>
      <p class="mp-common-title-wrap">{{ curPageTypeText }}汇总面板</p>
    </header>
    <main>
      <p class="inp-wrap">
        <span>面板标题：</span>
        <el-input type="text" v-model="Title" maxlength="60" show-word-limit></el-input>
      </p>
      <div class="item">
        <span class="title">选择统计图表：</span>
        <span class="blue-span" @click="onDialogOpenClick">选择统计图表</span>
      </div>
      <div class="item">
        <span class="title">已选统计图表：</span>
        <div style="color: #585858; font-size: 12px" v-if="checkedFormList.length === 0">当前尚未选择统计图表，请点击上方选择</div>
        <ul v-else>
          <li v-for="item in checkedFormList" :key='item.ID'>
            <span class="item-title">{{item.Title}}</span>
            <span>、</span>
          </li>
        </ul>
      </div>
      <SummaryEditDialog :list.sync='checkedFormList' v-model="dialogVisible" />
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick" class="is-blue-button">保存</el-button>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import SummaryEditDialog from '@/components/StatisticAnalyseComps/SummaryEditComps/SummaryEditDialog.vue';
import { mapState } from 'vuex';

export default {
  name: 'StatisticalSummaryAddEditPage',
  components: {
    SummaryEditDialog,
  },
  data() {
    return {
      ID: '',
      Title: '',
      checkedFormList: [],
    };
  },
  computed: {
    ...mapState('statistic', ['selectFormDialogShow', 'curEditPanelItemData', 'considtion4SummaryList']),
    curPageTypeText() {
      if (this.$route.params.type === 'add') return '添加';
      if (this.$route.params.type === 'edit') return '编辑';
      return '';
    },
    dialogVisible: {
      get() {
        return this.selectFormDialogShow;
      },
      set(bool) {
        this.$store.commit('statistic/setSelectFormDialogShow', bool);
      },
    },
  },
  methods: {
    onDialogOpenClick() {
      this.dialogVisible = true;
    },
    async onSubmitClick() {
      // console.log('onSubmitClick', this.Title, this.checkedFormList);
      if (!this.Title) {
        this.messageBox.failSingleError('保存失败', '请输入标题');
        return;
      }
      if (this.checkedFormList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择统计图表');
        return;
      }
      const temp = { Title: this.Title, List: [], ID: this.ID };
      temp.List = this.checkedFormList.map(it => ({ ID: it.ID, Title: it.Title }));
      const res = await this.api.getStatisticSummarySave(temp);
      if (res && res.data.Status === 1000) {
        const _title = this.ID ? '编辑成功' : '添加成功';
        this.messageBox.successSingle(_title, this.onSuccess, this.onSuccess);
      }
    },
    async onSuccess() {
      await this.$store.dispatch('statistic/getStatisticSummaryDataList', this.considtion4SummaryList.Page);
      this.onGoBackClick();
    },
    onGoBackClick() {
      this.$router.replace('/StatisticalSummary');
    },
    setInitData() {
      if (this.$route.params.type === 'edit') {
        if (!this.curEditPanelItemData) {
          this.onGoBackClick();
          return;
        }
        this.Title = this.curEditPanelItemData.Title;
        this.checkedFormList = this.curEditPanelItemData.List;
        this.ID = this.curEditPanelItemData.ID;
      }
    },
  },
  created() {
    this.setInitData();
  },
  activated() {
    this.setInitData();
  },
};
</script>
<style lang='scss'>
.mp-statistic-summary-add-edit-page-wrap {
  display: flex;
  flex-direction: column;
  padding-left: 50px;
  height: 100%;
  > header {
    padding: 30px 50px 30px 0;
    flex: none;
  }
  > main {
    font-size: 14px;
    padding-top: 30px;
    flex: 1;
    span {
      color: #888E99;
    }
    > p.inp-wrap {
      width: 580px;
      padding-bottom: 65px;
      > .el-input {
        width: 500px;
        height: 30px;
        > input {
          height: 30px;
        }
      }
      > span {
        font-weight: 700;
        color: #444444;
        margin-right: 5px;
      }
    }
    > div.item {
      display: flex;
      padding-bottom: 30px;
      > span {
        &.title {
          flex: none;
          margin-right: 13px;
        }
      }
      > ul {
        display: flex;
        flex-wrap: wrap;
        width: 700px;
        > li {
          display: flex;
          width: 340px;
          margin-bottom: 16px;
          > .item-title {
            max-width: 312px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  > footer {
    // text-align: center;
    padding-top: 40px;
    padding-right: 30px;
    padding-bottom: 120px;
    flex: none;
    > button {
      width: 120px;
      height: 30px;
      padding: 0;
      border-radius: 2px;
      margin-right: 20px;
      // margin-left: 0 !important;
    }
  }
}
</style>
