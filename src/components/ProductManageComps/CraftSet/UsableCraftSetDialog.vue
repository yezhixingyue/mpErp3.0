<template>
  <CommonDialogComp
    width="800px"
    top='8vh'
    title="设置可用工艺"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-usable-craft-set-dialog-comp-wrap"
   >
    <el-tabs v-model="activeName" type="card" size='small'>
      <el-tab-pane :label="it.ClassName" :name="`${i}`" v-for="(it, i) in CraftLevelData" :key="it.ID" >
        <div class="list-content">
          <CraftSelectFoldItem v-for="item in it.children" :key="item.ID" :itemData='item' v-model="foldItemData" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import { mapGetters } from 'vuex';
import CraftSelectFoldItem from './CraftSelectFoldItem.vue';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    usableCraftList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    CommonDialogComp,
    CraftSelectFoldItem,
  },
  data() {
    return {
      allCraftDataList: [],
      activeName: '0',
      localCraftList: [],
    };
  },
  computed: {
    ...mapGetters('common', ['twoLevelsCraftClassify']),
    CraftLevelData() {
      return this.$utils.getTreeDataFromListAndClassifyData(this.allCraftDataList, this.twoLevelsCraftClassify);
    },
    selectedIDs() {
      if (!this.localCraftList || this.localCraftList.length === 0) return [];
      return this.localCraftList.map(it => it.ID);
    },
    foldItemData: {
      get() {
        return this.selectedIDs;
      },
      set(val) {
        if (!val) return;
        const { ID } = val;
        if (this.selectedIDs.includes(ID)) {
          this.localCraftList = this.localCraftList.filter(it => it.ID !== ID);
        } else {
          this.localCraftList.push(val);
        }
      },
    },
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.localCraftList); // 后面可加校验 当使用的工艺被取消时可进行提示
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.localCraftList = [];
      this.activeName = '0';
      this.allCraftDataList = [];
    },
    async getAllCraftDataList() {
      if (this.allCraftDataList.length > 0) return;
      const resp = await this.api.getCraftListData({ Page: 1, PageSize: 100000, FieldType: 2 }).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        this.allCraftDataList = resp.data.Data;
      }
    },
    initEditData() { // 数据初始化方法
      this.$store.dispatch('common/getCraftClassifyData'); // 获取工艺列表
      this.getAllCraftDataList();
      this.localCraftList = JSON.parse(JSON.stringify(this.usableCraftList));
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-usable-craft-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 50px;
    padding-right: 20px;
    height: 548px;
    > .el-tabs {
      > .el-tabs__header {
        border: none;
        .el-tabs__nav {
          border: none;
          .el-tabs__item {
            border: 1px solid #e5e5e5;
            border-right: none;
            height: 32px;
            line-height: 30px;
            padding: 0 25px;
            color: #444;
            font-size: 14px;
            transition: none;
            user-select: none;
            box-sizing: border-box;
            &:hover {
              color: #444;
              background-color: #26bdf91f;
            }
            &.is-active {
              background-color: #26BCF9;
              color: #fff;
              border-color: #26BCF9;
              padding-left: 16px;
              padding-right: 20px;
              &::before {
                content: '';
                display: inline-block;
                width: 4px;
                height: 4px;
                background-color: #fff;
                border-radius: 50%;
                vertical-align: middle;
                margin-right: 10px;
              }
              & + .el-tabs__item {
                border-left: 1px solid #fff;
              }
            }
            &:first-of-type {
              border-radius: 3px 0px 0px 3px;
            }
            &:last-of-type {
              border-radius: 0px 3px 3px 0px;
              box-shadow: 1px 0 0 0 #e5e5e5;
              &.is-active {
                box-shadow: 1px 0 0 0 #26BCF9;
              }
            }
          }
        }
      }
      > .el-tabs__content {
        .list-content {
          height: 480px;
          overflow-y: auto;
          padding-top: 20px;
        }
      }
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      button + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
