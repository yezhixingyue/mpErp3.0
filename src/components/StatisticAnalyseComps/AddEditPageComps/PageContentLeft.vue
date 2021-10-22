<template>
  <section class="mp-statistic-analyse-add-edit-page-content-left-wrap">
    <header>
      <p>
        <span>统计标题：</span>
        <el-input type="text" v-model="Title" maxlength="60" show-word-limit></el-input>
      </p>
      <p>
        <span>数据类型：</span>
        <ul>
          <li
           v-for="it in StatisticalFormTypeList"
           @click="onMenuClick(it.ID)"
           :class="Type===it.ID?'active':''"
           :key="it.key">
           <span>{{it.name}}</span>
          </li>
        </ul>
      </p>
    </header>
    <div class="content" :class="isLeft ? 'left2right' : 'right2left'">
      <transition mode="out-in">
        <component :is="curFormComponent"></component>
      </transition>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import OrderForm from './Forms/OrderForm.vue';
import CustomerForm from './Forms/CustomerForm.vue';
import OrderCustomerForm from './Forms/OrderCustomerForm.vue';
import AfterSalesForm from './Forms/AfterSalesForm.vue';

export default {
  components: {
    OrderForm,
    CustomerForm,
    OrderCustomerForm,
    AfterSalesForm,
  },
  data() {
    return {
      isLeft: false,
    };
  },
  computed: {
    ...mapState('common', ['StatisticalFormTypeList']),
    ...mapState('statistic', ['condition4SaveForm']),
    curFormComponent() {
      const t = this.StatisticalFormTypeList.find(it => it.ID === this.Type);
      if (t) return t.key;
      return '';
    },
    Title: {
      get() {
        return this.condition4SaveForm.Title;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['Title', ''], val]);
      },
    },
    Type: {
      get() {
        return this.condition4SaveForm.Type;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['Type', ''], val]);
      },
    },
  },
  methods: {
    onMenuClick(ID) {
      if (this.Type === ID) return;
      const list = this.StatisticalFormTypeList.map(it => it.ID);
      const _nextIndex = list.findIndex(it => it === ID);
      const _curIndex = list.findIndex(it => it === this.Type);
      if ((_nextIndex || _nextIndex === 0) && (_curIndex || _curIndex === 0) && _nextIndex < _curIndex) {
        this.isLeft = true;
      } else {
        this.isLeft = false;
      }
      this.Type = ID;
    },
  },
  mounted() {
    this.$store.dispatch('common/getUserClassify');
    this.$store.dispatch('common/getExpressList');
  },
};
</script>

<style lang='scss'>
.mp-statistic-analyse-add-edit-page-content-left-wrap {
  > header {
    margin-left: 17px;
    padding-left: 13px;
    border-bottom: 1px solid #eee;
    padding-bottom: 30px;
    > p {
      display: flex;
      align-items: center;
      color: #444;
      font-size: 14px;
      padding: 15px 0;
      > span {
        white-space: nowrap;
        font-weight: 700;
        // font-size: 14px;
        margin-right: 10px;
      }
      > div.el-input {
        width: 400px;
        height: 30px;
        > input {
          border: 1px solid #CBCBCB;
          border-radius: 2px;
          height: 30px;
          padding-right: 50px;
        }
      }
      > ul {
        display: flex;
        > li {
          width: 90px;
          height: 35px;
          box-sizing: border-box;
          padding: 7px 0;
          line-height: 19px;
          text-align: center;
          border: 1px solid #cbcbcb;
          border-left: none;
          cursor: pointer;
          transition: 0.2s ease-in-out;
          &:first-of-type {
            border-left: 1px solid #cbcbcb;
            border-top-left-radius: 2px;
            border-bottom-left-radius: 2px;
          }
          &:last-of-type {
            border-bottom-right-radius: 2px;
            border-top-right-radius: 2px;
          }
          &.active {
            background-color: #26BCF9;
            color: #fff;
            border-color: #26BCF9;
            box-shadow: -1px 0 0 0 #26BCF9;
          }
        }
      }
    }
  }
  > .content {
    display: flex;
    > .v-enter-active,
    > .v-leave-active {
      transition: all .1s ease-in-out;
    }

    > .v-enter-to  {
      opacity: 1;
      transform: translateX(0px);
    }

    > .v-leave {
      opacity: 1;
      transform: translateX(0px);
    }

    &.left2right {
      > .v-enter,
      > .v-leave-to {
        opacity: 0;
        transform: translateX(-50px);
      }
      > .v-leave-to {
        opacity: 0;
        transform: translateX(50px);
      }
    }
    &.right2left {
      > .v-enter,
      > .v-leave-to {
        opacity: 0;
        transform: translateX(50px);
      }
      > .v-leave-to {
        opacity: 0;
        transform: translateX(-50px);
      }
    }
    .mp-statistic-analyse-add-edit-page-form-wrap {
      > header {
        font-size: 14px;
        color: #444444;
        margin-left: 18px;
        border-bottom: 1px dashed #eee;
        width: 776px;
        display: flex;
        padding-top: 30px;
        padding-bottom: 24px;
        > span {
          margin-right: 10px;
          width: 82px;
          text-align: right;
        }
        > div {
          > label {
            margin-right: 25px;
            color: #444;
          }
        }
      }
      > div {
        padding-top: 30px;
        > div {
          padding: 13px 0;
          display: flex;
          // align-items: center;
          > span {
            width: 100px;
            text-align: right;
            color: #888E99;
            margin-right: 10px;
            font-size: 14px;
          }
          > div {
            > label {
              // margin-bottom: 16px;
              > span.el-checkbox__label {
                font-size: 12px;
                color: #585858 !important;
              }
            }
          }
          &.mp-coms-common-min-max-value-input-comp-wrap {
            padding: 10px 0;
          }
          &.area-product-select-box {
            padding-bottom: 10px;
            padding-top: 12px;
            > span {
              padding-top: 2px;
            }
            > div {
              .span-title-blue {
                padding-left: 0;
              }
            }
          }
          &.express-box {
            padding-bottom: 0;
            // margin-bottom: -10px;
            .el-checkbox {
              margin-bottom: 16px;
            }
          }
        }
      }
      &.widen {
        > header > span {
          width: 122px;
        }
        > div > div {
          &.mp-coms-common-min-max-value-input-comp-wrap {
            padding: 8px 0;
          }
          > span {
            width: 140px;
          }
        }
      }
    }
  }
}
</style>
