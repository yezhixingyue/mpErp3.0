<template>
  <section class="mp-erp-time-limit-list-page-wrap">
    <header>
      <order-channel-selector
        :options='ProductLevel1List'
        :requestFunc="requestFunc"
        :changePropsFunc='setSearchCondition'
        :typeList="[['classID', '']]"
        :value='searchCondition.classID'
        :defaultProps="{ label: 'ClassName', value: 'ID' }"
        label='产品分类'
        />
      <!-- <span>添加工期：</span> -->
      <!-- <el-cascader
        size='small'
        placeholder='请选择产品分类'
        :options="twoLevelsProductClassify"
        :props="{value: 'ID', label: 'ClassName'}"
        @change="handleChange"></el-cascader> -->
    </header>
    <ListContentComp />
  </section>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import ListContentComp from '@/components/TimeLimitComps/Content/ListContentComp.vue';

export default {
  name: 'timeLimitList',
  components: {
    OrderChannelSelector,
    ListContentComp,
  },
  computed: {
    ...mapState('timelimit', ['searchCondition']),
    // ...mapState('common', ['productList']),
    ...mapGetters('common', ['twoLevelsProductClassify', 'allProductClassify']),
    ProductLevel1List() {
      if (!this.allProductClassify || this.allProductClassify.length === 0) return [];
      const _list = this.allProductClassify.filter(it => it.Level === 1);
      return [..._list];
    },
  },
  methods: {
    ...mapMutations('timelimit', ['setSearchCondition']),
    requestFunc() {
      this.$store.dispatch('timelimit/fetchTimeLimitList');
      this.$store.commit('timelimit/setTimeLimitActiveNames', []);
    },
    // handleChange([FirstLevelID, SecondLevelID]) {
    //   const _FirstLevel = this.twoLevelsProductClassify.find(it => it.ID === FirstLevelID);
    //   let FirstLevelName = '';
    //   let SecondLevelName = '';
    //   if (_FirstLevel) {
    //     FirstLevelName = _FirstLevel.ClassName;
    //     const _SecondLevel = _FirstLevel.children.find(it2 => it2.ID === SecondLevelID);
    //     if (_SecondLevel) SecondLevelName = _SecondLevel.ClassName;
    //   }
    //   this.$store.commit('timelimit/setAddTimeLimitDataInit', {
    //     FirstLevelID, FirstLevelName, SecondLevelID, SecondLevelName,
    //   });
    //   this.$router.push('/timeLimitSet');
    // },
  },
  mounted() {
    this.$store.dispatch('common/getProductList');
    this.$store.dispatch('common/getAllProductNames');
    if (!this.$route.query.notNeedFetch) this.$store.dispatch('timelimit/fetchTimeLimitList');
    else this.$router.replace('/timeLimitList');
  },
};
</script>

<style lang='scss'>
.mp-erp-time-limit-list-page-wrap {
  min-width: 1200px;
  box-sizing: border-box;
  padding: 20px;
  padding-top: 18px;
  padding-left: 25px;
  flex: 0 0 auto;
  position: relative;
  // height: 100vh;
  // overflow: auto;
  > header {
    display: flex;
    align-items: flex-end;
    padding-bottom: 40px;
    > section {
      margin-right: 100px;
      > header {
        position: relative;
        top: -1.5px;
      }
    }
    > div > div {
      > input {
        // border-color: #26bcf9;
        // background-color: #eee;
        &::placeholder {
          color: #989898;
        }
      }
    }
    > span {
      font-size: 14px;
      font-weight: 700;
      color: #444;
      display: block;
      height: 22px;
      margin-right: 6px;
    }
  }
}
</style>
