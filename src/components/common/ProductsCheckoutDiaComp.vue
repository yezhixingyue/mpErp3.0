<template>
  <div class="mp-common-comps-product-checkout-dia-comp-wrap">
    <span v-if="useSpan" class="span-title-blue" @click="handleOpenDialog">{{title}}</span>
    <normal-btn-full
       v-else
      :class="isDisabled?'is-disabled-g':''"
      :title='title'
      @click.native="handleOpenDialog"
     />
    <el-dialog
      :title="commonDialogTitle ? commonDialogTitle : dialogTitle"
      :visible.sync="dialogVisible"
      width="750px"
      top='8vh'
      :modal='false'
      v-dialogDrag
      class="mp-img-style-header"
      :before-close="handleClose">
        <!-- <tree-comp
         title=""
         :treeList='allProductClassify'
         :defaultCheckedKeys='defaultKeys'
         :handleChangeFunc='handleChangeFunc'
         :watchValue='watchValue4Tree'
         :shouldDisabledList='shouldDisabledList'
         :showDisabled='true'
         checkAllTitle='所有产品'
         /> -->
         <NewAreaTreeSpreadComp
          v-model="ProductRange" :DisabledList='shouldDisabledList' :list='allProductClassify4Customer' title="产品" leftWidth='7em' rightItemWidth='10em' />
        <span slot="footer" class="dialog-footer">
            <normal-btn-full @click.native="handleSave" title='确 定' />
            <normalBtn @click.native="handleClose" title="取 消" />
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
// import TreeComp from '@/components/common/TreeComp.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import NewAreaTreeSpreadComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp';


export default {
  components: {
    normalBtnFull,
    // TreeComp,
    normalBtn,
    NewAreaTreeSpreadComp,
  },
  props: {
    title: { // 按钮文字标题
      type: String,
      default: '添加活动商品',
    },
    useSpan: {
      type: Boolean,
      default: false,
    },
    commonDialogTitle: { // 弹窗顶部标题
      type: String,
      default: '',
    },
    handleSaveFunc: {
      type: Function,
      default: () => {},
    },
    setWatchValue2ProductDia: {
      type: Function,
      default: () => {},
    },
    watchValue: {},
    setOpenType2ProductDia: {
      type: Function,
      default: () => {},
    },
    shouldDisabledList: {
      type: Array,
      default: () => [],
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters('common', ['allProductClassify4Customer']),
  },
  data() {
    return {
      dialogVisible: false,
      // checkedNodes: [],
      dialogTitle: '添加活动商品',
      ProductRange: {
        IsIncludeIncreased: false,
        List: [],
      },
    };
  },
  methods: {
    handleClose() {
      if (typeof this.watchValue === 'number') {
        const _num = this.watchValue;
        this.setWatchValue2ProductDia(_num + 1);
      } else if (Array.isArray(this.watchValue)) {
        this.setWatchValue2ProductDia(1);
      }
      // this.checkedNodes = [];
      this.ProductRange = {
        IsIncludeIncreased: false,
        List: [],
      };
      this.dialogVisible = false;
    },
    handleSave() {
      if (!this.dialogVisible) return;
      const res = this.handleSaveFunc(this.ProductRange, this.handleClose);
      if (res === true) this.handleClose();
      else if (typeof res === 'string') {
        this.$message({
          showClose: true,
          message: res,
          type: 'error',
        });
      }
    },
    handleChangeFunc(checkedNodes) {
      this.checkedNodes = checkedNodes;
    },
    handleOpenDialog() {
      this.setOpenType2ProductDia('');
      this.dialogVisible = true;
      this.dialogTitle = '添加活动商品';
    },
  },
  watch: {
    watchValue(newVal) {
      if (newVal && typeof newVal === 'object' && !this.dialogVisible) {
        this.dialogVisible = true;
        this.dialogTitle = '修改活动商品';
        this.ProductRange = JSON.parse(JSON.stringify(newVal));
      }
    },
  },
  deactivated() {
    this.dialogVisible = false;
  },
  activated() {
    if (this.dialogVisible) this.dialogVisible = false;
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-common-comps-product-checkout-dia-comp-wrap {
  > .normal-full-btn {
    margin: 0;
    border-radius: 2px;
    line-height: 24px;
    padding: 1px 10px;
    width: 150px;
    background-color: #26bcf9;
    border-color: #26bcf9;
    &:active{
      background-color: #26bcf9;
    }
    &.is-disabled-g {
      background-color: rgba($color: #26bcf9, $alpha: 1);
      border-color: rgba($color: #26bcf9, $alpha: 0.4);
    }
  }
  .el-dialog__header {
    > span::before {
      background: url(../../assets/images/add.png) no-repeat center;
    }
    border-radius: 2px 2px 0px 0
  }

  .el-dialog__body {
      height: 50vh;
      min-height: 520px;
      overflow: auto;
      // overflow: overlay;
      > .mp-common-comps-tree-comp-wrap > .content {
          > .el-tree {
            > .el-tree-node  > .el-tree-node__children > .el-tree-node{
              .el-tree-node__children {
                > .el-tree-node > .el-tree-node__content{
                  width: 10em;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                padding-top: 6px;
              }
              > .el-tree-node__content  {
                width: 8em;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
      }
  }

  .el-dialog__footer .dialog-footer{
      display: flex;
      justify-content: center;
      > button {
        margin: 0;
        line-height: 24px;
        border-radius: 2px;
        & + button {
          margin-left: 35px;
        }
      }
  }
}

</style>
