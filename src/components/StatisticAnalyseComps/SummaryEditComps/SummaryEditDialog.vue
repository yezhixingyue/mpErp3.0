<template>
  <el-dialog
    :visible.sync="visible"
    width="950px"
    :modal='false'
    v-dialogDrag
    destroy-on-close
    top="13vh"
    class="mp-statistic-summary-add-edit-select-form-dialog"
    :before-close="handleDialogClose"
    @open='onOpen'
  >
    <section class="dialog-body-content">
      <header>
        <span>数据类型：</span>
        <ul>
          <li
           v-for="(it, i) in StatisticalFormTypeList"
           @click="onMenuClick(i)"
           :class="curIndex===i?'active':''"
           :key="it.key">
           <span>{{it.name}}</span>
          </li>
        </ul>
      </header>
      <main v-loading='curItemData.loading'>
        <SummaryEditDataListComp :selectList.sync='selectList' @getData='getStatisticFormDataList' :itemData='curItemData' />
      </main>
    </section>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmitClick" class="is-blue-button">确定</el-button>
      <el-button @click="handleDialogClose">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import SummaryEditDataListComp from './SummaryEditDataListComp.vue';

export default {
  components: {
    SummaryEditDataListComp,
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    ...mapState('common', ['StatisticalFormTypeList']),
    curItemData() {
      if (!this.mainData || !(this.curIndex || this.curIndex === 0)) return null;
      return this.mainData[this.curIndex];
    },
    visible: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
  },
  data() {
    return {
      curIndex: 0,
      mainData: null,
      selectList: [],
    };
  },
  methods: {
    onOpen() {
      this.selectList = this.list;
    },
    handleDialogClose() { // 弹窗关闭
      this.$emit('change', false);
    },
    onMenuClick(index) { // 切换分类
      if (this.curIndex !== index) this.curIndex = index;
    },
    onSubmitClick() { // 确认
      if (!this.value) return;
      this.$emit('update:list', this.selectList);
      this.handleDialogClose();
    },
    async getStatisticFormDataList(itemData, Page = 1) { // 获取分类列表数据
      const data = itemData;
      let key = true;
      const condition = { Page, PageSize: data.PageSize, Type: data.ID };
      data.loading = true;
      const res = await this.api.getStatisticFormDataList(condition, true).catch(() => { key = false; });
      data.loading = false;
      if (key && res && res.data.Status === 1000) {
        data.initialized = true;
        data.list = res.data.Data;
        data.count = res.data.DataNumber;
        if (!data.initialized) data.initialized = true;
        if (data.Page !== Page) data.Page = Page;
      }
    },
  },
  watch: {
    curItemData: {
      handler(newVal) {
        if (!newVal || newVal.initialized) return;
        this.getStatisticFormDataList(newVal);
      },
      immediate: true,
    },
  },
  created() {
    this.mainData = this.StatisticalFormTypeList.map(it => ({ ...it, list: [], count: 0, Page: 1, PageSize: 30, initialized: false, loading: false }));
  },
};
</script>
<style lang='scss'>
.mp-statistic-summary-add-edit-select-form-dialog {
  .el-dialog__header {
    .el-dialog__headerbtn {
      top: 11px;
      right: 15px;
      font-size: 18px;
    }
  }
  .el-dialog__body {
    min-height: 435px;
    max-height: 600px;
    padding-top: 25px;
    overflow: auto;
    .dialog-body-content {
      > header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 35px;
        > span {
          white-space: nowrap;
          font-weight: 700;
          margin-right: 11px;
          color: #444;
        }
        > ul {
          display: flex;
          > li {
            width: 90px;
            height: 35px;
            box-sizing: border-box;
            padding: 7px 0;
            line-height: 19px;
            text-align: center;
            border: 1px solid #cbcbcb;
            border-left: none;
            cursor: pointer;
            transition: 0.2s ease-in-out;
            &:first-of-type {
              border-left: 1px solid #cbcbcb;
              border-top-left-radius: 2px;
              border-bottom-left-radius: 2px;
            }
            &:last-of-type {
              border-bottom-right-radius: 2px;
              border-top-right-radius: 2px;
            }
            &.active {
              background-color: #26BCF9;
              color: #fff;
              border-color: #26BCF9;
              box-shadow: -1px 0 0 0 #26BCF9;
            }
            > span {
              color: inherit;
            }
          }
        }
      }
      > main {
        height: 400px;
        padding-left: 20px;
        .el-loading-spinner {
          top: 23%;
        }
      }
    }
  }
  .el-dialog__footer {
    height: 80px;
    padding-bottom: 50px;
    padding-top: 0;
    text-align: center;
    .dialog-footer {
      > button {
        width: 120px;
        height: 30px;
        padding: 0;
        border-radius: 2px;
        margin-right: 20px;
        margin: 0;
        &.is-blue-button {
          margin-right: 30px;
        }
        > span {
          color: inherit;
        }
      }
    }
  }
}
</style>
