<template>
  <div id="app">
    <MyTree :data.sync="data" v-if="data.length" :fileDrop="fileDrop" :distoryDrops="distoryDrops" :del="deleteItem"></MyTree>
  </div>
</template>

<script>
import { getList } from "./utils/api";
import MyTree from './components/MyTree';
export default {
  name: "App",
  data() {
    return {
      data: [],
      fileDrop: [
        {text: 'remove', value:'删除文件'}
      ],
      distoryDrops: [
        {text: 'remove', value: '删除文件夹'},
        {text: 'edit', value: '修改文件名'}
      ]
    }
  }, 
  methods: {
    deleteItem() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        })
      })
    }
  },
  components: {
    MyTree
  },
  async mounted() {
    let {data} = await getList()
    data.parent.forEach(item => item.type = 'parent')
    this.data = [...data.parent, ...data.children]
  }
};
</script>

<style>
</style>