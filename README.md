## PostToc

适用于 Typecho 1.2.1 版本的文章目录插件，可以使用鼠标随意拖动目录到任意位置，避免遮挡文章内容。文章页面右下角可以选择显示或隐藏目录。

## 使用说明

1. 下载后重命名文件夹为 `PostToc`
2. 将文件夹放在插件目录 `~/usr/plugins/`。
3. 启动插件。

## 隐藏/显示目录按钮

将下方代码插入在 `usr/themes/default/post.php` 文件中。

```
<!-- 隐藏/显示目录按钮 -->
<button id="toc-toggle" class="toc-toggle"></button>
```

插入位置：

![WX20240816-115348@2x](https://github.com/user-attachments/assets/8b48f456-ad76-4467-a44c-3df37e1cce9c)


## 效果

![屏幕录制2024-08-16 12-03-10_1](https://github.com/user-attachments/assets/f37a6e1b-0d18-4526-aec4-96eb7f72a5b6)

## 版本更新

### V1.0.0: 
1. 实现目录基本功能。
2. 拖动目录到任意位置，避免目录遮挡文章内容。
3. 显示或隐藏目录按钮。
4. 适配手机端。
5. 随文章滚动高亮相应的目录项。
