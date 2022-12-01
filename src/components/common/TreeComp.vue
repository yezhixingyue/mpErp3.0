<template>
  <section
   class="mp-common-comps-tree-comp-wrap"
   :class="isProduct?'isProduct':''">
    <header>
      {{title}}<span v-if="title">：</span>
    </header>
    <div class="content mp-scroll-wrap">
      <el-checkbox
        v-model="checkAllComputed"
        :disabled='isCheckAllDisabled'
        :indeterminate='checkAllIndeterminate'
        @change="handleCheckAllChange">
        {{checkAllTitle}}
      </el-checkbox>
      <el-tree
        :data="treeData"
        show-checkbox
        icon-class
        :node-key="defaultNodeKey"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
        :auto-expand-parent="false"
        @check="check"
        ref="treeComp"
        class="mp-scroll-wrap"
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :render-content="renderContent"
      ></el-tree>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '销售区域',
    },
    treeList: {
      type: Array,
      default: () => [],
    },
    // defaultExpandedKeys: {},
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'ClassName',
      }),
    },
    defaultNodeKey: {
      type: String,
      default: 'ID',
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => [],
    },
    handleChangeFunc: {
      type: Function,
      default: () => {},
    },
    watchValue: {}, // ---------------------------------- 该传值后续禁用
    shouldDisabledList: { // 需要禁选的项目列表
      type: Array,
      default: () => [],
    },
    showDisabled: { // 是否要展示包含禁选的列表，需配合上面一起使用
      type: Boolean,
      default: false,
    },
    checkAllTitle: {
      type: String,
      default: '所有地区',
    },
    isDisabled: { // 全选项是否禁选状态
      type: Boolean,
      default: false,
    },
    isProduct: { // 全选项是否禁选状态
      type: Boolean,
      default: false,
    },
  },
  computed: {
    defaultExpandedKeys() {
      if (this.treeList.length === 0 || !this.treeList) return [];
      const _list = [];
      this.treeList.forEach(level1 => {
        level1.children.forEach(level2 => {
          _list.push(level2.ID);
        });
      });
      return _list;
    },
    treeListHasDisabled() {
      const _list = JSON.parse(JSON.stringify([...this.treeList]));
      const _curChangeList = this.watchValue;
      _list.forEach(level1 => {
        let _num1 = 0;
        level1.children.forEach(level2 => {
          let _num2 = 0;
          level2.children.forEach(level3 => {
            if (this.shouldDisabledList.includes(level3[this.defaultNodeKey])) {
              if (Array.isArray(_curChangeList)) {
                if (!_curChangeList.includes(level3[this.defaultNodeKey])) {
                  // eslint-disable-next-line no-param-reassign
                  level3.disabled = true;
                  _num2 += 1;
                } else {
                  // eslint-disable-next-line no-param-reassign
                  level3.disabled = false;
                  // eslint-disable-next-line no-param-reassign
                  if (level2.disabled) level2.disabled = false;
                  // eslint-disable-next-line no-param-reassign
                  if (level1.disabled) level1.disabled = false;
                  this.localDisabled2CheckAll = false;
                }
              } else {
                // eslint-disable-next-line no-param-reassign
                level3.disabled = true;
                _num2 += 1;
              }
            }
          });
          if (level2.children.length === _num2) {
            // eslint-disable-next-line no-param-reassign
            level2.disabled = true;
            _num1 += 1;
          }
        });
        // eslint-disable-next-line no-param-reassign
        if (level1.children.length === _num1) level1.disabled = true;
      });
      return _list;
    },
    treeData() {
      return this.showDisabled ? this.treeListHasDisabled : this.treeList;
    },
    checkAllIndeterminate() {
      // if (this.selectKeys.length === 0) return false;
      // if (this.selectKeys.length === this.AllKeys.length) return false;
      // return true;
      return this.defaultCheckedKeys.length > 0
       && this.defaultCheckedKeys.length < this.threeLevelKeys.length;
    },
    AllKeys() {
      const _arr = [];
      this.treeData.forEach(l1 => {
        _arr.push(l1.ID);
        l1.children.forEach(l2 => {
          _arr.push(l2.ID);
          l2.children.forEach(l3 => {
            _arr.push(l3.ID);
          });
        });
      });
      return _arr;
    },
    threeLevelKeys() {
      const _arr = [];
      this.treeData.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            _arr.push(l3.ID);
          });
        });
      });
      return _arr;
    },
    isCheckAllDisabled() {
      const _arr = [];
      this.treeData.forEach(l1 => {
        l1.children.forEach(l2 => {
          l2.children.forEach(l3 => {
            _arr.push(l3.ID);
          });
        });
      });
      return (this.isDisabled || _arr.length === this.shouldDisabledList.length)
       && this.localDisabled2CheckAll;
    },
    checkAllComputed: {
      get() {
        // return this.checkAll;
        return this.defaultCheckedKeys.length === this.threeLevelKeys.length;
      },
      set(newVal) {
        // console.log(newVal, 'newVal checkAllComputed');
        if (!newVal && this.canFalse) this.checkAll = false;
        else if (this.checkAllIndeterminate) {
          this.checkAll = false;
          this.canFalse = false;
        } else {
          this.checkAll = true;
          this.canFalse = true;
        }
      },
    },
  },
  methods: {
    check(curItem, { checkedNodes, checkedKeys }) {
      this.handleChangeFunc(checkedNodes, checkedKeys, checkedKeys.length === this.AllKeys.length);
      this.setCheckAllListAndStatus(checkedKeys);
    },
    renderContent(h, { node, data }) {
      if (node.level > 1) {
        if (node.label.length > 5) {
          return (
          <el-tooltip
            class="el-tree-node__label"
            effect="dark"
            content={node.label}
            placement="top-start"
          >
            <span>{node.label}</span>
          </el-tooltip>
          );
        }
        return (
          <span class="el-tree-node__label">{node.label}</span>
        );
      }
      const text = !node.expanded ? '展开' : '收起';
      const classIcon = !node.expanded
        ? 'el-icon-caret-bottom'
        : 'close el-icon-caret-bottom';
      return (
        <span class="el-tree-node__label">
          <span class="title">{node.label}</span>
          <em
            class="mp-el-tree-node-collapse-btn"
            on-click={e => this.expandLevel1(node, data, text, e)}
          >
            {text}
          </em>
          <span class="icon-box" on-click={e => e.stopPropagation()}>
            <em on-click={e => this.expandLevel1(node, data, text, e)}>
              <i class={classIcon}></i>
            </em>
          </span>
        </span>
      );
    },
    expandLevel1(node, data, text, e) {
      e.stopPropagation();
      // eslint-disable-next-line no-param-reassign
      node.expanded = !node.expanded;
    },
    handleCheckAllChange() {
      if (this.checkAll) {
        this.$refs.treeComp.setCheckedNodes(this.treeData);
        this.selectKeys = this.AllKeys;
        const checkedNodes = this.$refs.treeComp.getCheckedNodes();
        const checkedKeys = this.$refs.treeComp.getCheckedKeys();
        this.handleChangeFunc(checkedNodes, checkedKeys, true); // 第三个代表全部选中
      } else {
        this.$refs.treeComp.setCheckedKeys([]);
        this.selectKeys = [];
        this.handleChangeFunc([], []);
      }
    },
    setCheckAllListAndStatus(checkedKeys) {
      this.selectKeys = checkedKeys;
      if (this.selectKeys.length === this.AllKeys.length) {
        this.checkAll = true;
      } else if (this.checkAll === true) {
        this.checkAll = false;
      }
    },
    clearTreeData() {
      this.$refs.treeComp.setCheckedKeys([]);
      this.selectKeys = [];
      //
    },
  },
  data() {
    return {
      checkAll: false,
      selectKeys: [],
      localDisabled2CheckAll: true,
      canFalse: true,
    };
  },
  watch: {
    watchValue: {
      handler(newVal) {
        this.localDisabled2CheckAll = true;
        this.$nextTick(() => {
          if (typeof newVal === 'number') {
            this.$refs.treeComp.setCheckedKeys([]);
            this.selectKeys = [];
            this.checkAll = false;
          } else if (Array.isArray(newVal)) {
            this.$refs.treeComp.setCheckedKeys(newVal);
            const checkedKeys = this.$refs.treeComp.getCheckedKeys();
            this.setCheckAllListAndStatus(checkedKeys);
            const checkedNodes = this.$refs.treeComp.getCheckedNodes();
            this.handleChangeFunc(checkedNodes, checkedKeys, checkedKeys.length === this.AllKeys.length);
          }
        });
      },
      immediate: true,
    },
    defaultCheckedKeys(newVal) {
      if (newVal && Array.isArray(newVal) && newVal.length === 0 && this.selectKeys.length > 0) {
        this.$refs.treeComp.setCheckedKeys([]);
        this.selectKeys = [];
        this.checkAll = false;
      } else if (!this.watchValue && newVal && Array.isArray(newVal) && newVal.length > 0 && newVal.length !== this.selectKeys.length) {
        this.$refs.treeComp.setCheckedKeys(newVal);
        this.selectKeys = newVal;
      }
    },
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     const dom = document.getElementsByClassName('el-tree-node__children');
  //   //  console.log(dom);
  //   //  console.log(this.$refs.treeComp);
  //   });
  // },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-tree-comp-wrap {
  display: flex;
  flex-direction: column;
  user-select: none;
  > header {
    font-size: 14px;
    color: $--color-text-primary;
    line-height: 26px;
    flex: none;
    margin-bottom: 5px;
  }
  > .content {
    > .el-tree {
      min-width: 120px;
      .el-tree-node__expand-icon {
        display: none;
      }
      > .el-tree-node {
        // width: 100px;
        line-height: 32px;
        > .el-tree-node__children {
          > .el-tree-node {
            display: flex;
            .el-tree-node__children {
              display: flex;
              flex-wrap: wrap;
              padding-top: 1px;
              > .el-tree-node {
                > .el-tree-node__content {
                  color: $--color-text-primary;
                  width: auto;
                  display: inline-block;
                  &:hover {
                    background-color: #fff !important;
                  }
                  .el-tree-node__label {
                    font-size: 12px;
                  }
                  padding-left: 0px !important;
                  width: 5.3em;
                  height: 20px;
                  line-height: 20px;
                  overflow: hidden;
                  // text-overflow: ellipsis;
                  white-space: nowrap
                }
              }
            }
            > .el-tree-node__content {
              color: $--color-text-primary;
              font-weight: 600;
              width: 5em;
              overflow: hidden;
              flex: none;
              height: 32px;
              line-height: 26px;
              display: inline-block;
              .el-tree-node__label {
                font-size: 12px;
              }
              display: inline-block;
              &:hover {
                background-color: #fff !important;
              }
            }
          }
        }
        > .el-tree-node__content {
          color: $--color-text-primary;
          font-weight: 600;
          // .el-tree-node__label {
          //   font-size: 13px;
          // }
          // width: auto;
          // width: 100px;
          display: inline-block;
          height: 32px;
          line-height: 32px;
          &:hover {
            background-color: #fff !important;
          }
          display: flex;
          > .el-tree-node__label {
            flex: 1;
            min-width: 130px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > span.title {
              width: 5em;
            }
            > .mp-el-tree-node-collapse-btn {
              padding-left: 20px;
              font-size: 12px;
              font-weight: 400;
              flex: none;
              user-select: none;
              color: $--color-text-primary;
              line-height: 28px;
            }
            > span.icon-box {
              flex: 1;
              > em {
                padding-right: 20px;
                padding-left: 4px;
                height: 100%;
                > .el-icon-caret-bottom {
                  color: $--color-text-secondary;
                  font-size: 19px;
                  line-height: 21px;
                  position: relative;
                  top: 2px;
                  transition: all 0.1s !important;
                  transform-origin: center;
                  &.close {
                    transform: rotate(180deg);
                    // top: 3px;
                  }
                }
              }
            }
          }
        }
        .el-tree-node__children {
          flex: 1;
          // pointer-events: none;
        }
      }
    }
    > .el-checkbox {
      padding-bottom: 8px;
      .el-checkbox__label {
        font-size: 14px;
        color: #444;
        font-weight: 600;
        padding-left: 8px;
      }
    }
  }
  span.is-indeterminate.el-checkbox__input {
    > .el-checkbox__inner {
      background-color: $--color-text-secondary;
      border-color: $--color-text-secondary;
      &::before {
        box-sizing: content-box;
        content: "";
        border: 1px solid #FFFFFF;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        width: 3px;
        transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
        transform: rotate(45deg) scaleY(1);
        transform-origin: center;
        background-color: $--color-text-secondary;
      }
    }
  }
  &.isProduct {
    > .content > .el-tree > .el-tree-node > .el-tree-node__children
    > .el-tree-node .el-tree-node__children > .el-tree-node > .el-tree-node__content {
      width: 8em;
    }
    > .content > .el-tree > .el-tree-node > .el-tree-node__children
    > .el-tree-node > .el-tree-node__content {
      width: 7em;
    }
  }
}
</style>
