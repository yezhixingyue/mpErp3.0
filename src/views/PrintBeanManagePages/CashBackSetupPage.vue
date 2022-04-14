<template>
  <section class="mp-erp-cash-back-setup-page-wrap">
    <header>
      <p class="mp-common-title-wrap">{{type}}消费返现</p>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='45%'>
        <template v-slot:left>
          <PrintBeanSetupLeftComp :curItemData='curItemData' @change="onChange" isCashBack />
        </template>
        <template v-slot:right>
          右侧区域
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
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import PrintBeanSetupLeftComp from '../../components/PrintBeanComps/PrintBeanSetupLeftComp.vue';
import CashBackItemClass from '../../store/cashback/CashBackItemClass';

export default {
  name: 'CashBackSetupPage',
  components: {
    LRWidthDragAutoChangeComp,
    PrintBeanSetupLeftComp,
  },
  data() {
    return {
      originData: null,
      curItemData: null,
    };
  },
  computed: {
    type() {
      return this.ID ? '编辑' : '添加';
    },
  },
  methods: {
    onGobackClick() {
      this.$goback();
    },
    getInitData() {
      const ID = this.$route.params.ID && this.$route.params.ID !== 'null' ? this.$route.params.ID : '';
      const temp = null;
      if (ID) {
        // 编辑 -- 对temp进行重新赋值
      }
      this.originData = temp;
      this.curItemData = new CashBackItemClass(temp);
    },
    onChange([key, val, key2]) {
      if (!this.curItemData) return;
      if (!key2) {
        this.curItemData[key] = val;
      } else {
        this.curItemData[key][key2] = val;
      }
    },
    onSubmitClick() {
      this.curItemData.check();
      // console.log(this.curItemData.check());
    },
  },
  mounted() {
    this.getInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-cash-back-setup-page-wrap {
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
