document.addEventListener("DOMContentLoaded", function () {
    // 获取文章内容容器
    var content = document.querySelector('.post-content');
    if (!content) {
        console.error("无法找到文章内容容器。请检查类名。");
        return;
    }

    // 创建目录元素
    var toc = document.createElement('div');
    toc.id = 'post-toc';
    toc.innerHTML = '<h3>目录</h3><ul></ul>';

    // 将目录插入到文章内容容器之前
    content.parentNode.insertBefore(toc, content);

    var headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    var tocList = toc.querySelector('ul');

    // 检查最小标题级别
    let minLevel = 7; // 初始值大于最大可能的标题级别
    headings.forEach((heading) => {
        let level = parseInt(heading.tagName.substring(1));
        if (level < minLevel) {
            minLevel = level;
        }
    });

    headings.forEach(function (heading, index) {
        var id = 'heading-' + index;
        heading.id = id;

        var li = document.createElement('li');
        var a = document.createElement('a');
        a.href = '#' + id;
        a.textContent = heading.textContent;
        li.appendChild(a);

        // 根据最小标题级别调整缩进
        var level = parseInt(heading.tagName.substring(1));
        li.style.marginLeft = (level - minLevel) * 20 + 'px'; // 相对于最小标题级别的缩进
        tocList.appendChild(li);
    });

    // 监听目录点击事件，实现平滑滚动
    toc.addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'a') {
            event.preventDefault();
            var targetId = event.target.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 10, // 可以根据需要调整偏移量
                    behavior: 'smooth'
                });

                // 更新URL中的哈希值
                history.pushState(null, null, '#' + targetId);
            }
        }
    });

    // 高亮当前可视区域的标题对应的目录项
    function highlightCurrentHeading() {
        let currentHeadingId = null;
        let offset = window.innerHeight * 0.25; // 设定一个偏移量，确保标题进入视口就被检测

        headings.forEach(function (heading) {
            const rect = heading.getBoundingClientRect();

            // 当标题的上边缘在偏移量以上，且下边缘在视口内时，认为该标题处于可视区域
            if (rect.top < offset && rect.bottom > 0) {
                currentHeadingId = heading.id;
            }
        });

        if (currentHeadingId) {
            tocList.querySelectorAll('a').forEach(function (a) {
                if (a.getAttribute('href').substring(1) === currentHeadingId) {
                    a.style.color = '#bc6462'; // 高亮颜色
                    a.style.textDecoration = 'underline'; // 使用下划线代替字体加粗
                } else {
                    a.style.color = ''; // 恢复默认颜色
                    a.style.textDecoration = ''; // 去掉下划线
                }
            });
        }
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            highlightCurrentHeading();
        } else {
            // 如果在页面顶部，清除所有高亮
            tocList.querySelectorAll('a').forEach(function (a) {
                a.style.color = ''; // 恢复默认颜色
                a.style.textDecoration = ''; // 去掉下划线
            });
        }
    });

    highlightCurrentHeading(); // 初始化时高亮

    // 拖动功能
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    toc.addEventListener('mousedown', function (event) {
        if (event.target.tagName.toLowerCase() === 'a') return; // 点击链接时不触发拖动

        event.preventDefault(); // 防止默认行为（如选择文本）

        // 初始化拖动状态
        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialLeft = toc.offsetLeft;
        initialTop = toc.offsetTop;

        // 绑定事件以响应鼠标移动
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // 添加拖动中的视觉反馈
        toc.style.transform = 'scale(1.05)';
    });

    function onMouseMove(event) {
        if (!isDragging) return;

        // 计算鼠标移动的距离
        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        // 更新目录位置
        toc.style.left = initialLeft + deltaX + 'px';
        toc.style.top = initialTop + deltaY + 'px';
    }

    function onMouseUp() {
        // 取消拖动状态
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        // 移除拖动中的视觉反馈
        toc.style.transform = 'scale(1)';
    }

    // 禁止默认的拖动行为
    toc.ondragstart = function () {
        return false;
    };

    // 创建目录切换按钮
    var tocToggle = document.createElement('button');
    tocToggle.id = 'toc-toggle';
    tocToggle.textContent = '隐藏目录'; // 初始按钮文字
    tocToggle.className = 'toc-toggle';
    document.body.appendChild(tocToggle);

    // 目录切换按钮事件
    tocToggle.addEventListener('click', function () {
        toc.classList.toggle('hidden'); // 切换目录显示状态

        // 切换按钮文字
        if (toc.classList.contains('hidden')) {
            tocToggle.textContent = '显示目录'; // 目录隐藏时的文字
            tocToggle.style.backgroundColor = '#487b96'; // 目录隐藏时的颜色
        } else {
            tocToggle.textContent = '隐藏目录'; // 目录显示时的文字
            tocToggle.style.backgroundColor = '#6f7f87'; // 目录显示时的颜色
        }
    });

    // 初始按钮颜色
    if (toc.classList.contains('hidden')) {
        tocToggle.style.backgroundColor = '#487b96'; // 目录隐藏时的颜色
    } else {
        tocToggle.style.backgroundColor = '#6f7f87'; // 目录显示时的颜色
    }
});
