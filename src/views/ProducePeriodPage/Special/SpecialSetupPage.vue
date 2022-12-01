<template>
  <section class="mp-erp-period-manage-special-setup-condition-set-page-wrap" v-if="!isIniting">
    <header>
      <p class="mp-common-title-wrap">特殊情况设置</p>
      <div class="name">
        <label for="">名称：</label>
        <el-input v-model.trim="ItemName" size="small" maxlength="20" show-word-limit></el-input>
      </div>
    </header>
    <main>
      <ContionCommonComp ref="oLeftComp" :PropertyList='PeriodSpecialPropertyList' leftWidth='40%' :curEditData='curEditData'
        :adAreaList="adAreaList" :areaList="areaList" :allAdAreaTreeList="allAdAreaTreeList"
        :allProductClassify="allProductClassify" :allProductAndLevelList="allProductAndLevelList" :allAreaTreeList="allAreaTreeList">
        <RightPanelComp ref="oRight" :curEditData='curEditData' /> <!-- 右侧面板区域 -->
      </ContionCommonComp>
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ContionCommonComp } from '@/components/common/mpzj-sell-lib/lib';
import RightPanelComp from '../../../components/ProducePeriodComps/NewSpecialComps/RightPanelComp.vue';

export default {
  name: 'SpecialSetupPage',
  components: {
    ContionCommonComp,
    RightPanelComp,
  },
  data() {
    return {
      curEditData: null,
      ItemName: '',
      isIniting: true,
    };
  },
  computed: {
    ...mapState('periodManage', ['PeriodSpecialPropertyList']),
    ...mapGetters('periodManage', ['NewSpecialDataListByGetters']),
    ...mapState('common', ['adAreaList', 'areaList']),
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allProductAndLevelList', 'allAreaTreeList']),
  },
  methods: {
    async getInitData() {
      const id = this.$route.params.ItemID;
      if (!id || id === 'null') {
        this.isIniting = false;
        return;
      }
      const t = this.NewSpecialDataListByGetters.find(it => it.ItemID === id);
      if (t) {
        this.curEditData = t;
        this.isIniting = false;
        this.ItemName = this.curEditData.ItemName;
      } else {
        this.$message.warning('找不到该特殊情况');
        this.onGoBackClick();
      }
    },
    onGoBackClick() {
      this.$goback();
    },
    onSubmitClick() {
      if (!this.ItemName) {
        this.messageBox.failSingleError('保存失败', '未设置名称');
        return;
      }
      const condition = this.$refs.oLeftComp?.getConditonResult();
      if (!condition) return;
      const rightData = this.$refs.oRight?.getSubmitInfo();
      if (!rightData) return;
      const { Priority, Constraint } = condition;
      const temp = { ...rightData, Priority, Constraint, ItemName: this.ItemName };
      temp.ItemID = this.curEditData ? this.curEditData.ItemID : '';
      this.handleSubmit(temp);
    },
    async handleSubmit(data) {
      const resp = await this.api.getPeriodSpecialSituationSave(data).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const ItemID = resp.data.Data;
        const isEdit = !!data.ItemID;
        const title = isEdit ? '编辑成功' : '添加成功';
        const temp = { ...data, ItemID };
        const cb = () => {
          this.$store.commit('periodManage/setNewSpecialItemChange', [temp, isEdit]);
          this.onGoBackClick();
        };
        this.messageBox.successSingle(title, cb, cb);
      }
    },
  },
  async mounted() {
    this.getInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-period-manage-special-setup-condition-set-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 12px 0;
    padding-bottom: 40px;
    line-height: 20px;
    box-sizing: border-box;
    height: 80px;
    color: #21CAE3;
    flex: none;
    white-space: nowrap;
    > .name {
      display: flex;
      align-items: center;
      padding-top: 16px;
      > label {
        flex: none;
        width: 4em;
        font-size: 14px;
        text-align: right;
        color: #888e99;
      }
      > .el-input {
        width: 380px;
        input {
          height: 30px;
          line-height: 30px;
          font-size: 13px;
        }
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    overflow: hidden;
    .mp-erp-new-comps-condtion-set-common-comp-wrap {
      .right .right-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        .right-content-main-wrap {
        flex: 1;
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
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
