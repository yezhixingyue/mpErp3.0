<template>
  <section class="responsibility-differentiation-comp">
    <header class="title is-bold">划分责任</header>
    <ul>
      <li>
        <span class="label is-bold">问题类别：</span><span class="value">湿货、生产质量问题、材料质量问题、晚货</span>
      </li>
      <li>
        <span class="label is-bold">责任占比：</span><span class="value">订单详情</span>
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
.responsibility-differentiation-comp {
  padding-left: 20px;
  min-width: 498px;
  width: 498px;
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
      >.value{
        flex: 1;
      }
    }
  }
}
</style>
