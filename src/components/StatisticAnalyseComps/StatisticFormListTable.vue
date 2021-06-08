<template>
<el-table
    class="mp-statistic-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="statisticFormDataList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column label="标题" min-width="360px" show-overflow-tooltip prop="Title"></el-table-column>
    <el-table-column show-overflow-tooltip min-width="120px" label="数据类型">
      <template slot-scope="scope">{{scope.row.Type | formatStatisticFormType
      }}</template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="210px" label="数据是否初始化">
      <template slot-scope="scope">
        <span class="is-success" v-if="scope.row.HaveInitial">已初始</span>
        <span class="is-pink" v-else>未初始</span>
      </template>
    </el-table-column>

    <el-table-column width="520px" label="操作">
      <ul
         class="handle-menus"
         slot-scope="scope"
         >
         <li>
           <span class="span-title-blue" @click="onDataInitClick(scope.row)">初始化数据</span>
         </li>
         <li>
           <span class="span-title-blue" @click="onFormViewClick(scope.row)">查看统计表</span>
         </li>
        <li class="img-menu-box">
          <span
           class="is-list-btn"
           @click="handleEditClick(scope.row)">
            <img src="@/assets/images/Compile.png" alt /><i>编辑</i>
          </span>
          <span
            @click="handleDeleteClick(scope.row)"
            class="is-list-btn">
            <img src="@/assets/images/del.png" alt /><i>删除</i>
          </span>
        </li>
      </ul>
    </el-table-column>
    <div slot="empty">
      <span v-show="!isTableDataLoading">暂无数据</span>
    </div>
  </el-table>
</template>

<script>
import { mapState } from 'vuex';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';

export default {
  mixins: [tableMixin],
  computed: {
    ...mapState('statistic', ['isTableDataLoading', 'statisticFormDataList']),
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('', 207);
      this.h = tempHeight;
    },
    onDataInitClick(itemData) { // 初始化数据
      if (itemData.HaveInitial) return;
      this.$store.dispatch('statistic/getStatisticInitialData', itemData.ID);
    },
    onFormViewClick(itemData) { // 查看统计表
      if (!itemData.HaveInitial) {
        this.messageBox.failSingle('该表尚未初始化数据');
        return;
      }
      this.$router.push({ name: 'StatisticFormView', params: { id: itemData.ID } });
    },
    handleEditClick(itemData) { // 编辑
      this.$router.push({ name: 'StatisticalFormSetting', params: { type: 'edit' }, query: { id: itemData.ID } });
    },
    handleDeleteClick({ ID, Title }) { // 删除
      this.messageBox.warnCancelBox('确定删除该统计表吗?', `标题： [ ${Title} ]`, () => {
        this.$store.dispatch('statistic/getStatisticConfigRemove', ID);
      });
    },
  },
};
</script>

<style lang="scss">
.mp-statistic-page-table-comp-wrap {
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .el-table__body-wrapper {
    .el-table__row {
      > td {
        > .cell {
          font-size: 14px;
          .handle-menus {
            display: flex;
            justify-content: center;
            padding-right: 80px;
            padding-left: 15px;
            > li {
              margin: 0 15px;
              display: flex;
              > span {
                margin-right: 25px;
                font-size: 12px;
                display: flex;
                align-items: center;
                cursor: pointer;
                > img {
                  margin-right: 8px;
                }
              }
              &.img-menu-box {
                padding-left: 25px;
              }
              &:not(.img-menu-box) > span {
                &:hover {
                  color: #35dff9;
                  color: #428dfa;
                  opacity: 1;
                }
                &:active {
                  background-color: rgba(0, 0, 0, 0);
                  color: #0758d3;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
