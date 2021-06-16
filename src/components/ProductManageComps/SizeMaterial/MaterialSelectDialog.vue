<template>
  <el-drawer
    :visible.sync="visible"
    :show-close='false'
    :before-close="handleClose"
    class="mp-erp-comps-pruduct-module-material-select-dialog-comp-wrap"
    @open='onOpen'
    @closed='onClosed'>
    <span slot="title" @click="handleClose" class="explain-title">
      <i class="el-icon-arrow-right"></i> 物料选择
      <em>（ 添加时只允许添加尚未被添加过的分类；编辑时只能编辑当前分类，不能调整为其它分类；一次保存只能保存一个分类 ）</em>
    </span>
    <section class="drawer-content">
      <aside>
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <span v-for="it in typeList" :key='`aside${it.ID}`'
          :class="{ active: activeType===it.ID, disabled: !canSelectTypeIDList.includes(it.ID) }"
           @click="onLabelClick(it)" :title='it.Name'>
            {{it.Name}}
          </span>
        </el-scrollbar>
      </aside>
      <div class="content">
        <p class="check-all" v-if="curTypeDataList.length > 0">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminateAll">全选</el-checkbox>
        </p>
        <SelectContentItem v-model="itemCheckedList" v-for="(it, i) of curTypeDataList" :key="it.Name + i" :itemData='it' />
        <p class="empty" v-if="activeType && curTypeDataList.length === 0">
          <i></i>
          <span>所选分类暂无可用物料</span>
        </p>
        <p class="empty" v-if="!activeType">
          <i></i>
          <span>请选择左侧物料类型</span>
        </p>
      </div>
    </section>
    <footer>
      <el-button type="primary" @click="onSubmit" :disabled='!curCheckedList||curCheckedList.length===0'>保存</el-button>
      <el-button @click="onCancle">取消</el-button>
    </footer>
  </el-drawer>
</template>

