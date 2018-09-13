<template>
  <div>
    <el-row>
      素材管理
    </el-row>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="图文消息" name="news">
        <news-list></news-list>
      </el-tab-pane>
      <el-tab-pane label="图片" name="image">
        <img-list></img-list>
      </el-tab-pane>
      <el-tab-pane label="语音" name="voice">
        <voice-list :activeName="activeName"></voice-list>
      </el-tab-pane>
      <el-tab-pane label="视频" name="video">
        <video-list></video-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mediaNewsList from "@/components/media/mediaNewsList";
import mediaImgList from "@/components/media/mediaImgList";
import mediaVideoList from "@/components/media/mediaVideoList";
import mediaVoiceList from "@/components/media/mediaVoiceList";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  components: {
    newsList:mediaNewsList,
    imgList: mediaImgList,
    videoList:mediaVideoList,
    voiceList:mediaVoiceList
  },
  data() {
    return {
      imageCount: 120,
      activeName: "news"
    };
  },
  mounted() {
    if (!this.adminInfo.ID) {
      if (localStorage.adminInfo) {
        this.saveAdminInfo(JSON.parse(localStorage.adminInfo));
      } else {
        this.$router.push('/login')
      }
    }
  },
  
  computed: {
    ...mapState(["adminInfo"])
  },
  methods: {
    ...mapMutations(["saveAdminInfo"]),
    handleClick(tab, event) {

    }
  }
};
</script>

<style scoped>

</style>