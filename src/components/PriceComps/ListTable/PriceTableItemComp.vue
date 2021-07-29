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
        <span @click="onPriceItemSaveClick(null)">
          <i></i>添加价格
        </span>
      </div>
      <div class="text-menu-box">
        <TipsSpanButton @click.native="jumpToPage('MakeupCtrl')" text='拼版控制' />
        <TipsSpanButton @click.native="jumpToPage('subConditionList')" :disabled='canSetPartList.length === 0' text='子条件'/>
        <TipsSpanButton @click.native="jumpToPage('PriceFormulaList', { timer: Date.now() })" text='计算公式'  />
      </div>
      <div class="extend-box" @click="onExtendClick" :class="itemData.PriceList&&itemData.PriceList.length>0 ? '' : 'disabled'">
        <span v-if="!extend">展开</span>
        <span v-else>隐藏</span>
        <i v-if="!extend" class="el-icon-caret-bottom"></i>
        <i v-else class="el-icon-caret-top"></i>
      </div>
    </header>
    <ul> <!-- 价格条目 -->
      <li v-for="it in itemData.PriceList" :key="it.PartID">
        <div class="mode">
          <span class="separate">
            <i v-if="it.IsOwnPrice">单独设置</i>
            <i v-else title="123">按 线下价格 固定报价 x 90%  专版x 50% 数码 x 58%
            </i>
          </span>
          <TipsSpanButton @click.native="onIsOwnPriceSetClick(it)" text='设置报价方式'/>
        </div>
        <div class="menus" v-if="it.IsOwnPrice">
          <TipsSpanButton text='数值转换' />
          <TipsSpanButton text='拼版方案选择' @click.native="onPriceItemSetMenuClick(it, 'MakeupSolutionSet')">
            <span>拼版方案选择（<i :class="it.MakeupList.filter(_it => _it.Solution).length < 6 ? 'is-pink' : ''"
            >{{it.MakeupList.filter(_it => _it.Solution).length}}</i>/{{it.MakeupList ? it.MakeupList.length : 0}}）</span>
          </TipsSpanButton>
          <TipsSpanButton text='工艺费' @click.native="onPriceItemSetMenuClick(it, 'CraftPriceSetPage')" />
          <TipsSpanButton text='价格表' @click.native="onPriceItemSetMenuClick(it, 'QuotationList', { isQuotation: true })">
            <span>价格表（{{it.PriceTableList ? it.PriceTableList.length : 0}}）</span>
          </TipsSpanButton>
          <TipsSpanButton text='报价方案' @click.native="onPriceItemSetMenuClick(it, 'QuotationScheme', { timer: Date.now() })">
            <span>报价方案（{{it.SolutionList ? it.SolutionList.length : 0}}）</span>
          </TipsSpanButton>
          <TipsSpanButton text='报价结果' @click.native="onPriceItemSetMenuClick(it, 'QuotationResult')">
            <span>报价结果（{{it.ResultList ? it.ResultList.length : 0}}）</span>
          </TipsSpanButton>
        </div>
        <div class="name">
          <span>价格名称：</span>
          <span :title="it.Name">{{it.Name}}</span>
        </div>
        <div class="date">
          <span>{{ it.CreateTime | format2LangTypeDate }}</span>
        </div>
        <div class="ctrl">
          <CtrlMenus :showList="['edit','del','copy']" @copy='onPriceItemCopyClick(it)' @edit='onPriceItemSaveClick(it)' @remove='onPriceItemRemoveClick(it)' />
        </div>
      </li>
    </ul>
    <!-- 价格 添加|保存 -->
    <PriceItemSaveDialog :productTitle="itemData.Name" :visible.sync='visible' :EditData='curData' @submit="handleSubmit" />
    <!-- 报价方式设置 -->
    <IsOwnPriceSetDialog
     :productTitle="itemData.Name"
     :visible.sync='isOwnPriceVisible'
     :curPrice='curData'
     :PriceList='itemData.PriceList'
     @submit='IsOwnSetSubmitHandler'
     />
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
import PriceItemClass from '@/assets/js/TypeClass/PriceItemClass';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import PriceItemSaveDialog from './PriceItemSaveDialog.vue';
import IsOwnPriceSetDialog from './IsOwnPriceSetDialog.vue';

