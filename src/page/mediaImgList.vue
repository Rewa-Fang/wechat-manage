<template>
  <div class="media-list">
    <el-row class="imgae-top">
      <el-col :span="12">
        <div class="image-count">图片(共{{ imageList.TotalCount }}条)</div>
      </el-col>
      <el-col :span="8" class="tips">
        <span>大小不超过2M，已关闭图片水印 </span>
        <el-tooltip effect="dark" content="不添加水印" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-col>
      <el-col :span="4" class="upload-btn">
        <el-row>
          <el-col :span="12">
            <el-upload :action="upLoadImgUrl" :data="upLoadImgData" :show-file-list="false" :on-success="upLoadSuccess" :before-upload="beforeAvatarUpload" :on-progress="uploadProgress">
              <el-button size="default" type="primary" :loading="btnLoading">上传图片</el-button>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-button size="default" type="success" @click="syncImage" :loading="btnLoading">同步图片</el-button>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
    <!-- <div>分组标签</div> -->
    <el-row class="delete-row">
      <el-col :span="12" class="del-row-left">
        <div>
          <input class="del-checkbox" type="checkbox" id="all-checked" v-model="isAllChecked" @change="allChecked">
          <label for="all-checked" style="margin:0"></label>
          <span>已选择{{ checkedImageArr.length }}项内容</span>
        </div>
      </el-col>
      <el-col :span="12" class="del-row-right">
        <el-button type="danger" class="el-icon-delete" circle @click="deleteImg" :disabled="delBtnDisabled"></el-button>
      </el-col>
    </el-row>
    <el-row class="img-list">
      <el-col :lg="4" :md="6" :sm="8" class="card-item" v-for="(item,index) in imageList.List" :key="item.ID">
        <div class="item-img" :class="{'item-img-bg':checkedStyleArr[index]}">
          <img :src="baseImgPath+imageList.Path+'/'+item.FileRealName" alt="">
        </div>
        <div class="card-title">{{ item.FileName }}</div>
        <div class="chckedBox-menu" :class="{'chckedBox-menu-block':checkedStyleArr[index]}">
          <input class="del-checkbox" type="checkbox" :id="item.ID" :value="item.ID" v-model="checkedImageArr" @change="changeChecked(index)">
          <label :for="item.ID"></label>
        </div>
      </el-col>
    </el-row>
    <my-pagination :pagiConfig="pagiConfig" @changePage="changePage"></my-pagination>
  </div>
</template>

