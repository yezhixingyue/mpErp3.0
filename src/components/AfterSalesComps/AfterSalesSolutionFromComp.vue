<template>
  <section class="after-sales-solution-from-comp">
    <header class="title is-bold">解决方案</header>
    <ul>
      <li>
        <span class="value">湿货、生产质量问题、材料质量问题、晚货</span>
      </li>
      <li>
        <span class="label is-bold">解决方案：</span><span class="value">湿货、生产质量问题、材料质量问题、晚货</span>
      </li>
      <li>
        <span class="label is-bold">选择包裹：</span><span class="value">订单详情</span>
      </li>
      <li>
        <span class="label is-bold">补印数量：</span><span class="value">订单详情</span>
      </li>
      <li>
        <span class="label is-bold">优惠券：</span><span class="value">订单详情</span>
      </li>
      <li>
        <span class="label is-bold">
          补充说明：<span class="text">(选填)</span>
        </span><span class="value">订单详情</span>
      </li>
      <li>
        <span class="label is-bold">额外支出：</span><span class="value"> </span>
      </li>
      <li>
        <span class="label is-bold">
          支出说明：<span class="text">(选填)</span>
        </span><span class="value"> </span>
      </li>
      <li>
        <span class="label is-bold">问题类别：</span><span class="value"> </span>
      </li>
      <li>
        <span class="label is-bold">责任占比：</span><span class="value"> </span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    condition: {
      type: Object,
      default: () => ({}),
    },
    dataList: {
      type: Array,
      default: () => ([]),
    },
  },

  components: {
  },
  computed: {
    ...mapState('common', ['userTypeList']),
  },
  data() {
    return {

    };
  },
  methods: {

  },
  mounted() {

  },
};
</script>

<style lang='scss'>
.after-sales-solution-from-comp {
  padding-left: 20px;
  min-width: 650px;
  box-sizing: border-box;
  padding-right: 30px;
  >.title{
    font-size: 16px;
    line-height: 20px;
    margin-top: 10px;
    position: relative;
    margin-bottom: 20px;
    &::before{
      content: "";
      display: inline-block;
      height: 14px;
      width: 3px;
      position: absolute;
      left: -8px;
      top: 3px;
      background: linear-gradient( 180deg, #32DAF9 0%, #28C1F9 100%);
    }
  }
  >ul{
    li{
      display: flex;
      font-size: 12px;
      margin-top: 10px;
      line-height: 15px;
      >.label{
        position: relative;
        >.text{
          position: absolute;
          right: 1em;
          top: 15px;
          color: #AEAEAE
        }
      }
      >.value{
        flex: 1;
      }
    }
  }
}
</style>
