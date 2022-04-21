<template>
  <section class="mp-erp-cash-back-setup-page-wrap">
    <header>
      <p class="mp-common-title-wrap">{{type}}消费返现</p>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='45%'>
        <template v-slot:left>
          <PrintBeanSetupLeftComp :curItemData='curItemData' @change="onChange" isCashBack :isStarted="isStarted" />
        </template>
        <template v-slot:right>
          <BackCashSetupRightComp
           :ItemList='rightItemList'
           @add='onRightItemAddClick'
           @remove="onRightItemRemoveClick"
           @productSetup='handleRightProductItemSetup'
           @productRemove='handleRightProductItemRemove'
           @productFilter='handleRightProductConditionSetup'
           @returnValueSetup='handleRightReturnValueItemSetup'
           @returnValueRemove='handleRightReturnValueItemRemove'
           />
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button @click="onGobackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import PrintBeanSetupLeftComp from '../../components/PrintBeanComps/PrintBeanSetupLeftComp.vue';
import BackCashSetupRightComp from '../../components/BackCashComps/BackCashSetupRightComp/index.vue';
import CashBackItemClass from '../../store/cashback/CashBackItemClass';

export default {
  name: 'CashBackSetupPage',
  components: {
    LRWidthDragAutoChangeComp,
    PrintBeanSetupLeftComp,
    BackCashSetupRightComp,
  },
  computed: {
    ...mapState('cashback', ['curItemData', 'curItemOriginData']),
    type() {
      return this.ID ? '编辑' : '添加';
    },
    rightItemList() {
      return this.curItemData?.ItemList || [];
    },
    isStarted() { // 该项目是否已经开始，影响：1.不允许设置开始日期 2. 不允许删除右侧已有印豆列表项目
      if (this.isEdit) {
        if (this.curItemOriginData?.StartTime) {
          return new Date(this.curItemOriginData.StartTime).getTime() < Date.now();
        }
        return true;
      }
      return false;
    },
  },
  methods: {
    onGobackClick() {
      this.$goback();
    },
    async getInitData() {
      this.$store.commit('cashback/setCurItemData', [null, null]);
      const ID = this.$route.params.ID && this.$route.params.ID !== 'null' ? this.$route.params.ID : '';
      let temp = null;
      if (ID) {
        // 编辑 -- 对temp进行重新赋值
        const resp = await this.api.getConsumeReturnCashDetail(ID).catch(() => null);
        if (resp && resp.data.Status === 1000) {
          temp = resp.data.Data;
        } else {
          this.onGobackClick();
        }
      }
      this.$store.commit('cashback/setCurItemData', [temp, new CashBackItemClass(temp)]);
      this.$store.dispatch('cashback/getAllPropertyList');
    },
    onChange([key, val, key2]) {
      this.$store.commit('cashback/setCurItemDataChange', [key, val, key2]);
    },
    onSubmitClick() {
      const bool = this.curItemData.check();
      if (bool) {
        const temp = this.curItemData.transfromToSubmit();
        const handleSuccess = () => {
          const cb = () => {
            this.onGobackClick();
          };
          this.messageBox.successSingle('保存成功', cb, cb);
        };
        this.$store.dispatch('cashback/submitCashBackSave', [temp, handleSuccess]);
      }
    },
    async onRightItemAddClick() {
      if (!this.curItemData) return;
      this.$store.commit('cashback/setCurItemDataAddNewRightItem');

      await this.$nextTick();
      const oRightWrap = document.querySelector('.right.mp-scroll-wrap .mp-scroll-wrap');
      if (oRightWrap) {
        oRightWrap.scrollTop = 10000;
      }
    },
    onRightItemRemoveClick(i) {
      if (i < -1) return;
      this.$store.commit('cashback/setCurItemDataRightItemRemove', i);
    },
    handleRightProductItemSetup(data, i, level2Index) { // level2Index为-1时为新增
      this.$store.commit('cashback/handleRightProductItemSetup', [data, i, level2Index]);
    },
    handleRightProductItemRemove(level2Index, i) {
      this.$store.commit('cashback/handleRightProductItemRemove', [i, level2Index]);
    },
    handleRightProductConditionSetup(level2Index, level1Index) {
      this.$router.push({
        name: 'cashBackConditionSetup',
        params: { level1Index, level2Index },
      });
    },
    handleRightReturnValueItemSetup(data, i, level2Index) { // level2Index为-1时为新增
      this.$store.commit('cashback/handleRightReturnValueItemSetup', [data, i, level2Index]);
    },
    handleRightReturnValueItemRemove(level2Index, i) {
      this.$store.commit('cashback/handleRightReturnValueItemRemove', [i, level2Index]);
    },
  },
  mounted() {
    this.getInitData();
    this.$store.dispatch('common/getProductClassifyData', { key: 6 });
    this.$store.dispatch('common/getAllProductNames');
  },
};
</script>
<style lang='scss'>
.mp-erp-cash-back-setup-page-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding-right: 12px;
  > header {
    flex: none;
    padding: 35px 45px;
  }
  > main {
    flex: 1;
    font-size: 14px;
    color: #585858;
    overflow: hidden;
  }
  > footer {
    flex: none;
    height: 104px;
    padding-top: 36px;
    box-sizing: border-box;
    text-align: center;
    > button.el-button {
      width: 120px;
      height: 35px;
      padding: 0;
      & + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
