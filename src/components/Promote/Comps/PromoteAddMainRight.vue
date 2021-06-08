<template>
  <section class="promote-add-edit-detail-right-wrap">
    <header>
      <VTypeTitle :title="pageTitle" />
    </header>
    <main>
      <span class="add-header">
        <ProductsCheckoutDiaComp
          :defaultCheckedKeys='defaultCheckedKeys'
          :handleSaveFunc='handleSaveFunc'
          :watchValue='watchValue2ProductDia'
          :setWatchValue2ProductDia='setWatchValue2ProductDia'
          :setOpenType2ProductDia='setOpenType2ProductDia'
          :shouldDisabledList='shouldDisabledList'
          :isDisabled='isDisabled'
          v-if="Permission.PermissionList.PermissionPromote.Obj.Setup"
          :title="isDisabled?'活动商品详情':'添加活动商品'"
         />
      </span>
      <ul class="add-product-list mp-scroll-wrap">
        <promote-product-price-item
          :isDisabled='isDisabled'
          v-for="(item,i) of promoteAddRequestObj.ProductList"
          :index='i'
          :data='item'
          :key='"ProductList" + "-" + i'
         />
      </ul>
    </main>
  </section>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import VTypeTitle from '@/components/ServiceAfterSale/EditDialog/VTypeTitle.vue';
import ProductsCheckoutDiaComp from '@/components/common/ProductsCheckoutDiaComp.vue';
import PromoteProductPriceItem from './PromoteProductPriceItem.vue';

export default {
  components: {
    VTypeTitle,
    ProductsCheckoutDiaComp,
    PromoteProductPriceItem,
  },
  data() {
    return {
      pageTitle: '添加活动',
    };
  },
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('promoteStore', ['promoteAddRequestObj', 'watchValue2ProductDia', 'openTypeIndex2ProductDia']),
    ...mapState('common', ['Permission']),
    ...mapGetters('common', ['allProductClassify']),
    defaultCheckedKeys() {
      if (!(!this.openTypeIndex2ProductDia && this.openTypeIndex2ProductDia !== 0)
        && this.promoteAddRequestObj.ProductList[this.openTypeIndex2ProductDia]) {
        return this.promoteAddRequestObj.ProductList[this.openTypeIndex2ProductDia]
          .LimitList.map(it => it.ProductID);
      }
      return [];
    },
    shouldDisabledList() {
      const _list = [];
      this.promoteAddRequestObj.ProductList.forEach(level1 => {
        level1.LimitList.forEach(level2 => {
          _list.push(level2.ProductID);
        });
      });
      return _list;
    },
  },
  methods: {
    ...mapMutations('promoteStore', ['setPromoteAddRequestObj', 'setWatchValue2ProductDia', 'setOpenType2ProductDia']),
    ...mapActions('common', ['getProductList', 'getAllProductNames']),
    // eslint-disable-next-line consistent-return
    handleSaveFunc(nodes, func) {
      const _nodes = nodes.filter(node => node.ProductID);
      if (_nodes.length === 0) {
        return '至少必须选择一种产品!';
      }
      const LimitList = _nodes.map(item => (
        {
          FirstLevelID: item.ProductClass.First,
          SecondLevelID: item.ProductClass.Second,
          ProductID: item.ProductID,
          ProductName: item.ProductName,
        }
      ));
      const List = [];
      const _tempObj1 = [...this.promoteAddRequestObj.ProductList];
      let _tempObj2;
      const _obj = { LimitList, List };
      if (!this.openTypeIndex2ProductDia && this.openTypeIndex2ProductDia !== 0) { // 完成新增
        _tempObj2 = [..._tempObj1, _obj];
        this.setPromoteAddRequestObj([['ProductList', ''], _tempObj2]);
        return true;
      }
      if (typeof this.openTypeIndex2ProductDia === 'number') { // 修改
        const len1 = LimitList.length; // 要改变后的产品数量
        const target = _tempObj1.find((it, i) => i === this.openTypeIndex2ProductDia);
        const len2 = target.LimitList.length; // 改变前的产品数量
        if (len2 === 1 && len1 === 1 && target.LimitList[0].ProductID === LimitList[0].ProductID) {
          // 未发生变化
          return true;
        }
        // eslint-disable-next-line max-len
        if ((len2 === 1 && len1 > 1) || (len2 === 1 && len1 === 1 && target.LimitList[0].ProductID !== LimitList[0].ProductID)) {
          this.messageBox.warnCancelBox('确定修改产品信息吗 ?', '[ 该操作会导致此价格表清空! ]', () => {
            _tempObj2 = _tempObj1.map((it, i) => {
              if (i !== this.openTypeIndex2ProductDia) {
                return it;
              }
              return { ...it, ..._obj };
            });
            this.setPromoteAddRequestObj([['ProductList', ''], _tempObj2]);
            func();
          }, null);
        } else {
          _tempObj2 = _tempObj1.map((it, i) => {
            if (i !== this.openTypeIndex2ProductDia) {
              return it;
            }
            const _it = JSON.parse(JSON.stringify(it));
            if (LimitList.length === 1) {
              const { ProductID } = LimitList[0];
              _it.List.forEach(sub => {
                sub.Constraint.ItemList.forEach(item => {
                  // eslint-disable-next-line no-param-reassign
                  item.ProductID = ProductID;
                });
              });
            }
            return { ..._it, LimitList };
          });
          this.setPromoteAddRequestObj([['ProductList', ''], _tempObj2]);
          return true;
        }
      }
    },
  },
  mounted() {
    this.getProductList();
    this.getAllProductNames();
    const { type } = this.$route.params;
    if (type === 'add') this.pageTitle = '添加活动';
    if (type === 'edit') this.pageTitle = '编辑活动';
    if (type === 'detail') this.pageTitle = '活动详情';
  },
};
</script>

<style lang='scss'>
.promote-add-edit-detail-right-wrap {
  width: 60%;
  background-color: #fff;
  > header {
    position: absolute;
    left: 48px;
    > .mp-vertical-type-title {
      display: flex;
      width: 90px;
      height: 14px;
      > div {
        flex: none;
        margin-left: 0px;
        > img {
          display: none;
        }
        width: 3px;
        height: 14px;
        border-radius: 0;
        margin-right: 10px;
        margin-bottom: 0px;
      }
      > span {
        width: 4em;
        line-height: 14px;
        font-size: 14px;
        color: #26BCF9;
      }
    }
    padding-top: 25px;
    padding-bottom: 15px;
  }
  > main {
    border-left: 1px solid #eee;
    margin-top: 70px;
    width: 88%;
    padding-left: 40px;
    > .add-header {
      height: 20px;
      line-height: 20px;
      padding-bottom: 10px;
      display: block;
      margin-bottom: 20px;
    }
    height: calc(100% - 70px);
    > ul {
      height: calc(100% - 50px);
      min-width: 688px;
      overflow: auto;
      // overflow: overlay;
      > li:first-of-type {
        padding-top: 10px;
      }
    }
  }
}
</style>
