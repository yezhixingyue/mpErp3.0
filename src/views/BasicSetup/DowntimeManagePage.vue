<template>
  <section class="mp-erp-down-time-manage-page-wrap">
    <header>
      <el-button type="primary" @click="onItemSaveClick('add')">添加停机维护</el-button>
    </header>
    <main>
      <DowntimeSetupDialog :visible.sync='visible' :type='type' />
    </main>
    <footer></footer>
  </section>
</template>

<script>
import DowntimeSetupDialog from '@/components/DowntimeManageComps/DowntimeSetupDialog';

export default {
  name: 'DowntimeManagePage',
  components: {
    DowntimeSetupDialog,
  },
  data() {
    return {
      visible: false,
      type: '',
    };
  },
  methods: {
    onItemSaveClick(type) {
      this.type = type;
      this.visible = true;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-down-time-manage-page-wrap {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding-left: 10px;
  > header {
    flex: none;
    height: 30px;
    background-color: #fff;
    padding: 15px 20px;
    > button {
      width: 120px;
      height: 30px;
      padding: 0;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    margin-top: 10px;
  }
  > footer {
    flex: none;
    height: 70px;
    background-color: #fff;
  }
}
</style>
