<template>
  <section class="mp-erp-multiple-level-2-selector-comp-wrap">
    <header>
      <el-checkbox v-model="checkedAll" :indeterminate="isIndeterminate" :disabled="allCanSelectLevel2Items.length===0">全部</el-checkbox>
    </header>
    <ul class="content">
      <ListItem v-for="lv1 in localList" :key="lv1.ID" :item="lv1" v-model="checkList" :disabledIds="disabledIds" />
    </ul>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import ListItem from './ListItem.vue';

export default {
  props: {
    list: {
      type: Array,
      default: null,
    },
    value: {
      type: Array,
      default: () => [],
    },
    disabledIds: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    ListItem,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('common', ['allProductClassify']),
    localList() {
      const arr = this.list || this.allProductClassify;
      return arr.filter(it => it.children.length > 0);
    },
    allLevel2Items() {
      return this.localList.reduce((arr, it) => {
        arr.push(...it.children);
        return arr;
      }, []);
    },
    allCanSelectLevel2Items() {
      return this.allLevel2Items.filter(it => !this.disabledIds.includes(it.ID));
    },
    allLevel2Ids() {
      return this.allLevel2Items.map(it => it.ID);
    },
    checkList: { // 数据转换在此完成
      get() {
        return this.value.map(it => ({ ID: it.TypeID, ParentID: it.ClassID }));
      },
      set(val) {
        this.$emit('input', val.map(it => ({ ClassID: it.ParentID, TypeID: it.ID })));
      },
    },
    checkedAll: {
      get() {
        return this.checkList.length > 0 && this.checkList.length === this.allLevel2Ids.length;
      },
      set(val) {
        this.checkList = val ? this.allCanSelectLevel2Items : [];
      },
    },
    isIndeterminate() {
      return this.checkList.length > 0 && !this.checkedAll;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-multiple-level-2-selector-comp-wrap {
  .el-checkbox {
    padding: 6px;
    padding-left: 0;
    .el-checkbox__label {
      // min-width: 10em;
      max-width: 10em;
      // width: 10em;
      font-size: 14px;
      font-weight: 700;
      color: #444;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
  > header {
    white-space: nowrap;
  }
  > ul.content {
    > li {
      .el-checkbox-group {
        padding-left: 18px;
        .el-checkbox {
          margin-right: 12px;
          .el-checkbox__label {
            font-size: 12px;
            font-weight: 400;
            width: 10em;
          }
        }
      }
      > div.title {
        white-space: nowrap;
        .menu {
          font-size: 12px;
          color: #585858;
          user-select: none;
          white-space: nowrap;
          cursor: pointer;
          vertical-align: -1px;
          i {
            color: #cbcbcb;
            font-size: 18px;
            vertical-align: -1px;
          }
        }
        > .check {
          display: inline-block;
          width: 170px;
        }
      }
    }
  }
}
</style>
