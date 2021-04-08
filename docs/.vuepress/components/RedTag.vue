<template>
  <div>
    <template v-if="type == 'simple'">
      <p v-for="item in sourceData" style="color: blue;" :key="item.name" v-redTagSimple="item.name"></p>
    </template>
    <template v-if="type == 'full'">
      <p v-for="item in sourceData" style="color: blue;" :key="item.name" v-redTag="item.name"></p>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'simple'
    }
  },
  directives: {
    // 用于基础展示的简单版
    redTagSimple: {
      bind: function(el, binding, vnode) {
        el.innerHTML = binding.value // 这就实现了一个最简单的指令渲染
      }
    },
    // 完整版
    redTag: {
      bind: function(el, binding, vnode) {
        let getType = Object.prototype.toString

        // 类型校验
        if(getType.call(binding.value) != '[object Number]' && getType.call(binding.value) != '[object String]') {
          el.innerHTML = binding.value
          return false
        }

        // 判断非空
        const redTagsLength = vnode.context.redTags.length
        if(!binding.value || redTagsLength == 0) {
          // 这里同时处理了一下 binding.value === 0 的情况 因为 (0 || '') >> 输出 >> ('')
          el.innerHTML = `${binding.value === 0 ? '0' : (binding.value || '')}` || ''
          return binding.value
        }

        // 记录原始字符串, 避免数字类型导致对比出错
        let valueString = `${binding.value}`


        let valueArray = []
        if(valueString.length > 0) {
          valueArray = valueString.split('').map(value => {
            return `<span style="color: blue;">${value}</span>`
          })
        } else {
          valueArray = [valueString]
        }

        // 开始记录当前字符串内是否有标红词语出现, 出现则记录其开始index位置以及该标红词的长度length
        let redMatched = []
        vnode.context.redTags.forEach(word => {
          // 轮训查找字符串 直到字符串结束
          let index = 0; //开始的位置
          while ((index = valueString.indexOf(word, index)) != -1) {
            // 如果是-1情况,说明找完了
            redMatched.push({
              index: index,
              length: word.length
            })
            index += word.length;
          }
        })

        let resultArray = []
        resultArray = valueArray.map((value, valueIndex) => {
          let flag = false
          flag = redMatched.some(matchInfo => {
            return (valueIndex >= matchInfo.index && valueIndex < matchInfo.index + matchInfo.length)
          })
          return flag ? value.replace('blue' , '#d9486E') : value // 替换颜色
        })

        el.innerHTML = resultArray.join('')

        console.log(redMatched)
      }
    }
  },
  data() {
    return {
      redTags: ['这是', '标红', '词语'],
      sourceData: [
        {
          name: '这是源数据',
          info: '看看标红不'
        },
        {
          name: '这是不是词语',
          info: '看看省略不'
        },
        {
          name: '这是短语',
          info: '看看省略不'
        }
      ]
    }
  }
}
</script>