export default {
  props: {
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    TipsSpanButton,
    PriceItemSaveDialog,
    CtrlMenus,
    IsOwnPriceSetDialog,
  },
  computed: {
    ...mapGetters('common', ['twoLevelsProductClassify']),
    ClassifyText() { // 列表分类显示文字
      if (!this.itemData) return '';
      const list = this.itemData.ClassifyList;
      if (!list || !Array.isArray(list) || list.length === 0) return '';
      return list.map(it => `${it.FirstLevel.Name}-${it.SecondLevel.Name}`).join('，');
    },
    canSetPartList() {
      if (!this.itemData || this.itemData.PartList.length === 0) return [];
      return this.itemData.PartList.filter(it => it.UseTimes && it.UseTimes.MaxValue > 1);
    },
    subConditionTitleText() {
      if (this.canSetPartList.length > 0) return '';
      return '仅有可多次使用的部件时才可设置子条件';
    },
  },
  data() {
    return {
      extend: false,
      curData: null,
      visible: false,
      isOwnPriceVisible: false,
    };
  },
  methods: {
    onExtendClick() {
      this.extend = !this.extend;
      if (this.extend) {
        sessionStorage.setItem('lastExtendProductID4Price', this.itemData.ID);
      } else {
        sessionStorage.removeItem('lastExtendProductID4Price');
      }
    },
    onPriceItemSaveClick(data) { // 编辑 | 保存产品价格条目
      this.$store.dispatch('common/getAreaList');
      this.$store.dispatch('common/getUserClassify');
      this.$store.dispatch('priceManage/getApplyRangeTemplateList');
      this.curData = data ? JSON.parse(JSON.stringify(data)) : null;
      this.visible = true;
    },
    async handleSubmit(data) { // 执行 编辑 | 保存 远程请求操作
      const { Name, ID } = data;
      const t = this.itemData.PriceList.find(it => it.Name === Name && it.ID !== ID);
      if (t) {
        this.messageBox.failSingleError('保存失败', '已存在相同的价格名称');
        return;
      }
      const temp = { ...data, ProductID: this.itemData.ID };
      const resp = await this.api.getProductPriceSave(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const title = !ID ? '添加成功' : '编辑成功';
        const cb = () => {
          if (data.ID) { // 编辑
            const _data = { ...this.curData, ...temp, ID: resp.data.Data };
            this.$store.commit('priceManage/setPriceItemSave', [_data, 'edit']);
          } else { // 添加
            const _data = new PriceItemClass({ ...temp, ID: resp.data.Data });
            this.$store.commit('priceManage/setPriceItemSave', [_data, 'add']);
          }
          this.visible = false;
          this.curData = null;
          this.extend = true;
        };
        this.messageBox.successSingle(title, cb, cb);
      }
    },
    onPriceItemRemoveClick(data) {
      this.messageBox.warnCancelBox('确定删除该条价格吗?', `价格名称：[ ${data.Name} ]`, () => {
        this.$store.dispatch('priceManage/getPriceItemRemove', data);
      });
    },
    onPriceItemCopyClick(data) { // 拷贝
      console.log('onPriceItemCopyClick', data);
    },
    onIsOwnPriceSetClick(data) { // 设置报价方式
      this.curData = data ? JSON.parse(JSON.stringify(data)) : null;
      this.isOwnPriceVisible = true;
    },
    async IsOwnSetSubmitHandler(data) {
      const cb = () => {
        this.isOwnPriceVisible = false;
      };
      this.$store.dispatch('priceManage/getPriceModeSetup', [data, cb]);
    },
    getFullName() { // 获取当前产品全称： 类别 + 内部名称
      const { Name, ClassifyList } = this.itemData;
      let _name = '';
      if (ClassifyList && ClassifyList.length > 0) {
        const [{ FirstLevel }] = ClassifyList;
        if (FirstLevel && FirstLevel.Name) _name = `${FirstLevel.Name} - `;
      }
      _name += Name;
      return _name;
    },
    jumpToPage(pathName, option) {
      let params = {
        name: this.getFullName(),
        id: this.itemData.ID,
      };
      if (option) params = { ...option, ...params };
      this.$router.push({ name: pathName, params });
    },
    onPriceItemSetMenuClick(item, path, option) {
      this.$store.commit('priceManage/setCurPriceItem', item);
      this.jumpToPage(path, option);
    },
  },
  mounted() {
    const extendID = sessionStorage.getItem('lastExtendProductID4Price');
    if (extendID && extendID === this.itemData.ID) this.extend = true;
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
          &.is-disabled {
            color: #cbcbcb !important;
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
      overflow: hidden;
      width: 1700px;
      > div {
        height: 30px;
        line-height: 30px;
        flex: none;
        &.mode {
          flex: 1;
          padding-left: 45px;
          overflow: hidden;
          display: flex;
          > .separate {
            color: #585858;
            margin-right: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: calc(100% - 100px);
            // flex: 1;
          }
          > .el-tooltip {
            // margin-left: 32px;
            flex: none;
          }
        }
        &.menus {
          padding-left: 35px;
          > span {
            margin-right: 40px;
          }
        }
        &.name {
          width: 240px;
          padding-left: 50px;
          color: #585858;
          > span {
            line-height: 30px;
          }
        }
        &.date {
          width: 120px;
          padding: 0 70px;
          padding-left: 20px;
          color: #999;
        }
        &.ctrl {
          padding-right: 80px;
          padding-left: 30px;
          .ctrl-menus-container > span + span {
            margin-left: 30px;
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
