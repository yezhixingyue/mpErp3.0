<template>
  <section class="customer-appeal-comp">
    <header class="title is-bold">客户诉求</header>
    <ul>
      <li>
        <span class="label is-bold">问题：</span><span class="value">湿货、生产质量问题、材料质量问题、晚货</span>
      </li>
      <li>
        <span class="label is-bold">问题描述：</span><span class="value">后宫编号重复，客户4月28日摇号，同时出现两次重复奖项，客户要求赔偿礼品损失</span>
      </li>
      <li>
        <span class="label is-bold">诉求：</span><span class="value">后宫编号重复，客户4月28日摇号，同时出现两次重复奖项，客户要求赔偿礼品损失</span>
      </li>
      <li>
        <span class="label is-bold">联系方式：</span><span class="value">后宫编号重复，客户4月28日摇号，同时出现两次重复奖项，客户要求赔偿礼品损失</span>
      </li>
      <li>
        <span class="label is-bold">QQ：</span><span class="value">后宫编号重复，客户4月28日摇号，同时出现两次重复奖项，客户要求赔偿礼品损失</span>
      </li>
      <li>
        <span class="label is-bold">图片凭证：</span><span class="value">
          <div class="image-list">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
          </div>
        </span>
      </li>
      <li>
        <span class="label is-bold">客服补充：</span><span class="value">
          <div class="image-list">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
            <img src="@/assets/images/del-disabled.png" alt="">
          </div>
        </span>
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
.customer-appeal-comp {
  padding-left: 20px;
  width: 453px;
  box-sizing: border-box;
  padding-right: 32px;
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
      .image-list{
        display: flex;
        flex-wrap: wrap;
        img{
          width: 107px;
          height: 75px;
          border-radius: 4px;
          margin-right: 10px;
          margin-bottom: 10px;
          &:nth-child(3n){
            margin-right: 0;
          }
        }
      }
    }
  }
}
</style>
