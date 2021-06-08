<template>
  <section class="mp-erp-time-limit-set-page-content-product-select-comp-wrap">
    <header>指定产品：</header>
    <div>
      <p><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" :disabled='productDisabled'
        >全选</el-checkbox></p>
      <el-checkbox-group v-model="checkList" :disabled='productDisabled'>
        <el-checkbox v-for="item in showList" :key="item.ID" :label="item.ID">
          {{item.Name}}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  props: {
    ProductList: {
      type: Array,
      required: true,
    },
    ProductClass: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('timelimit', ['setPageType', 'TimeLimitData']),
    ...mapGetters('common', ['allProductClassify']),
    showList() {
      if (!this.allProductClassify || this.allProductClassify.length === 0) return [];
      const t1 = this.allProductClassify.find(it1 => it1.ID === this.ProductClass.FirstLevelID);
      if (!t1) return [];
      const t2 = t1.children.find(it2 => it2.ID === this.ProductClass.SecondLevelID);
      if (!t2) return [];
      return t2.children.map(it => ({ ID: it.ID, Name: it.ClassName }));
    },
    checkList: {
      get() {
        return this.ProductList.map(it => it.ID);
      },
      set(val) {
        this.$store.commit('timelimit/setTimeLimitData', ['ProductList', val.map(it => ({ ID: it }))]);
      },
    },
    checkAll: {
      get() {
        if (this.showList === 0) return false;
        return this.showList.length === this.ProductList.length;
      },
      set(val) {
        if (val) {
          // const _list = this.showList.map(it => it.ID);
          this.$store.commit('timelimit/setTimeLimitData', ['ProductList', this.showList]);
        } else {
          this.$store.commit('timelimit/setTimeLimitData', ['ProductList', []]);
        }
      },
    },
    isIndeterminate() {
      if (this.ProductList.length === 0 || this.showList.length === this.ProductList.length) return false;
      return this.ProductList.length < this.showList.length;
    },
  },
  data() {
    return {
      productDisabled: false,
    };
  },
  mounted() {
    this.$store.dispatch('common/getAllProductNames');
    // if (this.setPageType === 'edit') {
    //   if (this.TimeLimitData.ProductList.length === 1) this.productDisabled = true;
    //   else this.productDisabled = false;
    // }
  },
};
</script>

<style lang='scss'>
.mp-erp-time-limit-set-page-content-product-select-comp-wrap {
  > div {
    width: 1470px;
    .el-checkbox {
      font-size: 12px;
      margin-right: 8px;
      margin-bottom: 14px;
      .el-checkbox__label {
        color: #444;
        font-size: 12px;
        box-sizing: border-box;
        display: inline-block;
        min-width: 110px;
      }
      &.is-checked {
        .el-checkbox__label {
          color: #444;
        }
      }
    }
    > p {
      line-height: 19px;
    }
  }
  margin-bottom: 24px;
}
</style>
