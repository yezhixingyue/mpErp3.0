<template>
  <section class="mp-erp-product-manage-table-item-comp-wrap" v-if="itemData" :class="extend ? 'extend': ''">
    <header>
      <div class="title-box">
        <span class="classify-name">{{classifyName}}</span>
        <span class="product-name">{{itemData.ProductName}}</span>
      </div>
      <div class="order-ctrl">
        <el-checkbox v-model="helpOrderChecked">可代客下单</el-checkbox>
        <el-checkbox v-model="customOrderChecked">可自助上传</el-checkbox>
      </div>
      <div class="img-menu-box">
        <span>
          <i></i>编辑
        </span>
        <span>
          <i></i>删除
        </span>
        <span>
          <i></i>添加部件
        </span>
        <span>
          <i></i>设置工艺
        </span>
      </div>
      <div class="text-menu-box">
        <TipsSpanButton text='物料数量公式' />
        <TipsSpanButton text='属性关联' />
        <TipsSpanButton text='常规数量' />
        <TipsSpanButton text='默认产品' />
        <TipsSpanButton text='产品属性' />
      </div>
      <div class="extend-box" @click="extend = !extend">
        <span v-if="!extend">展开部件</span>
        <span v-else>隐藏部件</span>
        <i v-if="!extend" class="el-icon-caret-bottom"></i>
        <i v-else class="el-icon-caret-top"></i>
      </div>
    </header>
    <ul>
      <li v-for="it in itemData.PartList" :key="it.PartID">
        <div>
          <span>{{it.PartName}}</span>
        </div>
        <div>
          <TipsSpanButton text='编辑' />
          <TipsSpanButton text='删除' isRed />
          <TipsSpanButton text='设置工艺' />
        </div>
        <div>
          <TipsSpanButton text='设置自定义属性' />
          <TipsSpanButton text='设置尺寸数量公式' />
          <TipsSpanButton text='常规尺寸' />
          <TipsSpanButton text='设置尺寸条件' />
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';

export default {
  props: {
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    TipsSpanButton,
  },
  computed: {
    ...mapGetters('common', ['twoLevelsProductClassify']),
    classifyName() {
      if (!this.twoLevelsProductClassify || this.twoLevelsProductClassify.length === 0 || !this.itemData) return '';
      const { ProductClass } = this.itemData;
      if (!ProductClass) return '';
      const { First, Second } = ProductClass;
      const f = this.twoLevelsProductClassify.find(it => it.ID === First);
      if (f) {
        const s = f.children.find(it => it.ID === Second);
        if (s) return `${f.ClassName}-${s.ClassName}`;
      }
      return '';
    },
    helpOrderChecked: {
      get() {
        if (!this.itemData) return false;
        return this.itemData.AllowValetOrder;
      },
      set() {
        this.$store.dispatch('productManage/getOrderStatusChange', ['ValetOrderStatus', this.itemData.ProductID]);
      },
    },
    customOrderChecked: {
      get() {
        if (!this.itemData) return false;
        return this.itemData.AllowCustomOrder;
      },
      set() {
        this.$store.dispatch('productManage/getOrderStatusChange', ['CustomOrderStatus', this.itemData.ProductID]);
      },
    },
  },
  data() {
    return {
      extend: false,
    };
  },
};
</script>
<style lang='scss'>
.mp-erp-product-manage-table-item-comp-wrap {
  padding: 0 5px;
  > header {
    display: flex;
    min-width: 1700px;
    height: 44px;
    border: 1px solid #fff;
    box-sizing: border-box;
    background-color: rgb(245, 245, 245);
    align-items: center;
    > div {
      flex: none;
      &.title-box {
        width: 450px;
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        > span {
          white-space: nowrap;
          overflow: hidden;
          color: #585858;
          &.classify-name {
            font-size: 12px;
            width: 190px;
            box-sizing: border-box;
            padding-left: 20px;
          }
          &.product-name {
            font-size: 14px;
            font-weight: 700;
          }
        }
      }
      &.order-ctrl {
        margin-right: 20px;
        .el-checkbox {
          font-size: 13px;
          margin-right: 22px;
          .el-checkbox__label {
            font-size: 12px;
            padding-left: 8px;
          }
          &.is-checked {
            .el-checkbox__inner {
              background-color: #2196F3;
              border-color: #2196F3;
            }
          }
        }
      }
      &.img-menu-box {
        display: flex;
        margin-right: 40px;
        > span {
          height: 25px;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #989898;
          margin-right: 13px;
          cursor: pointer;
          transition: color 0.1s ease-in-out;
          user-select: none;
          > i {
            display: inline-block;
            width: 25px;
            height: 25px;
            margin-right: 4px;
            background: url(../../../assets/images/Compile.png) no-repeat center center/14px 14px;
          }
          &:nth-of-type(2) > i {
            background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
          }
          &:nth-of-type(3) > i {
            background: url(../../../assets/images/add.png) no-repeat center center/13px 13px;
          }
          &:nth-of-type(4) > i {
            background: url(../../../assets/images/setup.png) no-repeat center center/16px 16px;
          }
          &:hover {
            color: #444;
          }
          &:active {
            color: rgb(1, 1, 58);
          }
        }
      }
      &.text-menu-box {
        > span:not(:last-of-type) {
          margin-right: 20px;
        }
      }
      &.extend-box {
        margin-left: 60px;
        font-size: 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        user-select: none;
        > i {
          font-size: 18px;
          color: #cbcbcb;
          margin-left: 3px;
          // transform: rotate(0deg);
        }
        > span {
          position: relative;
          top: 1px;
        }
      }
    }
    transition: border-color 0.02s ease-in-out;
    &:hover {
      border-color: #cbcbcb;
    }
  }
  > ul {
    > li {
      display: flex;
      align-items: center;
      height: 35px;
      font-size: 12px;
      > div {
        &:first-of-type {
          color: #585858;
          padding-left: 40px;
          width: 190px;
          white-space: nowrap;
          overflow: hidden;
        }
        &:nth-of-type(2) {
          > span {
            margin-right: 30px;
          }
          margin-right: 20px;
        }
        &:last-of-type {
          > span {
            margin-right: 20px;
          }
        }
      }
    }
    height: 0;
    overflow: hidden;
  }
  margin-bottom: 5px;
  &.extend {
    > ul {
      height: auto;
    }
    // > header > div.extend-box > i {
    //   transform: rotate(180deg);
    // }
  }
}
</style>