<script>
import { getFirstOptionName } from '@/assets/js/TypeClass/MaterialSizeClass';
import SelectContentItem from './SelectContentItem.vue';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    typeList: {
      type: Array,
      default: () => [],
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    MaterialLocalList: {
      type: Array,
      default: () => [],
    },
    checkedList: {
      type: Array,
      default: () => [],
    },
    value: {
      type: Object,
      default: null,
    },
  },
  components: {
    SelectContentItem,
  },
  data() {
    return {
      activeType: '',
      list: [],
      isEdit: false,
    };
  },
  computed: {
    curTypeDataList() {
      if (!this.activeType || !this.dataList || this.dataList.length === 0) return [];
      const list = this.dataList.filter(it => it.Type && it.Type.ID === this.activeType);
      const _temp = {};
      list.forEach(it => {
        const { UnionShowList, ElementList } = it.Type;
        const { lv1Title, itemContent } = getFirstOptionName(UnionShowList, ElementList); // 获取右侧第一级分类标题
        if (!_temp[lv1Title]) _temp[lv1Title] = [];
        _temp[lv1Title].push({ ...it, itemContent });
      });
      const _list = Object.keys(_temp).map(key => ({
        Name: key,
        List: _temp[key],
      }));
      return _list;
    },
    curTypeItemList() {
      if (!this.curTypeDataList || this.curTypeDataList.length === 0) return [];
      return this.curTypeDataList.map(it => it.List).reduce((a, b) => [...a, ...b]);
    },
    curTypeListIds() {
      if (!this.curTypeItemList || this.curTypeItemList.length === 0) return [];
      return this.curTypeItemList.map(it => it.ID);
    },
    curCheckedList() {
      if (!this.activeType || this.curTypeDataList.length === 0 || this.list.length === 0) return [];
      return this.list.filter(it => this.curTypeListIds.includes(it.ID) && it.Type && it.Type.ID === this.activeType);
    },
    checkAll: {
      get() {
        return this.curTypeDataList.length > 0 && this.curCheckedList.length === this.curTypeItemList.length;
      },
      set(bool) {
        this.list = this.list.filter(it => it.Type && it.Type.ID !== this.activeType);
        if (bool) this.list.push(...this.curTypeItemList);
      },
    },
    isIndeterminateAll() {
      return this.curCheckedList.length > 0 && this.curCheckedList.length < this.curTypeItemList.length;
    },
    itemCheckedList: {
      get() {
        return this.curCheckedList;
      },
      set([delIDList, list]) {
        this.list = this.list.filter(it => !delIDList.includes(it.ID));
        this.list.push(...list);
      },
    },
    canSelectTypeIDList() {
      if (!this.isEdit) {
        const selectedIDs = this.MaterialLocalList.map(it => it.ID);
        return this.typeList.filter(it => !selectedIDs.includes(it.ID)).map(it => it.ID);
      }
      if (this.value) return [this.value.ID];
      return [];
    },
  },
  methods: {
    onSubmit() {
      if (!this.curCheckedList || this.curCheckedList.length === 0) {
        this.messageBox.failSingle('未选中物料');
        return;
      }
      this.$emit('change', [this.curCheckedList, this.activeType, this.isEdit]);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.list = [];
      this.isEdit = false;
      this.activeType = '';
    },
    handleClose() {
      this.onCancle();
    },
    initEditData() { // 数据初始化方法
      if (!this.typeList || !Array.isArray(this.typeList)) {
        this.onCancle();
        return;
      }
      if (this.typeList.length > 0) {
        if (!this.value) {
          this.isEdit = false;
          this.$nextTick(() => {
            if (this.canSelectTypeIDList && this.canSelectTypeIDList.length > 0) {
              const [id] = this.canSelectTypeIDList;
              this.activeType = id;
            }
          });
        } else {
          this.isEdit = true;
          this.activeType = this.value.ID;
          this.list = this.value.List;
        }
      }
    },
    onLabelClick({ ID }) {
      if (!this.canSelectTypeIDList.includes(ID)) return;
      this.activeType = ID;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-material-select-dialog-comp-wrap {
  .el-drawer {
    width: 80% !important;
    max-width: 1220px !important;
    min-width: 800px;
    > header {
      padding-left: 16px;
      .explain-title {
        cursor: pointer;
        font-size: 15px;
        color: #888E99;
        display: flex;
        align-items: center;
        transition: 0.1s ease-in-out;
        > i {
          font-size: 18px;
          margin-right: 6px;
        }
        &:hover {
          color: #585858;
          > i {
            font-weight: 700;
          }
        }
        > em {
          font-size: 12px;
          color: #a2a2a2;
        }
      }
    }
  }

  .el-drawer__body {
    height: calc(100% - 70px);
    > .drawer-content {
      display: flex;
      padding-left: 50px;
      height: calc(100% - 100px);
      > aside {
        height: 100%;
        .el-scrollbar {
          height: 100%;
          width: 150px;
          .el-scrollbar__wrap {
            overflow: hidden;
            overflow-y: auto;
            padding-right: 2px;
            margin: 0;
          }
        }
        .el-scrollbar__view {
          height: 100%;
          display: flex;
          flex-direction: column;
          flex: none;
          width: 150px;
          border-right: 1px solid #eee;
          font-size: 14px;
          box-sizing: border-box;
          > span {
            flex: none;
            height: 40px;
            padding: 10px 0;
            box-sizing: border-box;
            line-height: 20px;
            cursor: pointer;
            color: #585858;
            width: 100%;
            padding-right: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            position: relative;
            transition: color 0.12s ease-in-out;
            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              width: 3px;
              background-color: #26BCF9;
              opacity: 0;
              transition: opacity 0.2s ease-in-out;
            }
            &.active {
              color: #26BCF9;
              &::after {
                opacity: 1;
              }
            }
            &.disabled {
              color: #cbcbcb;
              user-select: none;
              pointer-events: none;
            }
          }
        }
      }
      > .content {
        padding-left: 40px;
        width: 960px;
        height: 100%;
        overflow-y: auto;
        .empty {
          font-size: 12px;
          color: #a2a2a2;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-left: 220px;
          padding-top: 100px;
          > i {
            display: block;
            width: 59px;
            height: 48px;
            background: url(../../../assets/images/null.png) no-repeat 100% 100%;
            margin-bottom: 12px;
            margin-left: 26px;
          }
        }
        .check-all {
          padding-top: 8px;
          padding-bottom: 25px;
          .el-checkbox__label {
            font-size: 14px;
          }
        }
      }
    }
    > footer {
      text-align: center;
      padding-top: 40px;
      height: 100px;
      > button {
        height: 35px;
        border-radius: 3px;
        padding: 0;
        width: 120px;
        &.el-button--default {
          border-color: #26bcf9;
          color: #26bcf9;
          &:active {
            border-color: #428dfa;
            color: #428dfa;
          }
        }
        &.el-button--primary {
          background: linear-gradient(to right, #26bcf9, #35dff9);
          border: none;
          &:hover {
            opacity: 0.88;
          }
          &:active {
            background: linear-gradient(to right, #428dfa, #26bcf9);
          }
        }
        &.is-disabled {
          background: #ccc !important;
        }
      }
    }
  }

  .el-form-item__label {
    color: #888E99;
    &::before {
      display: none;
    }
  }
  input {
    border-radius: 3px;
  }
}
</style>
