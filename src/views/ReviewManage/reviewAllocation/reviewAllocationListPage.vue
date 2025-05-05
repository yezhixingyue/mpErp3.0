<template>
  <section class="mp-erp-review-allocation-list-page-wrap">
    <ReviewAllocationHeader @add="onSaveClick" :hasPermission="localPermission.Setup" />
    <main>
      <p class="is-origin">注：分配策略仅匹配一条，优先级数字越小，越优先匹配。</p>
      <div>
        <ReviewAllocationTable
          :dataList="reviewAllocationList"
          :loading="loading"
          :PropertyList="allocationConditionPropList"
          :hasPermission="localPermission.Setup"
          @edit="onSaveClick"
          @remove="handleItemRemove"
        />
      </div>
    </main>
    <footer>
      <Count
       :watchPage='condition4ReviewAllocationList.Page'
       :handlePageChange='handlePageChange'
       :count='reviewAllocationListNumber'
       center
       :pageSize='condition4ReviewAllocationList.PageSize'
       />
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import ReviewAllocationHeader from '../../../components/ReviewComps/ReviewAllocation/List/ReviewAllocationHeader.vue';
import ReviewAllocationTable from '../../../components/ReviewComps/ReviewAllocation/List/ReviewAllocationTable.vue';
import Count from '../../../components/common/Count.vue';
import PropertyClass from '../../../assets/js/TypeClass/PropertyClass';

export default {
  name: 'reviewAllocationListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-review-allocation-list-page-wrap > main > div')],
  components: {
    ReviewAllocationHeader,
    ReviewAllocationTable,
    Count,
  },
  computed: {
    ...mapState('review', ['reviewAllocationList', 'reviewAllocationListNumber', 'loading', 'allocationConditionPropList', 'condition4ReviewAllocationList']),
    ...mapState('common', ['Permission']),
    localPermission() { // localPermission.Setup
      return this.Permission?.PermissionList?.PermissionCheckFileStrategy?.Obj || {};
    },
  },
  methods: {
    onSaveClick(e) {
      this.$store.commit('review/setCurAllocationEditItem', e);
      this.$router.push('/reviewAllocationSetup');
    },
    async getConditionPropList() {
      const temp = {
        UseModule: 51,
      };
      this.$store.commit('review/setAllocationConditionPropList', []);
      const list = await PropertyClass.getPropertyList(temp);
      this.$store.commit('review/setAllocationConditionPropList', list);
    },
    handleItemRemove(item) {
      this.$store.dispatch('review/getDistributionStrategyRemove', { item });
    },
    handlePageChange(page = 1) {
      this.$store.dispatch('review/getReviewAllocationList', page);
    },
  },
  mounted() {
    this.getConditionPropList();
    this.handlePageChange();
    this.$store.dispatch('common/getAreaList');
    this.$store.dispatch('common/getProductClassifyData');
    this.$store.dispatch('common/getAllProductNames');
    this.$store.dispatch('common/fetchAdAreaList');
  },
};
</script>
<style lang='scss'>
.mp-erp-review-allocation-list-page-wrap {
  padding: 0 30px;
  font-size: 14px;
  color: #585858;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  > footer, > header {
    flex: none;
  }
  > main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    > p {
      flex: none;
      padding: 10px 0;
    }
    > div {
      overflow: auto;
      overflow: overlay;
      flex: 1;
      .mp-erp-price-module-price-table-result-formula-table-comp-container {
        padding-top: 6px;
      }
    }
  }
  > footer {
    height: 60px;
  }
}
</style>
