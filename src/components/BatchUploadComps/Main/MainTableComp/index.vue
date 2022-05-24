<template>
  <section class="mp-c-batch-upload-page-main-table-comp-wrap">
    <el-table
      ref="multipleTable"
      v-show="showTable"
      :data="list"
      :max-height="h"
      :height="h"
      style="width: 100%"
      :checkAllDisabled='handleCheckAllDisabled'
      :class="{
        'is-dragover': dragover,
      }"
      @drop.native.prevent="onDrop"
      @dragover.native.prevent="onDragover"
      @dragleave.native.prevent="dragover = false"
      @selection-change="handleSelectionChange">

      <el-table-column type="selection" width="55" :selectable='handleSelectable'></el-table-column>

      <el-table-column show-overflow-tooltip label="产品" min-width="180">
        <span slot-scope="scope" class="is-font-size-12">{{ scope.row.result | formatProductName }}</span>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="数量规格" min-width="180">
        <template slot-scope="scope" class="">
          <template>{{ scope.row.result | formatProductAmount }} </template>
          <template>{{ scope.row.result | formatProductSize }} </template>
          <template>{{ scope.row.result | formatCraftShowContent }}</template>
        </template>
      </el-table-column>

      <el-table-column label="印刷内容" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.result.Content || '' }}</template>
      </el-table-column>

      <el-table-column label="平台单号" width="200" show-overflow-tooltip v-if="!UseSameAddress">
        <template slot-scope="scope">{{scope.row.result | formatOutPlateNo}}</template>
      </el-table-column>

      <el-table-column label="配送地址" width="200" show-overflow-tooltip v-if="!UseSameAddress">
        <template slot-scope="scope">{{scope.row.result | formatAddress}}</template>
      </el-table-column>

      <el-table-column label="价格" width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.result.CurrentCost | formatCurrentCost }}</template>
      </el-table-column>

      <el-table-column label="配送方式" width="140" show-overflow-tooltip v-if="!UseSameAddress">
          <el-select :value="scope.row.Express.Second" @change="e => onExpressChange(e, scope.row)" placeholder="请选择" slot-scope="scope" size="mini">
            <el-option
              v-for="item in getExpressOptions(scope.row.result.ExpressList, subExpressList, scope.row)"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
            </el-option>
          </el-select>
      </el-table-column>

      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <ItemOperationComp :itemData='scope.row' @upload='handleItemUpload' @detail='handleDetailClick' @remove='handleItemRemove' />
        </template>
      </el-table-column>
      <div slot="empty">
        <p class="content">请点击左上角 <i class="is-bold is-font-14">[ 选择文件 ]</i> 按钮选择文件 或 <i class="is-bold is-font-14">[ 拖动文件至此区域 ]</i> 进行解析并上传</p>
        <p class="remark" v-if="accept">注：1、支持的文件格式：{{accept}}</p>
        <p class="remark two">{{accept ? 2 : 1}}、文件名称需携带订单信息且符合指定格式（ 下单页面计算价格后会生成符合格式的订单信息 ）</p>
        <!-- <p class="remark two">{{accept ? 3 : 2}}、选择文件后会覆盖上次已选择文件，请在当次选择完全部需要上传的订单文件</p> -->
        <p class="remark two is-pink">{{accept ? 3 : 2}}、IE9及IE9以下版本浏览器不支持使用，请升级浏览器</p>
      </div>
    </el-table>
    <ProductDetailDrawer v-model="drawer" :curDetailData='curDetailData' :ShowProductDetail='ShowProductDetail' />
  </section>
</template>

<script>
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import ProductDetailDrawer from '@/packages/BatchUploadComps/Main/ProductDetailDrawer';
import { formarProductAmountFunc } from '@/packages/commonFilters';
import ItemOperationComp from './ItemOperationComp.vue';

