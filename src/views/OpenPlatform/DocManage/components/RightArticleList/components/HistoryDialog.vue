<template>
  <CommonDialogComp
    width="720px"
    :visible.sync="localVisible"
    title="查看修改历史："
    :showSubmit="false"
    closeOnClickModal
    cancelText="关闭"
    @cancle="localVisible = false"
    @open="open"
    class="mp-doc-manage-page-article-history-dialog-comp-wrap"
  >
    <!-- 内容区域 -->
    <div class="content">
      <el-table
        v-if="ruleForm"
        fit
        :data="ruleForm.list"
        class="history-table"
        stripe
        max-height="280"
        border
        style="width: 100%;height: 280px;"
      >
        <el-table-column width="150px" prop="operatorName" show-overflow-tooltip label="员工姓名"></el-table-column>
        <el-table-column width="110px" prop="operateType" show-overflow-tooltip label="操作项"></el-table-column>
        <el-table-column min-width="150px" prop="operateRemark" show-overflow-tooltip label="备注"></el-table-column>
        <el-table-column width="150px" prop="operateTime" show-overflow-tooltip label="操作时间"></el-table-column>
        <div slot="empty">
          <span v-if="ruleForm && !ruleForm.listNumber && !ruleForm.loading">暂无数据</span>
        </div>
      </el-table>
      <Count v-if="ruleForm"
        style="padding-right: 5px;margin-top: 10px;"
        :watchPage='ruleForm.Page'
        :handlePageChange='(e) => ruleForm.getList(e)'
        :showLoading='ruleForm.loading'
        :count='ruleForm.listNumber'
        :pageSize='ruleForm.Limit'
       />
    </div>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue';
import Count from '@/components/common/Count.vue';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { IArticle } from '../../../js/types';
import { ArticleHistoryList } from '../js/ArticleHistoryList';

const props = defineProps<{
  visible: boolean
  article: IArticle | null
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const ruleForm = ref<null | ArticleHistoryList>(null);

const open = () => {
  if (props.article) {
    ruleForm.value = new ArticleHistoryList(props.article);
  }
};

</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-doc-manage-page-article-history-dialog-comp-wrap {
  .el-dialog__body {
    padding-bottom: 0;
  }
  .content {
    display: block;
    padding: 0 20px;
    margin-top: -10px;
    margin-bottom: -15px;
    height: 350px;
    .history-table {
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
              height: 32px;
              line-height: 32px;
              color: $--color-text-primary;
            }
          }
        }
      }
      .el-table__body-wrapper .el-table__body tbody tr td {
        color: $--color-text-primary;
        > .cell {
          color: #585858;
          height: 24px;
          line-height: 24px;
        }
      }
    }

    .count-wrap {
      .mp-pagination-wrap {
        text-align: left;
        flex: 1;
      }
      .count {
        margin-left: 2px;
      }
    }
  }

  .el-dialog__footer {
    display: none;
  }
}
</style>
