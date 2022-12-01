<template>
  <section class="mp-erp-print-bean-setup-page-right-comp-wrap" v-if="curPrintBeanData">
    <header>
      <el-button type="primary" @click="onItemSaveClick(null)">+添加</el-button>
    </header>
    <main>
      <div class="h">
        <div>印豆数量</div>
        <div>价格</div>
        <div>总份数</div>
        <div>已售份数</div>
        <div>每个客户可购买总份数</div>
        <div>每个客户每日可购买份数</div>
        <div>描述</div>
        <div>操作</div>
      </div>
      <ul ref="oScrollWrap" class="mp-scroll-wrap">
        <li v-for="(it, i) in itemList" :key="it.ID || it.key" :class="{l: true, stripe: i % 2 > 0}">
          <div>{{it.BeanNumber}}个</div>
          <div>{{it.Price}}元</div>
          <div>{{it.TotalNumber}}{{it.TotalNumber ? '份' : ''}}</div>
          <div>{{it.SellNumber}}{{it.SellNumber ? '份' : ''}}</div>
          <div>{{it.BuyMaxNumber}}{{it.BuyMaxNumber ? '份' : ''}}</div>
          <div>{{it.DayBuyMaxNumber}}{{it.DayBuyMaxNumber ? '份' : ''}}</div>
          <div :title="it.Describe">{{it.Describe}}</div>
          <div>
            <CtrlMenus @edit='onItemSaveClick(it, i)' @remove='onItemRemoveClick(it, i)' :canRemove='getCanRemove(it)' />
          </div>
        </li>
        <li v-if="itemList.length === 0" class="l e">暂无数据</li>
      </ul>
      <PrintBeanSetupRightBeanItemDialog :visible.sync='visible' :editData="curEditData" @save='handleItemSave' :isStarted='isStarted' />
    </main>
  </section>
</template>

<script>
import CtrlMenus from '../common/NewComps/CtrlMenus/index.vue';
import PrintBeanSetupRightBeanItemDialog from './PrintBeanSetupRightBeanItemDialog.vue';

export default {
  props: {
    curPrintBeanData: {
      type: Object,
      default: null,
    },
    isStarted: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CtrlMenus,
    PrintBeanSetupRightBeanItemDialog,
  },
  computed: {
    itemList() {
      return this.curPrintBeanData?.ItemList || [];
    },
  },
  data() {
    return {
      curIndex: '', // 保存时使用，如果为''则为添加（执行push），如果为数字则为编辑（执行splice） -- 保存或删除时上传给上级组件，由其决定处理方式
      curEditData: null, // 弹窗中使用，为null时为添加 为对象时则为编辑
      visible: false,
    };
  },
  methods: {
    getCanRemove(item) {
      return !(typeof item.ID === 'number' && this.isStarted);
    },
    onItemSaveClick(item, i) {
      this.curEditData = item;
      this.curIndex = item ? i : '';
      this.visible = true;
    },
    onItemRemoveClick(item, i) {
      if (item.SellNumber > 0) {
        this.messageBox.failSingleError('删除失败', '该印豆已有客户购买，不可删除');
        return;
      }
      this.$emit('remove', i);
    },
    handleItemSave(item) {
      const { BeanNumber, Price, ID, key } = item;
      const bool = this.curPrintBeanData.ItemList.some(
        it => it.BeanNumber === BeanNumber && +it.Price === +Price && ((key && it.key !== key) || ((ID || ID === 0) && ID !== it.ID)),
      );
      if (bool) {
        this.messageBox.failSingleError('保存失败', '列表中已存在印豆数量相同且价格相同的条目');
        return;
      }
      this.$emit('save', [item, this.curIndex]);
      this.visible = false;
      if (this.$refs.oScrollWrap) {
        setTimeout(() => {
          this.$refs.oScrollWrap.scrollTop = 10000;
        }, 10);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-print-bean-setup-page-right-comp-wrap {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  height: 100%;
  width: 950px;
  padding-right: 10px;
  > header {
    flex: none;
    button {
      font-size: 14px;
      padding: 0;
      height: 30px;
      width: 100px;
    }
    padding-bottom: 30px;
  }
  > main {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    > div.h, > ul > li.l {
      display: flex;
      align-items: center;
      > div {
        white-space: nowrap;
        text-align: center;
        width: 108px;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 4px;
        box-sizing: border-box;
        &:nth-of-type(5) {
          width: 140px;
        }
        &:nth-of-type(6) {
          width: 150px;
        }
        &:last-of-type {
          width: 120px;
        }
      }
      &.h {
        background: #f5f5f5;
        height: 40px;
        color: #444;
        font-size: 13px;
        font-weight: 700;
        > div {
          padding: 0;
        }
      }
      &.l {
        height: 20px;
        padding: 10px 0px;
        font-size: 13px;
        line-height: 20px;
        &.stripe {
          background: #f5f5f5;
        }
        &:last-of-type {
          border-bottom: 1px solid #e5e5e5;
        }
        > div:nth-of-type(7) {
          font-size: 12px;
          color: #989898;
        }
        &.e {
          text-align: center;
          font-size: 12px;
          display: block;
          color: #a2a2a2;
        }
      }
    }
    > .h {
      flex: none;
    }
    > ul {
      flex: 1;
      overflow-x: hidden;
      overflow-y: scroll;
      > li {
        width: 100%;
      }
    }
  }
}
</style>
