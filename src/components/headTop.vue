<template>
  <div class="header_container">
    <div>
      {{ pageTitle }}
    </div>
    <div>

      <div class="user-info">
        <div class="company-logo"><img :src="adminInfo.CompanyLogo?'':'http://a2designing.cn/logo/a2.png'" :alt="adminInfo.CompanyName"></div>
        <div class="company-name">
          <div>{{ adminInfo.CompanyName }}</div>
          <div class="nick-name">{{ adminInfo.NickName }}</div>
        </div>
        <el-dropdown @command="handleCommand" trigger="click">
          <i class="el-icon-arrow-down el-icon--right arrow"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="home">首页</el-dropdown-item>
            <el-dropdown-item command="update">修改信息</el-dropdown-item>
            <el-dropdown-item command="singout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
  </div>
</template>

<script>
import { signout } from "@/api/getData";
import { baseImgPath } from "@/config/env";
import { mapActions, mapState } from "vuex";

export default {
  props: ["pageTitle"],
  data() {
    return {
      baseImgPath
    };
  },
  created() {
    if (!this.adminInfo.ID) {
      this.getAdminInfo();
    }
    console.log(this.adminInfo);
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  methods: {
    ...mapActions(["getAdminData"]),
    async handleCommand(command) {
      if (command == "home") {
        this.$router.push("/");
      } else if (command == "singout") {
        this.$confirm("确认退出系统？", "提示", {
          confirmButtonText: "退出",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          localStorage.removeItem("adminInfo");
          this.$router.push("/login");
        }).catch(()=>{

        })
      } else if (command == "update") {
        alert("update");
      }
    },
    async getAdminInfo() {
      try {
        let res = await this.getAdminData();
        if (!res.Result) {
          this.$message({
            type: "error",
            message: res.Msg
          });
        }
        console.log(this.adminInfo);
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
</script>

<style scoped>
.header_container {
  background-color: #eff2f7;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
}
.user-info {
  display: flex;
  align-items: center;
}
.company-logo {
  /* padding: 4px; */
}
.company-logo img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}
.company-name div {
  padding: 2px 20px 2px 4px;
  cursor: pointer;
}
.nick-name {
  color: #9a9a9a;
  font-size: 14px;
}
.arrow {
  cursor: pointer;
}
</style>
