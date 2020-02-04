<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <h2>Essential Links</h2>-->
    <el-form ref="form" :model="form" label-width="100px" style="width: 400px;">
      <el-form-item label="任务名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="任务组名称" style="text-align: left;" >
        <el-select  v-model="form.jobsname" style="width:300px;" placeholder="请选择任务组">
          <el-option
            v-for="obj in form.jobs"
            :key="obj.name"
            :label="obj.name"
            :value="obj.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row style="text-align: left;" >
        <el-button @click="ref" type="success">获取全部任务</el-button>
        <el-button @click="getTimeOut" type="warning">查询超时任务</el-button>
    </el-row>
    <hr/>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="任务名称" width="180"></el-table-column>
      <el-table-column prop="group" label="任务组" width="180"></el-table-column>
      <el-table-column prop="cronExpression" label="执行表达式"></el-table-column>
      <el-table-column prop="jobClass" label="任务类名"></el-table-column>
      <el-table-column prop="state" label="状态"></el-table-column>
      <el-table-column :formatter="formatter" label="上一次执行时间"></el-table-column>
      <el-table-column prop="description" label="任务描述"></el-table-column>
      <el-table-column prop label="操作">
        <!-- <a @click="pause(this)" class="pause" :param="{{name}}" >暂停</a>&nbsp;&nbsp;
        <a class="reload" >重启</a>&nbsp;&nbsp;
        <a class="interrupt" >中断</a>&nbsp;&nbsp; -->
        <template slot-scope="scope">
          <el-button @click="pause(scope.row)" type="text" size="small">暂替</el-button>
          <el-button @click="reload(scope.row)" type="text" size="small">重启</el-button>
          <el-button @click="interrupt(scope.row)" type="text" size="small">中断</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  methods: {
    alertinfo: function() {
      this.showmsg("提示", "获取数据成功!");
      console.log(this.data.tableData);
    },
    pause: function(row){
      let _that = this;
      this.$axios
        .post(_that.controlLink + "/quartz/pauseJob", {
          "name": row.name,
          "group": row.group
        })
        .then(function(res) {
          this.showmsg("暂停任务成功！", "任务名："+row.name +"-任务组："+row.group);
          console.log(res);
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
        this.showmsg("暂停任务成功！", "任务名："+row.name +"-任务组："+row.group);
    },
    reload(row) {
      let _that = this;
      this.$axios
        .post(_that.controlLink + "/quartz/resumeJob", {
          "name": row.name,
          "group": row.group
        })
        .then(function(res) {
          this.showmsg("重启任务成功！", "任务名："+row.name +"-任务组："+row.group);
          console.log(res);
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
        this.showmsg("重启任务成功！", "任务名："+row.name +"-任务组："+row.group);
    },
    interrupt(row) {
      let _that = this;
      this.$axios
        .post(_that.controlLink + "/quartz/interrupt", {
          "name": row.name,
          "group": row.group
        })
        .then(function(res) {
          this.showmsg("暂停任务成功！", "任务名："+row.name +"-任务组："+row.group);
          console.log(res);
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
        this.showmsg("暂停任务成功！", "任务名："+row.name +"-任务组："+row.group);
    },
    formatter(row , column) {
      var t = row.previousFireTime;
      if(t!=undefined&&t!=""){
        return t.substring(0,4)+"/"+t.substring(4,6)+"/"+t.substring(6,8)+" "+t.substring(8,10)+":"+t.substring(10,12)+":"+t.substring(12,14);
      }
      return "";
    },
    ref: function() {
      let _that = this;
      this.$axios
        .post(_that.controlLink + "/quartz/getTriggers")
        .then(function(res) {

          var data = res.data;
          var real = [];
          
          if((_that.form.jobsname!="" && _that.form.jobsname!=undefined && _that.form.jobsname.length !=0)){
            for(var i in data){
              if(data[i].group.indexOf(_that.form.jobsname)!=-1){
                real.push(data[i]);
              }
            }
          }else{
            real = data;
          }

          if(_that.form.name!="" && _that.form.name!=undefined && _that.form.name.length !=0){
            for (var i =0 ; i<real.length ;i++) {
              if(real[i].name.indexOf(_that.form.name)==-1){
                real.splice(i);
                i--;
              }
            }
          }

          _that.tableData = real;
          console.log(res);
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
    getTimeOut: function() {

// alert(this.form.jobsname); // 任务组名称
// alert(this.form.name); // 任务名称

      let _that = this;
      this.$axios
        .post(_that.controlLink + "/quartz/getTimeoutTriggers", {
          timeout: 600000
        })
        .then(function(res) {

          var data = res.data;
          var real = [];

          if((_that.form.jobsname!="" && _that.form.jobsname!=undefined && _that.form.jobsname.length !=0)){
            for(var i in data){
              if(data[i].group.indexOf(_that.form.jobsname)!=-1){
                real.push(data[i]);
              }
            }
          }else{
            real = data;
          }

          if(_that.form.name!="" && _that.form.name!=undefined && _that.form.name.length !=0){
            for (var i =0 ; i<real.length ;i++) {
              if(real[i].name.indexOf(_that.form.name)==-1){
                real.splice(i);
                i--;
              }
            }
          }
          


          _that.tableData = real;
          console.log(res);
        })
        .catch(function(error) {
          // 请求失败处理
          console.log(error);
        });
    },
    showmsg: function(title, content) {
      const h = this.$createElement;
      this.$message({
        message: h("p", null, [
          h("span", null, title),
          h("i", { style: "color: teal" }, content)
        ])
      });
    },
    vdata: function(arr , key){
      for(var i in arr){
        if(arr[i].name.indexOf(key)!=-1){
          return false;
        }
      }
      return true;
    }
  },
  data() {
    return {
      msg: "定时任务管理页面",
      controlLink :"http://127.0.0.1:9999/",
      tableData: [],
      tableDataBack: [],
      timeoutJobs: [],
      form: {
        name: "",
        region: "",
        jobsname: "",
        jobs: []
      }
    };
  },
  mounted() {
    let _that = this;
    this.$axios
      .get(_that.controlLink + "/quartz/getTriggers")
      .then(function(res) {
        _that.tableData = res.data;
        _that.tableDataBack = res.data;

        // 获取所有的任务组
        var jobs = [];
        jobs.push({
          "name": "全部",
          "value": ""
        });
        for(var obj in res.data){
          console.log("======================>"+res.data[obj]);
          if(_that.vdata(jobs, res.data[obj].group)){
            jobs.push({
              "name": res.data[obj].group,
              "value": res.data[obj].group
            })
          }
        }
        _that.form.jobs = jobs;
        console.log(jobs);

        console.log(res);
      })
      .catch(function(error) {
        // 请求失败处理
        console.log(error);
      });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
a:hover {
  cursor: pointer;
}
</style>
