<template>
  <CommonDialogComp
    width="660px"
    title="设置审稿部件"
    :visible.sync="localVisible"
    class="mp-erp-review-product-list-page-comps-part-setup-dialog-comp-wrap"
    :disabled="!isChange"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    top="16vh"
  >
    <span slot="title">
      <i class="is-bold is-black mr-13">设置审稿产品及部件</i>
      <i class="is-gray ft-13">点击以下产品或部件添加该产品或部件的文件检查设置</i>
    </span>
    <section v-if="item" class="box">
      <header>
        <el-button-group>
          <el-button v-for="it in topList" :key="it.ID" @click="add(it)">{{it.Name}}</el-button>
        </el-button-group>
        <p v-show="topList.length === 0" class="is-gray ft-12 em">已全部添加</p>
      </header>
      <el-table
        class="content"
        :max-height="278"
        fit
        :data="selectedList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column min-width="200px" prop="Name" show-overflow-tooltip label="已添加部件"></el-table-column>
        <el-table-column width="260px" label="操作">
          <template slot-scope="scope">
            <span :class="scope.row._setupNumber===0?'red-span':'is-gray'" @click="del(scope.row)">删除</span>
          </template>
        </el-table-column>
        <div slot="empty">
          <span>未选择部件</span>
        </div>
      </el-table>
    </section>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '../../../../packages/CommonDialogComp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    totalPartList() {
      let list = this.item && Array.isArray(this.item.PartList) ? [...this.item.PartList] : [];
      list.unshift({ ...this.item, Name: '产品' });
      list = list.map(it => {
        let _setupNumber = 0;
        if (it.SetupCountAttribute) {
          const { FilePages, OutputFile, SizeNumber } = it.SetupCountAttribute;
          _setupNumber += (FilePages || 0);
          _setupNumber += (OutputFile || 0);
          _setupNumber += (SizeNumber || 0);
        }
        return {
          ...it,
          _setupNumber,
        };
      });
      return list;
    },
    topList() {
      return this.totalPartList.filter(it => !this.selectedIds.includes(it.ID));
    },
    selectedList() {
      const list = this.totalPartList.filter(it => this.selectedIds.includes(it.ID));
      return list;
    },
    isChange() {
      if (!this.item) return false;
      const originSelectIds = this.item.PartList.filter(it => it.IsSelected).map(it => it.ID) || [];
      if (this.item.IsSelected) originSelectIds.unshift(this.item.ID);
      if (this.selectedIds.length === originSelectIds.length && originSelectIds.length === [...new Set([...this.selectedIds, ...originSelectIds])].length) {
        // 未变化
        return false;
      }
      return true;
    },
  },
  data() {
    return {
      selectedIds: [],
    };
  },
  methods: {
    onOpen() {
      this.selectedIds = this.totalPartList.filter(it => it.IsSelected).map(it => it.ID);
    },
    async submit() {
      if (!this.item || !this.item.PartList) return;
      // const originSelectIds = this.item.PartList.filter(it => it.IsSelected).map(it => it.ID) || [];
      // if (this.item.IsSelected) originSelectIds.unshift(this.item.ID);
      // if (this.selectedIds.length === originSelectIds.length && originSelectIds.length === [...new Set([...this.selectedIds, ...originSelectIds])].length) {
      //   // 未变化
      //   this.messageBox.failSingleError('保存失败', '选中数据未更改');
      //   return;
      // }
      // 有变化
      const temp = {
        ProductID: this.item.ID,
        PartIDList: this.selectedIds,
      };
      const resp = await this.api.getCheckFilePartSave(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$emit('submited', temp);
          this.cancel();
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    cancel() {
      this.localVisible = false;
    },
    add(e) {
      this.selectedIds.push(e.ID);
    },
    del(e) { // 加禁用状态判断
      if (e._setupNumber > 0) return;
      this.selectedIds = this.selectedIds.filter(it => it !== e.ID);
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-review-product-list-page-comps-part-setup-dialog-comp-wrap {
  .el-dialog__body {
    padding-left: 45px;
    padding-top: 15px;
    padding-right: 35px;
    min-height: 260px;
    section.box {
      > header {
        padding-bottom: 18px;
        min-height: 60px;
        box-sizing: border-box;
        > p.caption {
          color: #888E99;
        }
        > .el-button-group {
          margin-top: 10px;
          button {
            width: auto;
            padding: 0 13px;
            min-width: 100px;
            height: 28px;
            box-sizing: border-box;
            background: #f9f9f9;
            color: #585858;
            &:hover {
              background: #fff;
              color: #585858;
              border-color: #26bcf9;
            }
          }
        }
        > p.em {
          line-height: 28px;
          height: 28px;
        }
      }
      > .content {
        margin-right: 2px;
        border: 1px solid $--border-color-base;
        min-height: 157px;
        &.el-table::before {
          display: none;
        }
        .el-table__header-wrapper .el-table__header thead {
          tr {
            th {
              font-size: 14px;
              .cell {
                height: 34px;
                line-height: 34px;
                color: $--color-text-primary;
              }
            }
          }
        }
        .el-table__body-wrapper .el-table__body tbody tr td {
          color: $--color-text-primary;
          &.is-gray > .cell {
            font-size: 12px;
            color: #989898;
          }
          > .cell {
            color: #585858;
            height: 24px;
            line-height: 24px;
          }
        }
        .el-table__empty-text {
          padding-top: 15px;
        }
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 28px;
  }
}
</style>
