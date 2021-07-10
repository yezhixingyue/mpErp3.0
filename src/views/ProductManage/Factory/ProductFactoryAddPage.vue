<template>
  <section class="mp-erp-product-list-page-product-factory-add-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftCondition" :PropertyList='ProductFactoryPropertyList' :curEditData='curEditFactoryData'>
        <div>
          <span>默认生产工厂：</span>
          <el-select v-model="defaultFactory" placeholder="请选择" size="small">
            <el-option
              v-for="item in factoryList"
              :key="item.FactoryID"
              :label="item.FactoryName"
              :disabled='checkedFactoryList.includes(item.FactoryID)'
              :value="item.FactoryID">
            </el-option>
          </el-select>
        </div>
        <div>
          <span>可选生产工厂：</span>
          <el-checkbox-group v-model="checkedFactoryList">
            <el-checkbox
              v-for="it in factoryList"
             :label="it.FactoryID"
             :key="it.FactoryID"
             :disabled='it.FactoryID === defaultFactory'
             >{{it.FactoryName}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </ContionCommonComp>
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';

export default {
  name: 'ProductFactoryAddPage',
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      defaultFactory: '', // 默认工厂
      checkedFactoryList: [], // 普通工厂列表
    };
  },
  components: {
    ContionCommonComp,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'ProductFactoryPropertyList', 'curEditFactoryData']),
    ...mapState('common', ['factoryList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
    },
    onGoBackClick() {
      // this.$router.replace(`/ProductFactorySet/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/${Date.now()}`);
      // this.$router.go(-1);
      this.$goback();
    },
    findFactoryByID(FactoryID) {
      return this.factoryList.find(it => it.FactoryID === FactoryID);
    },
    getFactoryList() {
      const list = this.checkedFactoryList
        .map(it => this.findFactoryByID(it))
        .filter(it => it)
        .map(it => ({ Factory: it, IsDefault: false }));
      const defaultFactory = this.findFactoryByID(this.defaultFactory);
      if (!defaultFactory) {
        this.messageBox.failSingleError('保存失败', '默认工厂数据寻找错误，请联系IT部门');
        return false;
      }
      list.push({ Factory: defaultFactory, IsDefault: true });
      return list;
    },
    onSubmitClick() { // 点击保存
      const condition = this.$refs.oLeftCondition.getConditonResult();
      if (!condition) return;
      if (!this.defaultFactory && this.defaultFactory !== 0) {
        this.messageBox.failSingleError('保存失败', '请选择默认工厂');
        return;
      }
      const { ID, Priority, Constraint } = condition;
      const FactoryList = this.getFactoryList();
      if (!FactoryList) return;
      const temp = { ID, Priority, Constraint, FactoryList, ProductID: this.ProductID };
      this.ProductFactorySubmitHandler(temp);
    },
    async ProductFactorySubmitHandler(data) { // getProductFactoryAddSave
      const resp = await this.api.getProductFactoryAddSave(data).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const isEdit = data.ID || data.ID === 0;
        const cb = () => {
          this.$store.commit('productManage/setProductFactorySave', [{ ...data, ID: resp.data.Data }, isEdit]);
          this.onGoBackClick();
        };
        const title = isEdit ? '编辑成功' : '添加成功';
        this.messageBox.successSingle(title, cb, cb);
      }
    },
  },
  mounted() {
    this.getPositionID();
    this.$store.dispatch('common/getFactoryList');
    if (!this.curEditFactoryData) return;
    const { FactoryList } = this.curEditFactoryData;
    if (!Array.isArray(FactoryList) || FactoryList.length === 0) return;
    const _default = FactoryList.find(it => it.IsDefault);
    if (_default) {
      this.defaultFactory = _default.Factory.FactoryID;
    }
    this.checkedFactoryList = FactoryList.filter(it => !it.IsDefault).map(it => it.Factory.FactoryID);
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-factory-add-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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
  }
  > main {
    flex: 1;
    padding-top: 15px;
    .right-content-main-wrap {
      > div {
        display: flex;
        > span {
          color: #888E99;
          flex: none;
          line-height: 32px;
          margin-right: 6px;
        }
        > .el-select {
          width: 120px;
          .el-input__inner {
            font-size: 12px;
            color: #585858;
          }
        }
        &:first-of-type {
          margin-bottom: 30px;
        }
        .el-checkbox-group {
          padding-top: 6px;
          .el-checkbox {
            margin-bottom: 10px;
            width: 130px;
            margin-right: 10px;
            .el-checkbox__label {
              font-size: 12px;
              color: #585858;
              display: inline-block;
              vertical-align: middle;
              max-width: 108px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    padding-top: 40px;
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
