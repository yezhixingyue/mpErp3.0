<template>
  <section class="mp-erp-product-manage-table-item-comp-wrap" v-if="itemData" :class="extend ? 'extend': ''">
    <header @click="onHeadrClick">
      <div class="title-box">
        <span class="name" :title="itemData.Name">{{itemData.Name}}</span>
        <span class="show-name" :title="itemData.ShowName">{{itemData.ShowName}}</span>
      </div>
      <div class="classify-box">
        <span :title="ClassifyText">{{ClassifyText}}</span>
      </div>
      <div class="order-ctrl" :title="!canOrder ? '先设置 [产品 - 设置元素] 后才可设置下单' : ''">
        <el-checkbox :disabled='!canOrder && !helpOrderChecked' v-model="helpOrderChecked">可代客下单</el-checkbox>
        <el-checkbox :disabled='!canOrder && !customOrderChecked' v-model="customOrderChecked">可自助上传</el-checkbox>
      </div>
      <div class="text-menu-box">
        <TipsSpanButton text='界面元素' @click.native="onElementSaveClick(null)" />
        <TipsSpanButton text='尺寸物料' @click.native="onProductSizeMaterialSetClick(null)" />
        <TipsSpanButton text='工艺' @click.native="onProductCraftSetClick(null)" />
        <TipsSpanButton text='设置元素' @click.native="onElementMapSetClick(null)" />
        <TipsSpanButton style="margin-right:40px" text='显示顺序' @click.native="onProductDisplaySortSetClick(null)" />
        <TipsSpanButton text='工厂' @click.native="onProductFactorySetClick" />
        <TipsSpanButton text='文件' @click.native="setCommonPathJump('ProductFileList')" />
        <TipsSpanButton text='公式' @click.native="setCommonPathJump('ProductFormulaList')" />
        <TipsSpanButton text='交互' @click.native="setCommonPathJump('ProductInteractionList')" />
        <TipsSpanButton text='文件名设置' @click.native="setCommonPathJump('ProductFileNameSet')" />
        <TipsSpanButton text='库存' @click.native="setCommonPathJump('ProductStockList')" />
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
      <div class="extend-box" @click="onExtendClick" :class="itemData.PartList&&itemData.PartList.length>0 ? '' : 'disabled'">
        <span v-if="!extend">展开</span>
        <span v-else>隐藏</span>
        <i v-if="!extend" class="el-icon-caret-bottom"></i>
        <i v-else class="el-icon-caret-top"></i>
      </div>
    </header>
    <ul> <!-- 部件 -->
      <li v-for="it in itemData.PartList" :key="it.PartID">
        <div>
          <span :title="it.Name">{{it.Name}}</span>
        </div>
        <div>
          <TipsSpanButton text='界面元素' @click.native="onElementSaveClick(it)" />
          <TipsSpanButton text='尺寸物料' @click.native="onProductSizeMaterialSetClick(it)" />
          <TipsSpanButton text='工艺' @click.native="onProductCraftSetClick(it)" />
          <TipsSpanButton text='设置元素' @click.native="onElementMapSetClick(it)" />
          <TipsSpanButton text='显示顺序' @click.native="onProductDisplaySortSetClick(it)" />
        </div>
        <div>
          <TipsSpanButton text='编辑' @click.native="onPartSaveClick(it)" />
          <TipsSpanButton text='删除' @click.native="onPartRemoveClick(it)" isRed />
        </div>
      </li>
    </ul>
    <PartSaveDialog :visible.sync='visible' :curData='curPartData' :ProductID='itemData.ID' @submit="onPartSaveSubmit" />
    <ProductMapSetDialog :visible.sync='mapVisible' :curData='curPartData' :itemData='itemData' @submit="onMapSetSubmit" />
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import TipsSpanButton from '@/components/common/NewComps/TipsSpanButton.vue';
import PartSaveDialog from './PartSaveDialog.vue';
import ProductMapSetDialog from './ProductMapSetDialog.vue';

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
    ProductMapSetDialog,
  },
  computed: {
    ...mapGetters('common', ['twoLevelsProductClassify']),
    ...mapState('productManage', ['ProductElementTypeList']),
    helpOrderChecked: { // 代客下单
      get() {
        if (!this.itemData) return false;
        return this.itemData.AllowValetOrder;
      },
      set() {
        this.$store.dispatch('productManage/getOrderStatusChange', ['ValetOrderStatus', this.itemData.ID]);
      },
    },
    customOrderChecked: { // 自助上传
      get() {
        if (!this.itemData) return false;
        return this.itemData.AllowCustomOrder;
      },
      set() {
        this.$store.dispatch('productManage/getOrderStatusChange', ['CustomOrderStatus', this.itemData.ID]);
      },
    },
    ClassifyText() { // 列表分类显示文字
      if (!this.itemData) return '';
      const list = this.itemData.ClassifyList;
      if (!list || !Array.isArray(list) || list.length === 0) return '';
      return list.map(it => `${it.FirstLevel.Name}-${it.SecondLevel.Name}`).join('，');
    },
    canOrder() {
      if (!this.itemData || !Array.isArray(this.itemData.TypeList) || this.itemData.TypeList.length < this.ProductElementTypeList.length) return false;
      const list = this.ProductElementTypeList.map(({ ID }) => {
        const t = this.itemData.TypeList.find(_it => _it.First === ID);
        return t ? t.Second : null;
      }).filter(it => !it);
      if (list.length > 0) return false;
      return true;
    },
  },
  data() {
    return {
      extend: false,
      visible: false,
      curPartData: null,
      mapVisible: false,
    };
  },
  methods: {
    onExtendClick() {
      this.extend = !this.extend;
      if (this.extend) {
        sessionStorage.setItem('lastExtendProductID', this.itemData.ID);
      } else {
        sessionStorage.removeItem('lastExtendProductID');
      }
    },
    onHeadrClick() {
      this.$emit('setActive', this.itemData.ID);
    },
    onProductSaveClick() { // 产品编辑
      this.$store.commit('productManage/setCurEditData', this.itemData);
      this.$router.push(`/ProductDataSave/${Date.now()}`);
    },
    onRemoveClick() { // 删除产品
      this.messageBox.warnCancelBox('确定删除该产品吗', `产品名称：${this.itemData.Name}`, () => {
        this.$store.dispatch('productManage/getProductRemove', this.itemData.ID);
      });
    },
    setCommonPathJump(path, data) { // 产品与部件共同属性设置页面跳转方法
      const { Name, ClassifyList } = this.itemData;
      let _name = '';
      const t = ClassifyList.find(it => it.Type === 1);
      if (t) {
        _name = `${t.FirstLevel.Name}`;
      }
      _name += `-${Name}`;
      const ID = data ? data.ID : this.itemData.ID;
      _name += (data ? `：${data.Name}` : '');
      const type = data ? '部件' : '产品';
      if (path === 'ProductElementSet') {
        this.$router.push(`/${path}/${ID}/${_name}/${type}/${Date.now()}`);
        return;
      }
      if (path === 'ProductDisplaySort') {
        const PartID = data ? data.ID : null;
        const materialName = data ? data.MaterialDisplayName : this.itemData.MaterialDisplayName;
        this.$router.push(`/${path}/${this.itemData.ID}/${PartID}/${_name}/${type}/${materialName}/${Date.now()}`);
        return;
      }
      const PartID = data ? data.ID : null;
      this.$router.push(`/${path}/${this.itemData.ID}/${PartID}/${_name}/${type}/${Date.now()}`);
    },
    onElementSaveClick(data) { // 跳转产品与部件元素设置 data有值时为部件元素设置
      this.setCommonPathJump('ProductElementSet', data);
    },
    onProductSizeMaterialSetClick(data) { // 跳转尺寸物料设置
      this.setCommonPathJump('ProductSizeMaterialSet', data);
    },
    onProductCraftSetClick(data) { // 跳转工艺设置
      this.setCommonPathJump('ProductCraftSet', data);
    },
    onProductDisplaySortSetClick(data) { // 跳转显示排序
      this.setCommonPathJump('ProductDisplaySort', data);
    },
    onProductFactorySetClick() { // 产品工厂设置页面
      this.setCommonPathJump('ProductFactorySet');
    },
    onPartSaveClick(data) { // 添加 | 编辑 部件 --- 打开弹窗
      this.curPartData = data;
      this.visible = true;
    },
    onPartSaveSubmit(data) { // 部件添加与编辑数据提交保存
      const t = this.itemData.PartList.find(it => it.Name === data.Name && it.ID !== data.ID);
      if (t) {
        this.messageBox.failSingleError('保存失败', '部件名称不能与其它部件名称重复');
        return;
      }
      const cb = () => {
        this.visible = false;
        this.extend = true;
      };
      this.$store.dispatch('productManage/getProductPartSave', [data, cb]);
    },
    onPartRemoveClick(data) { // 部件删除
      const { ID, ProductID, Name } = data;
      this.messageBox.warnCancelBox('确定删除该部件吗', `部件名称：${Name}`, () => {
        this.$store.dispatch('productManage/getProductPartRemove', [ID, ProductID]);
      });
    },
    onElementMapSetClick(data) { // 设置元素映射
      this.curPartData = data;
      this.mapVisible = true;
    },
    onMapSetSubmit(data) {
      const callback = () => {
        this.mapVisible = false;
      };
      this.$store.dispatch('productManage/getProductBindElementType', [data, callback]);
    },
  },
  mounted() {
    const extendID = sessionStorage.getItem('lastExtendProductID');
    if (extendID && extendID === this.itemData.ID) this.extend = true;
  },
};
</script>
<style lang='scss'>
.mp-erp-product-manage-table-item-comp-wrap {
  // padding: 0 5px;
  padding-top: 10px;
  min-width: 1718px;
  width: calc(100% - 2px);
  &.active > header {
    background-color: #f5f5f5;
    border-color: #e6e6e6;
    border-left-color: #f5f5f5;
    // position: relative;
    // &::before {
    //   content: '';
    //   width: 2px;
    //   height: 100%;
    //   left: -1px;
    //   top: 0;
    //   background-color: #428dfa;
    //   position: absolute;
    // }
  }
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
        width: 300px;
        display: flex;
        white-space: nowrap;
        overflow: hidden;
        height: 36px;
        line-height: 36px;
        padding-left: 10px;
        > span {
          white-space: nowrap;
          overflow: hidden;
          color: #585858;
          font-size: 14px;
          // text-align: center;
          &.name {
            width: 140px;
            padding-right: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          &.show-name {
            width: 140px;
            padding-right: 15px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      &.classify-box {
        width: 190px;
        height: 26px;
        > span {
          display: inline-block;
          height: 100%;
          font-size: 12px;
          line-height: 26px;
          color: #585858;
          // text-align: center;
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
        margin-left: 20px;
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
        width: 640px;
        text-align: center;
        > span:not(:last-of-type) {
          margin-right: 20px;
        }
      }
      &.extend-box {
        font-size: 12px;
        width: 90px;
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
      // border-left: #ccc;
      // border-left-color: #f5f5f5;
      box-shadow: -2px 0 0  #ccc;
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
        height: 30px;
        line-height: 30px;
        &:first-of-type {
          color: #585858;
          width: 120px;
          white-space: nowrap;
          overflow: hidden;
          // text-align: center;
          text-overflow: ellipsis;
          margin-right: 48px;
          padding-left: 25px;
          transition: color 0.1s ease-in-out;
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
      &:hover > div:first-of-type {
        color: #000;
        // font-weight: 700;
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
