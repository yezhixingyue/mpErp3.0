<template>
  <section class="mp-price-manage-page-area-template-page-wrap">
    <header>
      <p class="mp-common-title-wrap is-black">
        <span>设置适用范围模板</span>
      </p>
      <div>
        <el-button type="primary" @click="setAreaTemplateHandler(null)">新建模板</el-button>
      </div>
    </header>
    <main class="mp-scroll-wrap">
      <AreaTempSaveDialog :visible.sync='visible' :EditData='curEditData' @submit="handleSubmit" />
      <ul>
        <li v-for="(it,i) in dataList" :key='it.ID'>
          <div class="content">{{it.Name}}</div>
          <div class="area">
            <TableItemShowComp :list='getAreaContent(it)' />
          </div>
          <CtrlMenus @edit="setAreaTemplateHandler(it)" @remove='onRemoveClick(it,i)' />
        </li>
        <li class="empty-box" v-if="!loading && dataList.length === 0">
          <img src="@/assets/images/null.png" alt="">
          <p>暂无数据</p>
        </li>
      </ul>
    </main>
    <footer>
      <el-button class="goback" @click="onGobackClick"> <i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import AreaTempSaveDialog from '../../components/PriceComps/AreaTemplate/AreaTempSaveDialog.vue';
import CtrlMenus from '../../components/common/NewComps/CtrlMenus';
import { getSelectedContentBySelectedDataAndAllData } from '../../components/common/SelectorComps/NewAreaTreeSpreadComp/utils';
import TableItemShowComp from '../../components/common/SelectorComps/NewAreaTreeSpreadComp/TableItemShowComp';

export default {
  name: 'AreaTemplate',
  components: {
    AreaTempSaveDialog,
    CtrlMenus,
    TableItemShowComp,
  },
  data() {
    return {
      curEditData: null,
      visible: false,
      dataList: [],
      loading: true,
    };
  },
  computed: {
    ...mapGetters('common', ['allAreaTreeList']),
  },
  methods: {
    setAreaTemplateHandler(data) {
      this.curEditData = data ? JSON.parse(JSON.stringify(data)) : null;
      this.visible = true;
    },
    onGobackClick() {
      this.$goback();
    },
    async handleSubmit(data) {
      const { Name, ID } = data;
      const t = this.dataList.find(it => it.Name === Name && it.ID !== ID);
      if (t) {
        this.messageBox.failSingleError('保存失败', '已存在相同的模板名称');
        return;
      }
      const resp = await this.api.getApplyRangeTemplateSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const title = data.ID ? '添加成功' : '编辑成功';
        const cb = () => {
          if (data.ID) {
            const i = this.dataList.findIndex(it => it.ID === data.ID);
            if (i > -1) this.dataList.splice(i, 1, data);
          } else {
            this.dataList.unshift({ ...data, ID: resp.data.Data });
          }
          this.visible = false;
          this.curEditData = null;
        };
        this.messageBox.successSingle(title, cb, cb);
      }
    },
    async getDataList() {
      const resp = await this.api.getApplyRangeTemplateList().catch(() => {});
      this.loading = false;
      if (resp && resp.data.Status === 1000) {
        this.dataList = resp.data.Data;
      }
    },
    onRemoveClick(it, i) {
      this.messageBox.warnCancelBox('确定删除该条范围模板吗', `模板名称：[ ${it.Name} ]`, () => {
        this.getApplyRangeTemplateRemove(it, i);
      });
    },
    async getApplyRangeTemplateRemove({ ID }, i) {
      const resp = await this.api.getApplyRangeTemplateRemove(ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.dataList.splice(i, 1);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    getAreaContent(item) {
      const temp = { List: item.AreaList, IsIncludeIncreased: item.IsIncludeIncreasedArea };
      const content = getSelectedContentBySelectedDataAndAllData(temp, this.allAreaTreeList);
      return content;
    },
  },
  mounted() {
    this.getDataList();
    this.$store.dispatch('common/getAreaList');
  },
};
</script>
<style lang='scss'>
.mp-price-manage-page-area-template-page-wrap {
  padding-left: 20px;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  > header {
    padding: 35px 0;
    flex: none;
    > p {
      font-size: 14px;
      &::before {
        height: 15px;
      }
      padding-bottom: 40px;
    }
    > div > button {
      width: 125px;
      height: 35px;
      padding: 0;
    }
  }
  > main {
    flex: 1;
    overflow-y: auto;
    width: 1000px;
    > ul {
      width: 900px;
      > li {
        border-bottom: 1px solid #eee;
        display: flex;
        align-items: center;
        line-height: 20px;
        padding: 12px 32px 10px 16px;
        > .content {
          color: #585858;
          font-size: 14px;
          width: 140px;
          padding: 0 16px;
          flex: none;
        }
        > .area {
          flex: 1;
          font-size: 12px;
          color: #585858;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        > .ctrl-menus-container {
          padding-left: 50px;
        }
        &:hover {
          background-color: #f5f5f5;
        }
        &.empty-box {
          border: none;
          height: 200px;
          background-color: #fff;
          text-align: center;
          width: 100%;
          display: block;
          padding-top: 80px;
          padding-right: 50px;
          box-sizing: border-box;
          > p {
            font-size: 12px;
            color: #a2a2a2;
          }
        }
      }
    }
  }
  > footer {
    height: 60px;
    width: 750px;
    text-align: center;
    flex: none;
    padding-top: 15px;
  }
}
</style>
