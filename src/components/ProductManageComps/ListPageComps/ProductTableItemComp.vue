<template>
  <section class="mp-erp-product-manage-table-item-comp-wrap" v-if="itemData" :class="extend ? 'extend': ''">
    <header>
      <div class="title-box">
        <span class="name" :title="itemData.Name">{{itemData.Name}}</span>
        <span class="show-name" :title="itemData.ShowName">{{itemData.ShowName}}</span>
      </div>
      <div class="classify-box">
        <span :title="ClassifyText">{{ClassifyText}}</span>
      </div>
      <div class="order-ctrl">
        <el-checkbox v-model="helpOrderChecked">可代客下单</el-checkbox>
        <el-checkbox v-model="customOrderChecked">可自助上传</el-checkbox>
      </div>
      <div class="text-menu-box">
        <TipsSpanButton text='界面元素' />
        <TipsSpanButton text='尺寸物料' />
        <TipsSpanButton text='工艺' />
        <TipsSpanButton style="margin-right:60px" text='显示顺序' />
        <TipsSpanButton text='工厂' />
        <TipsSpanButton text='文件' />
        <TipsSpanButton text='公式' />
        <TipsSpanButton text='交互' />
        <TipsSpanButton text='文件名设置' />
        <TipsSpanButton text='库存' />
      </div>
      <div class="img-menu-box">
        <span @click="onPartSaveClick(null)">
          <i></i>添加部件
        </span>
        <span @click="onProductSaveClick">
          <i></i>编辑
        </span>
        <span @click="onRemoveClick">
          <i></i>删除
        </span>
      </div>
      <div class="extend-box" @click="extend = !extend">
        <span v-if="!extend">展开</span>
        <span v-else>隐藏</span>
        <i v-if="!extend" class="el-icon-caret-bottom"></i>
        <i v-else class="el-icon-caret-top"></i>
      </div>
    </header>
    <ul>
      <li v-for="it in itemData.PartList" :key="it.PartID">
        <div>
          <span :title="it.Name">{{it.Name}}</span>
        </div>
        <div>
          <TipsSpanButton text='界面元素' />
          <TipsSpanButton text='尺寸物料' />
          <TipsSpanButton text='工艺' />
          <TipsSpanButton text='显示顺序' />
        </div>
        <div>
          <TipsSpanButton text='编辑' @click.native="onPartSaveClick(it)" />
          <TipsSpanButton text='删除' isRed />
        </div>
      </li>
    </ul>
    <PartSaveDialog :visible.sync='visible' :curData='curPartData' :ProductID='itemData.ID' @submit="onPartSaveSubmit" />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
import PartSaveDialog from './PartSaveDialog.vue';

