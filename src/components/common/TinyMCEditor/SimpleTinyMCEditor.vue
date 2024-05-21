<template>
  <section style="font-size: 14px" ref="TynyMCEditor"></section>
</template>

<script setup lang="ts">
/* eslint-disable max-len */
import tinymce from 'tinymce/tinymce.js';
import 'tinymce/themes/silver/theme.js';
import 'tinymce/icons/default/icons.min.js';
import 'tinymce/plugins/preview/plugin.min.js';
import 'tinymce/plugins/advlist/plugin.min.js';
import 'tinymce/plugins/anchor/plugin.min.js';
import 'tinymce/plugins/autoresize/plugin.min.js';
import 'tinymce/plugins/image/plugin.min.js';
import 'tinymce/plugins/link/plugin.min.js';
import 'tinymce/plugins/media/plugin.min.js';
import 'tinymce/plugins/paste/plugin.min.js';
import 'tinymce/plugins/autolink/plugin.min.js';
import 'tinymce/plugins/lists/plugin.min.js';
import 'tinymce/plugins/charmap/plugin.min.js';
import 'tinymce/plugins/searchreplace/plugin.min.js';
import 'tinymce/plugins/visualblocks/plugin.min.js';
import 'tinymce/plugins/code/plugin.min.js';
import 'tinymce/plugins/fullscreen/plugin.min.js';
import 'tinymce/plugins/insertdatetime/plugin.min.js';
import 'tinymce/plugins/table/plugin.min.js';
import 'tinymce/plugins/help/plugin.min.js';
import 'tinymce/plugins/print/plugin.min.js';
import 'tinymce/plugins/wordcount/plugin.min.js';
import 'tinymce/plugins/importcss/plugin.min.js';
import 'tinymce/plugins/autosave/plugin.min.js';
import 'tinymce/plugins/save/plugin.min.js';
import 'tinymce/plugins/directionality/plugin.min.js';
import 'tinymce/plugins/visualchars/plugin.min.js';
// import 'tinymce/plugins/template/plugin.min.js';
import 'tinymce/plugins/codesample/plugin.min.js';
import 'tinymce/plugins/hr/plugin.min.js';
import 'tinymce/plugins/pagebreak/plugin.min.js';
import 'tinymce/plugins/nonbreaking/plugin.min.js';
import 'tinymce/plugins/toc/plugin.min.js';
import 'tinymce/plugins/imagetools/plugin.min.js';
import 'tinymce/plugins/textpattern/plugin.min.js';
import 'tinymce/plugins/noneditable/plugin.min.js';
import 'tinymce/plugins/quickbars/plugin.min.js';
// import 'tinymce/plugins/emoticons/plugin.js';
import {
  onBeforeUnmount, onMounted, ref,
} from 'vue';

const props = defineProps<{
  modelValue: string,
  h?: number,
}>();

const emit = defineEmits(['update:modelValue']);

const TynyMCEditor = ref(null);

const publicPath = process.env.NODE_ENV === 'development' ? '' : '/Web';

const initEditor = () => { // 富文本编辑器初始化
  if (!TynyMCEditor.value) return;
  tinymce.init({
    target: TynyMCEditor.value,
    language: 'zh_CN',
    language_url: `${publicPath}/tinymce/langs/zh_CN.js`,
    skin_url: `${publicPath}/tinymce/skins/ui/oxide`,
    content_css: `${publicPath}/tinymce/skins/content/default/content.css`,
    menubar: false,
    placeholder: '请在此输入内容...',
    toolbarSticky: false,
    image_title: true,
    file_picker_types: 'file image media',
    image_advtab: true,
    image_description: false,
    height: props.h || '100%',
    image_caption: false,
    branding: false,
    convert_urls: false,
    toolbar_mode: 'wrap',
    base_url: '/',
    lineheight_formats: '1 1.1 1.2 1.3 1.4 1.5 2 2.4 2.8',
    fontsize_formats: '12px 13px 14px 15px 16px 18px 24px 28px 36px 48px 64px 72px',
    font_formats: `微软雅黑=Microsoft-YaHei; 宋体=SimSun; 黑体=SimHei; 仿宋=FangSong; 楷体=KaiTi; Andale Mono=andale mono,times; 
        Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; 
        Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; 
        Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; 
        Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; 
        Webdings=webdings; Wingdings=wingdings,zapf dingbats`,

    quickbars_selection_toolbar: 'bold italic forecolor backcolor | quicklink h2 h3 blockquote quicktable lineheight',
    media_poster: false,
    default_link_target: '_blank',
    video_template_callback(data: { width: string; height: string; poster?: string; source: string; }) {
      return `<video width="${data.width}" height="${data.height}"${data.poster ? ` poster="${data.poster}"` : ''} controls="controls" src="${data.source}"></video>`;
    },
    // toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent pagebreak lineheight blockquote |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | | charmap  | fullscreen  preview | insertfile image media pageembed link anchor codesample | a11ycheck ltr rtl | showcomments addcomment toc',
    toolbar: 'bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter | link',
    plugins: `print preview paste importcss searchreplace autolink autosave 
         directionality code visualblocks visualchars fullscreen image link media codesample
          table charmap hr anchor toc insertdatetime advlist lists wordcount
          nonbreaking pagebreak textpattern noneditable help quickbars`,
    // 监听 tinymec 初始化完成事件
    setup: (editor) => {
      editor.on('init', () => {
        editor.setContent(props.modelValue ? props.modelValue : '');
      });
    },
    toc_depth: 6,
    quickbars_insert_toolbar: false,
    // 监听 input 和 change 事件，实时更新 value
    init_instance_callback: (editor) => {
      editor.on('input', (e) => {
        const _content = e.target.innerHTML;
        emit('update:modelValue', _content);
      });
      editor.on('change', (e) => {
        if (e.level.type === 'complete') {
          const _content = e.level.content;
          emit('update:modelValue', _content);
        }
      });
      editor.on('blur', () => {
        const _content = editor.getContent();
        emit('update:modelValue', _content);
      });
    },
  });
};

onMounted(() => {
  initEditor();
});

onBeforeUnmount(() => {
  tinymce.remove();
});
</script>

<style lang="scss">
.tox-tinymce-aux {
  z-index: 8888 !important;
}
</style>
