document.addEventListener("DOMContentLoaded", function () {
    // 确保 DOM 内容加载完成后再执行

    // 如果 mobileDisplay 为 '0' 且屏幕宽度小于等于 768px，则隐藏目录和目录切换按钮
    if (typeof mobileDisplay !== 'undefined' && mobileDisplay === '0' && window.innerWidth <= 768) {
        // 删除已有的目录和目录切换按钮
        if (document.querySelector('#post-toc')) {
            document.querySelector('#post-toc').remove();
        }
        if (document.querySelector('.toc-toggle')) {
            document.querySelector('.toc-toggle').remove();
        }
        return;  // 结束函数
    }

    // 设置目录项的默认文本颜色
    document.querySelectorAll('#post-toc ul li a').forEach(function(a) {
        a.style.color = textColor;  
    });

    // 定义可能包含文章内容的几个容器类名
    var selectors = [
        '.post-content', 
        '.entry-content', 
        '.article-content', 
        '.markdown-body', 
        '.content-body',
        '.joe_detail'
    ];

    var content = null;

    // 根据选择器找到实际的文章内容容器
    for (var i = 0; i < selectors.length; i++) {
        content = document.querySelector(selectors[i]);
        if (content) break;
    }

    // 如果没有找到文章内容容器，则输出错误信息
    if (!content) {
        console.error("无法找到文章内容容器。请检查类名或添加新的选择器。");
        return;
    }

    // 创建目录容器并插入到文章内容前
    var toc = document.createElement('div');
    toc.id = 'post-toc';
    toc.innerHTML = '<h3>目录</h3><ul></ul>';
    content.parentNode.insertBefore(toc, content);

    // 获取文章中的所有标题元素，并过滤掉 joe-card-describe 容器内的标题
    var headings = Array.from(content.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(function (heading) {
        return !heading.closest('joe-card-describe'); // 确保标题不在 joe-card-describe 容器内
    });
    
    var tocList = toc.querySelector('ul');

    // 计算目录中最小的标题等级（如h1、h2、h3等）
    let minLevel = 7;
    headings.forEach((heading) => {
        let level = parseInt(heading.tagName.substring(1));
        if (level < minLevel) {
            minLevel = level;
        }
    });

    // 为每个标题创建目录项并插入到目录列表中
    headings.forEach(function (heading, index) {
        var id = 'heading-' + index;
        heading.id = id;

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = heading.textContent;
        li.appendChild(a);

        var level = parseInt(heading.tagName.substring(1));
        li.style.marginLeft = (level - minLevel) * 20 + 'px';  // 根据标题级别设置缩进
        tocList.appendChild(li);
    });

    // 设置目录的位置
    function setTocPosition() {
        const contentRect = content.getBoundingClientRect();
        
        if (window.innerWidth > 768) { 
            toc.style.position = 'fixed';
            toc.style.top = (200 + Number(verticalOffset)) + 'px';
            console.log(toc.style.top);
            toc.style.left = (contentRect.left - toc.offsetWidth - 65 + Number(horizontalOffset)) + 'px'; // 根据文章内容位置调整目录位置
        } else { 
            toc.style.position = 'fixed';
            toc.style.bottom = '70px';
            toc.style.right = '20px';
            toc.style.left = 'auto';
            toc.style.top = 'auto';
            toc.style.width = '300px';  // 小屏幕下调整目录宽度
        }
    }

    setTocPosition();  // 初始设置目录位置

    // 监听窗口大小变化时重新设置目录位置
    window.addEventListener('resize', setTocPosition);

    // 监听目录点击事件，实现平滑滚动
    toc.addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'a') {
            event.preventDefault();
            var targetId = event.target.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);

            if (targetElement) {
                // 平滑滚动到目标元素
                window.scrollTo({
                    top: targetElement.offsetTop - navbarOffset, 
                    behavior: 'smooth'
                });

                // 更新浏览器历史记录
                history.pushState(null, null, '#' + targetId);
            }
        }
    });

    // 高亮显示当前的目录项
    function highlightCurrentHeading() {
        let currentHeadingId = null;
        const offset = 100;  // 滚动时的偏移量

        // 查找当前视口中的标题
        for (let i = 0; i < headings.length; i++) {
            const rect = headings[i].getBoundingClientRect();
            if (rect.top <= offset) {
                currentHeadingId = headings[i].id;
            } else {
                break;
            }
        }

        // 高亮当前标题的目录项
        tocList.querySelectorAll('a').forEach(function (a) {
            if (a.getAttribute('href').substring(1) === currentHeadingId) {
                a.classList.add('active');
                a.style.backgroundColor = backgroundColor;
                a.style.color = activeTextColor;
            } else {
                a.classList.remove('active');
                a.style.backgroundColor = '';
                a.style.color = textColor;
            }
        });
    }

    // 监听滚动事件以更新当前高亮的目录项
    window.addEventListener('scroll', highlightCurrentHeading);
    highlightCurrentHeading();  // 初始化高亮

    // 允许拖拽目录
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    toc.addEventListener('mousedown', function (event) {
        if (event.target.tagName.toLowerCase() === 'a') return;  // 如果点击的是目录项链接，则不触发拖拽

        event.preventDefault();
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialLeft = toc.offsetLeft;
        initialTop = toc.offsetTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        toc.style.transform = 'scale(1.05)';  // 增加拖拽时的缩放效果
    });

    // 拖动时更新目录的位置
    function onMouseMove(event) {
        if (!isDragging) return;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        toc.style.left = initialLeft + deltaX + 'px';
        toc.style.top = initialTop + deltaY + 'px';
    }

    // 停止拖拽
    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        toc.style.transform = 'scale(1)';  // 恢复缩放效果
    }

    toc.ondragstart = function () {
        return false;  // 禁止拖拽时默认的拖拽行为
    };

    // 创建显示/隐藏目录按钮
    var tocToggle = document.createElement('button');
    tocToggle.id = 'toc-toggle';
    tocToggle.className = 'toc-toggle';
    document.body.appendChild(tocToggle);

    // 根据后台设置确定是否默认隐藏目录
    if (typeof defaultDisplay !== 'undefined' && defaultDisplay === '0') {
        toc.classList.add('hidden');
        tocToggle.textContent = '显示目录';
    } else {
        toc.classList.remove('hidden');
        tocToggle.textContent = '隐藏目录';
    }

    // 监听按钮点击事件切换目录的显示状态
    tocToggle.addEventListener('click', function () {
        toc.classList.toggle('hidden');
        tocToggle.textContent = toc.classList.contains('hidden') ? '显示目录' : '隐藏目录';
    });
});
