<template>
  <section class="mp-erp-material-type-page-element-set-comp-wrap">
    <header>
      <span>当前物料类型：</span>
      <span>{{materialTypeName}}</span>
    </header>
    <CommonElementSetPageComp
     v-if="PositionID"
     :PositionID='PositionID'
     :showGroup='false'
     :canRemove='canRemove'
     @elementSave='onElementSave'
     @elementRemove='onElementRemove' />
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import CommonElementSetPageComp from '@/components/CommonElementSet/CommonElementSetPageComp.vue';
import { mapState } from 'vuex';

export default {
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
    onElementSave({ isEdit, data }) {
      this.$store.commit('basicSet/setMaterialTypeElementChange', [isEdit, data, this.PositionID]);
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
  position: relative;
  height: 100%;
  padding-bottom: 105px;
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
  > footer {
    position: absolute;
    text-align: center;
    padding: 25px;
    bottom: 20px;
    left: 0;
    right: 0;
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
