<template>
  <section class="mp-erp-review-out-file-name-manage-page-wrap">
    <header>
      <Crumbs :list="crumbsList" />
      <el-button type="primary" @click="onItemSetupClick(null, -1)">添加输出文件</el-button>
      <span class="intro tips-box"><i class="el-icon-warning"></i> 说明：检查输出文件时，会严格按照此处设置的条目进行文件名称包含规则进行对比。</span>
    </header>
    <main>
      <OutFileTable :list="OutputFileList" :loading="loading" @edit="onItemSetupClick" @remove="handleItemRemove" />
      <OutFileSetupDialog :list="OutputFileList" :visible.sync="visible" :item="curEditItem" @submited="onSubmited" />
    </main>
    <footer>
      <el-button class="cancel-blue-btn" @click="$goback">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';
import Crumbs from '../../../../components/common/NewComps/Crumbs.vue';
import OutFileTable from '../../../../components/ReviewComps/ReviewSetup/OutFiles/OutFileTable.vue';
import OutFileSetupDialog from '../../../../components/ReviewComps/ReviewSetup/OutFiles/OutFileSetupDialog.vue';

export default {
  name: 'outFileNameManagePage',
  mixins: [recordScrollPositionMixin('.mp-erp-review-out-file-name-manage-page-wrap .el-table__body-wrapper')],
  components: {
    Crumbs,
    OutFileTable,
    OutFileSetupDialog,
  },
  computed: {
    ...mapState('review', ['OutputFileList', 'loading']),
  },
  data() {
    return {
      crumbsList: [
        { name: '审稿设置', path: '/reviewSetupList' },
        { name: '管理输出文件' },
      ],
      visible: false,
      curEditItem: null,
      curEditItemIndex: -1,
    };
  },
  methods: {
    onItemSetupClick(item, index) {
      this.curEditItem = item;
      this.curEditItemIndex = index;
      this.visible = true;
    },
    onSubmited(e) {
      const temp = {
        item: e,
        index: this.curEditItemIndex,
        isDelete: false,
      };
      this.$store.commit('review/setOutputFileItemChange', temp);
      this.visible = false;
    },
    async handleItemRemove(item, index) {
      const resp = await this.api.getOutputFileRemove(item.ID).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const temp = {
            item,
            index,
            isDelete: true,
          };
          this.$store.commit('review/setOutputFileItemChange', temp);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
  },
  mounted() {
    // 进入页面获取并更新下文件列表数据
    this.$store.dispatch('review/getOutputFileList');
  },
};
</script>
<style lang='scss'>
.mp-erp-review-out-file-name-manage-page-wrap {
  padding-left: 30px;
  padding-right: 30px;
  font-size: 14px;
  > header {
    white-space: nowrap;
    padding-bottom: 15px;
    > .mp-erp-common-comps-crumbs-comp-wrap {
      display: block;
      margin-bottom: 6px;
    }
    > button {
      padding: 0;
      width: 120px;
      line-height: 30px;
      font-size: 14px;
    }
    > .intro {
      // color: #888;
      white-space: nowrap;
      margin-left: 20px;
      display: inline-block;
      width: auto;
      font-size: 13px;
      letter-spacing: 0.5px;
    }
  }
  > footer {
    text-align: center;
    padding-top: 18px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
    }
  }
}
</style>
