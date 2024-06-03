<template>
  <CommonDialogComp width="525px" title="设置外购价格" :visible.sync="localVisible" class="dialog" @open="open" @submit="submit" @cancle="cancel" top="16vh">
    <div class="content" v-if="ruleForm">
      <!-- 方案选择 -->
      <el-radio-group v-model="ruleForm._radio" class="radio-group">
        <el-radio :label="PriceSetupTypeEnum.None">
          <span>不设置</span>
        </el-radio>
        <el-radio :label="PriceSetupTypeEnum.Discount">
          <span>按成交价折扣 <el-input @focus="onFocus" v-model.number="ruleForm.Discount" size="small" maxlength="4"></el-input> %</span>
        </el-radio>
        <el-radio :label="PriceSetupTypeEnum.PriceOption">
          <span>选择外购报价方案</span>
        </el-radio>
      </el-radio-group>

      <!-- 产品价格选项下拉菜单 -->
      <el-select class="select" v-model="ruleForm.Price.ID" placeholder="请选择" size="small" v-show="ruleForm._radio === PriceSetupTypeEnum.PriceOption">
        <el-option v-for="item in ruleForm._PriceOptionList" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
      </el-select>
    </div>
  </CommonDialogComp>
</template>

<script lang="ts" setup>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, ref } from 'vue';
import { IFactoryProductPrice } from '../js/type';
import { PriceSetupRuleForm, PriceSetupTypeEnum } from '../js/PriceSetupRuleForm';

const props = defineProps<{
  visible: boolean
  item: IFactoryProductPrice | null // 当前设置条目
}>();

const emit = defineEmits(['update:visible', 'submit']);

const localVisible = computed({
  get() {
    return props.visible;
  },
  set(val) {
    emit('update:visible', val);
  },
});

const ruleForm = ref<null | PriceSetupRuleForm>(null);

const onFocus = () => {
  ruleForm.value._radio = PriceSetupTypeEnum.Discount;
};

const open = () => {
  ruleForm.value = props.item ? new PriceSetupRuleForm(props.item) : null;
};

const cancel = () => {
  localVisible.value = false;
};

const submit = () => {
  if (!ruleForm.value) return;

  const temp = ruleForm.value.getParams();
  if (!temp) return;

  emit('submit', temp, cancel);
};

</script>
<style lang='scss' scoped>
@import '@/assets/css/mixins.scss';

.dialog {

  :deep(.el-dialog__body) {
    .content {
      margin-top: 10px;
      padding-left: 128px;
      height: 145px;

      .radio-group {
        >label {
          display: block;
          margin-bottom: 8px;

          .el-input {
            width: 60px;
            margin: 0 5px;

            input {
              padding: 0 4px;
              text-align: center;
            }
          }
        }
      }

      .select {
        margin-left: 24px;
        margin-top: 4px;
      }

    }
  }

}
</style>
