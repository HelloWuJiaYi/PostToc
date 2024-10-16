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
 * @version 1.3.0
 * @author 吴佳轶
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

    public static function config(Typecho_Widget_Helper_Form $form)
    {
        // 文本说明
        $instructions = new Typecho_Widget_Helper_Form_Element_Textarea(
            'instructions', 
            NULL, 
            '<!-- 隐藏/显示目录按钮 -->
<button id="toc-toggle" class="toc-toggle"></button>',
            _t('设置按钮'), 
            _t('在 post.php 文件中的<a href="https://github.com/HelloWuJiaYi/PostToc" target="_blank" style="color: #ff5500;">适当位置</a>插入以上代码，用来设置 “隐藏/显示目录"的按钮。')
        );
        $instructions->input->setAttribute('style', 'width: 100%; height: 100%; background-color: #f9f9f9; border: 1px solid #ddd;');
        $instructions->input->setAttribute('readonly', 'readonly');
        $form->addInput($instructions);
        
        // 默认显示选项
        $defaultDisplay = new Typecho_Widget_Helper_Form_Element_Radio(
            'defaultDisplay', 
            array('1' => '是', '0' => '否'),
            '1', 
            _t('默认显示目录'),  
            _t('设置加载文章页面时是否显示目录。')
        );
        $form->addInput($defaultDisplay);

        // 滚动偏移量设置
        $offset = new Typecho_Widget_Helper_Form_Element_Text(
            'offset', 
            NULL, 
            '0',  // 默认偏移量，单位为像素
            _t('滚动偏移量'),  
            _t('设置标题滚动时的偏移量，以像素为单位，避免被导航栏遮挡。')
        );
        $form->addInput($offset);

        // 手机端目录按钮显示设置
        $mobileDisplay = new Typecho_Widget_Helper_Form_Element_Radio(
            'mobileDisplay', 
            array('1' => '显示', '0' => '隐藏'),
            '1', 
            _t('手机端显示目录按钮'), 
            _t('选择是否在手机端显示目录按钮。')
        );
        $form->addInput($mobileDisplay);
    }

    public static function personalConfig(Typecho_Widget_Helper_Form $form){}

    public static function renderHeader()
    {
        $widget = Typecho_Widget::widget('Widget_Archive');
        if ($widget->is('single') && !$widget->is('page')) {
            echo '<link rel="stylesheet" href="' . Helper::options()->pluginUrl . '/PostToc/static/style.css">';
        }
    }

    public static function renderFooter()
    {
        $widget = Typecho_Widget::widget('Widget_Archive');
        if ($widget->is('single') && !$widget->is('page')) {
            $defaultDisplay = Typecho_Widget::widget('Widget_Options')->plugin('PostToc')->defaultDisplay;
            $offset = Typecho_Widget::widget('Widget_Options')->plugin('PostToc')->offset;
            $mobileDisplay = Typecho_Widget::widget('Widget_Options')->plugin('PostToc')->mobileDisplay;

            echo '<script>';
            echo 'var defaultDisplay = ' . json_encode($defaultDisplay) . ';';
            echo 'var navbarOffset = ' . json_encode($offset) . ';';
            echo 'var mobileDisplay = ' . json_encode($mobileDisplay) . ';';  // 输出手机端显示设置
            echo '</script>';
            echo '<script src="' . Helper::options()->pluginUrl . '/PostToc/static/script.js"></script>';
        }
    }
}
