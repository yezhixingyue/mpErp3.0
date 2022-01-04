<template>
  <section class="mp-product-production-period-composition-list-page" v-if="curSetupProduct">
    <header>
      <p>
        <label>当前产品：</label>
        <span>{{curSetupProduct.Name}}</span>
      </p>
      <TopRadioButtonComp
        v-model="SolutionID"
        title="工期"
       :list='SolutionList'
       :loading='false'
       @remove='onRemoveClick'
       @itemSave='onItemSaveClick'
       />
    </header>
    <main>
      <DialogSaveComp :visible.sync='visible' :saveData='saveData' @submit="handleDialogSubmit" />
      <ResultFormulaTableCom
       v-show="SolutionID"
       title="工期列表"
       operationTitle='工期条目'
       hiddenTip
       usePropList
       :FormulaList='PeriodItemFormulaList'
       :PropertyList='PeriodItemConditionPropertyList'
       :isLoading='loading'
       :disabled='!SolutionID'
       @setup='onFormulaSetupClick' @remove="onFormulaRemove"
       />
       <p v-show="!SolutionID" class="tips-box is-pink" style="margin: 0;width:300px"> <i  class="el-icon-warning"></i>请设置并选择工期方案</p>
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import TopRadioButtonComp from '@/components/common/NewComps/TopRadioButtonComp';
import DialogSaveComp from '@/components/ProducePeriodComps/ProductionPeriodComps/ProductionPeriodCompositionSolutionDialogSaveComp.vue';
import ResultFormulaTableCom from '@/components/PriceComps/PriceTableItem/ResultFormulaTableCom.vue';

export default {
  name: 'ProductionPeriodCompositionListPage',
  components: {
    TopRadioButtonComp,
    DialogSaveComp,
    ResultFormulaTableCom,
  },
  computed: {
    ...mapState('periodManage', ['loading', 'PeriodItemFormulaList', 'PeriodItemConditionPropertyList']),
    ...mapGetters('periodManage', ['curSetupProduct']),
    SolutionList() {
      if (this.curSetupProduct) {
        return this.curSetupProduct.PeriodItemList || [];
      }
      return [];
    },
    curSolutionItem() {
      if (!this.SolutionID) return null;
      return this.SolutionList.find(it => it.ID === this.SolutionID);
    },
    params4FormulaList() { // 获取公式列表的params参数
      return { ProduceItemID: this.SolutionID, UseModule: 9, ProductID: this.curSetupProduct.ID };
    },
    params4FormulaConditionPropertyList() { // 获取公式条件属性列表的params参数
      return { UseModule: 44, ProductID: this.curSetupProduct.ID };
    },
  },
  data() {
    return {
      SolutionID: '',
      visible: false,
      saveData: { ID: '', Name: '', ProductID: '' },
      isNewItemCreate: false,
    };
  },
  methods: {
    onGoBackClick() { // 返回页面
      this.$goback();
    },
    onRemoveClick() {
      this.messageBox.warnCancelBox('确定要删除当前工期吗', `工期名称：[ ${this.curSolutionItem ? this.curSolutionItem.Name : '未知工期'} ]`, () => {
        this.handleSolutionRemove();
      });
    },
    async handleSolutionRemove() { // 方案删除
      const resp = await this.api.getWorkPeriodProducePeriodRemove(this.SolutionID).catch(() => {});
      const cb = () => {
        const i = this.SolutionList.findIndex(it => it.ID === this.SolutionID);
        if (i > -1) {
          const id = this.SolutionID;
          this.SolutionID = '';
          this.$store.commit('periodManage/setCompositionSolutionRemove', id);
        }
      };
      if (resp && resp.data.Status === 1000) {
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    onItemSaveClick(ID) { // 工期方案保存
      const t = this.SolutionList.find(it => it.ID === ID);
      if (t) {
        this.saveData.ID = ID;
        this.saveData.Name = t.Name;
      } else {
        this.saveData.ID = '';
        this.saveData.Name = '';
      }
      this.saveData.ProductID = this.curSetupProduct.ID;
      this.visible = true;
    },
    async handleDialogSubmit(data) { // 方案提交保存  尚未考虑PeriodList相关变动 后面补充 ---------------------- ！！！
      const nameSameItem = this.SolutionList.find(it => it.Name === data.Name);
      if (nameSameItem) {
        if (nameSameItem.ID === data.ID) {
          this.messageBox.failSingleError('保存失败', '方案名称未变化');
        } else {
          this.messageBox.failSingleError('保存失败', '方案名称重复');
        }
        return;
      }
      const resp = await this.api.getWorkPeriodProducePeriodSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = { ...data };
          if (!temp.ID && resp.data.Data) temp.ID = resp.data.Data;
          this.$store.commit('periodManage/setCompositionSolutionSave', temp);
          if (this.SolutionList.length === 1 && !this.SolutionID) {
            // 可以设置一个临时开关为true 以阻止此处下方列表数据的获取
            this.isNewItemCreate = true;
          }
          this.visible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    getPriceTableList() { // 获取列表数据
      this.$store.dispatch('periodManage/getPeriodItemFormulaList', {
        params4FormulaList: this.params4FormulaList,
        params4FormulaConditionPropertyList: this.params4FormulaConditionPropertyList,
        isNewItemCreate: this.isNewItemCreate, // 如果为初始生成，则不用获取列表数据，直接设置为[]
      });
      this.isNewItemCreate = false;
    },
    onFormulaSetupClick(item) { // 工期公式 添加与编辑
      this.$store.commit('periodManage/setCurEditFormulaData', item);
      this.$router.push({ name: 'ProductionPeriodCompositionSetup', params: { ProduceItemID: this.SolutionID, ProduceItemName: this.curSolutionItem.Name } });
    },
    onFormulaRemove({ ID }) { // 工期公式删除
      this.$store.dispatch('periodManage/getPeriodItemFormulaRemove', { ID });
    },
  },
  watch: {
    SolutionList: {
      handler(newVal) {
        if (newVal.length > 0 && !this.SolutionID) this.SolutionID = newVal[0].ID;
      },
      immediate: true,
    },
    SolutionID: {
      handler(val) {
        if (!val) return;
        this.getPriceTableList();
      },
      immediate: true,
    },
  },
  mounted() {
    this.$store.commit('periodManage/setPeriodItemFormulaList', [[], []]);
  },
};
</script>
<style lang='scss'>
.mp-product-production-period-composition-list-page {
  background-color: #f5f5f5;
  padding: 8px;
  padding-top: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    background-color: #fff;
    flex: 0;
    padding: 20px;
    margin-bottom: 10px;
    > p {
      color: #21CAE3;
      font-size: 15px;
      font-weight: 700;
      padding-bottom: 15px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    padding: 20px;
  }
  > footer {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    padding-right: 120px;
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
