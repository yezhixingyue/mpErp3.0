<template>
  <section class="mp-erp-basic-setup-element-set-common-comp-wrap">
    <header>
      <!-- <span>当前产品：</span>
      <span>名片 - 普通名片</span> -->
    </header>
    <CommonElementSetComp
      :ElementDataList='ElementDataList'
      :ElementGroupDataList='ElementGroupDataList'
      :isLoadingElement='isLoadingElement'
      :isLoadingGroup='isLoadingGroup'
      :isCommon='true'
      @saveElement='handleEditSubmitSuccess'
      @removeElement='onElementRemove'
      @saveElementGroup='handleGroupSaveSuccess'
      @removeElementGroup='onElementGroupRemove'
      @sortGroupElementList='handleSortSuccess'
     />
  </section>
</template>

<script>
import CommonElementSetComp from '@/components/CommonElementSet/CommonElementSetComp.vue';

import { mapState } from 'vuex';

export default {
  name: 'ElementTemplatePage',
  components: {
    CommonElementSetComp,
  },
  data() {
    return {
      isLoadingElement: false,
      isLoadingGroup: false,
    };
  },
  computed: {
    ...mapState('basicSet', ['ElementDataList', 'ElementGroupDataList']),
  },
  methods: {
    handleEditSubmitSuccess({ saveType, editData, ID }) { // 元素添加|编辑成功后的处理方法
      this.$store.commit('basicSet/setElementItemSave', { saveType, editData, ID });
    },
    onElementRemove([ID]) {
      this.$store.dispatch('basicSet/getElementRemove', ID);
    },
    async getElementList() {
      this.isLoadingElement = true;
      await this.$store.dispatch('basicSet/getElementList');
      this.isLoadingElement = false;
    },
    handleGroupSaveSuccess({ saveType, editData, ID }) { // 元素组添加|编辑成功后的处理方法
      this.$store.commit('basicSet/setElementGroupItemSave', { saveType, editData, ID });
    },
    async onElementGroupRemove([id, Module]) {
      this.$store.dispatch('basicSet/getElementGroupRemove', [id, Module]);
    },
    async getElementGroupList() {
      this.isLoadingGroup = true;
      await this.$store.dispatch('basicSet/getElementGroupList');
      this.isLoadingGroup = false;
    },
    handleSortSuccess(data) { // { ID, ElementList: { ID, Index } } 处理排序成功后的数据修改及弹窗关闭
      this.$store.commit('basicSet/setElementGroupElementListBySort', data);
    },
  },
  mounted() {
    this.getElementList();
    this.getElementGroupList();
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-setup-element-set-common-comp-wrap {
  padding-left: 20px;
  padding-bottom: 40px;
  > header {
    // padding: 20px 0;
    padding-top: 0px;
    line-height: 15px;
    box-sizing: border-box;
    height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
  }
}
</style>
