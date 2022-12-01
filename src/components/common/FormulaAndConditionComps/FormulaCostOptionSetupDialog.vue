<template>
  <CommonDialogComp
    width="880px"
    top='12vh'
    title="费用选择"
    :visible="visible"
    submitText='确定'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-all-cost-formula-cost-setup-dialog-comp-wrap"
   >
    <p>
        <el-checkbox v-model="checkAll" :indeterminate="indeterminateAll">全选</el-checkbox>
    </p>
    <div v-for="item in showList" :key="item.Name">
      <p class="mp-common-title-wrap black">{{item.Name}}</p>
      <ul>
        <li v-for="it in item.List" :key="it.ID">
          <el-checkbox :value='it.IsChecked' @change="onItemChange($event, it, 'IsChecked')" :title="it.Name">{{it.Name}}</el-checkbox>
          <div v-show="it.IsChecked" class="set-default">
            <span>空值设为：</span>
            <el-input type="small" :value="it.DefaultValue" @input="onItemChange($event.trim(), it, 'DefaultValue')" maxlength="9"></el-input>
            <span>元</span>
          </div>
        </li>
      </ul>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    prop: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  data() {
    return {
      optionList: [],
    };
  },
  computed: {
    checkedList() {
      if (!Array.isArray(this.optionList) || this.optionList.length === 0) return [];
      return this.optionList.filter(it => it.IsChecked);
    },
    checkAll: {
      get() {
        return this.checkedList.length === this.optionList.length && this.checkedList.length > 0;
      },
      set(bool) {
        this.optionList.forEach(it => {
          const _it = it;
          _it.IsChecked = bool;
        });
      },
    },
    indeterminateAll() {
      return this.checkedList.length > 0 && this.checkedList.length < this.optionList.length;
    },
    showList() {
      if (!Array.isArray(this.optionList) || this.optionList.length === 0) return [];
      const list = []; // [{ Name: '产品工艺', List: [] }]
      this.optionList.forEach(it => {
        const Name = it.Part ? `${it.Part.Name}工艺` : '产品工艺';
        const t = list.find(_it => _it.Name === Name);
        if (t) t.List.push(it);
        else list.push({ Name, List: [it] });
      });
      return list;
    },
  },
  methods: {
    onSubmit() {
      const list = this.optionList.filter(it => it.IsChecked);
      // if (list.length === 0) {
      //   this.messageBox.failSingleError('保存失败', '应至少勾选一种工艺');
      //   return;
      // }
      // let t = list.find(it => !it.DefaultValue);
      // if (t) {
      //   this.messageBox.failSingleError('保存失败', `[${t.Name}] 未设置默认值`);
      //   return;
      // }
      const t = list.find(it => it.DefaultValue && !this.$utils.getValueIsOrNotNumber(it.DefaultValue));
      if (t) {
        this.messageBox.failSingleError('保存失败', `[${t.Name}] 默认值不是数字类型`);
        return;
      }
      this.$emit('submit', this.optionList);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.optionList = [];
    },
    initEditData() { // 数据初始化方法
      if (!this.prop) return;
      const { CraftOptionList } = this.prop;
      if (Array.isArray(CraftOptionList)) this.optionList = JSON.parse(JSON.stringify(CraftOptionList));
    },
    onItemChange(value, item, key) {
      const t = this.optionList.find(it => it.ID === item.ID && JSON.stringify(it.Part) === JSON.stringify(item.Part));
      if (t) t[key] = value;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-all-cost-formula-cost-setup-dialog-comp-wrap {
  .el-dialog__body {
    height: 520px;
    overflow-y: auto;
    padding: 30px 45px;
    padding-right: 30px;
    > p {
      padding-bottom: 5px;
    }
    > div {
      > p.mp-common-title-wrap {
        font-size: 14px !important;
        padding: 10px 0;
        padding-top: 25px;
      }
      > ul {
        display: flex;
        flex-wrap: wrap;
        > li {
          width: 248px;
          height: 30px;
          padding: 5px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-right: 20px;
          > .set-default {
            > span {
              font-size: 12px;
              color: #888E99;
            }
            .el-input {
              width: 70px;
              margin-right: 4px;
              input {
                height: 30px;
                line-height: 30px;
                font-size: 12px;
                padding: 0 8px;
                border-radius: 3px;
              }
            }
          }
          > label {
            position: relative;
            top: 1px;
            .el-checkbox__input {
              position: relative;
              top: -1px;
            }
          }
        }
      }
      .el-checkbox__label {
        font-size: 12px;
        display: inline-block;
        width: 72px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
      }
    }
    .el-checkbox__label {
      color: #585858;
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      button + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
