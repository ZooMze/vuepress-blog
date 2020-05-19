<template>
  <div class="contact-moudle">
    <div class="primary-button-area">
      <p>推荐内容: 《React: 从入门到放弃》</p>
      <el-button @click="start" type="primary">开始阅读<i class="el-icon-arrow-right"></i></el-button>
      </div>
    <p>Find me in other social websites. <i class="el-icon-bottom"></i></p>
    <el-tooltip v-for="item in contacts" :content="item.desc" :key="item.type">
      <a 
        :href="item.href"
        class="link-item"
        target="_blank" rel="noreferrer noopener">
        <i :class="iconClass(item.type)"></i>
        {{ item.name }}
      </a>
    </el-tooltip>
    
  </div>
</template>

<script>
export default {
  name: "Contact",

  computed: {
    contacts() {
      return this.$page.frontmatter.contacts;
    },
    iconClass() {
      return (type) => {
        return type
      }
    },
    text() {
      console.log(this)
      return () => {
        console.log(this)
        return 12
      }
      
    }
  },

  mounted() {},

  methods: {
    start() {
      this.$router.push({ path: '/studyBasement/React.html' })
    }
  }
};
</script>

<style lang="stylus">
.contact-moudle
  margin-top 1rem
  text-align center
  .link-item
    display inline-block
    min-width: 2.5rem
    background-color #ffffff
    border 1px solid #ebeef5
    box-shadow 0 2px 12px 0 rgba(0,0,0,.1)
    padding .6rem 1rem
    margin .5rem 1rem
    border-radius 1.5rem
.link-item:hover
  background #000
  color #f1f9ff
.primary-button-area
  margin 15px
  padding 10px
</style>
