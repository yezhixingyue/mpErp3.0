<template>
  <section class="mp-erp-print-bean-setup-page-wrap">
    <header>
      <p class="mp-common-title-wrap">{{type}}印豆设置</p>
    </header>
    <main>
      <LRWidthDragAutoChangeComp leftWidth='45%'>
        <template v-slot:left>
          左侧区域
        </template>
        <template v-slot:right>
          右侧区域
        </template>
      </LRWidthDragAutoChangeComp>
    </main>
    <footer>
      <el-button type="primary">保存</el-button>
      <el-button @click="onGobackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';

export default {
  name: 'PrintBeanSetupPage',
  components: {
    LRWidthDragAutoChangeComp,
  },
  data() {
    return {
      ID: '', // 当前正在编辑的印豆项目，如果为空则为添加
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
  },
  mounted() {
    const ID = this.$route.params.ID && this.$route.params.ID !== 'null' ? this.$route.params.ID : '';
    this.ID = ID;
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
