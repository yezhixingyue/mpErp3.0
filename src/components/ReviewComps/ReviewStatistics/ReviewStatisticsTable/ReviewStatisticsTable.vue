<template>
  <div class="mp-erp-review-statistics-list-page-table-wrap">
    <table v-if="datas">
      <!-- 存放横轴数据 -->
      <thead>
        <tr>
          <th>姓名\产品分类</th>
          <!-- <th>分组/姓名</th> -->
          <th v-for="it in xAxisList" :key="it.ID">{{it.Name}}</th>
        </tr>
      </thead>
      <!-- 分组数据 -->
      <!-- <TableBodyItem v-for="it in yAxisList" :key="it.ID" :curGroup="it"
         :condition="condition" :datas="datas" :onRowClick="onRowClick" :activeId="activeId" /> -->
      <TableBodyItem :condition="condition" :datas="datas" :onRowClick="onRowClick" :activeId="activeId" />
    </table>

    <div class="empty" v-else><span v-show="!loading">暂无数据</span></div>
  </div>
</template>

<script>
import TableBodyItem from './TableBodyItem.vue';

export default {
  props: {
    datas: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    condition: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    TableBodyItem,
  },
  computed: {
    xAxisList() {
      const list = Array.isArray(this.datas?.ProductList) ? [...this.datas.ProductList] : [];
      if (list.length > 0) {
        list.push({
          ID: -1,
          Name: '合计',
        });
      }
      return list;
    },
    yAxisList() {
      const list = Array.isArray(this.datas?.GroupList) ? this.datas.GroupList : [];
      return list;
    },
  },
  data() {
    return {
      activeId: '',
    };
  },
  methods: {
    onRowClick(rowId) {
      if (rowId) this.activeId = rowId;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-review-statistics-list-page-table-wrap {
  font-size: 14px;
  color: #444;
  width: 100%;
  height: 100%;
  overflow: auto;
  .empty {
    text-align: center;
    font-size: 12px;
    color: #989898;
    padding-top: 20vh;
    box-sizing: border-box;
    height: calc(100% - 20px);
    margin-right: 20px;
  }

  th, td {
    text-align: center;
    white-space: nowrap;
    padding: 4px 12px;
  }
  > table {
    > thead {
      position: sticky;
      top: 0;
      background: #fff;
      font-weight: 700;
      line-height: 30px;
      height: 40px;
      &::before {
        content: '';
        width: 1px;
        height: 40px;
        background-color: #fff;
        display: block;
        position: absolute;
        left: -1px;
      }
    }
    > tbody {
      margin-left: 1px;
      > tr {
        transition: background 0.05s ease-in-out;
        cursor: pointer;
        > td {
          border: 1px solid #eee;
          line-height: 30px;
          font-size: 12px;
          padding: 4px 22px;
          &.item {
            > span {
              display: inline-block;
              min-width: 36px;
              & + span {
                margin-left: 6px;
              }
              &.hide {
                display: none;
                margin-left: 0px;
                & + span {
                  margin-left: 0;
                }
              }
            }
          }
        }
        &.g-header {
          cursor: auto;
          > td {
            background: #F7F8FA;
            line-height: 34px;
            padding-top: 5px;
            &.label {
              font-size: 14px;
              font-weight: 700;
            }
          }
        }
        &.active {
          background: darken($color: aliceblue, $amount: 2);
          > td {
            border-bottom-color: darken($color: aliceblue, $amount: 2);
            border-top-color: darken($color: aliceblue, $amount: 2);
          }
        }
      }
    }
  }
}
</style>
