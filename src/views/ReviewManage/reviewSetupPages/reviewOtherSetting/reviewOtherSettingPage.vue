<template>
  <section class="mp-erp-review-other-setting-manage-page-wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <p class="p-t">
        <span>{{title}}</span>
      </p>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='100%' v-if="curReviewProduct && ProductDetail">
        <template v-slot:left>
          <!-- 单双面设置 -->
          <PrintSideInfoSetItem
           :Product="curReviewProduct"
           :Part="curReviewProductPart"
           :filterMultiplePartElements="filterMultiplePartElements"
           @changed="onChanged"
           />
          <!-- 印色设置 -->
          <PrintColorSetupIndex
           :Product="curReviewProduct"
           :Part="curReviewProductPart"
           :filterMultiplePartElements="filterMultiplePartElements"
           @changed="onChanged"
           />
        </template>
        <template v-slot:right>
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <el-button class="cancel-blue-btn" @click="$goback">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LRWidthDragAutoChangeComp } from '@/components/common/mpzj-sell-lib/lib';
import Crumbs from '../../../../components/common/NewComps/Crumbs.vue';
import PrintSideInfoSetItem from '../../../../components/ReviewComps/ReviewSetup/reviewOtherSettings/PrintSideInfo/PrintSideInfoSetItem.vue';
import PrintColorSetupIndex from '../../../../components/ReviewComps/ReviewSetup/reviewOtherSettings/PrintColor/PrintColorSetupIndex.vue';
import { getIDFromListByNames } from '../../../../assets/js/utils/util';

export default {
  name: 'reviewOtherSettingPage',
  components: {
    Crumbs,
    LRWidthDragAutoChangeComp,
    PrintSideInfoSetItem,
    PrintColorSetupIndex,
  },
  computed: {
    ...mapState('productManage', ['ProductModuleKeyIDList']),
    ...mapGetters('review', ['curReviewProduct', 'curReviewProductPart']),
    title() {
      const label = this.curReviewProductPart ? '当前部件：' : '当前产品：';
      let content = '';
      if (this.curReviewProduct) {
        const { ProductClass, Name } = this.curReviewProduct;
        const { FirstLevelName, SecondLevelName } = ProductClass || {};
        const productName = [FirstLevelName, SecondLevelName, Name].filter(it => it).join('-');
        const partName = this.curReviewProductPart?.Name || '';
        content = [productName, partName].filter(it => it).join(' ');
      }

      return `${label}${content}`;
    },
    allElements() { // 筛选出 产品 + 部件 上的全部元素列表  （ 包含可多次使用的部件 及 可多次使用的元素组，后面根据需要进行二次筛选 ）
      if (!this.ProductDetail) return [];
      const _Product = {
        ID: this.ProductDetail.ID,
        Name: '产品',
      };
      const arr = [];
      const addElement2Arr = (data) => {
        if (!data || typeof data !== 'object') return;
        const { ID, Name, UseTimes, ElementList, GroupList } = data;
        const _Part = ID !== this.ProductDetail.ID ? { ID, Name, UseTimes } : null;
        // 添加非元素组元素
        if (Array.isArray(ElementList)) {
          ElementList.filter(it => it && !it.Group).forEach(it => {
            arr.push({ ...it, _Product, _Part, _Group: null });
          });
        }
        // 添加元素组元素
        if (Array.isArray(GroupList)) {
          GroupList.forEach(group => {
            if (Array.isArray(group.ElementList)) {
              const _Group = { ID: group.ID, Name: group.Name, UseTimes: group.UseTimes };
              group.ElementList.forEach(it => {
                arr.push({ ...it, _Product, _Part, _Group, Name: `${group.Name}:${it.Name}` });
              });
            }
          });
        }
      };
      addElement2Arr(this.ProductDetail);
      if (Array.isArray(this.ProductDetail.PartList)) {
        this.ProductDetail.PartList.forEach(part => {
          addElement2Arr(part);
        });
      }
      // 返回格式类型：{ _Product, _Part, _Group, ...元素信息 }   _Part 和 _Group有值的情况下： { ID, Name, UseTimes }
      return arr;
    },
    filterMultiplePartElements() { // 筛选掉可多次使用的部件 （当前部件除外）
      const list = this.allElements.filter(it => !it._Part
        || (it._Part.UseTimes && it._Part.UseTimes.MinValue === 1 && it._Part.UseTimes.MaxValue === 1)
        || (this.curReviewProductPart && it._Part.ID === this.curReviewProductPart.ID));
      return list;
    },
  },
  data() {
    return {
      crumbsList: [
        { name: '审稿设置', path: '/reviewSetupList' },
        { name: '其它设置' },
      ],
      ProductDetail: null, // 产品详情数据
    };
  },
  methods: {
    async getProductDetailData() { // 获取产品详情信息
      if (!this.curReviewProduct || this.ProductDetail) return;
      const dataType = ['Group', 'Element', 'Part'];
      const List = getIDFromListByNames(dataType, this.ProductModuleKeyIDList);
      const _temp = { ID: this.curReviewProduct.ID, List };
      const resp = await this.api.getProductModuleData(_temp).catch(() => null);
      if (resp && resp.data && resp.data.Status === 1000) {
        this.ProductDetail = resp.data.Data;
      }
    },
    onChanged(e) {
      if (!e || typeof e !== 'object') return;
      this.$store.commit('review/setCheckFileOtherInfo', { ...e });
    },
  },
  created() {
    this.getProductDetailData();
  },
};
</script>
<style lang='scss'>
.mp-erp-review-other-setting-manage-page-wrap {
  padding-left: 30px;
  padding-right: 100px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  height: 100%;
  > header {
    flex: none;
    padding-bottom: 35px;
    > .mp-erp-common-comps-crumbs-comp-wrap {
      display: block;
      margin-bottom: 6px;
    }
    > .p-t {
      padding-top: 4px;
      color: #21CAE3;
      font-weight: 700;
    }
  }
  > main {
    flex: 1;
    .mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap {
      > .left {
        .mp-common-title-wrap {
          display: block;
          color: #444;
        }
        > section {
          margin-bottom: 20px;
          max-width: 720px;
          .blue-span {
            font-size: 13px;
          }
        }
      }
      > .right {
        padding-left: 50px;
        padding-top: 12px;
      }
      .vertical-line {
        display: none;
      }
    }
  }
  > footer {
    flex: none;
    height: 80px;
    padding-top: 30px;
    text-align: center;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
      & + .el-button {
        margin-left: 40px;
      }
    }
  }
}
</style>
