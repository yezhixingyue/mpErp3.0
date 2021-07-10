<template>
  <el-table
    class="mp-erp-element-template-page-element-table-comp-wrap"
    :data="localTableData"
    stripe
    border
    fit
    style="max-width: 1600px"
   >
    <el-table-column prop="Name" label="名称" width="185"></el-table-column>
    <el-table-column prop="GroupNameText" label="所属元素组" width="170"></el-table-column> <!-- 暂无 -->
    <el-table-column prop="TypeStringify" label="类型" width="150"></el-table-column>
    <el-table-column prop="widthStringify" label="显示宽度" width="100"></el-table-column>
    <el-table-column prop="NameHiddenStringify" label="界面隐藏名称" width="120"></el-table-column>
    <el-table-column prop="CustomerHiddenStringify" label="客户界面" width="110"></el-table-column>
    <el-table-column prop="describeStringify" label="描述" show-overflow-tooltip></el-table-column>
    <el-table-column label="操作" width="220">
      <div class="menu-list" slot-scope="scope">
        <span @click="onEditClick(scope.row)"><i></i>编辑</span>
        <span @click="onRemoveClick(scope.row)"><i></i>删除</span>
      </div>
    </el-table-column>
    <div slot="empty">
      <span v-if="!loading">暂无数据</span>
      <span v-else>加载中...</span>
    </div>
  </el-table>
</template>

<script>
import { TypeEnum, SelectModeEnum } from '@/assets/js/TypeClass/ElementClass';

