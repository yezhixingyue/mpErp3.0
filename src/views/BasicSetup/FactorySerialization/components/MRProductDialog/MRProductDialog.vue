<template>
  <CommonDialogComp width="1200px" title="生产需求序列化设置" :visible.sync="localVisible" class="dialog" @open="open" @submit="submit" @cancle="cancel" top="6vh">
    <div class="content">
      <h2 class="title">{{ getProductName(item) }}</h2>

      <div class="panel" v-if="ruleForm && visible">
        <div class="left">
          <InputChars :value.sync="ruleForm.SplitChars" label="通用分隔符" tip='可用"空格"或“_,，、”' :regex="SplitCharsRegexps.SplitChars"/>
          <InputChars :value.sync="ruleForm.SizeJoinChars" label="尺寸连接符" tip='可用"xX+”' :regex="SplitCharsRegexps.SizeJoinChars" />
          <InputChars :value.sync="ruleForm.PartSplitChars" label="部件开始结束符" tip='可用“【】{}[]《》()（）”' :regex="SplitCharsRegexps.PartSplitChars" />
          <InputChars :value.sync="ruleForm.GroupSplitChars" label="元素组开始结束符" tip='可用“【】{}[]《》()（）”' :regex="SplitCharsRegexps.GroupSplitChars" />
          <InputChars :value.sync="ruleForm.CraftSplitChars" label="工艺开始结束符" tip='可用“【】{}[]《》()（）”' :regex="SplitCharsRegexps.CraftSplitChars" />
        </div>

        <div class="right">
          <h4 class="title">选择对应显示名称</h4>

          <div class="serialize-wrap">
            <!-- 产品 -->
            <MRPart :Part="ruleForm" hiddenName />

            <!-- 部件列表 -->
            <MRPart v-for="Part in ruleForm.List" :key="Part.ID" :Part="Part" />
          </div>
        </div>
      </div>
    </div>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import api from '@/api';
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { IMRProduct } from '../../js/types';
import { useGetProductName } from '../../js/useGetProductName';
import { MRProductRuleForm } from './js/MRProductRuleForm';
import { SplitCharsRegexps } from './js/SplitCharsRuleForm';
import InputChars from './components/InputChars.vue';
import MRPart from './components/MRPart.vue';

const props = defineProps<{
  visible: boolean
  item: IMRProduct | null
}>();

const emit = defineEmits(['update:visible', 'submit']);

const { getProductName } = useGetProductName();

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const ruleForm = ref<null | MRProductRuleForm>(null);

const open = async () => {
  ruleForm.value = null;

  if (!props.item) return;

  const resp = await api.getProductMRProduct(props.item.ID).catch(() => null);

  if (resp?.data.Status === 1000) {
    ruleForm.value = new MRProductRuleForm(resp.data.Data);
  }
};

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  if (!ruleForm.value) return;

  const params = ruleForm.value.getParams();
  if (!params) return;

  emit('submit', params);
};

</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';

.dialog {
  .content {
    margin-top: -6px;
    padding-left: 20px;
    padding-right: 10px;
    margin-bottom: -10px;
    height: 635px;

    h2.title {
      font-weight: 700;
      color: #26bcf9;
      margin-bottom: 20px;
    }

    .panel {
      display: grid;
      grid-template-rows: 600px;
      grid-template-columns: 350px 1fr;

      .left {
        box-sizing: border-box;
        border-right: 1px solid #d9d9d9;
        padding-top: 40px;
      }

      .right {
        margin-left: 70px;
        display: flex;
        flex-direction: column;

        > .title {
          flex: none;
          font-weight: 700;
          color: #444;
          padding-bottom: 18px;
        }

        > .serialize-wrap {
          flex: 1;
          overflow: auto;
        }
      }
    }
  }

}
</style>
