<template>
  <div v-if="isShow" class="order-del-pop-wrap">
    <div class="mask" @click.self="onCancel" >
      <!-- 该组件未使用，作废 -->
      <section>
        <header>
            <img src="@/assets/images/warn.png" alt="">
            <span class="title">{{title}}</span>
            <i @click="onCancel"></i>
        </header>
        <div class="content">
            <span>{{content}}</span>
        </div>
        <footer>
          <normalBtnFull title="确定" @click.native="onSubmit" />
          <normalBtn title="取消" @click.native="onCancel" />
        </footer>
      </section>
    </div>
    <!-- <DelPopup
      @onDel='setIsDelPopShowFalse'                  --- 该组件调用方式
      @onSubmit='delTargetOrder'
      :isShow="isDelPopShow"
      title="确定取消此订单吗 ?"
      :content="orderDelContent"  /> -->
  </div>
</template>

<script>
import normalBtn from '@/components/common/normalBtn.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';

export default {
  props: {
    title: {
      type: String,
      default: '标题',
    },
    content: {
      type: String,
      default: 'content',
    },
    isShow: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    normalBtn,
    normalBtnFull,
  },
  methods: {
    onSubmit() {
      this.$emit('onSubmit');
    },
    onCancel() {
    //  console.log('点击了取消按钮');
      this.$emit('onDel');
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.order-del-pop-wrap {
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba($color: #000000, $alpha: 0.25);
    z-index: 999;
    display: flex;
    text-align: center;
    section {
      width: 350px;
      height: 200px;
      background-color: #fff;
      margin: 200px auto 0;
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      padding: 35px 0 25px 0;
      justify-content: space-between;
      box-sizing: border-box;
      position: relative;
      header {
        > span {
            line-height: 38px;
            margin-left: 20px;
            font-size: 16px;
            font-weight: 600;
            color: $--color-text-regular;
        }
        > img {
            vertical-align: -70%;
        }
        > i {
            position: absolute;
            width: 11px;
            height: 11px;
            background: url('../../../assets/images/close.png') center no-repeat;
            background-size: 100% 100%;
            right: 15px;
            top: 10px;
            cursor: pointer;
        }
      }
      .content{
          font-size: 12px;
          color: $--color-text-regular;
          flex: 1;
          padding-top: 15px;
      }
      footer{
          > button {
            margin-left: 0;
            height: 30px;
            width: 100px;
            font-size: 14px;
            border-radius: 2px;
          }
          button + button{
            margin-left: 35px;
          }
      }
    }
  }
}
</style>
