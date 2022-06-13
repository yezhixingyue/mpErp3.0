<template>
  <div class="mp-erp-back-cash-setup-page-right-item-comp-wrap">
    <section>
      <header>
        <span class="blue-span" @click="onProductSetupClick(null, -1)" :class="{disabled: isStarted}">+添加产品</span>
      </header>
      <main>
        <ProductSetupItemComp
         v-for="(it, i) in localRangeList"
         :key="it.key"
         :item="it"
         :isStarted='isStarted'
         @filter='onProductFilterClick(it, i)'
         @edit='onProductSetupClick(it, i)'
         @remove='onProductRemoveClick(i)'
        />
      </main>
    </section>
    <section>
      <header>
        <span class="blue-span" @click="onReturnValueSetClick(null, -1)" :class="{disabled: isStarted}">+添加返现比例</span>
      </header>
      <main>
        <FundSetupItemComp
         v-for="(it, i) in itemData.FundList"
         :key="it.key"
         :item='it'
         :isStarted='isStarted'
         @edit='onReturnValueSetClick(it, i)'
         @remove='onReturnValueRemoveClick(i)'
        />
      </main>
    </section>
    <span class="red-span" @click="onRemoveClick" :class="{disabled: isStarted}"><i>-</i>删除返现规则</span>
  </div>
</template>

<script>
import ProductSetupItemComp from './ProductSetupItemComp.vue';
import FundSetupItemComp from './FundSetupItemComp.vue';

export default {
  props: {
    itemData: {
      type: Object,
      default: () => ({}),
    },
    isStarted: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    ProductSetupItemComp,
    FundSetupItemComp,
  },
  computed: {
    localRangeList() {
      const list = Array.isArray(this.itemData?.RangeList) ? this.itemData.RangeList : [];
      return list;
    },
  },
  methods: {
    onRemoveClick() {
      if (this.itemData.FundList.length > 0 || this.itemData.RangeList.length > 0) {
        this.messageBox.warnCancelBox('确定删除该返现规则吗', '该条目已设置有部分内容', () => {
          this.$emit('remove');
        });
      } else {
        this.$emit('remove');
      }
    },
    onProductFilterClick(data, i) {
      this.$emit('productFilter', [data, i]);
    },
    onProductSetupClick(data, i) {
      this.$emit('productSetup', [data, i]);
    },
    onProductRemoveClick(i) {
      this.$emit('productRemove', i);
    },
    onReturnValueSetClick(data, i) {
      this.$emit('returnValueSetup', [data, i]);
    },
    onReturnValueRemoveClick(i) {
      this.$emit('returnValueRemove', i);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-back-cash-setup-page-right-item-comp-wrap {
  padding-right: 30px;
  > span.red-span {
    margin-left: 0px;
    > i {
      display: inline-block;
      text-align: center;
      width: 10px;
    }
  }
  > section {
    padding-bottom: 12px;
    > header {
      padding-bottom: 6px;
    }
  }
  & + & {
    margin-top: 50px;
  }
}
</style>
