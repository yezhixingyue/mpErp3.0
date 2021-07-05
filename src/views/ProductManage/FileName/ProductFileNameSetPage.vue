<template>
  <section class="mp-erp-product-list-page-product-file-name-set-comp-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
      <div v-if="productData">
        <div class="left">
          <el-checkbox v-model="productData.AllowAnalysisName">允许进行文件名解析</el-checkbox>
          <el-checkbox v-model="productData.AllowBatchUpload">允许进行批量上传</el-checkbox>
          <el-checkbox v-model="productData.IsAppendWeight">附加重量</el-checkbox>
          <el-checkbox v-model="productData.IsAppendPrice">附加价格 （如果有的话）</el-checkbox>
        </div>
        <ul class="right">
          <li>
            <span>分隔符：</span>
            <el-input size="small" v-model.trim="productData.SplitChars"></el-input>
          </li>
          <li>
            <span>部件开始结束符号：</span>
            <el-input size="small" v-model.trim="productData.PartSplitChars"></el-input>
          </li>
          <li>
            <span>元素组开始结束符号：</span>
            <el-input size="small" v-model.trim="productData.GroupSplitChars"></el-input>
          </li>
          <li class="explain" @click="onExplainClick">
            <i>?</i>
            <span>说明</span>
          </li>
        </ul>
      </div>
    </header>
    <main>
      <ExplainDrawer :visible.sync='drawer' />
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ExplainDrawer from '@/components/ProductManageComps/FileName/ExplainDrawer.vue';

export default {
  components: {
    ExplainDrawer,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
  },
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      productData: null,
      drawer: false,
    };
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
      this.getProductOrderData();
    },
    async getProductOrderData(dataType = ['FalseWords']) { // 获取初始产品信息
      const ID = this.PartID ? this.PartID : this.ProductID;
      const _fetchFunc = this.PartID ? this.api.getPartModuleData : this.api.getProductModuleData;
      const List = this.$utils.getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID, List };
      const resp = await _fetchFunc(_temp).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        // 获取数据成功
        this.productData = resp.data.Data;
      }
    },
    onGoBackClick() {
      this.$router.replace('/ProductManageList');
    },
    onExplainClick() {
      this.drawer = true;
    },
    onSubmitClick() {
      console.log('onSubmitClick');
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-file-name-set-comp-wrap {
  height: 100%;
  // width: 1724px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding: 10px;
  overflow: auto;
  > header {
    padding: 30px 0;
    line-height: 15px;
    box-sizing: border-box;
    height: 200px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    background-color: #fff;
    padding-left: 20px;
    margin-bottom: 10px;
    width: 1714px;
    > div {
      padding-top: 28px;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      > .left {
        display: flex;
        align-items: center;
        width: 400px;
        min-width: 354px;
        flex-wrap: wrap;
        padding-top: 22px;
        border-right: 1px solid #eee;
        > .el-checkbox {
          display: flex;
          align-items: center;
          width: 140px;
          margin-bottom: 15px;
          > .el-checkbox__label {
            font-size: 12px;
            color: #585858;
          }
        }
      }
      > ul {
        display: flex;
        padding-left: 30px;
        padding-bottom: 15px;
        align-items: flex-end;
        > li {
          > span {
            color: #888E99;
            margin-bottom: 10px;
            display: block;
          }
          width: 280px;
          margin-right: 18px;
          &.explain {
            margin-left: 15px;
            padding-left: 15px;
            height: 20px;
            line-height: 20px;
            display: flex;
            border-left: 1px solid #eee;
            margin-bottom: 6px;
            font-size: 12px;
            align-items: center;
            cursor: pointer;
            user-select: none;
            width: 60px;
            > i {
              margin-right: 5px;
              width: 13px;
              height: 13px;
              color: #FF3769;
              border: 1px solid #FF3769;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            > span {
              margin: 0;
            }
            &:hover {
              > span {
                color: #444;
              }
            }
          }
        }
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    padding-left: 20px;
    background-color: #fff;
    width: 1714px;
    box-sizing: border-box;
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    padding-left: 20px;
    background-color: #fff;
    padding-bottom: 30px;
    padding-right: 300px;
    width: 1714px;
    box-sizing: border-box;
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
