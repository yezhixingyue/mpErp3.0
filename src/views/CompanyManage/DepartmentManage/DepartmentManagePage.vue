<template>
  <section>部门管理</section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState('common', ['userTypeListNoneEmpty']), // 用户类型列表数据
    ...mapGetters('common', ['allAreaTreeList', 'twoLevelsProductClassify']), // 责任区域列表数据，产品2级分类列表数据
  },
  data() {
    return {
      departmentList: [], // 部门列表数据
    };
  },
  methods: {
    async getDepartmentList() { // 获取部门列表数据
      const resp = await this.api.getDepartmentList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.departmentList = resp.data.Data || [];
      }
    },
  },
  mounted() {
    this.$store.dispatch('common/getAreaList'); // 获取责任区域（销售区域）数据
    this.$store.dispatch('common/getProductClassifyData'); // 获取产品二级分类数据
    this.$store.dispatch('common/getUserClassify'); // 获取用户类型数据
    this.getDepartmentList(); // 获取部门列表数据
  },
};
</script>
<style lang='scss'>
</style>
