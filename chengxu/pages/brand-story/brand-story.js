Page({
  data: {
    brandVideo: {
      url: 'https://example.com/dior-brand-video.mp4',
      poster: '/images/video-poster.jpg'
    },
    timeline: [
      {
        year: '1946',
        title: '品牌创立',
        description: 'Christian Dior先生在巴黎创立了DIOR品牌，开启了一个新的时尚纪元。',
        image: '/images/timeline-1946.jpg'
      },
      {
        year: '1947',
        title: 'New Look革命',
        description: '首次发布"New Look"系列，重新定义了女性时尚，震撼了整个时尚界。',
        image: '/images/timeline-1947.jpg'
      },
      {
        year: '1995',
        title: 'Lady Dior诞生',
        description: '经典Lady Dior手袋问世，成为品牌最具代表性的产品之一。',
        image: '/images/timeline-1995.jpg'
      },
      {
        year: '2000',
        title: '千禧年辉煌',
        description: 'DIOR进入新千年，在全球范围内扩展，成为真正的国际奢侈品牌。',
        image: '/images/timeline-2000.jpg'
      },
      {
        year: '2024',
        title: '数字化时代',
        description: '拥抱数字化创新，通过小程序等新渠道为客户提供卓越的购物体验。',
        image: '/images/timeline-2024.jpg'
      }
    ],
    brandSpirit: [
      {
        title: '优雅',
        description: '永恒的法式优雅，体现在每一个细节中',
        icon: '/images/spirit-elegance.png'
      },
      {
        title: '创新',
        description: '不断突破传统界限，引领时尚潮流',
        icon: '/images/spirit-innovation.png'
      },
      {
        title: '精工',
        description: '匠心独运的精湛工艺，追求完美品质',
        icon: '/images/spirit-craftsmanship.png'
      },
      {
        title: '传承',
        description: '传承品牌DNA，延续经典魅力',
        icon: '/images/spirit-heritage.png'
      }
    ],
    iconicProducts: [
      {
        id: 1,
        name: 'Lady Dior',
        year: '1995',
        image: '/images/iconic-ladydior.jpg'
      },
      {
        id: 2,
        name: 'Saddle Bag',
        year: '2000',
        image: '/images/iconic-saddle.jpg'
      },
      {
        id: 3,
        name: 'J\'adore香水',
        year: '1999',
        image: '/images/iconic-jadore.jpg'
      },
      {
        id: 4,
        name: 'Bar Jacket',
        year: '1947',
        image: '/images/iconic-bar-jacket.jpg'
      }
    ],
    craftsmanshipHighlights: [
      {
        title: '手工缝制',
        description: '每一针每一线都由经验丰富的工匠手工完成',
        icon: '/images/craft-hand-sewing.png'
      },
      {
        title: '材料精选',
        description: '严格挑选来自世界各地的顶级材料',
        icon: '/images/craft-materials.png'
      },
      {
        title: '品质检验',
        description: '层层品质把关，确保每件产品完美无瑕',
        icon: '/images/craft-quality.png'
      },
      {
        title: '传统工艺',
        description: '传承百年的传统工艺技法',
        icon: '/images/craft-tradition.png'
      }
    ],
    designers: [
      {
        name: 'Christian Dior',
        period: '1946-1957',
        achievement: '品牌创始人，New Look革命的先驱',
        quote: '我想让女人感到美丽，让她们微笑。',
        avatar: '/images/designer-christian-dior.jpg'
      },
      {
        name: 'Maria Grazia Chiuri',
        period: '2016至今',
        achievement: '首位女性创意总监，现代女性力量的诠释者',
        quote: '时尚是女性表达自我的语言。',
        avatar: '/images/designer-maria-grazia.jpg'
      }
    ],
    brandStats: [
      {
        number: '78',
        label: '年品牌历史'
      },
      {
        number: '200+',
        label: '全球精品店'
      },
      {
        number: '40+',
        label: '覆盖国家'
      },
      {
        number: '100%',
        label: '正品保证'
      }
    ],
    globalPresence: {
      countries: 40,
      stats: [
        {
          number: '欧洲',
          label: '品牌发源地'
        },
        {
          number: '亚洲',
          label: '重要市场'
        },
        {
          number: '美洲',
          label: '奢华体验'
        },
        {
          number: '中东',
          label: '新兴市场'
        }
      ]
    },
    sustainabilityInitiatives: [
      {
        title: '环保材料',
        description: '使用可持续和回收材料制作产品',
        icon: '/images/sustainability-materials.png'
      },
      {
        title: '负责任采购',
        description: '确保供应链的透明度和可持续性',
        icon: '/images/sustainability-sourcing.png'
      },
      {
        title: '减碳行动',
        description: '致力于减少碳足迹，保护环境',
        icon: '/images/sustainability-carbon.png'
      },
      {
        title: '社区支持',
        description: '支持当地社区发展和文化传承',
        icon: '/images/sustainability-community.png'
      }
    ]
  },

  onLoad(options) {
    this.initPageAnimations();
  },

  onShow() {
    // 页面显示时的处理
  },

  // 初始化页面动画
  initPageAnimations() {
    // 监听滚动事件来触发动画
    this.createIntersectionObserver()
      .relativeToViewport({ bottom: 100 })
      .observe('.fade-in', (res) => {
        if (res.intersectionRatio > 0) {
          res.target.addClass('animated');
        }
      });
  },

  // 查看产品详情
  viewProduct(e) {
    const product = e.currentTarget.dataset.product;
    wx.showModal({
      title: product.name,
      content: `这是DIOR于${product.year}年推出的经典产品，想要了解更多详情吗？`,
      confirmText: '查看详情',
      confirmColor: '#D4AF37',
      success: (res) => {
        if (res.confirm) {
          // 这里可以跳转到具体的产品详情页
          wx.navigateTo({
            url: `/pages/product-detail/product-detail?id=${product.id}`
          });
        }
      }
    });
  },

  // 探索产品
  exploreProducts() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: 'DIOR品牌故事 - 78年传奇历程',
      path: '/pages/brand-story/brand-story',
      imageUrl: '/images/brand-story-share.jpg'
    };
  },

  onShareTimeline() {
    return {
      title: 'DIOR品牌故事 - 78年传奇历程',
      imageUrl: '/images/brand-story-share.jpg'
    };
  }
});