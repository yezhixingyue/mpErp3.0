<template>
  <CommonDialogComp
    width="1200px"
    top='5vh'
    title="物料选择"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-material-select-dialog-comp-wrap"
  >
    <aside>
      <span v-for="it in typeList" :key="'aside' + it.ID" @click="onLabelClick(it)" :class="activeType===it.ID?'active':''" :title='it.Name'>{{it.Name}}</span>
    </aside>
    <div class="content">
      <p class="check-all" v-if="curTypeDataList.length > 0"><el-checkbox v-model="checkAll">全选</el-checkbox></p>
      <SelectContentItem v-for="(it, i) of curTypeDataList" :key="it.Name + i" :itemData='it' />
      <p class="empty" v-if="activeType && curTypeDataList.length === 0">
        <i></i>
        <span>所选分类暂无可用物料</span>
      </p>
      <p class="empty" v-if="!activeType">
        <i></i>
        <span>请选择左侧物料类型</span>
      </p>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import SelectContentItem from './SelectContentItem.vue';

export default {
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
    checkedList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    SelectContentItem,
  },
  data() {
    return {
      ruleForm: null,
      activeType: '',
      checkAll: false, // 后面添加半选状态
    };
  },
  computed: {
    curTypeDataList() {
      if (!this.activeType || !this.dataList || this.dataList.length === 0) return [];
      const list = this.dataList.filter(it => it.Type && it.Type.ID === this.activeType);
      const _temp = {};
      list.forEach(it => {
        const { UnionShowList, ElementList } = it.Type;
        const { lv1Title, itemContent } = this.getFirstOptionName(UnionShowList, ElementList); // 获取右侧第一级分类标题
        if (!_temp[lv1Title]) _temp[lv1Title] = [];
        _temp[lv1Title].push({ ...it, itemContent });
      });
      const _list = Object.keys(_temp).map(key => ({
        Name: key,
        List: _temp[key],
      }));
      return _list;
    },
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.ruleForm);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.ruleForm = null;
    },
    initEditData() { // 数据初始化方法
      if (this.typeList && this.typeList.length > 0) {
        this.activeType = this.typeList[0].ID;
      }
    },
    onLabelClick({ ID }) {
      this.activeType = ID;
    },
    getFirstOptionName(UnionShowList, ElementList) {
      let lv1Title = '';
      let itemContent = '';
      if (!UnionShowList || UnionShowList.length === 0) { // 未设置元素组合 此时取元素列表种第一项
        if (ElementList && ElementList.length > 0) {
          lv1Title = ElementList[0].DisplayContent;
          ElementList.forEach((ele, i) => {
            if (i > 0) {
              itemContent += ele.DisplayContent;
            }
          });
        }
      } else if (ElementList && ElementList.length > 0) { // 如果设置有元素组合 则按照元素组合取一项  （组合第一项可能为多个）
        UnionShowList[0].forEach(union => {
          const t = ElementList.find(Ele => Ele.ID === union);
          if (t) lv1Title += t.DisplayContent;
        });
        UnionShowList.forEach((it, i) => {
          if (i > 0) {
            it.forEach((union, index) => {
              const t = ElementList.find(Ele => Ele.ID === union);
              if (t) {
                if (index === 0 && itemContent) itemContent += ' ';
                itemContent += t.DisplayContent;
              }
            });
          }
        });
      }
      return { lv1Title, itemContent };
    },
  },
  watch: {
    curTypeDataList(newVal) {
      console.log(newVal);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-material-select-dialog-comp-wrap {

  .el-dialog__body {
    display: flex;
    padding-left: 50px;
    height: calc(90vh - 220px);
    > aside {
      display: flex;
      flex-direction: column;
      flex: none;
      width: 150px;
      border-right: 1px solid #eee;
      > span {
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
      }
    }
    > .content {
      padding-left: 40px;
      width: 860px;
      .empty {
        font-size: 12px;
        color: #a2a2a2;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
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
      }
    }
  }

  // 公共部分
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    padding-bottom: 20px;
    > button {
      height: 35px;
      border-radius: 3px;
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
