/* ============================================================
   MARFATIA — SOCIAL MEDIA FEEDS INTERACTIVE COMPONENT
   Renders embedded articles, videos, and pins for YouTube,
   LinkedIn, Medium, and Pinterest with dynamic filter tabs.
   ============================================================ */
(function() {
  'use strict';

  var FEEDS_DATA = [
    {
      id: 'yt-1',
      platform: 'youtube',
      platformName: 'YouTube Channel',
      iconClass: 'bi-youtube',
      color: '#ff0000',
      title: 'Understanding Options Trading & Risk Management Strategies',
      summary: 'Watch our comprehensive video guide on managing risks in equity futures & options trading with Marfatia tools.',
      date: 'Latest Video',
      link: 'https://www.youtube.com/@MarfatiaStockBroking',
      embedType: 'iframe',
      embedUrl: 'https://www.youtube.com/embed/videoseries?list=PL38DCD196A3AC842B'
    },
    {
      id: 'li-1',
      platform: 'linkedin',
      platformName: 'LinkedIn Article',
      iconClass: 'bi-linkedin',
      color: '#0a66c2',
      title: 'Navigating Indian Capital Markets in 2026: Trends & Insights',
      summary: 'Explore detailed market commentary and institutional perspectives on sector performance and investment opportunities.',
      date: 'Published Recently',
      link: 'https://www.linkedin.com/company/marfatiastockbroking',
      embedType: 'card',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60'
    },
    {
      id: 'med-1',
      platform: 'medium',
      platformName: 'Medium Publication',
      iconClass: 'bi-medium',
      color: '#000000',
      title: 'Building Algorithmic Trading Workflows for Retail Investors',
      summary: 'A step-by-step breakdown on automating execution, setting stop-loss triggers, and utilizing backtesting engines.',
      date: '5 min read',
      link: 'https://medium.com/@marfatiastockbroking',
      embedType: 'card',
      image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=60'
    },
    {
      id: 'pin-1',
      platform: 'pinterest',
      platformName: 'Pinterest Visual Board',
      iconClass: 'bi-pinterest',
      color: '#bd081c',
      title: 'Essential Stock Market Terminology & Infographics',
      summary: 'Visual cheat-sheets and infographics summarizing candlestick patterns, chart indicators, and market concepts.',
      date: 'Featured Board',
      link: 'https://in.pinterest.com/Marfatiabroking/',
      embedType: 'card',
      image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&auto=format&fit=crop&q=60'
    }
  ];

  function createCardHtml(item) {
    var badgeStyle = 'background:' + item.color + '15; color:' + item.color + '; border: 1px solid ' + item.color + '30;';
    var iconStyle = 'color:' + item.color + ';';
    
    var mediaContent = '';
    if (item.embedType === 'iframe' && item.embedUrl) {
      mediaContent = '<div class="sm-card-media sm-card-media--iframe">' +
        '<iframe src="' + item.embedUrl + '" title="' + item.title + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>' +
        '</div>';
    } else if (item.image) {
      mediaContent = '<div class="sm-card-media">' +
        '<img src="' + item.image + '" alt="' + item.title + '" loading="lazy">' +
        '<div class="sm-card-overlay"><span class="sm-card-btn">View on ' + item.platformName.split(' ')[0] + ' &rarr;</span></div>' +
        '</div>';
    }

    return '<div class="sm-feed-card" data-platform="' + item.platform + '">' +
      mediaContent +
      '<div class="sm-card-body">' +
      '  <div class="sm-card-meta">' +
      '    <span class="sm-card-platform" style="' + badgeStyle + '"><i class="bi ' + item.iconClass + '" style="' + iconStyle + '"></i> ' + item.platformName + '</span>' +
      '    <span class="sm-card-date">' + item.date + '</span>' +
      '  </div>' +
      '  <h4 class="sm-card-title"><a href="' + item.link + '" target="_blank" rel="noopener">' + item.title + '</a></h4>' +
      '  <p class="sm-card-desc">' + item.summary + '</p>' +
      '  <a href="' + item.link + '" target="_blank" rel="noopener" class="sm-card-link">Read Full Post <i class="bi bi-arrow-right"></i></a>' +
      '</div>' +
      '</div>';
  }

  function initSocialFeed() {
    var container = document.getElementById('socialFeedGrid');
    var tabContainer = document.getElementById('socialFeedTabs');
    if (!container || !tabContainer) return;

    function renderFeed(filter) {
      var items = FEEDS_DATA.filter(function(item) {
        return filter === 'all' || item.platform === filter;
      });
      
      container.innerHTML = items.map(createCardHtml).join('');
    }

    renderFeed('all');

    tabContainer.addEventListener('click', function(e) {
      var btn = e.target.closest('.sm-feed-tab');
      if (!btn) return;

      var tabs = tabContainer.querySelectorAll('.sm-feed-tab');
      tabs.forEach(function(t) { t.classList.remove('active'); });
      btn.classList.add('active');

      var filter = btn.getAttribute('data-feed');
      renderFeed(filter);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocialFeed);
  } else {
    initSocialFeed();
  }
})();
