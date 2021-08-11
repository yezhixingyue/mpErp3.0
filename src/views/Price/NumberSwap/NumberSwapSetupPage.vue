<template>
  <section class="mp-erp-price-module-number-swap-setup-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="name">价格名称：{{PriceName}}</span>
      <span class="name">设置部件：{{$route.params.partName}}</span>
    </header>
    <main :class="{loading: loading}">
      <ContionCommonComp ref="oLeftComp" :ComparePropertyList='leftConditionPropList' :PropertyList='leftConditionPropList'
       leftWidth='715px' :curEditData='curNumberSwapData'>
        <!-- 右侧面板 -->
        <RightSetupPanel :leftPropList='rightSelfPropList' :rightPropList='rightComparePropList' />
      </ContionCommonComp>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button @click="onGoBackClick" class="go-back">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import RightSetupPanel from '@/components/PriceComps/NumberSwap/RightSetupPanel.vue';

export default {
  name: 'NumberSwapSetup',
  components: {
    ContionCommonComp,
    RightSetupPanel,
  },
  data() {
    return {
      PriceID: '',
      PriceName: '',
      ProductID: '',
      ProductName: '',
      loading: true,
      leftConditionPropList: [],
      rightSelfPropList: [],
      rightComparePropList: [],
    };
  },
  computed: {
    ...mapState('priceManage', ['curPriceItem', 'curNumberSwapData']),
  },
  methods: {
    initDataFromPath() {
      const { ID, Name } = this.curPriceItem;
      this.PriceID = ID;
      this.PriceName = Name;
      this.ProductID = this.$route.params.id;
      this.ProductName = this.$route.params.name;
      this.fetchPropertyLists();
    },
    onGoBackClick() {
      this.$router.replace({
        name: 'NumberSwapList',
        params: {
          name: this.$route.params.name,
          id: this.$route.params.id,
        },
      });
    },
    onSubmitClick() {
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      if (this.checkList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择方案');
        return;
      }
      const temp = { ...condition, ...this.form, PriceID: this.PriceID };
      this.submitSave(temp);
    },
    async submitSave(data) {
      const resp = await this.api.getPriceResultSetup(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        // 保存成功
        const isEdit = !!data.ID;
        const msg = isEdit ? '编辑成功' : '添加成功';
        const callback = () => {
          // this.$emit('successSubmit', [isEdit, data, resp.data.Data]);
          this.$store.commit('priceManage/setPriceResultItemChange', [data, resp.data.Data, this.ProductID, this.PriceID]);
          this.onGoBackClick();
        };
        this.messageBox.successSingle(msg, callback, callback);
      }
    },
    async fetchPropertyLists() {
      const getTemp = (UseModule) => ({
        ProductID: this.$route.params.id,
        PartID: this.$route.params.partID === 'null' ? '' : this.$route.params.partID,
        UseModule,
      });
      const [leftConditionPropList, rightSelfPropList, rightComparePropList] = await Promise.all([
        PropertyClass.getPropertyList(getTemp(30)),
        // PropertyClass.getPropertyList(getTemp(33)),
        PropertyClass.getPropertyList(getTemp(21)), // 应使用33 暂用21代替开发
        PropertyClass.getPropertyList(getTemp(21)),
      ]);
      this.loading = false;
      this.leftConditionPropList = leftConditionPropList || [];
      this.rightSelfPropList = rightSelfPropList || [];
      this.rightComparePropList = rightComparePropList || [];
    },
  },
  mounted() {
    this.initDataFromPath();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-number-swap-setup-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 20px;
    line-height: 15px;
    box-sizing: border-box;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    .name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
      & + .name {
        margin-left: 40px;
      }
    }
    > p {
      padding-top: 40px;
      > button {
        width: 125px;
        font-size: 14px;
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    padding-left: 5px;
    &.loading {
      opacity: 0.2;
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    bottom: 20px;
    > button {
      width: 120px;
      height: 35px;
      border-radius: 3px;
      padding: 0;
      &.go-back {
        border: 1px solid #26BCF9;
        color: #26BCF9;
        margin-left: 40px;
      }
    }
  }
}
</style>
