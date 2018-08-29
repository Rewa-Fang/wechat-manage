<template>
  <div>
    <div class="news-container">
      <div class="news-info">
        <el-form :label-position="labelPosition" label-width="80px" :model="newsArticles">
          <el-form-item label="标题">
            <el-input v-model="newsArticles.title"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="newsArticles.author" class="author-input"></el-input>
          </el-form-item>
          <el-form-item label="摘要">
            <el-input v-model="newsArticles.digest" :rows="3" resize="none" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="edit-container">
        <quill-editor v-model="newsArticles.content" ref="myQuillEditor" :options="editorOption" @ready="onEditorReady($event)">
        </quill-editor>
      </div>
      <div class="submit-btn">
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
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
      editorOption: {},
      labelPosition: "right",
      newsArticles: {
        title: "",
        author: "",
        digest: "",
        content: ""
      }
    };
  },
  created() {
    console.log(this.news);
    if (this.news) {
      // this.content = this.news.Articles[0].content;
      this.newsArticles = this.news.Articles[0];
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
.news-container{
  width: 70%;
}
.author-input{
  width: 35%;
}
</style>
