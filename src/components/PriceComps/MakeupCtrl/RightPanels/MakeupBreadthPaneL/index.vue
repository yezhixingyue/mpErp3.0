<template>
  <section class="mp-erp-price-module-makeup-set-breadth-panel-container">
    <header>
      <span class="blue-span" @click="onSelectClick" :class="{disabled: !loading && BreadthList.length === 0}">选择幅面</span>
      <span class="tips-box"><i class="el-icon-warning"></i> 注：多个幅面可用时，系统自动选择产品总价格最低的幅面！</span>
    </header>
    <main>
      <BreadthSelectDialog :visible.sync='visible' :saveData='saveData' :BreadthTreeList='BreadthTreeList' @select="handleSelect" />
      <ul>
        <li v-for="it in localBreadthList" :key="it.ID" :title="it.Name">{{it.Name}}</li>
      </ul>
      <div v-if="!loading && BreadthList.length === 0" class="is-empty">
        <img src="@/assets/images/null.png" alt="">
        <p class="tips-box is-pink">未获取到印刷幅面信息，请到印刷幅面模块中进行相关设置！</p>
      </div>
    </main>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { MakeupMode } from '@/assets/js/TypeClass/PrintBreadth';
import BreadthSelectDialog from './BreadthSelectDialog';

export default {
  props: {
    initData: {
      type: Object,
      default: null,
    },
  },
  components: {
    BreadthSelectDialog,
  },
  computed: {
    ...mapState('basicSet', ['BreadthList']),
    ...mapGetters('basicSet', ['BreadthTreeList']),
    localBreadthList() {
      if (this.checkedBreadthList.length === 0 || this.BreadthList.length === 0) return [];
      return this.checkedBreadthList.map(it => {
        const t = this.BreadthList.find(_it => _it.ID === it.First.ID);
        return t ? { ID: it.First.ID, Name: `${t.Name} （${this.getModeText(it.Second)}）` } : null;
      }).filter(it => it);
    },
  },
  data() {
    return {
      visible: false,
      saveData: null,
      loading: true,
      checkedBreadthList: [],
    };
  },
  methods: {
    onSelectClick() {
      this.saveData = this.checkedBreadthList;
      this.visible = true;
    },
    getBreadthInfo() {
      const func1 = () => (this.BreadthList.length === 0 ? this.$store.dispatch('basicSet/getBreadthList') : null);
      const func2 = () => this.$store.dispatch('basicSet/getBreadthClassList');
      return Promise.all([func1(), func2()]);
    },
    handleSelect(list) {
      this.checkedBreadthList = list;
      this.visible = false;
    },
    getModeText(modeList) {
      const list = this.$utils.getNameFromListByIDs(modeList, MakeupMode);
      return list ? list.join('、') : '';
    },
    getSubmitInfo() {
      if (this.checkedBreadthList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择印刷幅面');
        return null;
      }
      return { BreadthList: this.checkedBreadthList };
    },
  },
  async mounted() {
    await this.getBreadthInfo();
    this.loading = false;
    // 此时进行数据还原 checkedBreadthList  筛选掉不包含在总列表中的旧选中条目数据
    if (!this.initData || !Array.isArray(this.initData.BreadthList)) return;
    const ids = this.BreadthList.map(it => it.ID);
    const list = this.initData.BreadthList.filter(it => ids.includes(it.First.ID)).map(({ First, Second }) => ({ First: { ID: First.ID }, Second }));
    this.checkedBreadthList = list;
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-set-breadth-panel-container {
  height: 100%;
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
    overflow: auto;
    min-width: 500px;
    .is-empty {
      padding-top: 36px;
      white-space: nowrap;
      > p {
        margin-top: 12px;
        width: 380px;
      }
    }
    > ul {
      padding-top: 25px;
      display: flex;
      flex-wrap: wrap;
      > li {
        font-size: 12px;
        color: #999;
        line-height: 18px;
        margin-bottom: 10px;
        margin-right: 20px;
        width: 23em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
