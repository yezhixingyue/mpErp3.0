<template>
  <div class="text-area-group-wrap">
    <TextArea
      v-for="(val, index) in list"
      :key="index"
      :value="val"
      :index.sync="config.index"
      :scrollTop.sync="config.scrollTop"
      @update:value="(e) => setListChange(e, index)"
      @lineChange="(diff) => onLineChange(diff, index)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TextArea from './AreaText.vue';
import { NEW_LINE_CHAR } from './utils';

const props = defineProps<{
  list: string[];
}>();

const emit = defineEmits(['change']);

const setListChange = (value: string, index: number) => {
  emit('change', value, index);
};

const config = ref({
  index: -1, // 当前选中行
  scrollTop: 0,
});

const onLineChange = (diff: number, index: number) => {
  props.list.forEach((it, i) => {
    if (i === index) return;

    const _list = it.split(NEW_LINE_CHAR);

    if (diff > 0) {
      _list.splice(config.value.index - diff + 1, 0, ...new Array(diff).fill(''));
    } else {
      _list.splice(config.value.index + 1, -diff);
    }
    setListChange(_list.join(NEW_LINE_CHAR), i);
  });
};

const init = () => {
  const maxlength = Math.max(
    ...props.list.map((it) => it.split(NEW_LINE_CHAR)).map((it) => it.length),
  );

  props.list.forEach((it, i) => {
    const len = it.split(NEW_LINE_CHAR).length;
    if (len < maxlength) {
      const diff = maxlength - len;
      const _val = it + new Array(diff).fill('\n').join('');
      setListChange(_val, i);
    }
  });
};

init();
</script>

<style scoped lang="scss">
.text-area-group-wrap {
  display: flex;

  > * {
    flex: none;
    width: 200px;
    height: 360px;
    margin-left: 11px;
  }
}
</style>
