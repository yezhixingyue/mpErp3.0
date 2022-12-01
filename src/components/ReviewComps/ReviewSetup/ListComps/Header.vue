<template>
  <header class="mp-erp-review-product-list-page-header-comp-wrap">
    <!-- <ProductSelectorIndexTwoLevels
      title="产品分类"
      :changePropsFunc="setCondition4ReviewProductList"
      :requestFunc="getList"
      :ClassID="condition4ReviewProductList.ProductClass.First"
      :TypeID="condition4ReviewProductList.ProductClass.Second"
      :typeList="[['ProductClass', 'First'],['ProductClass', 'Second']]" /> -->
    <EpCascaderByLv2ProductOrOther
       title="产品分类"
      :showLine="false"
      :setCondition="setCondition4ReviewProductList"
      :getList="getList"
      :First="condition4ReviewProductList.ProductClass.First"
      :Second="condition4ReviewProductList.ProductClass.Second"
      :typeList="[['ProductClass', 'First'],['ProductClass', 'Second']]"
    />
    <div class="intro">
      <p class="tips-box">
        <i class="el-icon-warning"></i>
        <span>当条件不匹配时，执行如下操作：</span>
        <span class="c" :title="displayContent">{{displayContent}}</span>
      </p>
    </div>
    <div v-if="hasPermission">
      <el-button type="primary" @click="onDefaultFlowSetupClick" :disabled="!data">设置默认流程</el-button>
      <el-button type="primary" @click="onFileOutManageClick">管理输出文件</el-button>
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
// import ProductSelectorIndexTwoLevels from '@/components/common/SelectorComps/ProductSelectorIndexTwoLevels.vue';
import EpCascaderByLv2ProductOrOther from '../../../common/SelectorComps/EpCascaderWrap/EpCascaderByLv2ProductOrOther.vue';

export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
    originData: {
      type: Object,
      default: null,
    },
    hasPermission: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    // ProductSelectorIndexTwoLevels,
    EpCascaderByLv2ProductOrOther,
  },
  computed: {
    ...mapState('review', ['condition4ReviewProductList']),
    displayContent() {
      if (!this.originData && this.data) return '尚未设置，请及时设置';
      if (!this.originData) return '';
      return this.data ? this.data.getDisplayContent() : '';
    },
  },
  methods: {
    ...mapMutations('review', ['setCondition4ReviewProductList']),
    getList() {
      this.$store.dispatch('review/getReviewProductList');
    },
    onDefaultFlowSetupClick() {
      this.$emit('setDefaultFlow');
    },
    onFileOutManageClick() {
      this.$emit('outFileManage');
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-product-list-page-header-comp-wrap {
  display: flex;
  align-items: center;
  font-size: 14px;
  flex: none;
  padding: 13px 33px;
  padding-right: 2px;
  box-sizing: border-box;
  overflow: hidden;
  background: #fff;
  padding-right: 30px;
  > ul, > div {
    flex: none;
    &.mp-order-product-select-wrap {
      > .text {
        color: #888E99;
        font-weight: 400;
        position: relative;
        top: -1px;
      }
      > li:not(.text) {
        position: relative;
        top: -1px;
        .el-input {
          input {
            border: 1px solid #cbcbcb;
            border-radius: 3px;
            height: 30px;
            width: 130px;
            padding-left: 15px;
            padding-right: 30px;
          }
          &::after {
            display: none;
          }
          .el-input__suffix {
            display: block;
            top: -1px;
            .el-select__caret {
              color: #666;
            }
          }
        }
      }
    }
  }
  > div {
    white-space: nowrap;
    &.intro {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      padding: 0 10px;
      > p {
        width: auto;
        padding-right: 25px;
        max-width: 100%;
        display: flex;
        align-items: center;
        font-size: 14px;
        > i {
          position: relative;
          top: -1px;
        }
        > span {
          flex: none;
        }
        > span.c {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    > .el-button {
      margin-left: 25px;
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
  .mp-common-comps-ep-cascader-comp-wrap {
    margin-right: 15px;
    top: 1px;
    position: relative;
  }
}
</style>
