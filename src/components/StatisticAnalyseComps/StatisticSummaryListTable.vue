<template>
<el-table
    class="mp-statistic-summary-page-table-comp-wrap"
    :max-height="h"
    :height="h"
    fit
    :data="statisticSummaryDataList"
    stripe
    border
    style="width: 100%"
  >
    <el-table-column label="标题" min-width="360px" show-overflow-tooltip prop="Title"></el-table-column>
    <el-table-column show-overflow-tooltip min-width="280px" label="包含统计表数量">
      <template slot-scope="scope">{{scope.row.List.length}}</template>length
    </el-table-column>

    <el-table-column min-width="520px" label="操作">
      <ul
         class="handle-menus"
         slot-scope="scope"
         >
         <li>
           <span class="span-title-blue" @click="onPanelViewClick(scope.row)">查看面板</span>
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
    ...mapState('statistic', ['isTableDataLoading', 'statisticSummaryDataList']),
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('', 207);
      this.h = tempHeight;
    },
    onPanelViewClick(itemData) { // 查看统计表
      // console.log('onPanelViewClick', itemData);
      this.$router.push({ name: 'StatisticSummaryView', params: { id: itemData.ID } });
    },
    handleEditClick(itemData) { // 编辑
      this.$store.commit('statistic/setCurEditPanelItemData', itemData);
      this.$nextTick(() => {
        this.$router.push({ name: 'StatisticalSummarySetting', params: { type: 'edit' } });
      });
    },
    handleDeleteClick({ ID, Title }) { // 删除
      this.messageBox.warnCancelBox('确定删除该统计表吗?', `统计表标题： [ ${Title} ]`, () => {
        this.$store.dispatch('statistic/getStatisticSummaryRemove', ID);
      });
    },
  },
};
</script>

<style lang="scss">
.mp-statistic-summary-page-table-comp-wrap {
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
