<template>
  <CommonDialogComp width="500px" :visible.sync="localVisible" @submit="submit" @cancle="cancel" @open="onOpen"
    class="dialog" top="27vh">
    <el-form :model="ruleForm" ref="oForm" label-width="150px" class="ruleForm">
      <el-form-item label="短信停发截止时间：">
        <el-col :span="15">
          <el-form-item prop="date" :rules="[
            { required: true, message: '请选择日期' },
            { validator: validateDate },
          ]">
            <el-date-picker v-model="ruleForm.date" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              :picker-options="{ disabledDate: handleDisabledDate, format: 'HH:mm' }" size="mini"
              style="margin-right: 10px;width: 150px;"
              placeholder="请选择日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="time" :rules="[
            { required: true, message: '请选择时间' },
          ]">
            <el-time-select v-model="ruleForm.time" :picker-options="{
              start: '00:00',
              step: '01:00',
              end: '24:00'
            }" size="mini" style="width: 100px;" placeholder="选择时间">
            </el-time-select>
          </el-form-item>

        </el-col>

      </el-form-item>
    </el-form>

  </CommonDialogComp>
</template>

<script setup lang='ts'>
import { CommonDialogComp } from '@/components/common/mpzj-sell-lib/lib';
import { computed, nextTick, ref } from 'vue';

const props = defineProps<{
  visible: boolean
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

const cancel = () => {
  localVisible.value = false;
};

const validateDate = (rule, value: string, callback) => {
  if (!ruleForm.value.date || !ruleForm.value.time) {
    callback();
  } else {
    const selectedDate = new Date(getTimeString()).getTime();

    if (selectedDate <= Date.now()) {
      callback(new Error('截止时间必须晚于当前时间'));
    } else {
      callback();
    }
  }
};

const handleDisabledDate = (e) => new Date(e) < new Date(todayTime - 24 * 60 * 60 * 1000);

const ruleForm = ref({
  date: '',
  time: '',
});
const getTimeString = () => {
  const { date, time } = ruleForm.value;

  return `${date}T${time === '24:00' ? '23:59:59' : time}`;
};
const oForm = ref();
let todayTime = Date.now();
const onOpen = async () => {
  todayTime = Date.now();

  const _date = new Date(todayTime + 24 * 60 * 60 * 1000);
  const y = _date.getFullYear();
  const month = String(_date.getMonth() + 1).padStart(2, '0');
  const day = String(_date.getDate()).padStart(2, '0');
  const hour = String(_date.getHours()).padStart(2, '0');

  ruleForm.value.date = `${y}-${month}-${day}`;
  ruleForm.value.time = `${hour}:00`;

  oForm.value?.clearValidate();

  await nextTick();
  oForm.value?.resetFields();
};

const submit = () => {
  oForm.value.validate((valid: boolean) => {
    if (valid) {
      console.log(`${ruleForm.value.date}T${ruleForm.value.time}`);
      emit('submit', getTimeString());
    }
  });
};

</script>

<style scoped lang='scss'>
.dialog {
  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    height: 140px;
    box-sizing: border-box;
    padding: 35px 50px;

    .ruleForm {
      margin-top: 20px;
    }
  }
}
</style>
