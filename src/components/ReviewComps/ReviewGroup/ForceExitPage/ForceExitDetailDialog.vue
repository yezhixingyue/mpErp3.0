<template>
  <CommonDialogComp
    width="1000px"
    title="查看详情"
    :visible.sync="localVisible"
    :showSubmit="false"
    class="mp-erp-review-group-force-exit-detail-dialog-comp-wrap"
    @open="onOpen"
    @cancle="cancel"
    top="12vh"
    cancelText="关闭"
  >
    <p class="mp-common-title-wrap">{{title}}</p>
    <el-table
      fit
      :data="tableList"
      class="content-table"
      stripe
      max-height="480"
      border
      style="width: 100%"
    >
      <el-table-column min-width="162px" prop="_GroupNames" show-overflow-tooltip label="当时所在组"></el-table-column>
      <el-table-column min-width="138px" prop="_TimeContent" show-overflow-tooltip label="强退时间" class-name="is-gray"></el-table-column>
      <el-table-column min-width="220px" label="操作" class-name="box">
        <template slot-scope="scope">
          <span
            v-show="activeIndex!==scope.$index"
            :class="{text:1, 'is-gray':!scope.row.Remark}"
            >
            <em class="content" :title="scope.row.Remark">{{scope.row.Remark || '未备注内容'}}</em>
            <i class="blue-span ml-8" @click="ondblclick(scope.row, scope.$index)" v-if="localPermission.SetupForcedExit">
              <img src="@/assets/images/Compile.png" alt="" />
              编辑
            </i>
          </span>
          <div v-show="activeIndex===scope.$index" class="ctrl">
            <el-input size="mini" v-model.trim="content" maxlength="20" @keyup.enter.native="onSaveClick" placeholder="请输入备注内容"></el-input>
            <el-button size="mini" type="primary" @click="onSaveClick" :disabled="!content">保存</el-button>
            <el-button size="mini" class="cancel-blue-btn" @click="onCancelChangeClick">取消</el-button>
          </div>
        </template>
      </el-table-column>
  </el-table>
  </CommonDialogComp>
</template>

<script>
import { mapState } from 'vuex';
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
    ...mapState('common', ['Permission']),
    localPermission() { // localPermission.Setup
      return this.Permission?.PermissionList?.PermissionCheckFileMemberGroup?.Obj || {};
    },
    localVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
    title() {
      return this.item && this.item.Name ? `${this.item.Name}强退记录` : '强退记录';
    },
    tableList() {
      if (this.item && Array.isArray(this.item.List)) {
        return this.item.List.map(it => ({
          ...it,
          _GroupNames: it.GroupList.map(_it => _it.Name).join('、'),
          _TimeContent: this.$utils.getTimeContentWithChiness(it.Time),
        }));
      }
      return [];
    },
  },
  data() {
    return {
      activeIndex: -1,
      content: '',
      activeItem: null,
    };
  },
  methods: {
    onOpen() {
      this.onCancelChangeClick();
    },
    cancel() {
      this.localVisible = false;
    },
    ondblclick(item, index) {
      if (!this.localPermission.SetupForcedExit) return;
      this.content = item.Remark;
      this.activeItem = item;
      this.activeIndex = index;
    },
    onCancelChangeClick() {
      this.activeIndex = -1;
      this.content = '';
      this.activeItem = null;
    },
    async onSaveClick() {
      if (this.content !== this.activeItem.Remark) {
        const resp = await this.api.getForcedExitChangeRemark(this.activeItem.ID, this.content).catch(() => null);
        if (resp && resp.data.Status === 1000) {
          this.activeItem.Remark = this.content;
          this.onCancelChangeClick();
        }
      } else {
        this.onCancelChangeClick();
      }
    },
  },
};
</script>
<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-erp-review-group-force-exit-detail-dialog-comp-wrap {
  .el-dialog__body {
    padding: 30px;
    padding-top: 18px;
    .mp-common-title-wrap {
      color: #444;
      margin-bottom: 17px;
    }
    .content-table {
      margin-right: 2px;
      border: 1px solid $--border-color-base;
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
        &.box {
          padding: 0;
          > .cell {
            height: 40px;
            line-height: 40px;
            padding: 0;
            .text {
              cursor: pointer;
              display: block;
              padding: 8px 0;
              line-height: 24px;
              transition: color 0.05s ease-in-out;
              img {
                position: relative;
                top: 2px;
                margin-right: 2px;
              }
              .content {
                display: inline-block;
                min-width: 17em;
                max-width: 25em;
                overflow: hidden;
                text-overflow: ellipsis;
                vertical-align: top;
              }
              &:hover {
                color: #444 !important;
              }
            }
            .ctrl {
              display: flex;
              align-items: center;
              .el-input {
                height: 28px;
                width: 275px;
                margin-right: 10px;
                position: relative;
                top: -2px;
              }
              button {
                width: 45px;
                height: 24px;
                padding: 0;
                position: relative;
                top: 5px;
              }
            }
          }
        }
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 25px;
  }
}
</style>
