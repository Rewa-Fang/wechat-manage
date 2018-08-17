<template>
  <div class="media-list">
    <media-header :mediaConfig="mediaConfig" @uploadSuccess="uploadSuccess" @syncSuccess="syncSuccess"></media-header>
    <!-- <div>分组标签</div> -->
    <el-row class="delete-row" v-show="!delBtnDisabled">
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

    <div class="data-null" v-if="mediaConfig.totalCount <= 0">
      <i class="el-icon-warning"></i>本地没有图片素材，您可以添加或同步素材
    </div>
    <my-pagination :pagiConfig="mediaConfig" @changePage="changePage" v-if="mediaConfig.totalCount > 0"></my-pagination>
  </div>
</template>

<script>
import { postActionHandler } from "@/api/getData";
import { baseImgPath } from "@/config/env";
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
        type: 1,
        pageSize: 15,
        pagerCount: 7,
        verification: "",
        totalCount: 0, // 本地服务器素材总数
        wxTotalCount: 0 // 微信服务器素材总数
      },
      baseImgPath,
      userInfo: {},
      imageList: {},
      Verification: "",
      // 设置获取列表的素材类型及分页设置
      pageParam: {
        Type: 1,
        PageSize: 15,
        PageNumber: 0
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
      this.mediaConfig.verification = JSON.stringify({
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
      this.pageParam.PageNumber = currentPage;
      this.getImageList();
    },
    async getImageList() {
      try {
        let postData = new FormData();
        postData.append("Act", "Material_GetList");
        postData.append("Param", JSON.stringify(this.pageParam));
        postData.append("Verification", this.mediaConfig.verification);
        let response = await postActionHandler(postData);
        if (response.Result) {
          console.log(response);
          this.imageList = response.Data;
          this.imageList.List.reverse();
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
              postData.append("Verification", this.mediaConfig.verification);
              postData.append(
                "Param",
                JSON.stringify({
                  ID: Number(img),
                  OnlyLocal: true
                })
              );
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
              this.checkedImageArr.splice(
                this.checkedImageArr.indexOf(img.ID),
                1
              );
              this.mediaConfig.totalCount--;
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
    syncSuccess(response) {
      if(response){
        this.getImageList();
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
          this.mediaConfig.wxTotalCount = response.Data.image_count;
        }
      } catch (error) {
        console.log(error);
      }
    },
    uploadSuccess(data) {
      this.imageList.List.unshift(data);
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
}
.data-null {
  text-align: center;
  margin-top: 100px;
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
