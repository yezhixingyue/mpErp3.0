<template>
  <section class="mp-product-production-period-root-list-page">
    <header>
      <ProductSelectorIndexTwoLevels
        title='产品分类'
        haveNotEmpty
        :changePropsFunc="setObjForListData"
        :requestFunc="getDataList"
        :ClassID="condition4RootDataList.classID"
        :TypeID="condition4RootDataList.typeID"
        :typeList="[['classID', ''],['typeID', '']]" />
    </header>
    <main>
      <!-- 列表数据 -->
      <ul v-if="RootDataList && RootDataList.length > 0 && !loading">
        <li v-for="(it, i) in RootDataList" :key="it.ID">
          <div class="l">{{it.Name}}</div>
          <div class="r">
            <span class="blue-span f" @click="onTotalPeriodClick(i)">设置总工期 <i>({{it.TotalPeriodList.length}})</i></span>
            <span class="blue-span" @click="onPeriodItemClick(i)">设置工期组成 <i>({{it.PeriodItemList.length}})</i></span>
          </div>
        </li>
      </ul>
      <!-- 空状态 -->
      <div v-else-if="!loading">暂无数据</div>
    </main>
  </section>
</template>

<script>
import ProductSelectorIndexTwoLevels from '@/components/common/SelectorComps/ProductSelectorIndexTwoLevels.vue';
import { mapState } from 'vuex';

export default {
  name: 'ProductionPeriodPage',
  components: {
    ProductSelectorIndexTwoLevels,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('periodManage', ['condition4RootDataList', 'RootDataList', 'loading']),
  },
  methods: {
    getDataList() { // 获取列表数据
      this.$store.dispatch('periodManage/getRootDataList');
    },
    setObjForListData(data) {
      this.$store.commit('periodManage/setCondition4RootList', data);
    },
    onTotalPeriodClick(i) { // 设置总工期
      this.$store.commit('periodManage/setCurSetupProductIndex', i); // 在仓库中设置当前产品条目索引值信息
      this.$router.push({ name: 'ProductionTotalPeriodList' });
    },
    onPeriodItemClick(i) { // 设置工期组成
      this.$store.commit('periodManage/setCurSetupProductIndex', i); // 在仓库中设置当前产品条目索引值信息
      this.$router.push({ name: 'ProductionPeriodCompositionList' });
    },
  },
  created() {
    this.$store.commit('periodManage/clearCondition4RootDataList');
  },
};
</script>
<style lang='scss'>
.mp-product-production-period-root-list-page {
  background-color: #f5f5f5;
  padding: 8px;
  padding-top: 0;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-width: 1000px;
  > header {
    background-color: #fff;
    flex: 0;
    padding: 25px 45px;
  }
  > main {
    flex: 1;
    background-color: #fff;
    padding: 25px 45px;
    box-sizing: border-box;
    // 列表
    > ul {
      height: 100%;
      > li {
        width: 800px;
        height: 30px;
        border-bottom: 1px solid #eee;
        padding-top: 12px;
        line-height: 24px;
        > div {
          display: inline-block;
          &.l {
            width: 480px;
            font-size: 14px;
            color: #585858;
            overflow: hidden;
            vertical-align: top;
            padding-left: 26px;
            box-sizing: border-box;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-right: 10px;
          }
          &.r {
            font-size: 13px;
            > span {
              > i {
                letter-spacing: 1.5px;
              }
              &.f {
                margin-right: 55px;
              }
            }
          }
        }
      }
    }
    // 空状态
    > div {
      width: 1000px;
      height: 100%;
      text-align: center;
      font-size: 12px;
      color: #989898;
      padding-top: 30vh;
      box-sizing: border-box;
    }
  }
}
</style>
