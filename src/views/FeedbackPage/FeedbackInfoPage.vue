<template>
  <section class=" FeedbackInfoPage">
    <Tables></Tables>
    <footer>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">开始处理</el-button>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">挂起</el-button>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">转他人处理</el-button>
      <el-button type='primary' class="is-blue-button" @click="onSubmitClick">驳回</el-button>
      <el-button class="cancel-blue-btn" @click="onGoBackClick"><i>＜＜</i> 返回</el-button>
    </footer>
    <!-- 挂起 -->
    <PostponeDialogComp :visible="false"></PostponeDialogComp>
    <!-- 转他人处理 -->
    <DeliverToDialogComp :visible="false"></DeliverToDialogComp>
    <!-- 驳回 -->
    <RejectDialogComp :visible="false"></RejectDialogComp>
    <!-- 执行售后 -->
    <ExecuteDialogComp :visible="false"></ExecuteDialogComp>
  </section>
</template>

<script>
import Tables from '@/components/Feedback/Tables.vue';
import PostponeDialogComp from '@/components/Feedback/PostponeDialogComp.vue';
import DeliverToDialogComp from '@/components/Feedback/DeliverToDialogComp.vue';
import RejectDialogComp from '@/components/Feedback/RejectDialogComp.vue';
import ExecuteDialogComp from '@/components/Feedback/ExecuteDialogComp.vue';

export default {
  name: 'FeedbackInfoPage',
  components: {
    Tables,
    PostponeDialogComp,
    DeliverToDialogComp,
    RejectDialogComp,
    ExecuteDialogComp,
  },
  data() {
    return {
      loading: false,
      isEdit: true,
    };
  },
  methods: {
    async getInitData() {
      this.loading = true;
      if (this.$route.params.ID && this.$route.params.ID !== 'null') {
        console.log('a');
      }
      this.loading = false;
    },
    onGoBackClick() {
      this.$router.go(-1);
      this.$goback();
    },
    async onSubmitClick() {
      // 需要先校验
    },
  },
  mounted() {
    this.getInitData();
  },
};
</script>
<style lang='scss'>
.FeedbackInfoPage {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  > footer {
    flex: none;
    height: 65px;
    text-align: center;
    padding-top: 40px;
    button {
      width: 120px;
      height: 35px;
      padding: 0;
      border-radius: 3px;
      i {
        transform: scaleY(1.4);
        display: inline-block;
      }
      & + button.el-button {
        margin-left: 20px;
      }
    }
  }
}
</style>
