<template>
  <div>
    <el-row class="imgae-top">
      <el-col :xs="6" :sm="6" :md="4" :lg="8" :xl="12">
        <div class="image-count">{{ mediaType }}(共{{ mediaConfig.totalCount }}条)</div>
      </el-col>
      <el-col :xs="10" :sm="10" :md="12" :lg="11" :xl="8" class="tips">
        <span>{{ tipsText }} </span>
        <el-tooltip effect="dark" content="不添加水印" placement="top-start" v-if="mediaConfig.type==1">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="5" :xl="4" class="upload-btn">
        <el-row>
          <el-col :span="12">
            <el-upload :action="upLoadUrl" :data="upLoadData" :show-file-list="false" :on-success="upLoadSuccess" :before-upload="beforeAvatarUpload" :on-progress="uploadProgress">
              <el-button size="default" type="primary" :loading="btnLoading">添加{{ mediaType }}</el-button>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-button size="default" type="success" @click="syncImage" :loading="btnLoading">同步{{ mediaType }}</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { baseUrl } from "@/config/env";
import synchronize from "@/api/synchronize";
import { checkedMediaType, checkedMediaSize, typeMsg, sizeMsg } from "@/config/mediaType";
export default {
  props: ["mediaConfig"],
  data() {
    return {
      baseUrl,
      mediaType: "",
      tipsText: "",
      // mediaConfig: {
      //   type: 1,
      //   totalCount: 100
      // },
      upLoadUrl: baseUrl + "/ActionHandler.ashx",
      upLoadData: {
        Act: "Material_Add",
        Param: {
          Type: 1,
          Title: "test upload",
          Introduction: "test upload"
        },
        Verification: ""
      },
      btnLoading: false,
      loadingInstance:{}
    };
  },
  created() {
    if (this.mediaConfig.verification) {
      this.upLoadData.Verification = this.mediaConfig.verification;
      this.upLoadData.Param.Type = this.mediaConfig.type;
      switch (this.mediaConfig.type) {
        case 1:
          this.mediaType = "图片";
          this.tipsText = "大小不超过2M，已关闭图片水印";
          break;
        case 2:
          this.mediaType = "语音";
          this.tipsText = "格式mp3/wma/wav/amr，大小不超过2M，时长不超过60秒";
          break;
        case 3:
          this.mediaType = "视频";
          this.tipsText = "格式支持mp4，文件大小不超过10M";
          break;
        default:
          break;
      }
    }
    // 上传前将参数字符串化 后台只接受 Param 为string类型
    this.upLoadData.Param = JSON.stringify(this.upLoadData.Param);
  },
  methods: {
    upLoadSuccess(res, file) {
      if (res.Result) {
        Object.defineProperty(res.Data, "FileName", {
          value: file.name
        });
        console.log(res);
        this.$emit("uploadSuccess", res.Data);
        // this.imageList.List.unshift(res.Data);
        this.$message.success("添加成功");
      } else {
        this.$message.error("上传失败，请稍后重试!");
      }
      this.btnLoading = false;
      this.loadingInstance.close();
    },
    upLoadError(err, file) {
      console.log(err);
      this.btnLoading = false;
    },
    beforeAvatarUpload(file) {
      this.loadingInstance = this.$loading({
        target:'.media-list'+this.mediaConfig.type,
        text:'正在上传...'
      });
      const isType = checkedMediaType(this.mediaConfig.type, file.type);
      const isSize = checkedMediaSize(this.mediaConfig.type, file.size);

      if (!isType) {
        this.$message.error(typeMsg[this.mediaConfig.type]);
      }else if (!isSize) {
        this.$message.error(sizeMsg[this.mediaConfig.type]);
      }
      return isType && isSize;
    },
    uploadProgress() {
      this.btnLoading = true;
    },
    syncImage() {

      this.$confirm(
        `此操作将同步${this.mediaConfig.wxTotalCount}条素材, 是否继续?`,
        "提示",
        {
          confirmButtonText: "同步",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          try {
            this.btnLoading = true;
            let response = await synchronize(this.mediaConfig, this);
            if (response) {
              // this.$message.success("同步成功");
            } else {
              this.$message.error(`同步失败，${response.Msg}`);
            }
            this.$emit("syncSuccess", response);
            this.btnLoading = false;
          } catch (error) {
            console.log(error);
            this.$message.error(`同步出错，${error}`);
            this.btnLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
.imgae-top {
  line-height: 36px;
  padding: 2% 0;
}
.tips {
  font-size: 14px;
  text-align: right;
  padding-right: 1%;
}
.image-count {
  font-size: 20px;
}
.upload-btn {
  text-align: right;
}
</style>