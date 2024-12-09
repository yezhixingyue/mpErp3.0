<template>
  <ComputerTypeForm :form="form.attribute" v-if="form.type === EquipmentTypeEnum.computer" ref="formRef" />
  <DisplayerTypeForm :form="form.attribute" v-else-if="form.type === EquipmentTypeEnum.displayer" ref="formRef" />
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { EquipmentFormClass } from '../../../../model/ruleForm/EquipmentFormClass';
import { EquipmentTypeEnum } from '../../../../types/enum';
import ComputerTypeForm from './components/ComputerTypeForm.vue';
import DisplayerTypeForm from './components/DisplayerTypeForm.vue';

defineProps<{
  form: EquipmentFormClass
}>();

const formRef = ref();

defineExpose({
  validate: () => {
    if (formRef.value) {
      return formRef.value.validate().catch(() => false) as Promise<boolean>;
    }

    return false;
  },
});

</script>

<style scoped lang='scss'>
</style>
