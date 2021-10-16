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
        this.setProductListChange(val.map(it => ({ ID: it })));
      },
    },
    checkAll: {
      get() {
        if (this.showList === 0) return false;
        return this.showList.length === this.ProductList.length;
      },
      set(val) {
        this.setProductListChange(val ? this.showList : []);
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
  methods: {
    setProductListChange(list) {
      if (list.length > 1 && this.checkList.length > 1) { // 多到多  -- 可直接修改
        this.$store.commit('timelimit/setTimeLimitData', ['ProductList', list]);
      } else { // 多到单 单到多 无到有 有到无 等等
        // 一、 清除TimeLimitData中的SchemaPropertyList数据
        // this.$store.commit('timelimit/setTimeLimitData', ['SchemaPropertyList', []]); // ----- 和通过修改一起执行 !!!!!
        // 二、 后面此时需要查看
        // 1. 是否已设置有工期列表， 如果没有则直接通过修改
        // 2. 如果有工期列表 则进一步判断工期列表中是否包含有已设置有其它条件的子项目  如果没有则直接通过
        // 3. 如果有则报错给与进一步确认，确认后修改产品及清除掉其它条件
        if (this.TimeLimitData.SchemaList.length > 0) { // 存在工期列表
          const t = this.TimeLimitData.SchemaList.find(it => it.Constraint?.ItemList?.length > 0);
          if (t) { // 工期列表中存在已设置有其它条件的子项目
            // 弹窗提示是否继续变更
            const cb = () => {
              this.$store.commit('timelimit/setTimeLimitData', ['SchemaPropertyList', []]); // ----- 和通过修改一起执行 !!!!!
              this.$store.commit('timelimit/setTimeLimitData', ['ProductList', list]);
              this.$store.commit('timelimit/setTimeLimitAllSchemaItemConstraintClear');
            };
            this.messageBox.warnCancelBox('当前修改将会清空其它条件设置', '执行当前修改将会清空已设置工期列表中的所有其它条件，确认修改吗 ？', cb, () => {
              const _list = [...this.checkList].map(it => ({ ID: it }));
              this.$store.commit('timelimit/setTimeLimitData', ['ProductList', list]);
              this.$nextTick(() => {
                this.$store.commit('timelimit/setTimeLimitData', ['ProductList', _list]);
              });
            });
            return;
          }
        }
        this.$store.commit('timelimit/setTimeLimitData', ['SchemaPropertyList', []]); // ----- 和通过修改一起执行 !!!!!
        this.$store.commit('timelimit/setTimeLimitData', ['ProductList', list]);
      }
    },
  },
  mounted() {
    this.$store.dispatch('common/getAllProductNames');
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
