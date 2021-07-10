<template>
  <section class="mp-erp-price-manage-table-item-comp-wrap" v-if="itemData" :class="extend ? 'extend': ''">
    <header>
      <div class="classify-box">
        <span :title="ClassifyText">{{ClassifyText}}</span>
      </div>
      <div class="title-box">
        <span class="name" :title="itemData.Name">{{itemData.Name}}</span>
      </div>
      <div class="price-count">
        <span>{{itemData.PriceList ? itemData.PriceList.length : 0}}种报价</span>
      </div>
      <div class="img-menu-box">
        <span @click="onPartSaveClick(null)">
          <i></i>添加价格
        </span>
      </div>
      <div class="text-menu-box">
        <TipsSpanButton text='拼版控制' />
        <TipsSpanButton text='子条件'/>
        <TipsSpanButton text='计算公式'  />
      </div>
      <div class="extend-box" @click="extend = !extend" :class="itemData.PriceList&&itemData.PriceList.length>0 ? '' : 'disabled'">
        <span v-if="!extend">展开</span>
        <span v-else>隐藏</span>
        <i v-if="!extend" class="el-icon-caret-bottom"></i>
        <i v-else class="el-icon-caret-top"></i>
      </div>
    </header>
    <ul> <!-- 价格条目 -->
      <li v-for="it in itemData.PriceList" :key="it.PartID">
        <div>
          <span :title="it.Name">{{it.Name}}</span>
        </div>
        <div>
          <TipsSpanButton text='界面元素'/>
          <TipsSpanButton text='尺寸物料' />
          <TipsSpanButton text='工艺' />
          <TipsSpanButton text='设置元素' />
          <TipsSpanButton text='显示顺序' />
        </div>
        <div>
          <TipsSpanButton text='编辑' />
          <TipsSpanButton text='删除'  isRed />
        </div>
      </li>
    </ul>
    <!-- <PartSaveDialog :visible.sync='visible' :curData='curPartData' :ProductID='itemData.ID' @submit="onPartSaveSubmit" />
    <ProductMapSetDialog :visible.sync='mapVisible' :curData='curPartData' :itemData='itemData' @submit="onMapSetSubmit" /> -->
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
// import PartSaveDialog from './PartSaveDialog.vue';
// import ProductMapSetDialog from './ProductMapSetDialog.vue';

export default {
  props: {
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    TipsSpanButton,
    // PartSaveDialog,
    // ProductMapSetDialog,
  },
  computed: {
    ...mapGetters('common', ['twoLevelsProductClassify']),
    ClassifyText() { // 列表分类显示文字
      if (!this.itemData) return '';
      const list = this.itemData.ClassifyList;
      if (!list || !Array.isArray(list) || list.length === 0) return '';
      return list.map(it => `${it.FirstLevel.Name}-${it.SecondLevel.Name}`).join('，');
    },
  },
  data() {
    return {
      extend: false,
    };
  },
  methods: {
  },
};
</script>
<style lang='scss'>
.mp-erp-price-manage-table-item-comp-wrap {
  padding-bottom: 10px;
  min-width: 1718px;
  width: calc(100% - 2px);
  > header {
    display: flex;
    min-width: 1703px;
    height: 44px;
    border: 1px solid #f8f8f8;
    box-sizing: border-box;
    background-color: #f8f8f8;
    align-items: center;
    > div {
      flex: none;
      &.title-box {
        width: 175px;
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        height: 36px;
        line-height: 36px;
        padding-left: 15px;
        > span {
          white-space: nowrap;
          width: 100%;
          overflow: hidden;
          color: #585858;
          font-size: 14px;
          text-align: left;
          text-overflow: ellipsis;
        }
      }
      &.classify-box {
        width: 300px;
        height: 26px;
        padding-left: 30px;
        margin-right: 15px;
        > span {
          display: inline-block;
          height: 100%;
          font-size: 14px;
          line-height: 26px;
          color: #585858;
          text-align: left;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      &.price-count {
        width: 100px;
        text-align: left;
        padding-left: 30px;
        font-size: 14px;
        color: #585858;
      }
      &.img-menu-box {
        display: flex;
        width: 223px;
        flex: 1;
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
          &:hover {
            color: #444;
          }
          &:active {
            color: rgb(1, 1, 58);
          }
        }
      }
      &.text-menu-box {
        text-align: center;
        > span {
          margin-right: 50px;
          font-size: 14px;
          &:last-of-type {
            margin-right: 30px;
          }
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
        height: 30px;
        line-height: 30px;
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
          transition: color 0.06s ease-in-out;
        }
        &:hover {
          > span {
            color: #444;
          }
        }
        &.disabled {
          pointer-events: none;
          > span {
            color: #ddd;
          }
          > i {
            filter: grayscale(1);
            color: #ddd;
          }
        }
      }
    }
    transition: border-color 0.02s ease-in-out;
    &:hover {
      border-color: #ccc;
      box-shadow: -2px 0 0  #ccc;
    }
  }
  > ul {
    > li {
      display: flex;
      align-items: center;
      height: 40px;
      font-size: 12px;
      > div {
        height: 30px;
        line-height: 30px;
        &:first-of-type {
          color: #585858;
          width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-align: center;
          text-overflow: ellipsis;
          margin-right: 48px;
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