export default {
  props: {
    dataList: {
      default: () => [],
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    localTableData() {
      if (!this.dataList || !Array.isArray(this.dataList) || this.dataList.length === 0) return [];
      return this.dataList.map(it => ({
        ...it,
        ...this.getLocalInfoNames(it),
      }));
    },
  },
  methods: {
    onEditClick(itemData) {
      this.$emit('edit', itemData);
    },
    onRemoveClick(itemData) {
      this.$emit('remove', itemData);
    },
    getSelectMode(mode) {
      const t = SelectModeEnum.find(it => it.ID === mode);
      if (t) return `表现形式：${t.Name}`;
      return '';
    },
    getDescribeStringify(itemData) {
      const { HiddenToCustomer, DefaultValue } = itemData;
      const hideValText = HiddenToCustomer && (DefaultValue || DefaultValue === 0) ? `客户界面隐藏取值：${DefaultValue}` : '';
      if (itemData.Type === 1) {
        // 数字描述 ： 是否允许小数 单位 默认选择 是否必填 是否允许自定义值 分段控制条目数
        const { AllowDecimal, Unit, CheckedValue, IsRequired, Allow, AllowCustomer, SectionList } = itemData.NumbericAttribute;
        const decimalText = AllowDecimal ? '小数：允许' : '';
        const unitText = Unit ? `单位：${Unit}` : '';
        const defaultText = CheckedValue || CheckedValue === 0 ? `默认值：${CheckedValue}` : '';
        const requiredText = IsRequired ? '是否必填：必填' : '';
        let canDefine = Allow ? '自定义：允许（客户除外）' : '自定义：不允许';
        if (AllowCustomer) canDefine = '自定义：允许（包含客户）';
        const limit = SectionList && SectionList.length > 0 ? `分段控制条数：${SectionList.length}条` : '分段控制：未限制';
        const _list = [hideValText, decimalText, unitText, defaultText, requiredText, canDefine, limit].filter(it => it);
        return _list.join('；');
      }
      if (itemData.Type === 2) {
        // 选项
        const { OptionList, IsRadio, Allow, AllowCustomer, CustomizeValue, SelectMode, IsRequired, UseTimes } = itemData.OptionAttribute;
        const len = OptionList.length > 0 ? `选项数量：${OptionList.length}` : ''; // 选项数量
        let checkedLen;
        let customerShowLen;
        if (OptionList.length > 0) {
          checkedLen = OptionList.filter(it => it.IsChecked).length; // 默认选中数量
          customerShowLen = OptionList.filter(it => !it.HiddenToCustomer).length; // 客户显示数量
          checkedLen = checkedLen > 0 ? `默认选中数量：${checkedLen}` : '';
          customerShowLen = customerShowLen > 0 ? `客户显示数量：${customerShowLen}` : '';
        }

        const type = IsRadio ? '选择方式：单选' : '选择方式：多选';
        let canDefine = IsRadio ? '自定义：不允许' : '';
        if (canDefine && Allow) {
          canDefine = '自定义：允许（客户除外';
          if (AllowCustomer) canDefine = '自定义：允许（包含客户';
          if (CustomizeValue) canDefine += `,自定义值:${CustomizeValue}）`;
          else canDefine += '）';
        }
        const mode = IsRadio ? this.getSelectMode(SelectMode) : ''; // 表现形式
        const requiredText = IsRadio && IsRequired ? '是否必选：必选' : '';
        const limit = !IsRadio && UseTimes && UseTimes.MaxValue ? `项数限制：[${UseTimes.MinValue}, ${UseTimes.MaxValue}]` : '';
        const _list = [hideValText, len, checkedLen, customerShowLen, type, requiredText, canDefine, mode, limit].filter(it => it);
        return _list.join('；');
      }
      if (itemData.Type === 3) {
        // 客户界面隐藏取值  显示文字 开值 关值 初始值
        const { Words, OpenValue, CloseValue, DefaultOpen } = itemData.SwitchAttribute;
        const wordText = Words ? `显示文字：${Words}` : '';
        const openText = OpenValue || OpenValue === 0 ? `开值：${OpenValue}` : '';
        const closeText = CloseValue || CloseValue === 0 ? `关值：${CloseValue}` : '';
        const defaultText = DefaultOpen ? '默认：开' : '默认：关';
        const _list = [hideValText, wordText, openText, closeText, defaultText].filter(it => it);
        return _list.join('；');
      }
      return '';
    },
    getLocalInfoNames(itemData) { // 表格数据转换
      const t = TypeEnum.find(it => it.ID === itemData.Type);
      const GroupNameText = itemData.Group && itemData.Group.Name ? itemData.Group.Name : '';
      if (t) {
        const key = `${t.Name}Attribute`;
        if (itemData[key]) {
          const str = itemData[key].IsRequired ? '（必填）' : ''; // 单选时一定生效 多选时服务器端会处理IsRequired然后返回 也可使用该值进行判断
          // eslint-disable-next-line no-nested-ternary
          const widthStringify = itemData[key].IsWidthAdaption ? '自动宽度' : (itemData[key].DisplayWidth ? `${itemData[key].DisplayWidth}px` : '');
          const NameHiddenStringify = itemData.IsNameHidden ? '隐藏' : '显示';
          const CustomerHiddenStringify = itemData.HiddenToCustomer ? '隐藏' : '显示';
          const describeStringify = this.getDescribeStringify(itemData); // 描述 选项时：选项数量 是否有默认 客户显示数量 选择方式 单选（是否允许自定义（还有客户 自定义值） 表现形式 是否必填） 多选（项数限制）
          return {
            TypeStringify: `${t.label}${str}`, // 类型
            widthStringify, // 显示宽度
            NameHiddenStringify, // 界面是否隐藏名称
            CustomerHiddenStringify, // 客户界面是否隐藏
            describeStringify, // 描述
            GroupNameText,
          };
        }
        return {
          TypeStringify: `${t.label}`,
          GroupNameText,
        };
      }
      return {
        GroupNameText,
      };
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-element-template-page-element-table-comp-wrap {
  border-top-color: rgb(230, 230, 230);
  border-left: 1px solid rgb(230, 230, 230);
  min-height: 222px;
  overflow-x: auto;
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-table__body-wrapper {
    // overflow-x: hidden;
    .el-table__row {
      width: 100%;
      > td {
        > .cell {
          font-size: 12px;
          height: 30px;
          .menu-list {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 12px;
            > span {
              color: #a2a2a2;
              transition: color 0.05s ease-in-out;
              cursor: pointer;
              margin: 0 10px;
              display: flex;
              align-items: center;
              user-select: none;
              &:hover {
                color: #444;
              }
              > i {
                width: 14px;
                height: 14px;
                background: url(../../assets/images/Compile.png) no-repeat center center/14px 14px;
                margin-right: 6px;
              }
              &:last-of-type > i {
                width: 12px;
                height: 16px;
                background: url(../../assets/images/del.png) no-repeat center center/12px 16px;
              }
            }
          }
        }
      }
    }
  }
  .el-table__empty-block {
    min-height: 150px;
  }
}
</style>
