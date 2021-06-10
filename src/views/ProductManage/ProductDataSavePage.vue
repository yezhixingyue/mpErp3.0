<template>
  <section class="mp-erp-product-manage-module-product-save-page-wrap">
    <header>
      <span class="mp-common-title-wrap">{{title}}</span>
    </header>
    <LRWidthDragAutoChangeComp leftWidth='450px'>
      <template v-slot:left>
        <ul class="left-content">
          <li>
            <p>内部名称：</p>
            <el-input size="small" v-model.trim="productData.Name"></el-input>
            <span class="tip">内部名称不能重复，仅内部可见</span>
          </li>
          <li>
            <p>显示名称：</p>
            <el-input size="small" v-model.trim="productData.ShowName"></el-input>
            <span class="tip">显示名称可重复，用于下单界面展示</span>
          </li>
          <li>
            <p>是否标准化产品：</p>
            <el-checkbox v-model="productData.IsSpacial">非标准化产品</el-checkbox>
            <span class="tip">（ 非标准化产品允许修改价格，允许编写订单备注 ）</span>
          </li>
        </ul>
      </template>
      <template v-slot:right>
        <div class="right-content">
          <p>所属产品分类：</p>
        </div>
      </template>
    </LRWidthDragAutoChangeComp>
    <footer>
      <el-button class="blue-full-color-btn-styles is-blue-button " type="primary">保存</el-button>
      <el-button><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';

export default {
  data() {
    return {
      title: '',
      productData: {
        ID: '',
        Name: '',
        ShowName: '',
        IsSpacial: false,
      },
    };
  },
  components: {
    LRWidthDragAutoChangeComp,
  },
  computed: {
    ...mapState('productManage', ['curEditData']),
    ...mapState('common', ['ProductClassifyIDList']),
    ...mapGetters('common', ['twoLevelsMultipleProductClassifyList4Sort']),
  },
  methods: {
    getInitData() {
      const { type } = this.$route.params;
      this.title = type === 'edit' && this.curEditData ? '编辑产品' : '添加产品';
      if (type === 'edit' && !this.curEditData) this.onGoback();
    },
    onGoback() {
      this.$router.replace('/ProductManageList');
    },
  },
  mounted() {
    this.getInitData();
    this.ProductClassifyIDList.forEach(({ ID }) => {
      this.$store.dispatch('common/getProductClassifyData', { key: ID });
    });
  },
  activated() {
    this.getInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-manage-module-product-save-page-wrap {
  padding: 25px 20px;
  height: 100%;
  box-sizing: border-box;
  > header {
    padding-bottom: 30px;
  }
  > section {
    height: calc(100% - 110px);
    min-height: 400px;
    ul.left-content {
      padding-top: 10px;
      min-width: 400px;
      > li {
        margin-bottom: 40px;
        > p {
          font-weight: 700;
          font-size: 14px;
          color: #444;
          margin-bottom: 11px;
        }
        > .el-input {
          width: 300px;
          display: block;
          margin-bottom: 4px;
          input {
            border-color: #e5e5e5;
            border-radius: 2px;
          }
        }
        > span {
          font-size: 12px;
          color: #a2a2a2;
        }
      }
    }
    div.right-content {
      padding-top: 10px;
      padding-left: 52px;
      > p {
        font-weight: 700;
        font-size: 14px;
        color: #444;
        margin-bottom: 11px;
      }
    }
  }
  > footer {
    padding-top: 30px;
    text-align: center;
    > button {
      width: 120px;
      height: 35px !important;
      padding: 0;
    }
  }
}
</style>
