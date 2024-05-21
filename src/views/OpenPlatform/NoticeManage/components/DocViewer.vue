<template>
  <div class="rich-edit-content mce-content-body" v-html="Content"></div>
</template>

<script setup lang='ts'>
defineProps<{
  Content: string
}>();
</script>

<style lang='scss'>
@import '@/assets/css/tinymce.content.default.scss';
@import '@/assets/css/tinymce.content.scss';

.rich-edit-content {
  color: #000000;
  font-size: 14px;
  padding: 20px;
  background-color: #fafafa;

  /* font
-------------------------*/
  .ql-font-SimSun {
    font-family: "SimSun";
  }
  .ql-font-SimHei {
    font-family: "SimHei";
  }
  .ql-font-Microsoft-YaHei {
    font-family: "Microsoft YaHei";
  }
  .ql-font-KaiTi {
    font-family: "KaiTi";
  }
  .ql-font-FangSong {
    font-family: "FangSong";
  }
  .ql-font-Arial {
    font-family: "Arial";
  }
  .ql-font-Times-New-Roman {
    font-family: "Times New Roman";
  }
  .ql-font-sans-serif {
    font-family: "sans-serif";
  }

  /* 部分标签样式初始化
----------------------*/
  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  s {
    text-decoration: line-through;
  }

  sub {
    vertical-align: sub;
    font-size: smaller;
  }

  sup {
    vertical-align: super;
    font-size: smaller;
  }

  h1 {
    font-size: 2em;
    font-weight: bold;
  }
  h2 {
    font-size: 1.5em;
    font-weight: bold;
  }
  h3 {
    font-size: 1.17em;
    font-weight: bold;
  }
  h4 {
    font-size: 1em;
    font-weight: bold;
  }
  h5 {
    font-size: 0.83em;
    font-weight: bold;
  }
  h6 {
    font-size: 0.67em;
    font-weight: bold;
  }

  img {
    max-width: 100%;
    object-fit: cover;
    height: auto;
  }

  a {
    color: #0000ee;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
      color: #0000ee;
      opacity: 0.88;
    }
    &:active {
      opacity: 1;
    }
  }
}
</style>
