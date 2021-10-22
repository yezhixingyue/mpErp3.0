<template>
  <section class="mp-statistic-summary-add-edit-select-form-data-list-comp-wrap" v-if="itemData">
    <main>
      <el-checkbox-group v-model="checkList">
        <el-checkbox :label="it.ID" v-for="it in itemData.list" :key="it.ID">{{it.Title}}</el-checkbox>
      </el-checkbox-group>
      <div v-if="itemData.list.length === 0 && !itemData.loading" class="null-box">
        <img src="@/assets/images/null.png" alt="">
        <p><span class="is-font-size-12" >暂无该类型统计表</span></p>
      </div>
    </main>
    <footer>
      <el-pagination
        small
        hide-on-single-page
        layout="prev, pager, next"
        :current-page.sync='curPage'
        :page-size='itemData.PageSize'
        :total="itemData.count">
      </el-pagination>
    </footer>
  </section>
</template>

<script>
export default {
  props: {
    itemData: {},
    selectList: {
      type: Array,
      default: () => ([]),
    },
  },
  computed: {
    curPage: {
      get() {
        return this.itemData.Page;
      },
      set(val) {
        if (val === this.itemData.Page) return;
        this.$emit('getData', this.itemData, val);
      },
    },
    checkList: {
      get() {
        return this.selectList.map(it => it.ID);
      },
      set(val) {
        const _list = [...this.selectList, ...this.itemData.list];
        const list = val.map(it => {
          const t = _list.find(item => item.ID === it);
          if (t) return t;
          return '';
        }).filter(it => !!it);
        this.$emit('update:selectList', list);
      },
    },
  },
};
</script>
<style lang='scss'>
.mp-statistic-summary-add-edit-select-form-data-list-comp-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  > main {
    flex: 1;
    max-height: 354px;
    overflow: auto;
    > .null-box {
      text-align: center;
      padding-top: 50px;
      padding-right: 20px;
      > p {
        padding-top: 10px;
      }
    }
    > .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      > label {
        margin-right: 17px;
        width: 279px;
        display: flex;
        align-items: center;
        margin-bottom: 18px;
        > .el-checkbox__label {
          padding-left: 8px;
          max-width: 265px;
          height: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #585858;
          font-size: 12px;
        }
        > .el-checkbox__input {
          top: 3px;
        }
      }
    }
  }
  > footer {
    flex: none;
    text-align: right;
    padding: 20px 10px 0;
  }
}
</style>
