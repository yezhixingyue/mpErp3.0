<template>
  <section class="mp-erp-common-classify-manage-comp-wrap">
    <LRWidthDragAutoChangeComp leftWidth='45%'>
      <template v-slot:left>
        <ContentLeft @setCurEditClassifyData='setCurEditClassifyData' :classifyData='classifyData' @submit='onLeftSubmit' :title='title' />
      </template>
      <template v-slot:right>
        <ContentRight :dataList='curEditClassify' :ParentID='ParentID' :classifyName='curClassify' @goback='onGobackClick' @submit='onRightSubmit' />
      </template>
    </LRWidthDragAutoChangeComp>
  </section>
</template>

<script>
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import ContentLeft from './ContentLeft.vue';
import ContentRight from './ContentRight.vue';

export default {
  props: {
    classifyData: { // 列表数据
      type: Array,
      default: () => [],
    },
    type: {
      type: Number,
      default: null,
    },
    fetchData: {
      type: Function,
      default: () => {},
    },
    title: {
      type: String,
      default: '产品',
    },
  },
  components: {
    LRWidthDragAutoChangeComp,
    ContentLeft,
    ContentRight,
  },
  data() {
    return {
      curEditClassify: [],
      ParentID: -1,
      curClassify: '根分类',
    };
  },
  methods: {
    setCurEditClassifyData([data, ParentID, classifyName]) {
      const item = { ClassName: '', ParentID, ID: '' };
      if (ParentID === -1) item.children = [];
      this.curEditClassify = [...data, item].map(it => ({ ...it, key: this.$utils.getRandomRangeId(10) }));
      this.ParentID = ParentID;
      this.curClassify = classifyName;
    },
    onGobackClick() {
      this.$emit('goback');
    },
    // eslint-disable-next-line no-unused-vars
    onLeftSubmit(list) {
      this.$emit('sort', list);
      // this.fetchData(true);
      this.$store.dispatch('common/getAllProductNames', true);
    },
    async onRightSubmit(data) {
      const List = data.map(it => ({ Name: it.ClassName, ID: it.ID }));
      const temp = {
        Type: this.type,
        ParentID: this.ParentID,
        List,
      };
      const resp = await this.api.getClassSave(temp).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => {
          this.fetchData(true);
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
  watch: {
    classifyData() {
      this.setCurEditClassifyData([this.classifyData, -1, '根分类']);
    },
  },
  async mounted() {
    const bool = await this.fetchData();
    if (bool) {
      this.$nextTick(() => {
        this.setCurEditClassifyData([this.classifyData, -1, '根分类']);
      });
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-common-classify-manage-comp-wrap {
  height: 100%;
  width: 100%;
  padding: 25px 0;
  box-sizing: border-box;
  > section.mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap {
    > div {
      > section {
        padding-left: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        > header {
          height: 20px;
          flex: none;
          > p {
            line-height: 15px;
            padding-top: 2px;
          }
        }
        > main {
          flex: 1;
          margin-right: 50px;
          overflow: auto;
          // box-sizing: border-box;
        }
        > footer {
          flex: none;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 50px;
          > button {
            height: 30px;
            width: 100px;
            padding: 0;
            text-align: center;
            border-radius: 2px;
            & + button {
              margin-left: 22px;
            }
          }
        }
      }
    }
  }
}
</style>
