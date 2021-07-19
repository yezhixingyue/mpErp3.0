<template>
  <section class="mp-erp-price-module-makeup-set-breadth-panel-container">
    <header>
      <span class="blue-span" @click="onSelectClick" :class="{disabled: !loading && BreadthList.length === 0}">选择幅面</span>
      <span class="tips-box"><i class="el-icon-warning"></i> 注：多个幅面可用时，系统自动选择产品总价格最低的幅面！</span>
    </header>
    <main>
      <BreadthSelectDialog :visible.sync='visible' :saveData='saveData' :BreadthTreeList='BreadthTreeList' />
      <div v-if="!loading && BreadthList.length === 0" class="is-empty">
        <img src="@/assets/images/null.png" alt="">
        <p class="tips-box is-pink">未获取到印刷幅面信息，请到印刷幅面模块中进行相关设置！</p>
      </div>
    </main>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BreadthSelectDialog from './BreadthSelectDialog';

export default {
  components: {
    BreadthSelectDialog,
  },
  computed: {
    ...mapState('basicSet', ['BreadthList']),
    ...mapGetters('basicSet', ['BreadthTreeList']),
  },
  data() {
    return {
      visible: false,
      saveData: null,
      loading: true,
    };
  },
  methods: {
    onSelectClick() {
      // this.saveData = null;
      this.visible = true;
    },
    getBreadthInfo() {
      const func1 = () => (this.BreadthList.length === 0 ? this.$store.dispatch('basicSet/getBreadthList') : null);
      const func2 = () => this.$store.dispatch('basicSet/getBreadthClassList');
      return Promise.all([func1(), func2()]);
    },
  },
  async mounted() {
    await this.getBreadthInfo();
    this.loading = false;
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-set-breadth-panel-container {
  > header {
    display: flex;
    align-items: center;
    white-space: nowrap;
    .blue-span {
      font-size: 14px;
      margin-right: 40px;
    }
    .tips-box {
      width: 400px;
    }
  }
  > main {
    min-width: 500px;
    .is-empty {
      padding-top: 36px;
      white-space: nowrap;
      > p {
        margin-top: 12px;
        width: 380px;
      }
    }
  }
}
</style>
