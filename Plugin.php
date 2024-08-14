<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
/**
 * 文章目录：
 * 
 * 鼠标可以拖动目录到任意位置，点击页面右下角的按钮可以显示目录或隐藏目录。<br>
 * 
 * 详细说明及更新请查阅： <a target="_blank" href="https://github.com/HelloWuJiaYi/PostToc/" rel="noopener noreferrer">PostToc</a> 
 * 
 * @package PostToc
 * @author 吴佳轶
 * @version 1.0.0
 * @link https://www.wujiayi.vip
 */
class PostToc_Plugin implements Typecho_Plugin_Interface
{
    public static function activate()
    {
        Typecho_Plugin::factory('Widget_Archive')->header = array('PostToc_Plugin', 'renderHeader');
        Typecho_Plugin::factory('Widget_Archive')->footer = array('PostToc_Plugin', 'renderFooter');
    }

    public static function deactivate(){}

    public static function config(Typecho_Widget_Helper_Form $form){}

    public static function personalConfig(Typecho_Widget_Helper_Form $form){}

    public static function renderHeader()
    {
        // 仅在普通文章页面加载样式
        $widget = Typecho_Widget::widget('Widget_Archive');
        if ($widget->is('single') && !$widget->is('page')) {
            echo '<link rel="stylesheet" href="' . Helper::options()->pluginUrl . '/PostToc/static/style.css">';
        }
    }

    public static function renderFooter()
    {
        // 仅在普通文章页面加载脚本
        $widget = Typecho_Widget::widget('Widget_Archive');
        if ($widget->is('single') && !$widget->is('page')) {
            echo '<script src="' . Helper::options()->pluginUrl . '/PostToc/static/script.js"></script>';
        }
    }
}
