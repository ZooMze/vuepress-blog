module.exports = {
  title: "ZooMze",
  description: "The description of the site.",
  head: [["link", { rel: "icon", href: `/logo.png` }]],
  base: "/",
  dest: "./dist",

  themeConfig: {
    search: true,
    nav: [
      {
        text: '基础',
        link: '/studyBasement/', // 读取改目录下的README.md
        items: [
          {
            text: 'JS',
            link: '/studyBasement/JS' // 直接读取需要的文件
          },
          {
            text: 'Vue',
            link: '/studyBasement/Vue'
          },
          {
            text: 'React',
            link: '/studyBasement/React'
          },
        ]
      },
      {
        text: '扩展',
        link: '/studyComponents/',
        items: [
          {
            text: 'Element',
            link: '/studyComponents/Element'
          },
          {
            text: 'Vant',
            link: '/studyComponents/Vant'
          },
          {
            text: 'AntD',
            link: '/studyComponents/AntD'
          },
          {
            text: 'GoJS',
            link: '/studyComponents/GoJS'
          },
        ]
      },
      {
        text: '踩坑&总结',
        link: '/summary/',
        items: [
          {
            text: 'Vue-Cli Polyfill',
            link: '/summary/vue-cli3-polyfill'
          },
        ]
      },
    ],
    sidebar: 'auto',
    sidebarDepth: 3,
    smoothScroll: true,
    lastUpdated: 'Last Updated'
  },

  markdown: {
    // options for markdown-it-anchor
    anchor: { permalink: false },
    extendMarkdown: md => {
      md.use(require("markdown-it-katex"));
    }
  }
};

function genSidebarConfig (title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        '',
        'getting-started',
        'customize',
        'advanced',
      ]
    }
  ]
}

