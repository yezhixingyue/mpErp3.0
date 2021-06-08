<script>
export default {
  props: {
    colItem: {
      type: Object,
      default: () => ({}),
    },
  },
  render() {
    return (
      <el-table-column
        label={this.colItem.label}
        prop={this.colItem.prop}
        width={this.colItem.width || undefined}
        minWidth={this.colItem.minWidth || undefined}
        sortable={this.colItem.sortable || false}
        show-overflow-tooltip={this.colItem.showOverflowTooltip || false}
        {...{ scopedSlots: {
          default: scope => {
            if (this.colItem.scope) {
              const res = this.colItem.scope(scope);
              if (res) return res;
              return null;
            }
            if (this.colItem.prop) {
              return <span>{scope.row[this.colItem.prop]}</span>;
            }
            return null;
          },
          // header: scope => (<p class='mp-erp-define-table-header-box'>
          //   <span>{scope.column.label}</span>
          //   <el-tooltip popper-class="mp-common-tip-span-btn-popper-box" class="mp-common-tip-span-btn-box" open-delay={60}
          //     visible-arrow={false} transition='none' enterable={false} content='123'>
          //   <i class='el-icon-info'></i>
          //   </el-tooltip>
          // </p>),
        } }}
      >
      </el-table-column>
    );
  },
};
</script>
<style lang='scss'>
.mp-erp-define-table-header-box {
  position: relative;
  padding-right: 8px;
  > i {
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    display: none;
    cursor: pointer;
  }
  &:hover {
    > i {
      display: block;
    }
  }
}
</style>
