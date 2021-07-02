<template>
  <CommonDialogComp
    width="950px"
    top='10vh'
    title="设置固定尺寸"
    cancelText='关闭'
    :visible.sync="visible"
    :disabled='SizeList && SizeList.length === 0'
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-pruduct-module-general-size-set-dialog-comp-wrap"
   >
    <p class="btn-box">
      <el-button size="mini" class="border-blue-btn" @click="onAddClick">+ 添加一行</el-button>
    </p>
    <div v-if="SizeGroup && ElementList.length > 0">
      <div class="header">
        <span style="width:150px;padding-right: 6px;">名称</span>
        <div>
          <span :style="`width:${autoWidth}`" v-for="it in ElementList" :key="it.ID" :title="it.Name">{{it.Name}}<i v-if="it.Unit">（{{it.Unit}}）</i></span>
        </div>
        <span style="width:90px">客户隐藏</span>
        <span style="width:210px">操作</span>
      </div>
      <ul>
        <li class="content-item" v-for="(item, index) in SizeList" :key="item.key || item.ID" >
          <el-input v-model.trim="item.Name" maxlength="20" size="small" class="name"></el-input>
          <ul class="flex-content">
            <li :style="`width:${autoWidth}`" v-for="(it,i) in ElementList" :key="it.ID">
              <NumberTypeItemComp
                v-if="it.Type === 1"
                v-model="item.List[i].Second"
               InputContent=''
               :Allow='it.NumbericAttribute.Allow' />
              <OptionTypeItemComp
               v-if="it.Type === 2"
               v-model="item.List[i].Second"
               :options='it.OptionAttribute.OptionList'
               :Allow='it.OptionAttribute.Allow'
               :canRadio='false' />
            </li>
          </ul>
          <el-checkbox v-model="item.HiddenToCustomer">隐藏</el-checkbox>
          <div class="ctrl">
            <span class="del-btn" @click="onItemRemove(index)"><i></i> 删除</span>
            <div>
              <span v-show="index < SizeList.length - 1" @click="onOptionMove('down', index)"><i class="el-icon-bottom"></i> 下移</span>
            </div>
            <div>
              <span v-show="index > 0" @click="onOptionMove('up', index)"><i class="el-icon-top"></i> 上移</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import NumberTypeItemComp from '@/components/common/ElementDisplayTypeComps/NumberTypeItemComp.vue';
