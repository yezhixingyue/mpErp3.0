<template>
  <header class="mp-erp-review-allocation-list-page-header-wrap">
    <div class="left">
      <el-button type="primary" @click="onStrategyAddClick" v-if="hasPermission">添加策略</el-button>
      <div>
        <span>未匹配任何分配策略时，订单分配给</span>
        <h4>：{{MemberGroupTitle}}</h4>
      </div>
      <span class="blue-span" @click="visible=true" v-if="hasPermission">设置默认分配组</span>
    </div>
    <SearchInputComp
      class="search-section"
      :typeList="[['KeyWords', '']]"
      :requestFunc='getReviewAllocationList'
      :changePropsFunc='setCondition4ReviewAllocationList'
      :word='condition4ReviewAllocationList.KeyWords'
      @reset='clearCondition4ReviewAllocationList'
      :searchWatchKey="reviewAllocationList"
      title='关键词'
      placeholder='请输入搜索关键词'
    />
    <DefaultStrategyDialog :visible.sync="visible" v-model="MemberGroupID" :list="reviewGroupList" />
  </header>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import { SearchInputComp } from '@/components/common/mpzj-sell-lib/lib';
import DefaultStrategyDialog from './DefaultStrategyDialog.vue';

export default {
  props: {
    hasPermission: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    SearchInputComp,
    DefaultStrategyDialog,
  },
  computed: {
    ...mapState('review', ['condition4ReviewAllocationList', 'reviewAllocationList', 'reviewGroupList']),
    MemberGroupTitle() {
      if (!this.MemberGroupID) return '未设置';
      if (this.reviewGroupList.length > 0) {
        const t = this.reviewGroupList.find(it => it.ID === this.MemberGroupID);
        return t ? t.Name : '-';
      }
      return '-';
    },
  },
  data() {
    return {
      MemberGroupID: '',
      visible: false,
    };
  },
  methods: {
    ...mapMutations('review', ['setCondition4ReviewAllocationList', 'clearCondition4ReviewAllocationList']),
    ...mapActions('review', ['getReviewAllocationList']),
    onStrategyAddClick() {
      this.$emit('add', null);
    },
    async getDefaultInfo() {
      const resp = await this.api.getCheckFileDefaultProcess().catch(() => null);
      if (resp && resp.data.Status === 1000 && resp.data.Data) {
        this.MemberGroupID = resp.data.Data.MemberGroupID;
      }
    },
  },
  mounted() {
    this.$store.dispatch('review/getReviewGroupList');
    this.getDefaultInfo();
  },
};
</script>
<style lang='scss'>
.mp-erp-review-allocation-list-page-header-wrap {
  padding: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: none;
  > div.left {
    flex: 1;
    display: flex;
    align-items: center;
    > .el-button {
      width: 120px;
      height: 30px;
      padding: 0;
      flex: none;
      margin-right: 20px;
    }
    > span.blue-span {
      flex: none;
      margin: 0 20px;
      font-size: 13px;
    }
    > div {
      white-space: nowrap;
      overflow: hidden;
      display: flex;
      flex: 0 1 auto;
      font-size: 13px;
      > h4 {
        flex: none;
        font-weight: 700;
      }
      > span {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  > section {
    flex: none;
  }
}
</style>
