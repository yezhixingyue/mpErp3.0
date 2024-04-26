<template>
  <section class="mp-doc-article-edit-view-wrap">
    <header>
      <div>
        <el-input v-model.trim="ruleForm.helpdocuTitle" maxlength="50" show-word-limit></el-input>
        <el-button type="primary" @click="() => ruleForm.submit()">保存文章</el-button>
        <el-button class="blue" @click="goback">返回</el-button>
      </div>

      <div>
        <h2>文档类型：</h2>
        <el-radio-group v-model="ruleForm.helpdocuType">
          <el-radio v-for="it in DocTypeEnumList" :key="it.ID" :label="it.ID">{{ it.Name }}</el-radio>
        </el-radio-group>
      </div>

    </header>

    <main>
      <div v-if="ruleForm.helpdocuType === DocTypeEnum.doc" style="height: 100%;">
        <TinyMCEditor :modelValue.sync="ruleForm.helpdocuContent" />
      </div>

      <div v-if="ruleForm.helpdocuType === DocTypeEnum.link" class="link">
        <h2>URL：</h2>
        <el-input v-model.trim="ruleForm.helpdocuURL" maxlength="255" class="url" style="width: 600px;" show-word-limit></el-input>
      </div>

      <RemarkDialog :visible.sync="ruleForm._remarkVisible" @submit="e => ruleForm.finally(e)" />
    </main>

  </section>
</template>

<script setup lang='ts'>
import { DocTypeEnumList, DocTypeEnum } from '@/views/OpenPlatform/DocManage/js/enum';
import TinyMCEditor from '@/components/common/TinyMCEditor/TinyMCEditor.vue';
import { ref } from 'vue';
import { IArticle } from '../../../../js/types';
import { ArticleForm } from './ruleForm';
import { goBackLastPage } from '@/router';
import { MpMessage } from '@/assets/js/utils/MpMessage';
import RemarkDialog from './RemarkDialog.vue';
import { docBaseURL } from '@/api/doc/instance';

const props = defineProps<{
  currentArticle: null | IArticle
  classId: number
}>();

const ruleForm = ref(new ArticleForm(props.classId, props.currentArticle));

const goback = () => {
  if (props.currentArticle && props.currentArticle.helpdocuType === DocTypeEnum.doc && props.currentArticle.helpdocuContent
   && ruleForm.value.helpdocuContent !== props.currentArticle.helpdocuContent.replaceAll('mpzj_origin_domain_address', docBaseURL)) {
    MpMessage.warn({
      title: '是否放弃修改',
      msg: '返回后当前页面已修改内容将不会保存，是否返回?',
      onOk: goBackLastPage,
    });
  } else {
    goBackLastPage();
  }
};
</script>

<style scoped lang='scss'>
.mp-doc-article-edit-view-wrap {
  display: grid;
  grid-template-columns: 935px;
  grid-template-rows: 85px 1fr;
  font-size: 14px;
  color: #222;

  > header {
    > div {
      display: flex;
      align-items: center;
      padding-bottom: 15px;

      :deep(input.el-input__inner) {
        padding-right: 50px;
      }
    }
    button {
      flex: none;
      height: 30px;
      padding: 0;
      width: 100px;
      border-radius: 4px;
      margin-left: 20px;
      font-size: 13px;
      line-height: 28px;
    }
  }

  > main {
    .link {
      display: flex;
      align-items: center;
    }

    .url {
      :deep(.el-input__inner) {
        padding-right: 60px;
      }
    }
  }

  h2 {
    font-weight: 700;
    margin-right: 6px;
    position: relative;
    top: -1px;
    width: 6em;
    text-align: right;
    &::before {
      content: '*';
      color: #f00;
      display: inline-block;
      margin-right: 1px;
      font-size: 15px;
    }
  }

  :deep(.el-input) {
    margin-right: 10px;
    input {
      height: 36px !important;
      line-height: 36px !important;
      border-radius: 4px;
    }
  }
}
</style>