export default {
  props: {
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    TipsSpanButton,
    PartSaveDialog,
  },
  computed: {
    ...mapGetters('common', ['twoLevelsProductClassify']),
    helpOrderChecked: {
      get() {
        if (!this.itemData) return false;
        return this.itemData.AllowValetOrder;
      },
      set() {
        this.$store.dispatch('productManage/getOrderStatusChange', ['ValetOrderStatus', this.itemData.ID]);
      },
    },
    customOrderChecked: {
      get() {
        if (!this.itemData) return false;
        return this.itemData.AllowCustomOrder;
      },
      set() {
        this.$store.dispatch('productManage/getOrderStatusChange', ['CustomOrderStatus', this.itemData.ID]);
      },
    },
    ClassifyText() {
      if (!this.itemData) return '';
      const list = this.itemData.ClassifyList;
      if (!list || !Array.isArray(list) || list.length === 0) return '';
      return list.map(it => `${it.FirstLevel.Name}-${it.SecondLevel.Name}`).join('，');
    },
  },
  data() {
    return {
      extend: false,
      visible: false,
      curPartData: null,
    };
  },
  methods: {
    onProductSaveClick() { // 产品编辑
      this.$store.commit('productManage/setCurEditData', this.itemData);
      this.$router.push(`/ProductDataSave/${Date.now()}`);
    },
    onRemoveClick() { // 删除产品
      this.messageBox.warnCancelBox('确定删除该产品吗', `产品名称：${this.itemData.Name}`, () => {
        this.$store.dispatch('productManage/getProductRemove', this.itemData.ID);
      });
    },
    onPartSaveClick(data) { // 添加 | 编辑 部件
      this.curPartData = data;
      this.visible = true;
    },
    onPartSaveSubmit(data) {
      const cb = () => {
        this.visible = false;
      };
      this.$store.dispatch('productManage/getProductPartSave', [data, cb]);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-product-manage-table-item-comp-wrap {
  // padding: 0 5px;
  padding-top: 10px;
  > header {
    display: flex;
    min-width: 1700px;
    height: 44px;
    border: 1px solid #f8f8f8;
    box-sizing: border-box;
    background-color: #f8f8f8;
    align-items: center;
    > div {
      flex: none;
      &.title-box {
        width: 300px;
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        > span {
          white-space: nowrap;
          overflow: hidden;
          color: #585858;
          font-size: 14px;
          text-align: center;
          &.name {
            width: 125px;
          }
          &.show-name {
            width: 175px;
          }
        }
      }
      &.classify-box {
        width: 200px;
        height: 26px;
        > span {
          display: inline-block;
          height: 100%;
          font-size: 12px;
          line-height: 26px;
          color: #585858;
          text-align: center;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      &.order-ctrl {
        width: 245px;
        text-align: center;
        .el-checkbox {
          font-size: 13px;
          margin-right: 22px;
          .el-checkbox__label {
            font-size: 12px;
            padding-left: 8px;
            color: #585858;
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
        width: 223px;
        > span {
          height: 25px;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #a2a2a2;
          margin-right: 13px;
          cursor: pointer;
          transition: color 0.1s ease-in-out;
          user-select: none;
          > i {
            display: inline-block;
            width: 25px;
            height: 25px;
            margin-right: 4px;
            background: url(../../../assets/images/add.png) no-repeat center center/13px 13px;
          }
          &:nth-of-type(2) > i {
            background: url(../../../assets/images/Compile.png) no-repeat center center/14px 14px;
          }
          &:nth-of-type(3) > i {
            background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
          }
          // &:nth-of-type(4) > i {
          //   background: url(../../../assets/images/setup.png) no-repeat center center/16px 16px;
          // }
          &:hover {
            color: #444;
          }
          &:active {
            color: rgb(1, 1, 58);
          }
        }
      }
      &.text-menu-box {
        width: 650px;
        text-align: center;
        > span:not(:last-of-type) {
          margin-right: 22px;
        }
      }
      &.extend-box {
        font-size: 12px;
        width: 100px;
        cursor: pointer;
        display: flex;
        align-items: center;
        user-select: none;
        justify-content: center;
        position: relative;
        top: -1px;
        > i {
          font-size: 18px;
          color: #cbcbcb;
          margin-left: 3px;
          // transform: rotate(0deg);
        }
        > span {
          position: relative;
          top: 1px;
          color: #a2a2a2;
        }
      }
    }
    transition: border-color 0.02s ease-in-out;
    &:hover {
      border-color: #ccc;
      border-left-color: #f5f5f5;
      box-shadow: -1px 0 0 0 #ccc;
      // background-color: #e5e5e5;
      // border-color: #eee;
    }
  }
  > ul {
    > li {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 12px;
      > div {
        &:first-of-type {
          color: #585858;
          width: 125px;
          white-space: nowrap;
          overflow: hidden;
          text-align: center;
          margin-right: 60px;
        }
        &:nth-of-type(2) {
          > span {
            margin-right: 25px;
          }
          margin-right: 35px;
        }
        &:last-of-type {
          > span {
            margin-right: 25px;
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
