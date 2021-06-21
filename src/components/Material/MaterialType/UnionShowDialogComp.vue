<template>
  <CommonDialogComp
    width="700px"
    top='13vh'
    title="元素组合显示"
    :visible.sync="visible"
    :disabled='curData && curData.ElementList.length === 0'
    @cancle="onCancle"
    @open='onOpen'
    @submit='onSubmit'
    @closed='onClosed'
    class="mp-erp--material-type-union-show-dialog-comp-wrap"
  >
    <template v-if="curData">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="it in curData.ElementList" :key="it.ID" :label="it.ID" :disabled='UnionShowIDs.includes(it.ID)'>{{getCheckLabel(it)}}</el-checkbox>
      </el-checkbox-group>
      <div v-if="curData.ElementList.length === 0">
        <el-alert
          :closable="false"
          title="暂无可用元素，请先设置元素 ！"
          show-icon
          type="error">
        </el-alert>
      </div>
      <p class="title">当前选择顺序</p>
      <p class="btn">
        <span class="blue-span" @click="onUnionClick">生成组合</span>
        <span class="is-pink is-font-size-12">{{ErrMsg}}</span>
      </p>
      <draggable v-bind="dragOptions" v-model="UnionShowList" class="drag-wrap">
        <li v-for="(it, i) in UnionShowList" :key='JSON.stringify(it)'>
          <span :title="getItemText(it)">{{getItemText(it)}}</span>
          <div class="ctrl">
            <span class="del-btn" @click="onItemRemove(i)"><i></i> 删除</span>
            <div>
              <span v-show="i < UnionShowList.length - 1" @click="onMove('down', i)"><i class="el-icon-bottom"></i> 下移</span>
            </div>
            <div>
              <span v-show="i > 0" @click="onMove('up', i)"><i class="el-icon-top"></i> 上移</span>
            </div>
          </div>
        </li>
      </draggable>
    </template>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp.vue';
import draggable from 'vuedraggable';
import { TypeEnum } from '@/assets/js/TypeClass/ElementClass';

export default {
  components: {
    CommonDialogComp,
    draggable,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      checkList: [],
      ErrMsg: '',
      UnionShowList: [],
      dragOptions: {
        animation: 180,
        ghostClass: 'ghost',
        tag: 'ul',
      },
    };
  },
  computed: {
    UnionShowIDs() {
      const _list = [];
      if (this.UnionShowList && this.UnionShowList.length > 0) {
        this.UnionShowList.forEach(it => {
          _list.push(...it);
        });
      }
      return _list;
    },
  },
  methods: {
    onSubmit() {
      this.$emit('submit', this.UnionShowList);
    },
    onCancle() {
      this.$emit('update:visible', false);
    },
    onClosed() {
      this.UnionShowList = [];
      this.ErrMsg = '';
    },
    getCheckLabel({ Name, Type }) {
      let str = '';
      const t = TypeEnum.find(it => it.ID === Type);
      if (t) str = `（${t.label}）`;
      return `${Name}${str}`;
    },
    getItemText(arr) {
      if (!arr || arr.length === 0) return '';
      return arr.map(it => {
        const t = this.curData.ElementList.find(_it => _it.ID === it);
        return t ? t.Name : '';
      }).filter(it => it).join(' + ');
    },
    onUnionClick() {
      if (this.checkList.length === 0) this.ErrMsg = '请先选择元素';
      else {
        this.ErrMsg = '';
        this.UnionShowList.push(this.checkList);
        this.checkList = [];
      }
    },
    onItemRemove(i) {
      this.UnionShowList.splice(i, 1);
    },
    onMove(type, index) {
      const [item] = this.UnionShowList.splice(index, 1);
      const newIndex = type === 'up' ? index - 1 : index + 1;
      this.UnionShowList.splice(newIndex, 0, item);
    },
    onOpen() {
      this.UnionShowList = JSON.parse(JSON.stringify(this.curData.UnionShowList));
    },
  },
};
</script>
<style lang='scss'>
.mp-erp--material-type-union-show-dialog-comp-wrap {
  .el-dialog__body {
    padding-left: 50px;
    padding-right: 50px;
    color: #585858;
    min-height: 360px;
    max-height: 520px;
    overflow-y: auto;
    > .el-checkbox-group {
      .el-checkbox {
        width: 156px;
        padding-bottom: 10px;
        font-size: 12px;
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
          overflow: hidden;
          width: 132px;
          text-overflow: ellipsis;
          vertical-align: middle;
        }
      }
    }
    > p {
      &.title {
        position: relative;
        font-weight: 600;
        padding: 30px 13px;
        &::before {
          background-color: #26bcf9;
          height: 15px;
          width: 3px;
          content: '';
          position: absolute;
          left: 0;
        }
      }
      &.btn {
        display: flex;
        flex-direction: column;
        height: 40px;
        > .is-pink {
          margin-top: 10px;
        }
      }
    }
    > .drag-wrap {
      > li {
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 30px 0;
        height: 44px;
        box-sizing: border-box;
        > span {
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 350px;
        }
        > .ctrl {
          font-size: 12px;
          user-select: none;
          color: #A2A2A2;
          width: 180px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .del-btn {
            font-size: 12px;
            user-select: none;
            display: flex;
            align-items: center;
            > i {
              display: inline-block;
              width: 12px;
              height: 28px;
              vertical-align: top;
              margin-right: 6px;
              background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
            }
            cursor: pointer;
            transition: color 0.05s ease-in-out;
            &:hover {
              color: #444 !important;
            }
          }
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
        }
      }
    }
  }
  &.mp-erp-common-dialog-comp-wrap .el-dialog__footer > .dialog-footer {
    > button {
      height: 35px;
      border-radius: 3px;
      &.el-button--default {
        border-color: #26bcf9;
        color: #26bcf9;
        &:active {
          border-color: #428dfa;
        }
      }
      &.el-button--primary {
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
        &:hover {
          opacity: 0.88;
        }
        &:active {
          background: linear-gradient(to right, #428dfa, #26bcf9);
        }
      }
    }
  }
}

</style>
