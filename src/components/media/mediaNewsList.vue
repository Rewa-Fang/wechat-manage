<template>
  <div class="media-list">
    <media-header :mediaConfig="mediaConfig" @uploadSuccess="uploadSuccess" @syncSuccess="syncSuccess"></media-header>
    <!-- <div>分组标签</div> -->

    <!-- image list -->
    <el-row class="img-list media-list4" type="flex">
      <el-col class="card-item" v-for="(item,index) in newsList.List" :key="item.ID">
        <div class="card-title">{{ item.Title }}</div>
        <div class="item-img">
          <img :src="item.Articles[0].thumb_url" alt="">
          <div class="preview-news">
            <span @click="previewNews(item.Articles[0].url)">预览文章</span>
          </div>
        </div>
        <div class="card-digest">{{ item.Articles[0].digest }}</div>
        <div class="card-action">
          <div class="card-update">更新于{{ item.UpdatedDate | dateFormatString }}</div>
          <div class="button-menu">
            <el-button type="default" plain class="el-icon-edit" title="编辑" @click="editNews(item)"></el-button>
            <el-button type="danger" plain class="el-icon-delete" title="删除" @click="deleteNews(index,item.ID)"></el-button>
          </div>
          <div style="clear:both;"></div>
        </div>
      </el-col>
    </el-row>
    <!-- if image list is null -->
    <div class="data-null" v-if="mediaConfig.totalCount <= 0">
      <i class="el-icon-warning"></i>本地没有图文信息，您可以添加或同步图文
    </div>
    <!-- pagination -->
    <my-pagination :pagiConfig="mediaConfig" @changePage="changePage" v-if="mediaConfig.totalCount > 0"></my-pagination>
  </div>
</template>

<script>
import { postActionHandler } from "@/api/getData";
import dateFormat from "@/filters/dateFormat";
import { baseImgPath, wxImageUrl } from "@/config/env";
import pagination from "./pagination";
import header from "./header";
export default {
  components: {
    myPagination: pagination,
    mediaHeader: header
  },
  data() {
    return {
      mediaConfig: {
        type: 4,
        pageSize: 10,
        pagerCount: 7,
        verification: "",
        totalCount: 0, // 本地服务器素材总数
        wxTotalCount: 0 // 微信服务器素材总数
      },
      baseImgPath,
      wxImageUrl,
      userInfo: {},
      newsList: {},
      // 设置获取列表的素材类型及分页设置
      pageParam: {
        PageSize: 12,
        PageNumber: 0
      },
      isAllChecked: false,
      delBtnDisabled: true,
      checkedStyleArr: [],
      checkedImageArr: [],
      btnLoading: false
    };
  },
  filters: {
    dateFormatString(timestamp) {
      return dateFormat(timestamp);
    }
  },
  created() {
    if (localStorage.adminInfo) {
      this.userInfo = JSON.parse(localStorage.adminInfo);
      this.mediaConfig.verification = JSON.stringify({
        UserID: this.userInfo.ID,
        Token: this.userInfo.Token
      });
      this.getNewsList();
      this.getCount();
    } else {
      this.$router.push("/login");
    }
  },
  computed: {},
  methods: {
    editNews(item){
      this.$router.push({
        name:'EditNews',
        params:{news:item}
      });
    },
    previewNews(url) {
      window.open(url);
    },
    changePage(currentPage) {
      this.pageParam.PageNumber = currentPage;
      this.getNewsList();
    },
    async getNewsList() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetNewsList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.mediaConfig.verification);
        let response = await postActionHandler(postData);
        if (response.Result) {
          console.log(response);
          this.newsList = response.Data;
          this.mediaConfig.totalCount = response.Data.TotalCount;
        } else {
          console.log(response);
          this.$message({
            type: "error",
            message: response.Msg
          });
          if (response.Code == "User000012" || response.Code == "User000014") {
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
    },
    deleteNews(index, ID) {
      this.$confirm("此操作将永久删除该图文, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
      .then(() => {
        let postData = new FormData();
        postData.append("Act", "Material_Del");
        postData.append("Verification", this.mediaConfig.verification);
        postData.append(
          "Param",
          JSON.stringify({
            ID: Number(ID),
            OnlyLocal: true
          })
        );
        console.log(postData);
        this.deleteNewsById(postData);
      })
      .catch(() => {
        // this.$message({
        //   type: "info",
        //   message: "已取消删除"
        // });
      });
    },
    async deleteNewsById(postData) {
      console.log(postData);
      try {
        let res = await postActionHandler(postData);
        console.log(res);
        if (res.Result) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });

          this.newsList.List.splice(index, 1);
          this.mediaConfig.totalCount--;
          // this.getNewsList();
        } else {
          this.$message({
            type: "error",
            message: "删除失败!" + res.Msg
          });
        }
      } catch (error) {
        this.$message({
          type: "error",
          message: "删除错误!" + error
        });
      }
    },
    syncSuccess(response) {
      if (response) {
        this.getNewsList();
        this.getCount();
      }
    },
    async getCount() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetCountWX");
        postData.append("Param", "{}");
        postData.append("Verification", this.mediaConfig.verification);
        let response = await postActionHandler(postData);
        if (response.Result) {
          this.mediaConfig.wxTotalCount = response.Data.news_count;
        }
      } catch (error) {
        console.log(error);
      }
    },
    uploadSuccess(data) {
      this.newsList.List.unshift(data);
      if (this.newsList.List.length > this.pageParam.PageSize) {
        this.newsList.List.pop();
      }
      this.mediaConfig.totalCount++;
    }
  }
};
</script>

<style scoped>
.media-list {
  padding: 2%;
}
.img-list {
  padding: 2% 0;
  flex-wrap: wrap;
}
.data-null {
  text-align: center;
  margin-top: 100px;
}
.card-item {
  flex: 0 0 26%;
  position: relative;
  margin: 0 15px 20px 0;
  /* height: 280px; */
  background-color: #f3f5f9;
  padding: 10px;
  border-radius: 5px;
}
.item-img {
  width: 100%;
  height: 160px;
  overflow: hidden;
  display: flex;
  align-items: center;
  position: relative;
}
.item-img img {
  width: 100%;
  height: auto;
}
.preview-news {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 160px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 14px;
  display: none;
}
.card-item:hover .preview-news {
  display: block;
}
.preview-news span {
  cursor: pointer;
}
.card-title {
  /* text-align: center; */
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  overflow-wrap: normal;
  text-overflow: ellipsis;
}
.card-digest {
  font-size: 14px;
  padding: 10px 0;
  color: #9a9a9a;
}
.card-action {
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: #9a9a9a;
}
.card-update {
  float: left;
  width: 50%;
}
.button-menu {
  float: left;
  width: 50%;
  display: none;
  text-align: right;
}
.button-menu button {
  background: none;
  padding: 0;
  color: #9a9a9a;
  border: 0;
  font-size: 18px;
}
.button-menu button:hover {
  background: none;
}
.card-item:hover .button-menu {
  display: block;
}
</style>
