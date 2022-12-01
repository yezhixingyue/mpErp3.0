<template>
  <div class="mp-erp-review-setting-panels-size-number-panel-index-comp-wrap" v-if="value">
    <h2>检查以下文件尺寸：</h2>
    <div class="main">
      <Table :list="value.SizeNumberList" @edit="onSaveClick" @remove="remove" />
    </div>
    <Dialog :item="curEditItem" :visible.sync="visible" :product="curReviewProduct" :part="curReviewProductPart"
     @submit="onItemSubmit" :disabledFileIds="selectedFileIds" />
    <div class="is-origin">
      <i class="el-icon-warning"></i>
      <span class="tips-box">注：审稿时文件处理后的尺寸必须在以上设置的允许范围内方可提交；</span>
      <span class="tips-box">注：如果最小尺寸不限（或最大尺寸不限），则只需允许误差减足够大的数（或加足够大的数）；</span>
      <span class="tips-box">注：仅输出格式为PDF的文件才可以检查尺寸；</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SizeNumberPanelClass from '../../../../../store/review/TypeClass/PanelClass/SizeNumberPanelClass';
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
      if (this.value && Array.isArray(this.value.SizeNumberList)) {
        const leftIds = this.curEditItem && Array.isArray(this.curEditItem.FileList) ? this.curEditItem.FileList.map(it => it.ID) : [];
        const allIds = this.value.SizeNumberList.reduce((last, current) => [
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
      if (!e || !this.value || !this.value.SizeNumberList) return;
      const SizeNumberList = [...this.value.SizeNumberList];
      if (e.ID || e.ID === 0) {
        const i = SizeNumberList.findIndex(it => it.ID === e.ID);
        if (i > -1) {
          SizeNumberList.splice(i, 1, e);
        }
      } else {
        const i = SizeNumberList.findIndex(it => it.key === e.key);
        if (i > -1) {
          SizeNumberList.splice(i, 1, e);
        } else {
          SizeNumberList.push(e);
        }
      }
      this.$emit('input', new SizeNumberPanelClass({ SizeNumberList }));
    },
    remove(i) {
      const SizeNumberList = [...this.value.SizeNumberList];
      if (i > -1) {
        SizeNumberList.splice(i, 1);
      }
      this.$emit('input', new SizeNumberPanelClass({ SizeNumberList }));
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-setting-panels-size-number-panel-index-comp-wrap {
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
    }
  }
  > div.main {
    min-height: calc(100vh - 540px);
  }
}
</style>
