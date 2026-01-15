function initialize_fc_lite() {
    // Define UserConfig safely
    var UserConfig = window.UserConfig || {};
    UserConfig = {
        private_api_url: UserConfig.private_api_url || "",
        page_turning_number: UserConfig.page_turning_number || 20,
        error_img: UserConfig.error_img || "https://fastly.jsdelivr.net/gh/Rock-Candy-Tea/Friend-Circle-Frontend/logo.png"
    };

    const PUBLIC_API_URL = 'https://circle-of-friends-iota.vercel.app/';

    const root = document.getElementById('friend-circle-lite-root');
    if (!root) return;
    root.innerHTML = '';

    const TopContainer = document.createElement('div');
    TopContainer.id = 'top-fc-container';
    root.appendChild(TopContainer);

    const container = document.createElement('div');
    container.className = 'articles-container';
    container.id = 'articles-container';
    root.appendChild(container);

    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.id = 'load-more-btn';
    loadMoreBtn.innerText = '再来亿点';
    root.appendChild(loadMoreBtn);

    const statsContainer = document.createElement('div');
    statsContainer.id = 'stats-container';
    root.appendChild(statsContainer);

    let start = 0;
    let allArticles = [];
    let globalStats = {};

    function getSortRule() {
        return localStorage.getItem('friend-circle-sort') || 'created';
    }

    function setSortRule(rule) {
        localStorage.setItem('friend-circle-sort', rule);
    }

    function getDataSource() {
        return localStorage.getItem('friend-circle-source') || 'private';
    }

    function setDataSource(source) {
        localStorage.setItem('friend-circle-source', source);
    }

    function getApiUrl() {
        // 如果配置了私有 API，优先使用私有 API
        if (UserConfig.private_api_url) {
             return UserConfig.private_api_url;
        }
        
        var source = getDataSource();
        if (source === 'private' && !UserConfig.private_api_url) {
            return PUBLIC_API_URL;
        }
        return source === 'public' ? PUBLIC_API_URL : UserConfig.private_api_url;
    }

    function clearCache() {
        localStorage.removeItem('friend-circle-cache');
        localStorage.removeItem('friend-circle-cache-time');
    }

    function loadMoreArticles() {
        const cacheKey = 'friend-circle-cache';
        const cacheTimeKey = 'friend-circle-cache-time';
        const cacheTime = localStorage.getItem(cacheTimeKey);
        const now = new Date().getTime();

        if (cacheTime && (now - cacheTime < 10 * 60 * 1000)) {
            const cachedData = JSON.parse(localStorage.getItem(cacheKey));
            if (cachedData) {
                processArticles(cachedData);
                return;
            }
        }

        const apiUrl = getApiUrl();
        const finalUrl = apiUrl.endsWith('/') ? apiUrl + 'all' : apiUrl + '/all';

        fetch(finalUrl)
            .then(response => response.json())
            .then(data => {
                localStorage.setItem(cacheKey, JSON.stringify(data));
                localStorage.setItem(cacheTimeKey, now.toString());
                processArticles(data);
            })
            .catch(error => {
                console.error('Error fetching friend circle data:', error);
                statsContainer.innerHTML = `<div style="color: red; text-align: center;">加载失败: ${error.message} <br> 请检查 API 配置或网络连接</div>`;
            })
            .finally(() => {
                loadMoreBtn.innerText = '再来亿点';
            });
    }

    function processArticles(data) {
        allArticles = data.article_data;
        globalStats = data.statistical_data;

        // 处理统计数据
        statsContainer.innerHTML = '';

        displayRandomArticle(); // 显示随机友链卡片

        const articles = allArticles.slice(start, start + UserConfig.page_turning_number);

        articles.forEach(article => {
            const card = document.createElement('div');
            card.className = 'card';

            const title = document.createElement('div');
            title.className = 'card-title';
            title.innerText = article.title;
            card.appendChild(title);
            title.onclick = () => window.open(article.link, '_blank');

            const author = document.createElement('div');
            author.className = 'card-author';
            const authorImg = document.createElement('img');
            authorImg.className = 'no-lightbox';
            authorImg.src = article.avatar || UserConfig.error_img; // 使用默认头像
            authorImg.onerror = () => authorImg.src = UserConfig.error_img; // 头像加载失败时使用默认头像
            author.appendChild(authorImg);
            author.appendChild(document.createTextNode(article.author));
            card.appendChild(author);

            author.onclick = () => {
                showAuthorArticles(article.author, article.avatar, article.link);
            };

            const date = document.createElement('div');
            date.className = 'card-date';
            date.innerText = "🗓️" + article.created.substring(0, 10);
            card.appendChild(date);

            const bgImg = document.createElement('img');
            bgImg.className = 'card-bg no-lightbox';
            bgImg.src = article.avatar || UserConfig.error_img;
            bgImg.onerror = () => bgImg.src = UserConfig.error_img; // 头像加载失败时使用默认头像
            card.appendChild(bgImg);

            container.appendChild(card);
        });

        start += UserConfig.page_turning_number;
        if (start >= allArticles.length) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // 显示随机文章的逻辑
    function displayRandomArticle() {
        if (!allArticles || allArticles.length === 0) return;
        
        const randomArticle = allArticles[Math.floor(Math.random() * allArticles.length)];
        // 使用与 cycle.css 匹配的随机文章容器结构
        const randomArticleContainer = document.getElementById('random-article');
        if (!randomArticleContainer) {
             const newContainer = document.createElement('div');
             newContainer.id = 'random-article';
             // 插入到 articles-container 之前
             root.insertBefore(newContainer, container);
        }
        
        const targetContainer = document.getElementById('random-article');
        
        targetContainer.innerHTML = `
            <div class="random-container">
                <div class="random-container-title">随机钓鱼</div>
                <div class="random-title">${randomArticle.title}</div>
                <div class="random-author">作者: ${randomArticle.author}</div>
            </div>
            <div class="random-stats">
                订阅:${globalStats.friends_num}   活跃:${globalStats.active_num}   总文章数:${globalStats.article_num}<br>
                更新时间:${globalStats.last_updated_time}
            </div>
            <div class="random-button-container">
                <a href="#" id="refresh-random-article">刷新</a>
                <button class="random-link-button" onclick="window.open('${randomArticle.link}', '_blank')">过去转转</button>
            </div>
        `;

        // 为刷新按钮添加事件监听器
        const refreshBtn = document.getElementById('refresh-random-article');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function (event) {
                event.preventDefault(); // 阻止默认的跳转行为
                displayRandomArticle(); // 调用显示随机文章的逻辑
            });
        }
    }


    function showAuthorArticles(author, avatar, link) {
        if (!document.getElementById('modal')) {
            const modal = document.createElement('div');
            modal.id = 'modal';
            modal.className = 'modal';
            modal.innerHTML = `<div class="modal-content"><img id="modal-author-avatar"src=""alt=""><a id="modal-author-name-link"></a><div id="modal-articles-container"></div><img id="modal-bg"src=""alt=""></div>`;
            document.body.appendChild(modal);
        }

        const modal = document.getElementById('modal');
        const modalArticlesContainer = document.getElementById('modal-articles-container');
        const modalAuthorAvatar = document.getElementById('modal-author-avatar');
        const modalAuthorNameLink = document.getElementById('modal-author-name-link');
        const modalBg = document.getElementById('modal-bg');

        modalArticlesContainer.innerHTML = '';
        modalAuthorAvatar.src = avatar || UserConfig.error_img;
        modalAuthorAvatar.onerror = () => modalAuthorAvatar.src = UserConfig.error_img;
        modalBg.src = avatar || UserConfig.error_img;
        modalBg.onerror = () => modalBg.src = UserConfig.error_img;
        modalAuthorNameLink.innerText = author;
        modalAuthorNameLink.href = new URL(link).origin;

        const authorArticles = allArticles.filter(article => article.author === author);
        authorArticles.slice(0, 4).forEach(article => {
            const articleDiv = document.createElement('div');
            articleDiv.className = 'modal-article';

            const title = document.createElement('a');
            title.className = 'modal-article-title';
            title.innerText = article.title;
            title.href = article.link;
            title.target = '_blank';
            articleDiv.appendChild(title);

            const date = document.createElement('div');
            date.className = 'modal-article-date';
            date.innerText = "📅" + article.created.substring(0, 10);
            articleDiv.appendChild(date);

            modalArticlesContainer.appendChild(articleDiv);
        });

        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 10);
    }

    function hideModal() {
        const modal = document.getElementById('modal');
        modal.classList.remove('modal-open');
        modal.addEventListener('transitionend', () => {
            modal.style.display = 'none';
            document.body.removeChild(modal);
        }, { once: true });
    }

    loadMoreArticles();
    loadMoreBtn.addEventListener('click', loadMoreArticles);
    window.onclick = function (event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) hideModal();
    };
}

function whenDOMReady() {
    initialize_fc_lite();
}

whenDOMReady();
document.addEventListener("astro:page-load", initialize_fc_lite);
document.addEventListener("pjax:complete", initialize_fc_lite);