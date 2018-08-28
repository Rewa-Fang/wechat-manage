<template>
  <div>
    <div class="edit_container">
      <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @ready="onEditorReady($event)">
      </quill-editor>
    </div>
    <div class="submit_btn">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";

export default {
  props: ["news"],
  data() {
    return {
      content: "<h3>文本编辑</h3>",
      editorOption: {}
    };
  },
  created() {
    console.log(this.news);
    if (this.news) {
      this.content = this.news.Articles[0].content;
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  components: {
    quillEditor
  },
  methods: {
    onEditorReady(editor) {
      console.log("editor ready!", editor);
    },
    submit() {
      console.log(this.content);
      this.$message.success("提交成功！");
    }
  }
};
</script>

<style scoped>
</style>
