<template>
  <section class="mp-erp-print-breadth-page-wrap">
    <header>
      <div class="menu">
        <el-button type="primary" @click="onBreadthSaveClick(null)">添加印刷幅面</el-button>
        <span class="blue-span" @click="onClassManageClick">管理分类</span>
      </div>
      <div class="list">
        <el-radio-group v-model="classID" size="small" v-if="BreadthCLassList.length>0">
          <el-radio-button :label="it.ID" :key='it.ID' v-for="it in localBreadthCLassList">{{it.Name}}</el-radio-button>
        </el-radio-group>
        <span class="is-font-size-12 is-pink" style="opacity: 0.8" v-if="BreadthCLassList.length===0 && !classLoading">
          <i style="font-size:14px" class="el-icon-warning-outline"></i>
          分类列表数据为空，请添加</span>
      </div>
    </header>
    <main>
      <BreadthSaveDialog :visible.sync='visible' :curData='saveData' :classList='BreadthCLassList' @submit="onSaveSubmit" />
      <BreadthTableComp ref="oBreadthTable" :dataList='listData' :loading='tableLoading' @edit='onBreadthSaveClick' @remove='onRemoveClick' />
    </main>
    <footer>
      <span>共检索出 <i>{{listData.length}}</i> 条数据</span>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import BreadthSaveDialog from '@/components/PrintBreadth/BreadthSaveDialog.vue';
import BreadthTableComp from '@/components/PrintBreadth/BreadthTableComp.vue';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'PrintFormatListPage',
  mixins: [recordScrollPositionMixin('.mp-erp-print-breadth-page-wrap .el-table__body-wrapper')],
  computed: {
    ...mapState('basicSet', ['BreadthCLassList', 'BreadthList']),
    listData() {
      if ((!this.classID && this.classID !== 0 && this.classID !== '') || this.BreadthList.length === 0) return [];
      if (this.classID === '') return this.BreadthList;
      return this.BreadthList.filter(it => it.Class.ID === this.classID);
    },
    localBreadthCLassList() {
      const _item = { ID: '', Name: '全部' };
      if (!this.BreadthCLassList || !Array.isArray(this.BreadthCLassList) || this.BreadthCLassList.length === 0) {
        return [_item];
      }
      return [_item, ...this.BreadthCLassList];
    },
  },
  data() {
    return {
      classID: '',
      visible: false,
      saveData: null,
      tableLoading: false,
      classLoading: false,
    };
  },
  components: {
    BreadthSaveDialog,
    BreadthTableComp,
  },
  methods: {
    onBreadthSaveClick(data) { // 添加印刷幅面
      this.saveData = data || null;
      this.visible = true;
    },
    onClassManageClick() { // 去往分类管理页面
      this.$router.push('/PrintFormatClassManage');
    },
    async onSaveSubmit(data) { // 印刷幅面保存
      const ID = await this.$store.dispatch('basicSet/getBreadthSave', data);
      if (ID) {
        const isEdit = !!((data.ID || data.ID === 0));
        const _title = isEdit ? '编辑成功' : '添加成功';
        const callback = () => { this.handleSaveSuccess({ isEdit, data, ID }); };
        this.messageBox.successSingle(_title, callback, callback);
      }
    },
    handleSaveSuccess({ isEdit, data, ID }) { // 印刷幅面保存成功后处理函数
      this.$store.commit('basicSet/setBreadthSaveSuccess', { isEdit, data, ID, curClassID: this.classID });
      this.visible = false;
    },
    async getTableDataList(classID) {
      this.tableLoading = true;
      await this.$store.dispatch('basicSet/getBreadthList', classID);
      this.tableLoading = false;
    },
    onRemoveClick(data) {
      if (!data) return;
      this.messageBox.warnCancelBox('确定删除该印刷幅面吗', `幅面名称：[ ${data.Name} ]`, () => {
        this.$store.dispatch('basicSet/getBreadthRemove', data.ID);
      });
    },
  },
  watch: {
    // BreadthCLassList: { // 为初始classID赋值
    //   handler(newVal) {
    //     if (this.classID || this.classID === 0 || !newVal || !Array.isArray(newVal) || newVal.length === 0) return;
    //     const first = newVal[0];
    //     if (first && Object.prototype.toString.call(first) === '[object Object]') {
    //       const { ID } = first;
    //       if (ID || ID === 0) this.classID = ID;
    //     }
    //   },
    //   immediate: true,
    // },
    classID: { // 监听数据改变，获取印刷幅面列表数据
      handler(newVal) {
        this.getTableDataList(newVal);
      },
      immediate: true,
    },
  },
  async mounted() {
    this.classLoading = true;
    await this.$store.dispatch('basicSet/getBreadthClassList');
    this.classLoading = false;
    if (this.$refs.oBreadthTable && this.$refs.oBreadthTable.setHeight) this.$refs.oBreadthTable.setHeight();
  },
};
</script>
<style lang='scss'>
.mp-erp-print-breadth-page-wrap {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 6px;
  > header {
    // min-height: 120px;
    padding: 15px 20px;
    background-color: #fff;
    box-sizing: border-box;
    // min-width: 1180px;
    .menu {
      > button {
        border-radius: 2px;
        width: 120px;
        height: 32px;
        padding: 0;
      }
      > span {
        font-size: 14px;
        margin-left: 30px;
      }
    }
    .list {
      margin-top: 20px;
      .el-radio-button:not(.is-active) {
        .el-radio-button__inner {
          &:hover {
            background-color: #f5f5f5;
          }
          &:active {
            background-color: #eee;
          }
        }
      }
      .el-radio-button__inner {
        padding: 8px 35px;
        font-size: 14px;
        box-shadow: -1px 0 0 0 #eee;
      }
      .el-radio-button:first-child .el-radio-button__inner {
        border-radius: 3px 0 0 3px;
      }
      .el-radio-button:last-child .el-radio-button__inner {
        border-radius: 0 3px 3px 0;
      }
      .el-radio-button {
        margin-bottom: 10px;
      }
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 8px;
    margin-right: 6px;
  }
  > footer {
    flex: none;
    height: 16px;
    background-color: #fff;
    font-size: 13px;
    padding: 10px 20px;
    padding-right: 65px;
    line-height: 16px;
    color: #585858;
    text-align: right;
    i {
      color: #26bcf9;
      font-weight: 600;
      font-size: 14px;
    }
  }
}
</style>
