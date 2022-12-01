<template>
  <ul v-if="ruleForm" class="mp-erp-review-allocation-setup-page-main-right-panel-wrap">
    <li class="f">
      <el-checkbox v-model="ruleForm.IsDistributionSelf" class="help-box">代客下单的订单分配给下单人员</el-checkbox>
      <div v-show="ruleForm.IsDistributionSelf">
        <p>如下单人员审稿不在线，或强制退出重新分配时，分配至如下审稿组：</p>
        <ReviewGroupListSelectComp :list="reviewGroupList"  v-model="ruleForm.OffLineDistributionGroupList" />
      </div>
    </li>
    <li>
      <p>{{ruleForm.IsDistributionSelf?'其它':'所有'}}订单分配给如下审稿组：</p>
      <ReviewGroupListSelectComp :list="reviewGroupList"  v-model="ruleForm.OtherOrderDistributionGroupList" />
    </li>
  </ul>
</template>

<script>
import ReviewAllocationItemClass from './ReviewAllocationItemClass';
import ReviewGroupListSelectComp from './ReviewGroupListSelectComp';

export default {
  props: {
    item: {
      type: Object,
      default: null,
    },
    reviewGroupList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ReviewGroupListSelectComp,
  },
  data() {
    return {
      ruleForm: null,
    };
  },
  methods: {
    getInfo() {
      if (!this.ruleForm.checker()) return null;
      const temp = {
        ...this.ruleForm,
      };
      if (!temp.IsDistributionSelf) {
        temp.OffLineDistributionGroupList = [];
      }
      return temp;
    },
  },
  mounted() {
    this.ruleForm = new ReviewAllocationItemClass(this.item);
  },
};
</script>
<style lang='scss'>
.mp-erp-review-allocation-setup-page-main-right-panel-wrap {
  > li {
    &.f {
      min-height: 170px;
      > .help-box {
        margin-bottom: 20px;
      }
      > div {
        margin-left: 35px;
        p {
          color: #989898;
        }
      }
    }
    p {
      padding-bottom: 10px;
      color: #444;
    }
  }
}
</style>
