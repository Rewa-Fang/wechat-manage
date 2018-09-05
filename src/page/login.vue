<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>官微后台管理系统</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="用户名">
              <span>dsfsf</span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item prop="verificationCode">
            <el-col :span="12">
              <el-input placeholder="验证码" v-model="loginForm.verificationCode"></el-input>
            </el-col>
            <el-col :span="12">
              <img :src="loginForm.verificationCodeImg + loginForm.codeUIDRandom" @click="changeCodeImg">
            </el-col>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登 录</el-button>
          </el-form-item>
        </el-form>
        <p class="tip">温馨提示：</p>
        <p class="tip">暂不提供注册，请联系管理员索取帐号密码</p>
        <!-- <p class="tip">注册过的用户可凭账号密码登录</p> -->
      </section>
    </transition>
  </div>
</template>

<script>
import { login, getAdminInfo, getCodeImg, getCode } from "@/api/getData";
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        verificationCode: "",
        verificationCodeUID: "",
        verificationCodeImg:
          "http://wechat.a2designing.cn/handlers/VerificationCodeImg.ashx?UID=",
        codeUIDRandom: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      showLogin: false
    };
  },
  created() {
    this.getVerificationCodeImg();
  },
  mounted() {
    this.showLogin = true;
    if (!this.adminInfo.ID) {
      if (localStorage.adminInfo) {
        this.saveAdminInfo(JSON.parse(localStorage.adminInfo));
        this.$router.push("/#/media");
      } else {
        this.getAdminData();
      }
    } else {
      this.$router.push("/#/media");
    }
  },
  computed: {
    ...mapState(["adminInfo"])
  },
  methods: {
    ...mapMutations(["saveAdminInfo"]),
    ...mapActions(["getAdminData"]),
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let formString = {
            UserName: this.loginForm.username,
            UserPwd: this.loginForm.password,
            VerificationCode: this.loginForm.verificationCode,
            VerificationCodeUID: this.loginForm.verificationCodeUID
          };
          let loginData = new FormData();
          loginData.append("Act", "User_Login");
          loginData.append("Param", JSON.stringify(formString));
          const res = await login(loginData);
          if (res.Result) {
            localStorage.adminInfo = JSON.stringify(res.Data);
            this.saveAdminInfo(res.Data);
            console.log(this.adminInfo);

            this.$message({
              type: "success",
              message: "登录成功"
            });
            this.$router.push("/");
          } else {
            this.$message({
              type: "error",
              message: res.Msg
            });
          }
        } else {
          this.$message.error({
            title: "错误",
            message: "请输入正确的用户名密码",
            offset: 100
          });
          return false;
        }
      });
    },
    async getVerificationCodeImg() {
      try {
        let data = new FormData();
        data.append("Act", "Common_GetRandomUID");
        data.append("Param", "{}");
        const res = await getCode(data);
        if (res.Result) {
          this.loginForm.verificationCodeUID = res.Data.RandomUID;
          this.loginForm.codeUIDRandom = this.loginForm.verificationCodeUID;
          // this.loginForm.verificationCodeImg += this.loginForm.verificationCodeUID;
        } else {
          // this.$message.error(res);
        }
      } catch (error) {
        this.$message({
          type:'error',
          msg:error
        })
      }
    },
    changeCodeImg() {
      this.loginForm.codeUIDRandom =
        this.loginForm.verificationCodeUID + "&d=" + Math.random();
    }
  },
  watch: {
    // adminInfo: function(newValue) {
    //   if (newValue.ID) {
    //     this.$message({
    //       type: "success",
    //       message: "检测到您之前登录过，将自动登录"
    //     });
    //     this.$router.push("manage");
    //     console.log("检测到您之前登录过，将自动登录");
    //   }
    // }
  }
};
</script>

<style lang="less" scoped>
@import "../style/mixin";
.login_page {
  background-color: #324057;
}
.manage_tip {
  position: absolute;
  width: 100%;
  top: -100px;
  left: 0;
  p {
    font-size: 34px;
    color: #fff;
  }
}
.form_contianer {
  .wh(320px, 210px);
  .ctp(320px, 210px);
  padding: 25px;
  border-radius: 5px;
  text-align: center;
  background-color: #fff;
  .submit_btn {
    width: 100%;
    font-size: 16px;
  }
}
.tip {
  font-size: 12px;
  color: #ffffff;
}
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 1s;
}
.form-fade-enter,
.form-fade-leave-active {
  transform: translate3d(0, -50px, 0);
  opacity: 0;
}
</style>
