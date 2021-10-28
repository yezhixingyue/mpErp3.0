<template>
  <section class="mp-erp-material-type-page-element-set-comp-wrap">
    <header>
      <span>当前物料类型：</span>
      <span>{{materialTypeName}}</span>
    </header>
    <main>
      <CommonElementSetPageComp
      v-if="PositionID"
      :PositionID='PositionID'
      :showGroup='false'
      :canRemove='canRemove'
      :curUseElementModule='curUseElementModule'
      @elementSave='onElementSave'
      @elementRemove='onElementRemove' />
      <p class="tips-box"> <i class="el-icon-warning"></i> 物料类型添加界面元素时，如果添加的元素类型为选择项，不建议使用多选选择方式，如果使用多选选择方式也将按照单选方式处理</p>
    </main>
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import CommonElementSetPageComp from '@/components/CommonElementSet/CommonElementSetPageComp.vue';
import { mapState } from 'vuex';

export default {
  name: 'MaterialElementSetPage',
  components: {
    CommonElementSetPageComp,
  },
  data() {
    return {
      PositionID: '',
      materialTypeName: '',
    };
  },
  computed: {
    ...mapState('basicSet', ['MaterialTypeList']),
    ...mapState('common', ['useElementModuleList']),
    curUseElementModule() {
      const t = this.$utils.getIDFromListByNames('MaterialType', this.useElementModuleList);
      return (t || t === 0) ? t : '';
    },
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
      this.$router.replace('/MaterialTypeList');
    },
    // eslint-disable-next-line no-unused-vars
    onElementSave({ isEdit, data }) {
      // this.$store.commit('basicSet/setMaterialTypeElementChange', [isEdit, data, this.PositionID]);
    },
    onElementRemove(id) {
      this.$store.commit('basicSet/setMaterialTypeElementRemove', [id, this.PositionID]);
    },
    canRemove(id) {
      const t = this.MaterialTypeList.find(it => it.ID === this.PositionID);
      if (t && t.UnionShowList.length > 0) {
        let bool = false;
        t.UnionShowList.forEach(lv1Arr => {
          if (!bool) {
            if (lv1Arr.includes(id)) bool = true;
          }
        });
        if (bool) {
          this.messageBox.failSingleError('删除失败', '该元素在 [ 元素组合显示 ] 中已使用');
          return false;
        }
      }
      return true;
    },
  },
  mounted() {
    this.getPositionID();
  },
};
</script>
<style lang='scss'>
.mp-erp-material-type-page-element-set-comp-wrap {
  padding-left: 20px;
  height: 100%;
  padding-bottom: 25px;
  box-sizing: border-box;
  > header {
    padding: 30px 0;
    padding-bottom: 40px;
    line-height: 15px;
    box-sizing: border-box;
    height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
  }
  .tips-box {
    width: 800px;
    margin-top: 15px;
  }
  > main {
    min-height: calc(100% - 70px - 85px);
  }
  > footer {
    text-align: center;
    padding: 25px;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      color: #26BCF9;
    }
  }
}
</style>
