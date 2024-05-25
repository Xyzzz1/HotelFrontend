<template>
  <div>
    <el-container class="wrapper">
      <el-main class="section">
        <div class="changeinfo-bg"></div>
        <el-card class="box-card changeinfo-card">
          <div class="text item">
            <p class="changeinfo-title">欢迎入住BUPT廉价酒店:))</p>
            <el-row :gutter="10">
              <el-col :span="8" class="text-right">
                <p>
                  用户名：
                </p>
              </el-col>
              <el-col :span="16" class="text-left">
                <p>
                  {{ userinfo.userName }}
                </p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8" class="text-right">
                <p>
                  创建时间：
                </p>
              </el-col>
              <el-col :span="16" class="text-left">
                <p>
                  {{ userinfo.createTime }}
                </p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8" class="text-right">
                <p>
                  账号邮箱：
                </p>
              </el-col>
              <el-col :span="16" class="text-left">
                <p>
                  {{ userinfo.email }}
                </p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8" class="text-right">
                <p>
                  性别：
                </p>
              </el-col>
              <el-col :span="16" class="text-left">
                <p>
                  {{ showsex }}
                </p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8" class="text-right">
                <p>
                  用户id：
                </p>
              </el-col>
              <el-col :span="16" class="text-left">
                <p>
                  {{ userinfo.id }}
                </p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8" class="text-right">
                <p>
                  账号积分：
                </p>
              </el-col>
              <el-col :span="16" class="text-left">
                <p>
                  {{ userinfo.jifen }}
                </p>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="8" class="text-right">
                <p>
                  手机号：
                </p>
              </el-col>
              <el-col :span="16" class="text-left">
                <p>
                  {{ userinfo.phone }}
                </p>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import footbar from "@/components/footbar.vue";
import store from './../store';
export default {
  data() {
    return {
      userinfo: {

      }
    }
  },
  components: {
    footbar,
  },
  mounted() {
    console.log(process.env.VUE_APP_BASE_URL); 
    this.$store.commit("setMine");
    
    this.axios.get(process.env.VUE_APP_BASE_URL+"/user/getUserInfo")
      .then(res => {
        this.userinfo = res.data.data;
        console.log(this.userinfo);
      })
      .catch(res => {
        console.log("失败" + res);
      });

  },
  methods: {
    back() {
      this.$router.push("/mine");
    },
  },
  computed: {
    showsex() {
      if (this.userinfo.sex == 0)
        return "女";
      else
        return "男";
    }
  }
}
</script>

<style scoped="scoped">
.changeinfo-bg {
  background: rgb(65, 105, 225);
  height: 20vh;
  background-size: 100%;
  border: 0px solid transparent;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.text {
  font-size: 14px;
}

.item {
  /* padding: 18px 0; */
}

.changeinfo-card {
  margin: -5rem 1rem 1rem 1rem;
}

.changeinfo-title {
  font-size: 2rem;
  margin-top: 1rem;
}

.wrapper {
  min-height: 94vh;
}

.el-main {
  max-height: 94vh;
}

#app {
  overflow: hidden;
}

.changeinfobtn {
  /* margin-top: 2rem; */
}

.changeinfo {
  margin-top: 5vh;
}

.changeinfo a,
.changeinfo div {
  color: #409EFF;
}

.changeinfo p {
  margin: 0.5rem;
}
</style>