<script>
import { postActionHandler } from "@/api/getData";
import synchronize from "@/api/synchronize";
import { baseImgPath, baseUrl } from "@/config/env";
import pagination from "@/components/pagination";
export default {
  components: {
    myPagination: pagination
  },
  data() {
    return {
      baseImgPath,
      baseUrl,
      userInfo: {},
      imageList: {},
      pagiConfig: {
        pageSize: 15,
        pagerCount: 7,
        total: 1000
      },
      upLoadImgUrl: baseUrl + "/ActionHandler.ashx",
      upLoadImgData: {
        Act: "Material_Add",
        Param:
          "{'Type':1, 'Title': 'image upload', 'Introduction': 'image upload'}",
        Verification: ""
      },
      // 设置获取列表的素材类型及分页设置
      pageParam: {
        Type: 1,
        PageSize: 15,
        PageNumber: 1
      },
      isAllChecked: false,
      delBtnDisabled: true,
      checkedStyleArr: [],
      checkedImageArr: [],
      btnLoading: false
    };
  },
  watch: {
    checkedImageArr(val) {
      // this.delBtnDisabled = val.length > 0 ? false : true;
      if (val.length > 0) {
        this.delBtnDisabled = false;
      } else {
        this.delBtnDisabled = true;
        this.isAllChecked = false;
      }
    }
  },
  created() {
    if (localStorage.adminInfo) {
      this.userInfo = JSON.parse(localStorage.adminInfo);
      this.upLoadImgData.Verification = JSON.stringify({
        UserID: this.userInfo.ID,
        Token: this.userInfo.Token
      });
      this.getImageList();
      this.getCount();
    } else {
      this.$router.push("/login");
    }
  },
  computed: {},
  methods: {
    changePage(currentPage) {
      console.log(currentPage);
    },
    upLoadSuccess(res, file) {
      if (res.Result) {
        Object.defineProperty(res.Data, "FileName", {
          value: file.name
        });
        this.imageList.List.unshift(res.Data);
      } else {
        this.$message.error("上传失败，请稍后重试!");
      }
      this.btnLoading = false;
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
        postData.append("Act", "Material_GetList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.upLoadImgData.Verification);
        let response = await postActionHandler(postData);
        if (response.Result) {
          console.log(response);
          this.imageList = response.Data;
          // this.imageList.List.reverse();
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
    deleteImg() {
      this.$confirm("此操作将永久删除该图片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.checkedImageArr.length > 0) {
            this.checkedImageArr.forEach(img => {
              let postData = new FormData();
              postData.append("Act", "Material_Del");
              postData.append("Verification", this.upLoadImgData.Verification);
              postData.append(
                "Param",
                JSON.stringify({
                  ID: Number(img)
                })
              );
              console.log(postData);

              this.deleteImgById(postData);
            });
          } else {
            this.$message({
              type: "info",
              message: "请选择至少一张图片"
            });
          }
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    async deleteImgById(postData) {
      console.log(postData);
      try {
        let res = await postActionHandler(postData);
        console.log(res);
        if (res.Result) {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.imageList.List.forEach((img, index) => {
            if (this.checkedImageArr.includes(img.ID)) {
              this.imageList.List.splice(index, 1);
            }
          });
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
    changeChecked(index) {
      this.checkedStyleArr[index] = !this.checkedStyleArr[index];
    },
    allChecked() {
      if (this.isAllChecked) {
        this.imageList.List.forEach((img, index) => {
          this.checkedImageArr[index] = img.ID;
        });
        this.checkedImageArr = [...this.checkedImageArr];
        this.checkedStyleArr = this.checkedImageArr;
        // console.log(this.checkedImageArr);
        // this.delBtnDisabled = false;
      } else {
        this.checkedStyleArr = [];
        this.checkedImageArr = [];
        // this.delBtnDisabled = true;
      }
    },
    async syncImage() {
      this.btnLoading = true;
      try {
        let response = await synchronize(
          this.upLoadImgData.Verification,
          this.pageParam.Type
        );
        console.log(response);
        if (response.Result) {
          console.log("########OK#########");
        } else {
          console.log("########OK#########");
        }
        this.getImageList();
        this.btnLoading = false;
      } catch (error) {
        console.log("########error#########" + error);
        this.btnLoading = false;
      }
    },
    uploadProgress() {
      this.btnLoading = true;
    },
    async getCount() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetCountWX");
        postData.append("Param", "{}");
        postData.append("Verification", this.upLoadImgData.Verification);
        let response = await postActionHandler(postData);
        if(response.Result){
          this.pagiConfig.total = this.imageList.TotalCount;
          console.log(response)
        }
      } catch (error) {

      }
    }
  }
};
</script>

<style scoped>
.media-list {
  padding: 2%;
}
.imgae-top {
  line-height: 36px;
  padding: 2% 0;
}
.img-list {
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
.card-item {
  position: relative;
  margin: 0 20px 20px 0;
  height: 200px;
}
.item-img {
  width: 100%;
  height: 160px;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.item-img img {
  width: 100%;
  height: auto;
}
.card-title {
  text-align: center;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  overflow-wrap: normal;
  text-overflow: ellipsis;
}
.chckedBox-menu {
  position: absolute;
  top: 0;
  left: 0;
  height: 30px;
  width: 100%;
  display: none;
}
.card-item:hover .chckedBox-menu {
  display: block;
}
.card-item:hover .item-img {
  background-color: #eaffea;
}
.item-img-bg {
  background-color: #eaffea;
}
.chckedBox-menu-block {
  display: block;
}
/* .del-checkbox {
  width: 10%;
  height: 20px;
  background-color: blue;
} */
.del-checkbox {
  display: none;
}
.del-checkbox + label {
  display: inline-block;
}
.del-checkbox + label::before {
  content: "";
  display: block;
  width: 20px;
  height: 20px;
  margin: 5px;
  background-clip: content-box;
  background-color: #ccc;
  border: 1px solid #fff;
  text-align: center;
  border-radius: 2px;
}
.del-checkbox:checked + label::before {
  background-color: #409eff;
  content: "\2714";
  color: #ffffff;
}
.delete-row {
  background-color: #f6f8f9;
  padding: 16px;
}
.del-row-left div {
  display: flex;
  align-items: center;
}
.del-row-right {
  text-align: right;
  color: #eaffea;
}
</style>
