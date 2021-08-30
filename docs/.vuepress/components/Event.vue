<template>
  <div @click="handleOuterClick">
    <p @click="handleInnerClick">
    </p>
  </div>
</template>

<script>
export default {
  methods: {
    handleOuterClick(event) {
      console.log('outer', event.target, event.currentTarget)
    },
    handleInnerClick(event) {
      console.log('inner', event.target, event.currentTarget)
    },
  }
}
</script>