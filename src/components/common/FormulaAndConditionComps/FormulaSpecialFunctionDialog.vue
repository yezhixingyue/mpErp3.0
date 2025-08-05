<template>
  <CommonDialogComp
    width="550px"
    top='16vh'
    title="特殊函数选择面板"
    :visible.sync="localVisible"
    @submit="submit"
    @cancle="localVisible = false"
    @open='onOpen'
    submitText='确定'
    :disabled="!ruleForm.name"
    class="mp-erp-comps-formula-panel-special-function-set-dialog-comp-wrap"
  >
    <section class="main-content">
      <aside>
        <h4>函数类型</h4>

        <ul class="mp-scroll-wrap">
          <li v-for="it in SpecialFunctionList" :key="it.Name" @click="onClassChange(it.Name)" :class="{active:it.Name===ruleForm.className}">{{ it.Name }}</li>
        </ul>
      </aside>

      <main>
        <h4>选择函数</h4>

        <ul class="mp-scroll-wrap">
          <li v-for="it in currentChildren" :key="it.Name" @click="ruleForm.name=it.Name" :class="{active:it.Name===ruleForm.name}">{{ it.Name }}</li>
        </ul>

        <div class="intro">
          <template v-if="currentFunc">
            <p>{{ currentFunc.Expression }}</p>
            <div v-html="currentFunc.Describe"></div>
          </template>
          <p v-else style="margin-top: 4px;margin-left: 8px;color: #888;">请选择函数</p>
        </div>
      </main>
    </section>
  </CommonDialogComp>
</template>

<script setup lang='ts'>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { computed, ref } from 'vue';

const props = defineProps<{
  visible: boolean
  SpecialFunctionList: { Name: string; List: { Name: string; Expression: string; Describe: string }[] }[]
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

const ruleForm = ref({
  className: '',
  name: '',
});

const onClassChange = (cName: string) => {
  if (ruleForm.value.className === cName) return;

  ruleForm.value.className = cName;
  ruleForm.value.name = '';
};

const currentChildren = computed(() => props.SpecialFunctionList.find(it => it.Name === ruleForm.value.className)?.List || []);
const currentFunc = computed(() => currentChildren.value.find(it => it.Name === ruleForm.value.name));

const onOpen = () => {
  ruleForm.value.className = props.SpecialFunctionList[0]?.Name || '';
  ruleForm.value.name = currentChildren.value[0]?.Name || '';
};

const submit = () => {
  if (!currentFunc.value) return;

  emit('submit', currentFunc.value);
  localVisible.value = false;
};

</script>

<style lang='scss'>
.mp-erp-comps-formula-panel-special-function-set-dialog-comp-wrap {
  .el-dialog__body {
    padding-left: 30px;
    padding-right: 10px;
    padding-bottom: 0;
    padding-top: 5px;
    height: 270px;
    overflow-y: auto;
    color: #444;
    font-size: 12px;
    line-height: 25px;

    .main-content {
      display: flex;
      height: 100%;

      > aside, > main {
        display: flex;
        flex-direction: column;
        ul {
          flex: 1;
          overflow: auto;
          padding-top: 4px;
        }
      }

      > aside {
        flex: none;
        width: 95px;

        ul {
          border-right: 1px solid #EEEEEE;
          text-align: center;
          padding-right: 20px;
        }
      }

      > main {
        flex: 1;
        overflow: hidden;

        h4 {
          padding-left: 20px;
        }

        ul {
          padding-left: 20px;

          li {
            padding-left: 15px;
            margin-right: 70px;
          }
        }

        > .intro {
          flex: 0 1 auto;
          padding-left: 10px;
          min-height: 61px;
          border-top: 1px solid #EEEEEE;
          white-space: wrap;
          line-height: 16px;
          padding-top: 4px;

          > div {
            padding-top: 5px;
          }

          b {
            font-weight: 700;
          }
        }
      }

      h4 {
        font-weight: 700;
        font-size: 14px;
        flex: none;
      }

      li {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin: 5px 0;
        cursor: pointer;

        &.active {
          background: rgba($color: #26BCF9, $alpha: 0.1);
          border-radius: 2px;
        }
      }
    }
  }
  .el-dialog__footer {
    padding-top: 12px;
  }
}
</style>
