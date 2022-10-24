<template>
  <CommonDialogComp
    width="660px"
    title="选择产品部件"
    :visible.sync="localVisible"
    class="mp-erp-review-product-list-page-comps-part-setup-dialog-comp-wrap"
    @open="onOpen"
    @submit="submit"
    @cancle="cancel"
    top="16vh"
  >
    <section v-if="item" class="box">
      <header>
        <el-button-group v-show="topList.length > 0">
          <el-button v-for="it in topList" :key="it.ID" @click="add(it)">{{it.Name}}</el-button>
        </el-button-group>
        <p v-show="topList.length === 0" class="is-gray ft-12 em">已全部添加</p>
      </header>
      <p class="tip-box warning">
        <i class="el-icon-warning"></i>
        <span class="ft-12 ml-5">请添加需要生产的部件，不需要生产则不用添加</span>
      </p>
      <el-table
        class="content"
        :max-height="278"
        fit
        :data="selectedList"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column min-width="200px" prop="Name" align="center" show-overflow-tooltip label="已添加部件"></el-table-column>
        <el-table-column width="260px" label="操作" align="center">
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
import { CommonDialogComp } from 'mpzj-sell-lib';
import { message } from '@/assets/js/message';
import api from '@/api';

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
          const {
            LineCount, NumbericInfoCount, UnionMakeupLimitCount, WordsInfoCount,
            WorkTimesCount, WorkingCount, DefaultLine, SemiFinished,
          } = it;
          _setupNumber += (LineCount || 0);
          _setupNumber += (NumbericInfoCount || 0);
          _setupNumber += (UnionMakeupLimitCount || 0);
          _setupNumber += (WordsInfoCount || 0);
          _setupNumber += (WorkTimesCount || 0);
          _setupNumber += (WorkingCount || 0);
          if (DefaultLine) _setupNumber += 1;
          if (SemiFinished) _setupNumber += 1;
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
      const originSelectIds = this.item.PartList.filter(it => it.IsSelected).map(it => it.ID) || [];
      if (this.item.IsSelected) originSelectIds.unshift(this.item.ID);
      if (this.selectedIds.length === originSelectIds.length && originSelectIds.length === [...new Set([...this.selectedIds, ...originSelectIds])].length) {
        // 未变化
        message.error({ title: '保存失败', message: '选中数据未更改' });
        return;
      }
      // 有变化
      const temp = {
        ID: this.item.ID,
        ServerID: this.item.ServerID,
        IsSelected: this.selectedIds.includes(this.item.ID),
        PartList: this.item.PartList.map(it => ({ ID: it.ID, IsSelected: this.selectedIds.includes(it.ID) })),
      };
      const resp = await api.getConvertServerPartSave(temp).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.$emit('submited', temp);
          this.cancel();
        };
        message.success({ title: '保存成功', onOk: cb, onCancel: cb });
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
        padding-bottom: 8px;
        min-height: 50px;
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
          line-height: 46px;
          height: 28px;
        }
      }
      > .tip-box {
        padding-bottom: 12px;
        i {
          vertical-align: -1px;
        }
      }
      > .content {
        margin-right: 2px;
        border: 1px solid $--border-color-base;
        min-height: 257px;
        &.el-table::before {
          display: none;
        }
        .el-table__header-wrapper .el-table__header thead {
          tr {
            th {
              .cell {
                color: $--color-text-primary;
                font-weight: 400;
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
