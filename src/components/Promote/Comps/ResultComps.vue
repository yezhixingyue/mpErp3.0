<template>
  <section class="mp-promote-comps-result-list-comp-wrap">
    <SingleRadioGroupComp
      @handleRadioChange='handleRadioChange'
      :radio='radio'
      :list='PriceUnitList'
    />
    <footer>
      <span v-if="radio === 4">减款:</span>
      <span v-else>执行价格:</span>
      <input type="text" placeholder="请输入价格" v-model="price">
      <span>{{priceUnit}}</span>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import SingleRadioGroupComp from '@/components/common/SingleRadioGroupComp.vue';

export default {
  components: {
    SingleRadioGroupComp,
  },
  props: {
    PriceUnitList: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('common', ['conditionTypeList']),
    priceUnit() {
      if (!this.radio && this.radio !== 0) return '';
      switch (this.radio) {
        case 0:
          return '元 / 每个产品';
        case 1:
          return '元 / 单款总价';
        case 3:
          return '%';
        case 4:
          return '元';
        default:
          return '';
      }
    },
    radio: {
      get() {
        if (this.value) return this.value.PriceUnit;
        return '';
      },
      set(newVal) {
        this.$emit('input', { ...this.value, PriceUnit: newVal });
      },
    },
    price: {
      get() {
        if (this.value) return this.value.Price;
        return '';
      },
      set(newVal) {
        this.$emit('input', { ...this.value, Price: newVal });
      },
    },
  },
  methods: {
    handleRadioChange(e) {
      this.radio = e;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-promote-comps-result-list-comp-wrap {
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  > .mp-coms-common-single-radio-group-comp-wrap {
    // text-align: center;
  }
  > footer {
    // text-align: center;
    margin-top: 30px;
    font-size: 14px;
    padding-left: 6px;
    > span {
      width: 100px;
      display: inline-block;
      color: #888E99;
      &:last-of-type{
        text-align: left;
        padding-left: 10px;
      }
    }
    > input {
      height: 30px;
      width: 160px;
      outline: none;
      border: 1px solid  $--border-color-base;
      padding: 0 5px;
      &::placeholder {
        font-size: 12px;
        color: $--color-text-secondary
     }
    }
  }
  > header {
    > .mp-common-comps-radio-group-wrap {
      > div {
        margin: 20px auto;
        margin-bottom: 80px;
        height: 28px;
        > label {
          width: 180px !important;
          > span.el-radio-button__inner  {
            font-size: 13px !important;
            line-height: 12px;
          }
        }
      }
    }
  }
}

</style>
