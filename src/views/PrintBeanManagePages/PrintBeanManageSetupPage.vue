<template>
  <section class="mp-erp-print-bean-setup-page-wrap">
    <header>
      <p class="mp-common-title-wrap">{{field}}印豆设置</p>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='780px'>
        <template v-slot:left>
          <PrintBeanSetupLeftComp :curPrintBeanData='curPrintBeanData' @change="onChange" :isStarted='isStarted' />
        </template>
        <template v-slot:right>
          <PrintBeanSetupRightComp :curPrintBeanData='curPrintBeanData' :isStarted='isStarted' @save="handleTableItemSave" @remove="handleTableItemRemove" />
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button @click="onGobackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import PrintBeanSetupLeftComp from '../../components/PrintBeanComps/PrintBeanSetupLeftComp.vue';
import PrintBeanSetupRightComp from '../../components/PrintBeanComps/PrintBeanSetupRightComp.vue';
import PrintBeanClassType from '../../store/printBean/PrintBeanClassType';

export default {
  name: 'PrintBeanSetupPage',
  components: {
    LRWidthDragAutoChangeComp,
    PrintBeanSetupLeftComp,
    PrintBeanSetupRightComp,
  },
  data() {
    return {
      curPrintBeanData: null, // 当前正在编辑的印豆项目数据，如果其ID为空则为添加
    };
  },
  computed: {
    ...mapState('printBean', ['PrintBeanListClassData']),
    isEdit() {
      return this.curPrintBeanData && this.curPrintBeanData.ID;
    },
    field() {
      return this.isEdit ? '编辑' : '添加';
    },
    isStarted() { // 该项目是否已经开始，影响：1.不允许设置开始日期 2. 不允许删除右侧已有印豆列表项目
      if (this.isEdit) {
        if (this.curPrintBeanData.StartTime && !this.curPrintBeanData.StartNow) {
          return new Date(this.curPrintBeanData.StartTime).getTime() < Date.now();
        }
        return true;
      }
      return false;
    },
  },
  methods: {
    onGobackClick() {
      this.$goback();
    },
    setCurPrintBeanData() { // 从路径中获取到当前正在设置的印豆ID（新增时为null）
      const ID = this.$route.params.ID && this.$route.params.ID !== 'null' ? this.$route.params.ID : '';
      let temp = null;
      if (ID) { // 编辑
        const t = this.PrintBeanListClassData.DataList.find(it => it.ID === ID);
        if (t) temp = t;
        else {
          this.$message.warning('未获取到有效编辑数据，请退出重试');
          return;
        }
      }
      this.curPrintBeanData = new PrintBeanClassType(temp);
    },
    onChange([key, val]) {
      if (!this.curPrintBeanData) return;
      this.curPrintBeanData[key] = val;
    },
    handleTableItemRemove(i) {
      if (this.curPrintBeanData) {
        this.curPrintBeanData.ItemList.splice(i, 1);
      }
    },
    handleTableItemSave([item, i]) {
      if (typeof i === 'number') {
        this.curPrintBeanData.ItemList.splice(i, 1, item);
      } else {
        this.curPrintBeanData.ItemList.push(item);
      }
    },
    async onSubmitClick() { // 保存
      if (!this.curPrintBeanData) return;
      const { result, error } = this.curPrintBeanData.checker(this.PrintBeanListClassData.DataList);
      if (error) {
        this.messageBox.failSingleError('保存失败', error);
        return;
      }
      if (!result) return;
      const data = await this.curPrintBeanData.submit();
      if (data.result) {
        const cb = () => {
          const temp = {
            item: data.itemData,
            isEdit: this.isEdit,
            isRemove: false,
            index: -1,
          };
          this.$store.commit('printBean/setItemChange', temp);
          if (data.itemData.ItemList.some(it => !it.ID && it.ID !== 0)) {
            this.$store.dispatch('printBean/getPrintBeanList'); // 内部印豆列表ID获取不到，所以此时重新获取列表数据
          }
          this.onGobackClick();
        };
        this.messageBox.successSingle(`${this.field}成功`, cb, cb);
      }
    },
  },
  mounted() {
    this.setCurPrintBeanData();
  },
};
</script>
<style lang='scss'>
.mp-erp-print-bean-setup-page-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  > header {
    flex: none;
    padding: 35px 45px;
  }
  > main {
    flex: 1;
    font-size: 14px;
    color: #585858;
    overflow: hidden;
  }
  > footer {
    flex: none;
    height: 104px;
    padding-top: 36px;
    box-sizing: border-box;
    text-align: center;
    > button.el-button {
      width: 120px;
      height: 35px;
      padding: 0;
      & + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