export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    multipleSelection: {
      type: Array,
      default: () => [],
    },
    checkAllDisabled: {
      type: Boolean,
      default: false,
    },
    accept: {
      type: String,
      default: '',
    },
    UseSameAddress: {
      type: Boolean,
      default: false,
    },
    subExpressList: {
      type: Array,
      default: () => [],
    },
    ShowProductDetail: {
      type: Function,
    },
  },
  mixins: [tableMixin],
  components: {
    ItemOperationComp,
    ProductDetailDrawer,
  },
  filters: {
    formatProductName(result) { // 产品名称
      if (result && result.ProductParams && result.ProductParams.Attributes) {
        const { ClassList, DisplayName } = result.ProductParams.Attributes;
        if (DisplayName) {
          if (ClassList && ClassList.length > 0) {
            const t = ClassList.find(it => it.Type === 1);
            if (t) {
              const { FirstLevel, SecondLevel } = t;
              const f = FirstLevel && FirstLevel.Name ? `${FirstLevel.Name}-` : '';
              const s = SecondLevel && SecondLevel.Name ? `${SecondLevel.Name}-` : '';
              return `${f}${s}${DisplayName}`;
            }
          }
          return DisplayName;
        }
      }
      return '';
    },
    formatProductSize(result) { // 数量规格
      if (result && result.ProductParams) {
        const { Size } = result.ProductParams;
        const s = Size && Size.DisplayContent ? Size.DisplayContent : '';
        return s;
      }
      return '';
    },
    formatProductAmount(result) { // 数量规格
      if (result && result.ProductParams) {
        const { Attributes } = result.ProductParams;
        return formarProductAmountFunc(Attributes);
        // const { Unit, ProductAmount, KindCount, HaveNumber, HaveKind } = Attributes || {};
        // const n = Attributes ? `${HaveNumber ? `${ProductAmount}${Unit || '个'}` : ''}${HaveKind ? `${KindCount}款` : ''}` : '';
        // return n;
      }
      return '';
    },
    formatCraftShowContent(result) { // 工艺名称
      if (result && result.ProductParams) {
        const { CraftList, PartList } = result.ProductParams;
        if (CraftList || PartList) {
          const _CraftList = CraftList || [];
          const _PartList = PartList || [];
          const arr = [];
          _CraftList.forEach(it => {
            if (it.Attributes) arr.push(it.Attributes.DisplayName);
          });
          if (Array.isArray(_PartList) && _PartList.length > 0) {
            _PartList.forEach(_it => {
              _it.List.forEach(_it2 => {
                if (_it2.CraftList) {
                  _it2.CraftList.forEach(_it3 => {
                    if (_it3.Attributes) arr.push(_it3.Attributes.DisplayName);
                  });
                }
              });
            });
          }
          return [...new Set(arr.filter(it => it))].join('，');
        }
      }
      return '';
    },
    formatCurrentCost(cost) { // 价格
      if (cost || cost === 0) {
        return `￥${(+cost).toFixed(2)}元`;
      }
      return '';
    },
    formatOutPlateNo(result) {
      if (result && result.Address && result.Address.OutPlateSN) {
        return result.Address.OutPlateSN;
      }
      return '';
    },
    formatAddress(result) {
      if (result && result.Address) {
        const { AddressDetail, ExpressArea } = result.Address;
        if (!ExpressArea) return AddressDetail || '';
        const { RegionalName, CityName, CountyName } = ExpressArea;
        return `${RegionalName || ''}${CityName || ''}${CountyName || ''}${AddressDetail || ''}`;
      }
      return '';
    },
  },
  data() {
    return {
      drawer: false,
      curDetailData: null,
      dragover: false,
      showTable: true,
    };
  },
  methods: {
    handleSelectionChange(val) { // 复选框点选事件
      this.$emit('multipleSelect', val);
    },
    setHeight() { // 设置表格高度
      let d = 320;
      const gap = 21;
      let oHeader = this.oHeaderDom;
      if (!oHeader) {
        oHeader = document.querySelector('.mp-c-batch-upload-page-wrap > header');
        this.oHeaderDom = oHeader;
      }
      if (oHeader) {
        let oWorkbench = this.oWorkbenchDom;
        if (!oWorkbench) {
          oWorkbench = document.querySelector('.mp-c-batch-upload-page-wrap > main > .workbench');
          this.oWorkbenchDom = oWorkbench;
        }
        if (oWorkbench) {
          let oFooter = this.oFooterDom;
          if (!oFooter) {
            oFooter = document.querySelector('.mp-c-batch-upload-page-wrap > main > .workbench');
            this.oFooterDom = oFooter;
          }
          if (oFooter) {
            d = oHeader.offsetHeight + oWorkbench.offsetHeight + oFooter.offsetHeight;
          }
        }
      }
      const tempHeight = this.getHeight('', d + gap, '');
      this.h = tempHeight;
    },
    handleItemUpload(item) {
      this.$emit('itemUpload', item);
    },
    handleDetailClick(item) {
      if (!item) return;
      this.curDetailData = item;
      this.drawer = true;
    },
    handleItemRemove(item) {
      this.$emit('itemRemove', item);
    },
    handleSelectable(data) { // 判断当前行是否可以被勾选
      if (data.orderStatus === 'success' || !data.result.HavePrice) return false;
      return true;
    },
    handleCheckAllDisabled() {
      return this.checkAllDisabled;
    },
    onDragover() {
      this.dragover = true;
    },
    onDrop(e) {
      this.dragover = false;
      this.$emit('droped', e);
    },
    getExpressOptions(validExpressIds, subExpressList, item) {
      const list = subExpressList.filter(it => validExpressIds.includes(it.ID));
      if (list.length > 0 && item?.Express && !item.Express.Second && item.Express.Second !== 0) {
        const First = list[0]._Type;
        const Second = list[0].ID;
        const _item = item;
        _item.Express.First = First;
        _item.Express.Second = Second;
      }
      return list;
    },
    onExpressChange(e, item) {
      const t = this.subExpressList.find(it => it.ID === e);
      if (t) {
        const _item = item;
        _item.Express.First = t._Type;
        _item.Express.Second = t.ID;
      }
    },
  },
  watch: {
    UseSameAddress() {
      this.showTable = false;
      setTimeout(() => {
        this.showTable = true;
      }, 100);
    },
  },
};
</script>
<style lang='scss'>
.mp-c-batch-upload-page-main-table-comp-wrap {
  padding: 0px 20px;
  > .el-table {
    &::before {
      display: none;
    }
    .el-table__header-wrapper {
      .el-table__header {
        height: 36px;
        tr {
          th {
            font-size: 14px;
            border: none;
            &::after {
              display: none;
            }
          }
        }
      }
    }
    .el-table__body-wrapper {
      .el-table__body {
        > tbody {
          > tr {
            position: relative;
            border-bottom: 1px solid #eee;
            // &::after {
            //   position: absolute;
            //   content: '';
            //   left: 8px;
            //   right: 8px;
            //   bottom: 0;
            //   height: 1px;
            //   background-color: #eee;
            // }
            > td {
              border-bottom: 1px solid #eee;
              color: #585858;
              padding: 10px 0;
            }
          }
        }
      }
    }
    .el-table__empty-block {
      align-items: flex-start;
      padding-top: 12vh;
      box-sizing: border-box;
      .el-table__empty-text {
        line-height: 30px;
        padding: 50px 20px;
        width: 800px;
        padding-top: 0px;
        color: #989898;
        .remark {
          width: 550px;
          margin: 0 auto;
          text-align: left;
          &.two {
            text-indent: 2em;
          }
          &.is-pink {
            display: none;
            display: block\9;
          }
        }
        .content {
          color: #585858;
          padding-bottom: 20px;
          padding-right: 10px;
        }
      }
    }
    &.is-dragover {
      border: 2px dashed #428dfa;
    }
  }
}
</style>
