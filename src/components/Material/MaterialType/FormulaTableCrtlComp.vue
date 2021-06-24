<template>
  <section class="mp-erp-material-type-page-formula-set-comp-wrap">
    <header>
      <span class="title">公式列表</span>
      <span class="blue-span" @click="onSetupClick(null)">+添加公式</span>
    </header>
    <main>
      <el-table
        class="mp-erp-common-formula-table-comp-wrap"
        :max-height="formulaH"
        :height="formulaH"
        stripe
        border
        :data="localTableData"
        key="mp-erp-common-formula-table-comp-wrap"
        fit
        style="width: 100%"
      >
        <el-table-column prop="Name" label="名称" width="280"></el-table-column>
        <el-table-column prop="Content" label="公式"  min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Unit" label="单位"  width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="UseTimes" label="使用次数"  width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="240" class-name='menu-column'>
          <div class="menu-list" slot-scope="scope">
            <span class="icon-span" @click="onSetupClick(scope.row)"><i></i>编辑</span>
            <span class="icon-span" @click="onRemoveClick(scope.row)"><i></i>删除</span>
          </div>
        </el-table-column>
        <div slot="empty">
          <span v-show="!loading">暂无公式</span>
        </div>
      </el-table>
    </main>
  </section>
</template>

<script>
export default {
  props: {
    PositionID: {
      type: String,
      default: '',
    },
    formulaH: {
      type: Number,
      default: 560,
    },
    PositionType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      localTableData: [],
      loading: false,
    };
  },
  methods: {
    onSetupClick(data) { // data 为null时为新增 有数据时为编辑
      this.$emit('setup', data);
    },
    async onRemoveClick(data) {
      if (!data || !data.ID) return;
      this.messageBox.warnCancelBox('确定删除该公式吗', `公式名称：[ ${data.Name} ]`, () => {
        this.handleRemove(data);
      });
    },
    async handleRemove(data) {
      const resp = await this.api.getFormulaRemove(data.ID).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => { this.setDataListRemove(data.ID); };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    setDataListRemove(ID) {
      this.localTableData = this.localTableData.filter(it => it.ID !== ID);
    },
    async getFormulaList() {
      if (!this.PositionID || this.loading) return;
      this.loading = true;
      const resp = await this.api.getFormulaList({ [this.PositionType]: this.PositionID }).catch(() => {});
      this.loading = false;
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        this.localTableData = resp.data.Data;
      }
    },
  },
  mounted() {
    this.getFormulaList();
  },
  // activated() {
  //   this.getFormulaList();
  // },
};
</script>
<style lang='scss'>
.mp-erp-material-type-page-formula-set-comp-wrap {
  > header {
    font-size: 14px;
    display: flex;
    > .title {
      font-weight: 700;
      padding-left: 13px;
      position: relative;
      font-size: 15px;
      margin-right: 40px;
      &::before {
        content: '';
        width: 3px;
        height: 15px;
        background-color: #26bcf9;
        left: 0;
        position: absolute;
      }
    }
  }
  > main {
    padding-right: 10px;
    padding-top: 30px;
    .mp-erp-common-formula-table-comp-wrap {
      border-top-color: rgb(230, 230, 230);
      border-left: 1px solid rgb(230, 230, 230);
      .el-table__header-wrapper thead tr th {
        .cell {
          line-height: 36px;
          font-size: 14px;
        }
        // &.menu-column {
          // text-align: left;
          // padding-left: 120px;
        // }
      }
      .el-table__body-wrapper {
        .el-table__row {
          width: 100%;
          > td {
            > .cell {
              font-size: 12px;
              height: 30px;
              color: #585858;
              .menu-list {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                padding-right: 12px;
                padding-left: 60px;
                font-size: 12px;
                > span.icon-span {
                  color: #a2a2a2;
                  transition: color 0.05s ease-in-out;
                  cursor: pointer;
                  margin: 0 10px;
                  display: flex;
                  align-items: center;
                  user-select: none;
                  &:hover {
                    color: #444;
                  }
                  > i {
                    width: 16px;
                    height: 16px;
                    background: url(../../../assets/images/Compile.png) no-repeat center center/14px 14px;
                    margin-right: 4px;
                  }
                  &:last-of-type > i {
                    background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
                  }
                }
                > span.mp-common-tip-span-btn-box {
                  margin-right: 45px;
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
