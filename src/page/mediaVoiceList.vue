<template>
  <div>
    <el-row class="imgae-top">
      <el-col :span="20">
        <div class="image-count">语音(共{{ imageList.total_count }}条)</div>
      </el-col>
      <el-col :span="4" class="upload-btn">
        <el-upload class="upload-demo" :action="upLoadImgUrl" :data="upLoadImgData" :show-file-list="false" :on-success="upLoadSuccess" :before-upload="beforeAvatarUpload">
          <el-button size="default" type="primary">添加语音</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <!-- <div>分组标签</div> -->
    <el-row class="img-list">
      <el-table :data="imageList.item" style="width: 100%" :row-style="rowStyle">
        <el-table-column label="名称">
          <template slot-scope="scope">
            <div class="vieio-tab-name">
              <img class="video-img" :src="scope.row.url" alt="">
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template slot-scope="scope">
            <span>{{ scope.row.update_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import { getMaterialList } from "@/api/getData";
export default {
  data() {
    return {
      userInfo: {},
      rowStyle: {
        height:'130px'
      },
      imageList: {
        total_count: 5,
        item_count: 5,
        item: [
          {
            media_id: "1",
            name: "111.jpg",
            update_time: "20180808",
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/ibprMm6WQqM1nroxn0R9t3WIwNPqpVjNoq7VhhroIrz53rdSHj2XqgTrsR7oCDmtqjrmQicUIoxY9icibGUg4HZatg/0"
          },
          {
            media_id: "2",
            name: "222.jpg",
            update_time: "20180809",
            url:
              "https://mmbiz.qpic.cn/mmbiz_jpg/Sl5K19wIuIRbV8SJYfTCO7RribQxjcvzmaarTtgPxjPHcsdiauj7CrnsmUcrNkzYWd9feUicZvu7bFmRq63WJ5JDw/0?wx_fmt=jpeg"
          },
          {
            media_id: "3",
            name: "333.jpg",
            update_time: "20180808",
            url:
              "https://mmbiz.qpic.cn/mmbiz_jpg/Sl5K19wIuIRbV8SJYfTCO7RribQxjcvzmaarTtgPxjPHcsdiauj7CrnsmUcrNkzYWd9feUicZvu7bFmRq63WJ5JDw/0?wx_fmt=jpeg"
          },
          {
            media_id: "4",
            name: "444.jpg",
            update_time: "20180808",
            url:
              "https://mmbiz.qpic.cn/mmbiz_jpg/Sl5K19wIuIRbV8SJYfTCO7RribQxjcvzmaarTtgPxjPHcsdiauj7CrnsmUcrNkzYWd9feUicZvu7bFmRq63WJ5JDw/0?wx_fmt=jpeg"
          },
          {
            media_id: "5",
            name: "555.jpg",
            update_time: "20180808",
            url:
              "https://mmbiz.qpic.cn/mmbiz_jpg/Sl5K19wIuIRbV8SJYfTCO7RribQxjcvzmaarTtgPxjPHcsdiauj7CrnsmUcrNkzYWd9feUicZvu7bFmRq63WJ5JDw/0?wx_fmt=jpeg"
          }
        ]
      },
      upLoadImgUrl: "http://wechat.a2designing.cn/Handlers/ActionHandler.ashx",
      upLoadImgData: {
        Act: "Material_Add",
        Param: "{'type':'image'}",
        Verification: ""
      },
      // 设置获取列表的素材类型及分页设置
      pageParam: {
        type: "image",
        offset: 0,
        count: 20
      }
    };
  },
  created() {
    if (localStorage.adminInfo) {
      this.userInfo = JSON.parse(localStorage.adminInfo);
      this.upLoadImgData.Verification = JSON.stringify({
        UserID: this.userInfo.ID,
        Token: this.userInfo.Token
      });
      // this.getImageList();
    } else {
      this.$router.push("/login");
    }
  },
  computed: {},
  methods: {
    upLoadSuccess(res, file) {
      if (res.Result) {
        Object.defineProperty(res.Data, "name", {
          value: file.name
        });
        this.imageList.item.push(res.Data);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "image/gif" ||
        file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 bmp/png/jpeg/jpg/gif 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    async getImageList() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetMaterialList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.upLoadImgData.Verification);
        let response = await getMaterialList(postData);
        if (response.Result) {
          this.imageList = response.Data;
        } else {
          console.log(response);
          this.$message({
            type: "error",
            message: response.Msg
          });
          if (response.Code == "User000012") {
            localStorage.removeItem("adminInfo");
            this.$router.push("/");
          }
        }
      } catch (error) {
        console.log(error);
        this.$message({
          type: "error",
          message: error
        });
      }
    }
  }
};
</script>

<style scoped>
.imgae-top {
  line-height: 36px;
  padding: 2%;
}
.img-list {
  padding: 2%;
}
.vieio-tab-name {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.video-img {
  width: 160px;
  height: 90px;
}
</style>