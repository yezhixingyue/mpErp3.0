<template>
  <section class="mp-price-tactic-list-page-wrap">
    <template v-if="curPriceTactic">
      <PageHeader v-model="curPriceTactic.ActivateTime" :loading='loading' />
      <PageMain
        :curPriceTactic='curPriceTactic'
        :loading='loading'
        @switch='handleAsideSwitch'
        @fill='handleFillCurrentPrice'
        @input="handleInput"
      />
      <PageFooter :loading='loading' @submit="handleSubmit" />
    </template>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import PriceTactic, { DefaultPriceEmuns } from '@/assets/js/TypeClass/PriceTacticClass';
import PageHeader from '../../components/PriceTacticComps/PageHeader.vue';
import PageMain from '../../components/PriceTacticComps/PageMain.vue';
import PageFooter from '../../components/PriceTacticComps/PageFooter.vue';

export default {
  name: 'PriceTacticListPage',
  components: {
    PageHeader,
    PageMain,
    PageFooter,
  },
  computed: {
    ...mapState('common', ['userRankListNoneEmpty']),
    ...mapGetters('common', ['twoLevelsProductClassify4Sort']),
  },
  data() {
    return {
      date: '',
      curPriceTactic: null,
      localPricePolicyCoverage: null, // 缓存侧边信息数据，暂注释未生效
      localCurPriceTacticStringify: '',
      loading: false,
    };
  },
  methods: {
    async fetchInitData() { // 获取初始依赖数据 -- 并在完成后继续初始化页面数据
      const resultArr = await Promise.all([
        this.$store.dispatch('common/getUserClassify'),
        this.$store.dispatch('common/getProductClassifyData', { key: 6 }),
      ]).catch(() => null);
      if (resultArr && resultArr[0] && resultArr[1] && this.userRankListNoneEmpty.length > 0) {
        this.setNewTacticClass(this.userRankListNoneEmpty[0].CategoryID);
      }
    },
    async getCustomerPricePolicy(CustomerGradeID, DefaultPrice = DefaultPriceEmuns.FuturePrice.ID) { // 获取右侧表体相关数据
      const temp = {
        CustomerGradeID,
        DefaultPrice,
      };
      const resp = await this.api.getCustomerPricePolicy(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) return resp.data.Data;
      return null;
    },
    async getPricePolicyCoverage() { // 获取左侧侧边栏相关数据
      // if (this.localPricePolicyCoverage) return this.localPricePolicyCoverage;
      const temp = { PolicyType: 3 };
      const resp = await this.api.getPricePolicyCoverage(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.localPricePolicyCoverage = resp.data.Data;
        return resp.data.Data;
      }
      return null;
    },
    async setNewTacticClass(CustomerGradeID) { // 生成类对象 - 用以渲染页面
      this.loading = true;
      const [PricePolicyData, CoverageList] = await Promise.all([
        this.getCustomerPricePolicy(CustomerGradeID),
        this.getPricePolicyCoverage(),
      ]).catch(() => null);
      if (PricePolicyData && CoverageList) {
        const item = new PriceTactic(PricePolicyData, CoverageList, this.userRankListNoneEmpty, this.twoLevelsProductClassify4Sort);
        this.curPriceTactic = item;
        this.localCurPriceTacticStringify = JSON.stringify(item);
      }
      setTimeout(() => {
        this.loading = false;
      }, 80);
    },
    handleAsideSwitch(e) { // 左侧等级切换事件
      const bool = JSON.stringify(this.curPriceTactic) === this.localCurPriceTacticStringify;
      if (bool) {
        this.setNewTacticClass(e);
      } else {
        this.messageBox.warnCancelBox('确定要切换吗', '当前未保存的数据将丢失，点确定继续，点取消撤销切换', () => {
          this.setNewTacticClass(e);
        });
      }
    },
    handleFillCurrentPrice() { // 填充当前价格
      this.messageBox.warnCancelBox('确定填充当前执行价吗', '这将会覆盖当前价格表中所有输入框内的价格', async () => {
        const PolicyData = await this.getCustomerPricePolicy(this.curPriceTactic.CustomerGradeID, DefaultPriceEmuns.OnSellPrice.ID).catch(() => null);
        if (PolicyData) this.curPriceTactic.setPolicyTableList(PolicyData.PolicyList, this.twoLevelsProductClassify4Sort);
      });
    },
    handleInput([i, val]) { // 表体价格输入
      this.curPriceTactic.PolicyTableList[i].PercentValue = val;
    },
    checker() {
      if (this.curPriceTactic) {
        const { ActivateTime, PolicyTableList } = this.curPriceTactic;
        if (!ActivateTime) {
          this.messageBox.failSingleError('保存失败', '未设置生效时间');
          return false;
        }
        const bool = JSON.stringify(this.curPriceTactic) === this.localCurPriceTacticStringify;
        if (bool) {
          this.messageBox.failSingleError('保存失败', '该价格策略未进行更改');
          return false;
        }
        const t = PolicyTableList.find(it => !this.$utils.getValueIsOrNotNumber(it.PercentValue) || it.PercentValue <= 0);
        if (t) {
          this.messageBox.failSingleError('保存失败', '价格设置不正确，请检查（必须为数字且应大于0）');
          return false;
        }
        return true;
      }
      return false;
    },
    async handleSubmit() {
      if (this.checker()) {
        const bool = await PriceTactic.submit(this.curPriceTactic);
        if (bool) {
          const cb = () => {
            const t = this.curPriceTactic.AsideList.find(it => it.CategoryID === this.curPriceTactic.CustomerGradeID);
            if (t) {
              t.FutureTime = this.curPriceTactic.ActivateTime;
            }
            this.localCurPriceTacticStringify = JSON.stringify(this.curPriceTactic);
          };
          this.messageBox.successSingle('保存成功', cb, cb);
        }
      }
    },
  },
  mounted() {
    this.fetchInitData();
  },
};
</script>
<style lang='scss'>
.mp-price-tactic-list-page-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  background: #f5f5f5;
  padding-left: 8px;
  font-size: 14px;
  color: #585858;
  > header {
    margin-bottom: 10px;
    padding: 16px 0;
    padding-left: 50px;
    white-space: nowrap;
    > label {
      font-weight: 700;
      color: #444;
      margin-right: 6px;
    }
    > span {
      color: #888;
      margin-left: 8px;
    }
  }
  > main {
    flex: 1 !important;
    padding-top: 10px;
    overflow: hidden;
    div.m {
      padding-left: 22px;
      min-height: 100%;
      box-sizing: border-box;
      &.l {
        padding-bottom: 40px;
        position: relative;
        > .f {
          text-align: center;
          position: absolute;
          left: 10px;
          right: 0;
          bottom: 0;
        }
        > ul {
          > li {
            height: 32px;
            padding-left: 20px;
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            transition: 0.05 ease-in-out;
            &:hover {
              background: #f5f5f5;
            }
            &.active {
              background: #26bcf9;
              color: #fff;
              > .el-icon-success {
                &::before {
                  border-radius: 50%;
                  background-image: radial-gradient(circle, #fff 1%, #fff 50%, #80c269 61%, #80c269 100%);
                }
              }
            }
            > .n {
              // min-width: 6em;
              margin-right: 12px;
            }
            > .el-icon-success {
              font-size: 18px;
              margin-right: 8px;
            }
            > .is-gray {
              color: #cbcbcb !important;
            }
          }
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    padding-bottom: 25px;
    padding-right: 400px;
    button {
      width: 120px;
    }
  }
  > header, > main, > footer {
    flex: none;
    background: #fff;
  }
}
</style>
