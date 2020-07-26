<template>
  <div>
    <el-tree
      :data="allData"
      default-expand-all
      :render-content="render"
      :expand-on-click-node="false"
    ></el-tree>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "MyTree",
  props: {
    data: {
      style: Array,
      default: () => []
    },
    fileDrop: {
      type: Array,
      default: () => []
    },
    distoryDrops: {
      type: Array,
      default: () => []
    },
    del: {
      type: Function
    }
  },
  data() {
    return {
      allData: [],
      // 当前点击的id
      currentId: '',
      // 当前编辑的内容
      currentContent: ''
    };
  },
  //
  watch: {
    // data发生改变就需要重新渲染
    data() {
      this.getData();
    }
  },
  methods: {
    isParent(data) {
      return data.type == "parent";
    },
    handleCommand(data,value) {
      console.log(data,value)
      if(value == 'remove'){
        this.handleRemove(data)
      }else if( value == 'edit'){
        this.handleEdit(data)
      }
    },
    // 重命名
    handleEdit(data) {
      this.currentId = data.id
      this.currentContent = data.label
    },
    // 删除页面中的数据
    remove(id) {
      let list = _.cloneDeep(this.data)
      list = list.filter(item => item.id != id)
      this.$emit('update:data', list)
      this.$message({
            type: 'success',
            message: '删除成功!'
          });
    },
    // 删除
    handleRemove(data) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 不能直接将数据删除，需要调用用户的删除方法
          // 如果用户传递了del方法，可以直接调用
          this.del? this.del(data.id).then(() => {
            this.remove(data.id)
          }): this.remove(data.id)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 确认编辑
    comfirm(data) {
      let list = _.cloneDeep(this.data)
      let currentItem = list.find(item => item.id === data.id)
      currentItem.label = this.currentContent
      this.$emit('update:data', list)
      this.currentId = ''
      this.$message({
            type: 'success',
            message: '删除成功!'
          });
    },
    // 取消编辑
    cancel() {
      this.currentId = ''
    },
    render(h, { node, data, store }) {
      let list = this.isParent(data) ? this.distoryDrops : this.fileDrop
      return (
        <div class='content' >
          {this.isParent(data) ? (
            node.expanded ? (
              <i class="el-icon-folder-opened"></i>
            ) : (
              <i class="el-icon-folder"></i>
            )
          ) : (
            <i class="el-icon-document"></i>
          )}
          {this.currentId === data.id ? <el-input v-model={this.currentContent}></el-input> : data.label}

          {/** bind 绑定的函数回返回一个新的函数，新函数的this被改变，两个函数都可以传递参数 */}
          {
            this.currentId !== data.id ? 
            <el-dropdown placement="bottom-start" trigger="click" on-command={this.handleCommand.bind(this,data)}>
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              {
                list.map(item => 
                  <el-dropdown-item command={item.text}>{item.value}</el-dropdown-item>
                )
              }
              </el-dropdown-menu>
            </el-dropdown>: 
            <span style={{float:'right'}}><el-button type="text" on-click={this.comfirm.bind(this,data)}>确认</el-button>
            <el-button type="text" on-click={this.cancel}>取消</el-button></span>
          }
          
        </div>
      );
    },
    getData() {
      // 将父组件传递过来的的数据进行深拷贝
      let allData = _.cloneDeep(this.data);
      // 1: {name: "文件夹1", pid: 0, id: 1}
      let treeMap = allData.reduce((obj, current) => {
        obj[current.id] = current;
        return obj;
      }, {});

      this.allData = allData.reduce((arr, value) => {
        let pid = value.pid;
        let parent = treeMap[pid];
        if (parent) {
          parent.children
            ? parent.children.push(value)
            : (parent.children = [value]);
        } else if (pid === 0) {
          arr.push(value);
        }
        return arr;
      }, []);
      console.log(this.allData);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>

<style>
.el-tree{
  width: 50%;
}
.el-tree .el-tree-node__content{
  height: 42px;
  justify-items: center;
}
.el-dropdown{
  float: right;
}
.el-tree .el-input{
  width: 50%;
}
.content{
  width: 100%;
  height: 32px;
  line-height: 32px;
}
.el-input .el-input__inner{
  height: 32px;
  line-height: 32px;
}
</style>