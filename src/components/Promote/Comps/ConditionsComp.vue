<template>
  <section
    class="mp-promote-comps-condition-list-comp-wrap"
    v-if="ConstraintIndex || ConstraintIndex === 0">
    <header class="is-blue">
      <span @click="addCondition">添加条件</span>
    </header>
    <ul
      class="condition-list mp-scroll-wrap"
      v-if="conditionData.Constraint && conditionData.Constraint.ItemList"
     >
      <ConditionSingleComp
       :conditionList='conditionList'
       v-for="(item,i) of conditionData.Constraint.ItemList"
       :key="'conditionData' + i"
       @editCondition='editCondition'
       @delCondition='delCondition'
       :itemList='conditionData.Constraint.ItemList'
       :itemIndex='i'
       :itemData='item'
       />
    </ul>
  </section>

</template>

<script>
import ConditionSingleComp from './ConditionSingleComp.vue';

export default {
  props: {
    conditionList: {
      type: Array,
      default: () => [],
    },
    ConstraintIndex: {
      type: Number,
    },
    ProductIndex: {
      type: Number,
    },
    conditionData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ConditionSingleComp,
  },
  // computed: {
  //   conditionSelfList() {
  //     return [...this.conditionData.Constraint.ItemList];
  //   },
  // },
  // data() {
  //   return {
  //     conditionItemList: [...this.conditionSelfList],
  //   };
  // },
  methods: {
    addCondition() {
      this.$emit('handleAddCondition', [this.ProductIndex, this.ConstraintIndex]);
      const oWrap = document.querySelector('.condition-list.mp-scroll-wrap');
      this.$utils.animateScroll(oWrap.scrollTop, oWrap.scrollHeight, (num) => {
        oWrap.scrollTop = num;
      });
    },
    delCondition(itemIndex) {
      this.$emit('delCondition4AddRequestObj', [this.ProductIndex, this.ConstraintIndex, itemIndex]);
    },
    editCondition([data, itemIndex]) {
      this.$emit('editCondition4AddRequestObj', [this.ProductIndex, this.ConstraintIndex, itemIndex, data]);
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-promote-comps-condition-list-comp-wrap {
  > .condition-list {
    height: 280px;
    overflow: auto;
    overflow: overlay;
    > li.mp-promote-single-condition-comp-wrap {
      & + li.mp-promote-single-condition-comp-wrap {
        > span {
          opacity: 0;
        }
      }
    }
  }
  > header {
    > span {
      cursor: pointer;
      &:hover {
        color: $--color-primary-light;
      }
    }
    margin-bottom: 10px;
    user-select: none;
  }
}
</style>
