<template>
  <section class="mp-erp-product-list-page-product-sub-fromula-filer-data-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="other">-- 子公式目标：{{curEditSubFormulaData && curEditSubFormulaData.Target ? curEditSubFormulaData.Target : '未知目标'}}</span>
      <span class="other">子公式：{{curEditSubFormulaData? curEditSubFormulaData.Name:'未知'}}</span>
    </header>
    <main>
      <ContionCommonComp
       v-if="propertyList && propertyList.length > 0 && ComparePropertyList.length > 0"
       :showPriority='false' ref="oLeftCondition"
       :PropertyList='propertyList'
       :curEditData='curEditData'
       single
       :curTargetID='curTargetID'
       :ComparePropertyList='ComparePropertyList' />
       <div v-if="(!propertyList || propertyList.length === 0) && !loading" class="empty">
         <img src="@/assets/images/null.png" alt="">
         <p class="tips-box is-pink"><i class="el-icon-warning"></i> 暂无可用的属性列表, 该子公式尚不可设置数据筛选</p>
       </div>
    </main>
    <footer>
      <el-button :disabled='!propertyList || propertyList.length === 0' @click="onSubmitClick" class="is-blue-button" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';

export default {
  name: 'PriceFormulaFilterPage',
  data() {
    return {
      ProductID: '',
      ProductName: '',
      moduleIndex: '',
      propertyList: [],
      ComparePropertyList: [],
      curEditData: null,
      loading: false,
    };
  },
  components: {
    ContionCommonComp,
  },
  computed: {
    ...mapState('priceManage', ['curEditSubFormulaData']),
    curTargetID() {
      if (!this.propertyList || this.propertyList.length === 0) return '';
      const { Part, Product } = this.propertyList[0];
      if (Part) return Part.ID;
      if (Product) return Product.ID;
      return '';
    },
  },
  methods: {
    async getPositionID() {
      const { ProductID, name, moduleIndex } = this.$route.params;
      this.ProductID = ProductID;
      this.ProductName = name;
      this.moduleIndex = +moduleIndex;
      this.getPropertyList();
    },
    async getPropertyList() { // 获取关联属性列表数据
      if (!this.curEditSubFormulaData) return;
      const { Constraint } = this.curEditSubFormulaData;
      if (Constraint) this.curEditData = { Constraint };
      const idObj = PropertyClass.getPropIDsObj(this.curEditSubFormulaData);
      this.loading = true;
      // const propertyList = await PropertyClass.getPropertyList({ ...idObj, UseModule: this.moduleIndex });
      const [propertyList, ComparePropertyList] = await Promise.all([
        PropertyClass.getPropertyList({ ...idObj, UseModule: this.moduleIndex }),
        PropertyClass.getPropertyList({ ...idObj, UseModule: 29 }),
      ]);
      this.loading = false;
      if (propertyList) this.propertyList = propertyList;
      if (ComparePropertyList) this.ComparePropertyList = ComparePropertyList;
    },
    onSubmitClick() {
      const condition = this.$refs.oLeftCondition.getConditonResult();
      if (!condition) return;
      this.onSubmitSave(condition);
    },
    async onSubmitSave({ Constraint }) {
      const { ID } = this.curEditSubFormulaData;
      if (!ID || !Constraint) return;
      const temp = { FormulaID: ID, Constraint };
      const resp = await this.api.getFormulaFilterSave(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const path = `/PriceFormulaList/${this.ProductID}/${this.ProductName}/${Date.now()}`;
          this.$router.push(path);
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    onGoBackClick() {
      this.$goback();
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-sub-fromula-filer-data-set-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  > header {
    padding: 30px 0;
    padding-bottom: 20px;
    line-height: 15px;
    box-sizing: border-box;
    // height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    > p {
      padding-top: 45px;
      > button {
        font-size: 14px;
      }
    }
    .other {
      font-weight: 400;
      font-size: 14px;
      margin-left: 40px;
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    .right-content-main-wrap {
      display: flex;
      > span {
        color: #888E99;
        font-size: 14px;
        margin-right: 10px;
        padding-top: 10px;
      }
      .file-list {
        > li {
          padding: 9px 0;
          display: flex;
          align-items: center;
          > .el-checkbox {
            display: flex;
            align-items: center;
            > .el-checkbox__label {
              color: #585858;
              font-size: 12px;
            }
            &:first-of-type {
              width: 120px;
              overflow: hidden;
              vertical-align: middle;
              margin-right: 0;
              > .el-checkbox__label {
                max-width: 85px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
    .left-content {
      > main {
        > .el-radio-group.mp-common-tab-radio-box {
          width: 782px;
        }
        .el-form.constraint-ruleForm {
          flex: unset !important;
        }
      }
    }
    > .empty {
      padding-top: 50px;
      > img {
        margin-left: 20px;
        margin-bottom: 18px;
      }
    }
  }
  > footer {
    text-align: left;
    padding: 25px;
    padding-top: 40px;
    flex: none;
    padding-left: 252px;
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
