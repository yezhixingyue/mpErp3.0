<template>
  <FormulaPanelComp
    v-if="PositionID"
    class="mp-erp-material-type-page-formula-set-page-wrap"
    :PositionID='PositionID'
    :moduleIndex='0'
    :NowEditFormulaData='NowEditFormulaData'
    :pageTitle='materialTypeName'
    pageLabel='当前物料类型'
    @goback='onGoBackClick'
    @successSubmit='onSuccessSubmit'
    />
</template>

<script>
import { mapState } from 'vuex';
import FormulaPanelComp from '@/components/common/FormulaComps/FormulaPanelComp.vue';

export default {
  components: {
    FormulaPanelComp,
  },
  data() {
    return {
      PositionID: '',
      materialTypeName: '',
    };
  },
  computed: {
    ...mapState('basicSet', ['NowEditFormulaData']),
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) return;
      const { id, name } = this.$route.params;
      if (!id || !name) return;
      this.PositionID = id;
      this.materialTypeName = name;
    },
    onGoBackClick() {
      this.$router.replace(`/MaterialFormulaList/${this.PositionID}/${this.materialTypeName}`);
    },
    // eslint-disable-next-line no-unused-vars
    onSuccessSubmit(data) {
      // 编辑成功后的处理方法 需要对列表数据进行修改  因为目前采用了直接重新获取列表数据的方式（页面传值，暂未采用仓库存储列表数据） 所以该方法暂不使用 同理有删除方法(未写)
      // console.log('onSubmit', data);
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
</style>
