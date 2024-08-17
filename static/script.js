document.addEventListener("DOMContentLoaded", function () {
    var content = document.querySelector('.post-content');
    if (!content) {
        console.error("无法找到文章内容容器。请检查类名。");
        return;
    }

    var toc = document.createElement('div');
    toc.id = 'post-toc';
    toc.innerHTML = '<h3>目录</h3><ul></ul>';
    content.parentNode.insertBefore(toc, content);

    var headings = content.querySelectorAll('h1, h2, h3, h4, h5, h6');
    var tocList = toc.querySelector('ul');

    let minLevel = 7;
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

        var level = parseInt(heading.tagName.substring(1));
        li.style.marginLeft = (level - minLevel) * 20 + 'px';
        tocList.appendChild(li);
    });

    toc.addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'a') {
            event.preventDefault();
            var targetId = event.target.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 10,
                    behavior: 'smooth'
                });

                history.pushState(null, null, '#' + targetId);
            }
        }
    });

    function highlightCurrentHeading() {
        let currentHeadingId = null;
        let offset = window.innerHeight * 0.25;

        headings.forEach(function (heading) {
            const rect = heading.getBoundingClientRect();

            if (rect.top < offset && rect.bottom > 0) {
                currentHeadingId = heading.id;
            }
        });

        if (currentHeadingId) {
            tocList.querySelectorAll('a').forEach(function (a) {
                if (a.getAttribute('href').substring(1) === currentHeadingId) {
                    a.style.color = '#bc6462';
                    a.style.textDecoration = 'underline';
                } else {
                    a.style.color = '';
                    a.style.textDecoration = '';
                }
            });
        }
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY > 0) {
            highlightCurrentHeading();
        } else {
            tocList.querySelectorAll('a').forEach(function (a) {
                a.style.color = '';
                a.style.textDecoration = '';
            });
        }
    });

    highlightCurrentHeading();

    let isDragging = false;
    let startX, startY, initialLeft, initialTop;

    toc.addEventListener('mousedown', function (event) {
        if (event.target.tagName.toLowerCase() === 'a') return;

        event.preventDefault();

        isDragging = true;
        startX = event.clientX;
        startY = event.clientY;
        initialLeft = toc.offsetLeft;
        initialTop = toc.offsetTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        toc.style.transform = 'scale(1.05)';
    });

    function onMouseMove(event) {
        if (!isDragging) return;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        toc.style.left = initialLeft + deltaX + 'px';
        toc.style.top = initialTop + deltaY + 'px';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        toc.style.transform = 'scale(1)';
    }

    toc.ondragstart = function () {
        return false;
    };

    var tocToggle = document.createElement('button');
    tocToggle.id = 'toc-toggle';
    tocToggle.className = 'toc-toggle';
    document.body.appendChild(tocToggle);

    // 设置目录和按钮的初始状态
    if (defaultDisplay === '0') {
        toc.classList.add('hidden');
        tocToggle.textContent = '显示目录';
        tocToggle.style.backgroundColor = '#487b96';
    } else {
        toc.classList.remove('hidden');
        tocToggle.textContent = '隐藏目录';
        tocToggle.style.backgroundColor = '#6f7f87';
    }

    tocToggle.addEventListener('click', function () {
        toc.classList.toggle('hidden');

        if (toc.classList.contains('hidden')) {
            tocToggle.textContent = '显示目录';
            tocToggle.style.backgroundColor = '#487b96';
        } else {
            tocToggle.textContent = '隐藏目录';
            tocToggle.style.backgroundColor = '#6f7f87';
        }
    });

    if (toc.classList.contains('hidden')) {
        tocToggle.style.backgroundColor = '#487b96';
    } else {
        tocToggle.style.backgroundColor = '#6f7f87';
    }
});