import OptionTypeItemComp from '@/components/common/ElementDisplayTypeComps/OptionTypeItemComp.vue';
import { elementValChecker } from '@/assets/js/checker';
import { normalNameReg } from '@/assets/js/utils/regexp';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    SizeGroup: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
    NumberTypeItemComp,
    OptionTypeItemComp,
  },
  data() {
    return {
      ElementList: [],
      SizeList: [],
      template: null,
    };
  },
  computed: {
    autoWidth() {
      if (!this.SizeGroup || this.ElementList.length === 0) return '100%';
      return `${100 / this.ElementList.length}%`;
    },
  },
  methods: {
    onSubmit() {
      if (this.SizeList.length === 0) return this.setErrorAndReturn('至少需设置一行固定尺寸');
      let i = this.SizeList.findIndex(it => !it.Name);
      if (i > -1) return this.setErrorAndReturn(`第${i + 1}行未设置名称`);

      i = this.SizeList.findIndex(it => !normalNameReg.test(it.Name));
      if (i > -1) return this.setErrorAndReturn(`第${i + 1}行名称不合法，名称仅支持中文、英文(全角/半角)、+-_(全角/半角)、数字等`);

      const names = this.SizeList.map(it => it.Name);
      if (names.length > [...new Set(names)].length) return this.setErrorAndReturn('存在重复名称，请检查');

      for (let index = 0; index < this.SizeList.length; index += 1) {
        const { List } = this.SizeList[index];
        for (let index2 = 0; index2 < List.length; index2 += 1) {
          const { First, Second } = List[index2];
          const element = this.ElementList.find(({ ID }) => First === ID);
          if (element) {
            const { result, msg } = elementValChecker(Second, element);
            if (!result) return this.setErrorAndReturn(`第${index + 1}行${element.Name}${msg}`);
          }
        }
      }
      const eleStrs = this.SizeList.map(it => it.List).map(list => list.map(({ Second }) => Second).join(''));
      if (eleStrs.length > [...new Set(eleStrs)].length) return this.setErrorAndReturn('存在设置项重复，请检查');
      this.$emit('submit', this.SizeList);
      return true;
    },
    setErrorAndReturn(msg) {
      this.messageBox.failSingleError('保存失败', msg);
      return false;
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.template = null;
    },
    onAddClick() {
      const _temp = JSON.parse(JSON.stringify(this.template));
      const Index = this.SizeList.length;
      const key = Math.random().toString(36).slice(-10);
      const item = { ..._temp, Index, key };
      this.SizeList.push(item);
    },
    onOptionMove(type, index) { // 排序
      const [item] = this.SizeList.splice(index, 1);
      const newIndex = type === 'up' ? index - 1 : index + 1;
      this.SizeList.splice(newIndex, 0, item);
      this.SizeList.forEach((it, i) => {
        const _it = it;
        _it.Index = i;
      });
    },
    onItemRemove(i) {
      this.SizeList.splice(i, 1);
    },
    initEditData() { // 数据初始化方法
      if (!this.SizeGroup || !this.SizeGroup.GroupInfo) return;
      this.ElementList = this.SizeGroup.GroupInfo.ElementList;
      this.SizeList = JSON.parse(JSON.stringify(this.SizeGroup.SizeList));
      this.template = {
        ID: '',
        Name: '',
        Index: 0,
        HiddenToCustomer: false,
        List: [],
      };
      this.ElementList.forEach(it => {
        const temp = { First: it.ID, Second: '' };
        this.template.List.push(temp);
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-general-size-set-dialog-comp-wrap {
  .el-dialog__body {
    font-size: 14px;
    padding-left: 30px;
    padding-right: 40px;
    p.btn-box {
      padding-left: 20px;
      button {
        font-size: 14px;
        padding: 0;
        width: 100px;
        height: 28px;
      }
    }
    > div {
      > div.header {
        display: flex;
        align-items: center;
        height: 39px;
        border-bottom: 1px solid #DCDFE6;
        margin-bottom: 16px;
        > span, > div > span {
          text-align: center;
          color: #a2a2a2;
          line-height: 20px;
          flex: none;
          white-space: nowrap;
          overflow: hidden;
        }
        > div { // 标题伸缩区域
          flex: 1;
          display: flex;
          align-items: center;
          max-width: 424px;
        }
      }
      > ul {
        max-height: 440px;
        min-height: 220px;
        overflow-y: auto;
        > li.content-item {
          display: flex;
          align-content: center;
          margin-bottom: 12px;
          > .ctrl {
            font-size: 12px;
            user-select: none;
            color: #A2A2A2;
            width: 210px;
            flex: none;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-bottom: 2px;
            > div {
              width: 46px;
              > span {
                cursor: pointer;
                transition: color 0.05s ease-in-out;
                &:hover {
                  color: #444;
                }
                > i {
                  font-size: 18px;
                  color: #1dc742;
                  position: relative;
                  top: 3px;
                }
              }
            }
            .del-btn {
              font-size: 12px;
              user-select: none;
              display: flex;
              align-items: center;
              position: relative;
              top: 2px;
              > i {
                display: inline-block;
                width: 12px;
                height: 18px;
                vertical-align: middle;
                margin-right: 6px;
                background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
              }
              cursor: pointer;
              transition: color 0.05s ease-in-out;
              &:hover {
                color: #444 !important;
              }
            }
          }
          > .el-checkbox {
            line-height: 32px;
            text-align: center;
            display: block;
            padding-left: 19px;
            padding-right: 23px;
            flex: none;
          }
          > .name {
            width: 150px;
            flex: none;
            padding-right: 6px;
            .el-input__inner {
              font-size: 12px;
            }
          }
          > .flex-content { // 表体伸缩区域
            flex: 1;
            display: flex;
            align-items: center;
            > li {
              flex: none;
              padding: 0 6px;
              box-sizing: border-box;
              text-align: center;
              > .el-input, > .el-select {
                max-width: 160px;
              }
            }
          }
        }
      }
    }
  }
  .el-dialog__footer {
    .dialog-footer {
      button + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
