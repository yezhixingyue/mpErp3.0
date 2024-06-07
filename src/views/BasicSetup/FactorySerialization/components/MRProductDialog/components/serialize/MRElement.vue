<template>
  <li class="mr-element">
    <span class="label-name" :title="localElement.Name">{{ localElement.Name }}</span>
    <el-checkbox v-model="localElement.IsShow" v-if="isRoot">显示</el-checkbox>
    <el-checkbox :disabled="localDisabled" v-model="localElement.IsShowName">
      <template>显示名称</template>
      <!-- <template v-if="localElement.Type !== ElementTypeEnum.Numberic">：</template> -->
    </el-checkbox>

    <!-- 选项类型 -->
    <div class="options" v-if="localElement.Type === ElementTypeEnum.Option && localElement.OptionList?.length > 0">
      <span class="ft-12 mr-2" style="line-height: 18px;flex: none;padding-left: 5px;">选项：</span>
      <div>
        <el-checkbox :disabled="localDisabled" v-for="it in localElement.OptionList" :key="it.ID" v-model="it.IsShowName">{{ it.Name }}</el-checkbox>
      </div>
    </div>

    <!-- 开关类型 -->
    <div class="switch" v-if="localElement.Type === ElementTypeEnum.Switch">
      <el-checkbox :disabled="localDisabled" v-model="localElement.IsShowWord">{{ localElement.ShowWord }}</el-checkbox>
    </div>

    <!-- 数值类型 - 不展示内容 -->
  </li>
</template>

<script setup lang='ts'>
import { ElementTypeEnum } from '@/views/BasicSetup/FactorySerialization/js/enum';
import { IMRElement } from '@/views/BasicSetup/FactorySerialization/js/types';
import { computed, watch } from 'vue';

const props = defineProps<{
  Element: IMRElement
  disabled?: boolean
  isRoot: boolean
}>();

const localElement = computed(() => props.Element);

const localDisabled = computed(() => (!props.isRoot ? !!props.disabled : !localElement.value.IsShow));

if (!props.isRoot) {
  localElement.value.IsShow = true;
  // localElement.value.IsShowName = false;
}

watch(() => localDisabled.value, (val) => { // 在禁用时，清除勾选数据
  if (val) {
    localElement.value.IsShowName = false;

    if (localElement.value.Type === ElementTypeEnum.Option && localElement.value.OptionList?.length > 0) {
      localElement.value.OptionList.forEach(it => {
        const _it = it;
        _it.IsShowName = false;
      });
    }

    if (localElement.value.Type === ElementTypeEnum.Switch) {
      localElement.value.IsShowWord = false;
    }
  }
});
</script>

<style scoped lang='scss'>
.mr-element {
  display: flex;
  margin-bottom: 8px;

  .options {
    display: flex;
  }
}
</style>
