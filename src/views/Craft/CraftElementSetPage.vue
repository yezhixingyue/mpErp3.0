<template>
  <section class="mp-erp-craft-list-page-element-set-comp-wrap">
    <header>
      <span>当前工艺：</span>
      <span>{{craftName}}</span>
    </header>
    <CommonElementSetPageComp
     v-if="PositionID"
     :PositionID='PositionID'
     :curUseElementModule='curUseElementModule'
     @elementSave='onElementSave'
     @elementRemove='onElementRemove'
     @elementGroupSave='onElementGroupSave'
     @elementGroupRemove='onElementGroupRemove'
     @copyGroupSuccess='setFetchData' />
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import CommonElementSetPageComp from '@/components/CommonElementSet/CommonElementSetPageComp.vue';
import { mapState } from 'vuex';

export default {
  name: 'CraftElementSetPage',
  components: {
    CommonElementSetPageComp,
  },
  data() {
    return {
      PositionID: '',
      craftName: '',
    };
  },
  computed: {
    ...mapState('basicSet', ['craftFetchData']),
    ...mapState('common', ['useElementModuleList']),
    curUseElementModule() {
      const t = this.$utils.getIDFromListByNames('Craft', this.useElementModuleList);
      return (t || t === 0) ? t : '';
    },
    fetchData: {
      get() {
        return this.craftFetchData;
      },
      set(val) {
        this.$store.commit('basicSet/setCraftFetchData', val);
      },
    },
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) return;
      const { id, name } = this.$route.params;
      if (!id || !name) return;
      this.PositionID = id;
      this.craftName = name;
    },
    onGoBackClick() {
      this.$router.replace('/CraftManageList');
    },
    // eslint-disable-next-line no-unused-vars
    onElementSave({ isEdit, data }) {
      // this.$store.commit('basicSet/setCraftElementChange', [isEdit, data, this.PositionID]);
    },
    onElementRemove(id) {
      this.$store.commit('basicSet/setCraftElementRemove', [id, this.PositionID]);
    },
    onElementGroupSave() {
      this.fetchData = true;
    },
    onElementGroupRemove() {
      this.fetchData = true;
    },
    setFetchData() {
      this.fetchData = true;
    },
  },
  mounted() {
    this.getPositionID();
  },
  activated() {
    this.fetchData = false;
  },
};
</script>
<style lang='scss'>
.mp-erp-craft-list-page-element-set-comp-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 40px;
    line-height: 15px;
    box-sizing: border-box;
    height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
  }
  > main {
    flex: 1;
  }
  > footer {
    text-align: center;
    padding: 25px;
    bottom: 20px;
    flex: none;
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
