<template>
  <div class="media-list">
    <el-row class="imgae-top">
      <el-col :span="14">
        <div class="image-count">图片(共{{ imageList.total_count }}条)</div>
      </el-col>
      <el-col :span="8" class="tips">
        <span>大小不超过5M，已关闭图片水印 </span>
        <el-tooltip effect="dark" content="不添加水印" placement="top-start">
          <i class="el-icon-warning"></i>
        </el-tooltip>
      </el-col>
      <el-col :span="2" class="upload-btn">
        <el-upload :action="upLoadImgUrl" :data="upLoadImgData" :show-file-list="false" :on-success="upLoadSuccess" :before-upload="beforeAvatarUpload">
          <el-button size="default" type="primary">上传图片</el-button>
        </el-upload>
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
      <el-col :lg="4" :md="6" :sm="8" class="card-item" v-for="(item,index) in imageList.item" :key="item.media_id">
        <div class="item-img" :class="{'item-img-bg':checkedStyleArr[index]}">
          <img :src="item.url" alt="">
        </div>
        <div class="card-title">{{ item.name }}</div>
        <div class="chckedBox-menu" :class="{'chckedBox-menu-block':checkedStyleArr[index]}">
          <input class="del-checkbox" type="checkbox" :id="item.media_id" :value="item.media_id" v-model="checkedImageArr" @change="changeChecked(index)">
          <label :for="item.media_id"></label>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getMaterialList, deleteMateria } from "@/api/getData";
export default {
  data() {
    return {
      userInfo: {},
      imageList: {
        total_count: 5,
        item_count: 5,
        item: [
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKdsLt85FO_Vp3KkKXGHOjXw",
            name: "abc.jpg",
            update_time: 1533705479,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqibKwggAsETNN6qVmVA5xH03YXMUIz6CyTUQQghyGpicFxMNRlDkNJzvEw/0?wx_fmt=jpeg"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKTPxz91gfesBgmiq8FJklQU",
            name: "hope.jpg",
            update_time: 1533703436,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqib0UpwInVlZCIsX9WZgvQq0ia4fXMGR2zlD1mKY1yqva30Kz9h11icIgxg/0?wx_fmt=jpeg"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKYqD3l0qE3oZPpHNZ0qg68U",
            name: "abc.jpg",
            update_time: 1533702040,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqibKwggAsETNN6qVmVA5xH03YXMUIz6CyTUQQghyGpicFxMNRlDkNJzvEw/0?wx_fmt=jpeg"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKSaDltyxyfvM5JFV8xgKLm0",
            name: "abc.jpg",
            update_time: 1533697754,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqibKwggAsETNN6qVmVA5xH03YXMUIz6CyTUQQghyGpicFxMNRlDkNJzvEw/0?wx_fmt=jpeg"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKRPtLeyRRCXcaTjbmzdursw",
            name: "abc.jpg",
            update_time: 1533697733,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqibKwggAsETNN6qVmVA5xH03YXMUIz6CyTUQQghyGpicFxMNRlDkNJzvEw/0?wx_fmt=jpeg"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKSp9nrV1zRnda-wWpS8WacY",
            name: "0.jpg",
            update_time: 1533696001,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqib7jvoAzeJRnxy8OSVPciaJEXtsNfZlne0Sloge2GAF5t8cnZyZ42MorQ/0?wx_fmt=jpeg"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKc8Ww3-WMiROHNkj0XPH0gI",
            name: "89802Gibbon_monkey_dog_tail.gif",
            update_time: 1533695103,
            url:
              "http://mmbiz.qpic.cn/mmbiz_gif/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqibHWAkJkQx0zGafbVQzkyT1icScTaAWsl56GicnHE7RF780FXjSH5rZwVQ/0?wx_fmt=gif"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKTUFkNk9JRZWsdg7VfJ0nHQ",
            name: "0.jpg",
            update_time: 1533695051,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqib7jvoAzeJRnxy8OSVPciaJEXtsNfZlne0Sloge2GAF5t8cnZyZ42MorQ/0?wx_fmt=jpeg"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKQn_0ukmWIs5sBfrkQOx7KQ",
            name: "abc.jpg",
            update_time: 1533694987,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3Npxf2NMHdEW56ZWWBZXIeqibKwggAsETNN6qVmVA5xH03YXMUIz6CyTUQQghyGpicFxMNRlDkNJzvEw/0?wx_fmt=jpeg"
          },
          {
            media_id: "yzait9Fj4D9uLQ-3yewqKdkAl5-8Vjp1OKx8ZCF5w6U",
            name: "20180807125639F4L4X04F.jpg",
            update_time: 1533617802,
            url:
              "http://mmbiz.qpic.cn/mmbiz_jpg/xST3KOBs3NrjdZZsouibbq8k0gP17AUHzicGqruEbUvDuSwFYaS0HCtxyCDRBkg6Fric2SAHZMuVtpicztnXRYYv8A/0?wx_fmt=jpeg"
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
      },
      isAllChecked: false,
      delBtnDisabled: true,
      checkedStyleArr: [],
      checkedImageArr: []
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
        this.imageList.item.unshift(res.Data);
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
    },
    deleteImg(media_id) {
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
                  media_id: img
                })
              );
              console.log(postData);

              this.deleteImgByMediaId(postData);
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
    async deleteImgByMediaId(postData) {
      console.log(postData);
      try {
        let res = await deleteMateria(postData);
        console.log(res);
        if (res.Result) {
          this.$message({
            type: "success",
            message: "删除成功!"
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
        this.imageList.item.forEach((img, index) => {
          this.checkedImageArr[index] = img.media_id;
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
