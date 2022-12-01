<template>
  <div class="mp-erp-review-setting-panels-page-number-panel-index-comp-wrap" v-if="value">
    <h2>检查以下文件页数：</h2>
    <div class="main">
      <Table :list="value.PagesNumberList" @edit="onSaveClick" @remove="remove" />
    </div>
    <Dialog :item="curEditItem" :visible.sync="visible" :product="curReviewProduct" :part="curReviewProductPart"
     @submit="onItemSubmit" :disabledFileIds="selectedFileIds" />
    <div class="is-origin">
      <i class="el-icon-warning"></i>
      <span class="tips-box">注：文件处理后的页数必须符合指定页数方可提交。</span>
      <span class="tips-box">注：仅输出PDF的文件才可以检查页数。</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PageNumberPanelClass from '../../../../../store/review/TypeClass/PanelClass/PageNumberPanelClass';
import Table from './Table.vue';
import Dialog from './Dialog.vue';

export default {
  props: {
    value: {
      type: Object,
      default: null,
    },
  },
  components: {
    Table,
    Dialog,
  },
  data() {
    return {
      visible: false,
      curEditItem: null,
    };
  },
  computed: {
    ...mapGetters('review', ['curReviewProduct', 'curReviewProductPart']),
    selectedFileIds() {
      if (this.value && Array.isArray(this.value.PagesNumberList)) {
        const leftIds = this.curEditItem && Array.isArray(this.curEditItem.FileList) ? this.curEditItem.FileList.map(it => it.ID) : [];
        const allIds = this.value.PagesNumberList.reduce((last, current) => [
          ...last,
          ...current.FileList.map(it => it.ID),
        ], []);
        return allIds.filter(id => !leftIds.includes(id));
      }
      return [];
    },
  },
  methods: {
    onSaveClick(e) {
      this.curEditItem = e;
      this.visible = true;
    },
    onItemSubmit(e) {
      if (!e || !this.value || !this.value.PagesNumberList) return;
      const PagesNumberList = [...this.value.PagesNumberList];
      if (e.ID || e.ID === 0) {
        const i = PagesNumberList.findIndex(it => it.ID === e.ID);
        if (i > -1) {
          PagesNumberList.splice(i, 1, e);
        }
      } else {
        const i = PagesNumberList.findIndex(it => it.key === e.key);
        if (i > -1) {
          PagesNumberList.splice(i, 1, e);
        } else {
          PagesNumberList.push(e);
        }
      }
      this.$emit('input', new PageNumberPanelClass({ PagesNumberList }));
    },
    remove(i) {
      const PagesNumberList = [...this.value.PagesNumberList];
      if (i > -1) {
        PagesNumberList.splice(i, 1);
      }
      this.$emit('input', new PageNumberPanelClass({ PagesNumberList }));
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-setting-panels-page-number-panel-index-comp-wrap {
  color: #585858;
  > h2 {
    font-weight: 700;
    margin-bottom: 25px;
    flex: none;
  }
  > div.is-origin {
    flex: none;
    position: relative;
    padding-left: 20px;
    padding-top: 20px;
    margin-left: -20px;
    > i {
      position: absolute;
      left: 0;
      top: 27px;
    }
    > span {
      display: block;
      margin-bottom: 10px;
      width: 320px;
    }
  }
  > div.main {
    min-height: calc(100vh - 540px);
  }
}
</style>
