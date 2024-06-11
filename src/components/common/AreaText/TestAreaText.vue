<template>
  <section class="test-wrap" style="display: flex;flex-wrap: wrap;">
    <AreaTextInputList style="height: auto;" />
    <TextArea :value.sync="value1" :index.sync="highlightLine" :scrollTop.sync="scrollTop" @lineChange="(diff) => onLineChange(diff, 0)" />
    <TextArea :value.sync="value2" :index.sync="highlightLine" :scrollTop.sync="scrollTop" @lineChange="(diff) => onLineChange(diff, 1)" />
    <TextArea :value.sync="value3" :index.sync="highlightLine" :scrollTop.sync="scrollTop" @lineChange="(diff) => onLineChange(diff, 2)" />

    <div>
      <p>当前行:{{ highlightLine }}</p>
      <p>scrollTop:{{ scrollTop }}</p>
    </div>

    <div style="width: 100%;margin-left: 220px;margin-top: 10px;line-height: 24px;">
      <p>{{ value1.toString() }}</p>
      <p>{{ value2 }}</p>
      <p>{{ value3 }}</p>
    </div>
  </section>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import AreaTextInputList from './AreaTextInputList.vue';
import TextArea from './AreaText.vue';
import { NEW_LINE_CHAR } from './utils';

const highlightLine = ref(-1); // 当前光标所在行数

const scrollTop = ref(0);

const value1 = ref('1\n2\n3\n4\n5\n6\n7\n8\n9\n0\n\na\nb\nc');
const value2 = ref('1\n2\n3\n4\n5\n6\n7\n8\n9\n0\n\na\nb\nc');
const value3 = ref('1\n2\n3\n4\n5\n6\n7\n8\n9\n0\n\na\nb\nc');

const onLineChange = (diff: number, i: number) => {
  const values = [value1, value2, value3];
  values.forEach((it, index) => {
    if (index === i) return;

    const list = it.value.split(NEW_LINE_CHAR);

    if (diff > 0) {
      list.splice(highlightLine.value - diff + 1, 0, ...new Array(diff).fill(''));
    } else {
      list.splice(highlightLine.value + 1, -diff);
    }

    const _it = it;
    _it.value = list.join(NEW_LINE_CHAR);
  });
};

</script>

<style scoped lang='scss'>
.test-wrap {
  > * {
    flex: none;
    height: 360px;
    width: 200px;
    margin-left: 11px;
  }
}
</style>
