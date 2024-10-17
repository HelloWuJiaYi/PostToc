document.addEventListener("DOMContentLoaded", function () {
    
    if (typeof mobileDisplay !== 'undefined' && mobileDisplay === '0' && window.innerWidth <= 768) {
        if (document.querySelector('#post-toc')) {
            document.querySelector('#post-toc').remove();
        }
        if (document.querySelector('.toc-toggle')) {
            document.querySelector('.toc-toggle').remove();
        }
        return; 
    }
    
    document.querySelectorAll('#post-toc ul li a').forEach(function(a) {
        a.style.color = textColor;  
    });
    
    var selectors = [
        '.post-content', 
        '.entry-content', 
        '.article-content', 
        '.markdown-body', 
        '.content-body',
        '.joe_detail'
    ];

    var content = null;

    for (var i = 0; i < selectors.length; i++) {
        content = document.querySelector(selectors[i]);
        if (content) break;
    }

    if (!content) {
        console.error("无法找到文章内容容器。请检查类名或添加新的选择器。");
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

    function setTocPosition() {
        const contentRect = content.getBoundingClientRect();

        if (window.innerWidth > 768) { 
            toc.style.position = 'fixed';
            toc.style.top = '200px';
            toc.style.left = (contentRect.left - toc.offsetWidth - 65) + 'px';
        } else { 
            toc.style.position = 'fixed';
            toc.style.bottom = '70px';
            toc.style.right = '20px';
            toc.style.left = 'auto';
            toc.style.top = 'auto';
            toc.style.width = '300px'; 
        }
    }
    
    setTocPosition();
    
    window.addEventListener('resize', setTocPosition);
    
    toc.addEventListener('click', function (event) {
        if (event.target.tagName.toLowerCase() === 'a') {
            event.preventDefault();
            var targetId = event.target.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);
    
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - navbarOffset, 
                    behavior: 'smooth'
                });
    
                history.pushState(null, null, '#' + targetId);
            }
        }
    });
    
    function highlightCurrentHeading() {
        let currentHeadingId = null;
        const offset = 100;

        for (let i = 0; i < headings.length; i++) {
            const rect = headings[i].getBoundingClientRect();
            if (rect.top <= offset) {
                currentHeadingId = headings[i].id;
            } else {
                break;
            }
        }

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
    
    window.addEventListener('scroll', highlightCurrentHeading);
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

    if (typeof defaultDisplay !== 'undefined' && defaultDisplay === '0') {
        toc.classList.add('hidden');
        tocToggle.textContent = '显示目录';
    } else {
        toc.classList.remove('hidden');
        tocToggle.textContent = '隐藏目录';
    }

    tocToggle.addEventListener('click', function () {
        toc.classList.toggle('hidden');
        tocToggle.textContent = toc.classList.contains('hidden') ? '显示目录' : '隐藏目录';
    });
});
