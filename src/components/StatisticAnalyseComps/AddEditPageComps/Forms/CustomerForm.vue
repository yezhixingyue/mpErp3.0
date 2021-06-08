<template>
  <section class="mp-statistic-analyse-add-edit-page-form-wrap">
    <header>
      <span>数据：</span>
      <SingleRadioGroupComp  v-model="DataType" :list='StatisticalCustomerTypeList' />
    </header>
    <div>
      <div class="area-product-select-box">
        <span>区域筛选：</span>
        <div>
          <AreaDialogTreeSelectComp v-model="AreaList" />
        </div>
      </div>
      <checkbox-group-comp
         title="注册时间"
        :itemList='StatisticalCustomerRegistrationTimeList'
         v-model='selectCustomerRegistrationTimeList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
      <checkbox-group-comp
         title="客户分类"
        :itemList='userTypeListNoneEmpty'
         v-model='selectUserTypeList'
        />
      <checkbox-group-comp
         title="客户等级"
        :itemList='userRankListNoneEmpty'
         v-model='selectUserRankList'
        />
      <checkbox-group-comp
         title="注册方式"
        :itemList='StatisticalCustomerRegistrationTypeList'
         v-model='selectCustomerRegistrationTypeList'
        :defaultProps="{ label: 'name', value: 'ID' }"
        />
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import AreaDialogTreeSelectComp from '@/components/common/SelectorComps/AreaDialogTreeSelectComp.vue';
import SingleRadioGroupComp from '@/components/common/SingleRadioGroupComp.vue';
import CheckboxGroupComp from '@/components/common/CheckboxGroupComp.vue';

export default {
  components: {
    CheckboxGroupComp,
    SingleRadioGroupComp,
    AreaDialogTreeSelectComp,
  },
  data() {
    return {
      // DataType: '', // 数据   客户数量 | null
      // AreaList: [], // 区域筛选
      // selectCustomerRegistrationTimeList: [], // 注册时间
      // selectUserTypeList: [], // 客户类型
      // selectUserRankList: [], // 客户等级
      // selectCustomerRegistrationTypeList: [], // 注册方式
    };
  },
  computed: {
    ...mapState('common', ['StatisticalCustomerTypeList', 'StatisticalCustomerRegistrationTimeList', 'userTypeListNoneEmpty', 'userRankListNoneEmpty',
      'StatisticalCustomerRegistrationTypeList']),
    ...mapState('statistic', ['condition4SaveForm']),
    DataType: {
      get() {
        return this.condition4SaveForm.CustomerFormData.DataType;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['CustomerFormData', 'DataType'], val]);
      },
    },
    AreaList: {
      get() {
        return this.condition4SaveForm.CustomerFormData.AreaList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['CustomerFormData', 'AreaList'], val]);
      },
    },
    selectUserTypeList: {
      get() {
        return this.condition4SaveForm.CustomerFormData.selectUserTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['CustomerFormData', 'selectUserTypeList'], val]);
      },
    },
    selectUserRankList: {
      get() {
        return this.condition4SaveForm.CustomerFormData.selectUserRankList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['CustomerFormData', 'selectUserRankList'], val]);
      },
    },
    selectCustomerRegistrationTimeList: {
      get() {
        return this.condition4SaveForm.CustomerFormData.selectCustomerRegistrationTimeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['CustomerFormData', 'selectCustomerRegistrationTimeList'], val]);
      },
    },
    selectCustomerRegistrationTypeList: {
      get() {
        return this.condition4SaveForm.CustomerFormData.selectCustomerRegistrationTypeList;
      },
      set(val) {
        this.$store.commit('statistic/setConditionForSaveForm', [['CustomerFormData', 'selectCustomerRegistrationTypeList'], val]);
      },
    },
  },
};
</script>
<style lang='scss'>
</style>
