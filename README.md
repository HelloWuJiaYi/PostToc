## PostToc :page_with_curl:

适用于 Typecho 1.2.1 版本的文章目录插件，可以使用鼠标随意拖动目录到任意位置，避免遮挡文章内容。文章页面右下角可以选择显示或隐藏目录。

## 使用说明 :mag_right:

1. 下载后重命名文件夹为 `PostToc`
2. 将文件夹放在插件目录 `~/usr/plugins/`。
3. 启动插件。

## 隐藏/显示目录按钮 :wrench:

将下方代码插入在 `usr/themes/default/post.php` 文件中。

```
<!-- 隐藏/显示目录按钮 -->
<button id="toc-toggle" class="toc-toggle"></button>
```

插入位置：

![WX20240816-115348@2x](https://github.com/user-attachments/assets/8b48f456-ad76-4467-a44c-3df37e1cce9c)

## 安装效果 :tada:

目录效果：[博客](https://www.wujiayi.vip/index.php/archives/210/)
(点击右下角“显示目录”)

## 适配主题列表 :hourglass:

|主题名称 | 是否适配|
| --- | --- |
|Typecho 的默认主题|已适配 :white_check_mark:|
|Jasmine|已适配 :white_check_mark:|

没有适配的主题可以在 Issues 上反馈

## 版本更新 :floppy_disk:

### 2024-09-23 V1.2.0: 
1. 适配更多主题。

### 2024-08-17 V1.1.0: 
1. 增加使用说明。
2. 增加“默认是否显示目录”选项。

### 2024-08-14 V1.0.0: 
1. 实现目录基本功能。
2. 拖动目录到任意位置，避免目录遮挡文章内容。
3. 显示或隐藏目录按钮。
4. 适配手机端。
5. 随文章滚动高亮相应的目录项。
