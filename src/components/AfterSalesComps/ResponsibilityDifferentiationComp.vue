<template>
  <section class="responsibility-differentiation-comp">
    <header class="title is-bold">划分责任</header>
    <ul>
      <li>
        <div class="label is-bold">问题类别：</div><div class="value">湿货、生产质量问题、材料质量问题、晚货</div>
      </li>
      <li class="form-box">
        <div class="label is-bold">责任占比：</div><div class="value">
          <p>
            <el-checkbox v-model="checked">备选项</el-checkbox>
            <template>
              所占责任：
              <el-input v-model="input" size="medium" style="width: 50px;"></el-input> %
              <i>已确认</i>
              <img src="@/assets/images/success.png" alt="">
            </template>
          </p>
          <p>
            <el-checkbox v-model="checked">备选项</el-checkbox>
            <template>
              所占责任：
              <el-input v-model="input" size="medium" style="width: 50px;"></el-input> %
              <i>已确认</i>
              <img src="@/assets/images/success.png" alt="">
            </template>
          </p>
          <p>
            <el-checkbox v-model="checked">备选项</el-checkbox>
            <template>
              所占责任：
              <el-input v-model="input" size="medium" style="width: 50px;"></el-input> %
              <i>已确认</i>
              <img src="@/assets/images/success.png" alt="">
            </template>
          </p>
          <p>
            <el-checkbox v-model="checked">备选项</el-checkbox>
            <template>
              所占责任：
              <el-input v-model="input" size="medium" style="width: 50px;"></el-input> %
              <i>已确认</i>
              <img src="@/assets/images/success.png" alt="">
            </template>
          </p>
        </div>
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
      &.form-box{
        line-height: 35px;
        .el-input, input{
          height: 35px;
        }
      }
      >.value{
        flex: 1;
        >p{
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          >.el-checkbox{
            .el-checkbox__label{
              font-size: 12px;
              color: #444;
            }
            margin-right: 20px;
          }
          >.el-input{
            margin-right: 5px;
          }
          >i{
            margin-right: 5px;
            margin-left: 20px;
            color: #80c269;
          }
          img{
            width: 15px;
            height: 15px;
          }
        }
      }
    }
  }
}
</style>
