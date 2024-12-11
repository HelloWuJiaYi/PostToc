<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;

/**
 * 一个可以随意拖动的目录，右下角可以选择显示或隐藏。<br>
 * 
 * 详细说明及插件更新，请查阅： <a target="_blank" href="https://github.com/HelloWuJiaYi/PostToc/" rel="noopener noreferrer">PostToc</a> 
 * 
 * @package PostToc
 * @version 1.4.1
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
        
        $defaultDisplay = new Typecho_Widget_Helper_Form_Element_Radio(
            'defaultDisplay', 
            array('1' => '是', '0' => '否'),
            '1', 
            _t('默认显示目录'),  
            _t('加载文章页面时，是否显示目录。')
        );
        $form->addInput($defaultDisplay);

        // 手机端目录按钮显示设置
        $mobileDisplay = new Typecho_Widget_Helper_Form_Element_Radio(
            'mobileDisplay', 
            array('1' => '显示', '0' => '隐藏'),
            '1', 
            _t('手机端显示目录按钮'), 
            _t('选择是否在手机端显示目录按钮。')
        );
        $form->addInput($mobileDisplay);
        
        $offset = new Typecho_Widget_Helper_Form_Element_Text(
            'offset', 
            NULL, 
            '10', 
            _t('滚动偏移量'),  
            _t('设置文章标题距离页面导航栏的偏移量，以像素为单位，避免被动态导航栏遮挡。')
        );
        $form->addInput($offset);

        // 新增目录上下位置偏移量设置
        $verticalOffset = new Typecho_Widget_Helper_Form_Element_Text(
            'verticalOffset', 
            NULL, 
            '0', 
            _t('目录垂直位置偏移量'),  
            _t('负数向上移动，正数向下移动，以像素为单位。')
        );
        $form->addInput($verticalOffset);
    
        // 新增目录左右位置偏移量设置
        $horizontalOffset = new Typecho_Widget_Helper_Form_Element_Text(
            'horizontalOffset', 
            NULL, 
            '0', 
            _t('目录水平位置偏移量'),  
            _t('负数向左移动，正数向右移动，以像素为单位。')
        );
        $form->addInput($horizontalOffset);
    
        $textColor = new Typecho_Widget_Helper_Form_Element_Text(
            'textColor', 
            NULL, 
            '#777777', 
            _t('目录项文字颜色'),  
            _t('输入十六进制颜色代码，例如：#777777。')
        );
        $form->addInput($textColor);
        
        $activeTextColor = new Typecho_Widget_Helper_Form_Element_Text(
            'activeTextColor', 
            NULL, 
            '#bc6462', 
            _t('选中状态文字颜色'),  
            _t('输入十六进制颜色代码，例如：#bc6462。')
        );
        $form->addInput($activeTextColor);
        
        $backgroundColor = new Typecho_Widget_Helper_Form_Element_Text(
            'backgroundColor', 
            NULL, 
            '#C8C8C870', 
            _t('目录项背景色块颜色（含透明度）'),  
            _t('输入十六进制颜色代码，包括透明度，例如：#C8C8C870。最后两位表示透明度，00 为全透明，FF 为不透明。')
        );
        $form->addInput($backgroundColor);
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
            $textColor = Typecho_Widget::widget('Widget_Options')->plugin('PostToc')->textColor;
            $activeTextColor = Typecho_Widget::widget('Widget_Options')->plugin('PostToc')->activeTextColor;
            $backgroundColor = Typecho_Widget::widget('Widget_Options')->plugin('PostToc')->backgroundColor;
            $verticalOffset = Typecho_Widget::widget('Widget_Options')->plugin('PostToc')->verticalOffset; // 获取垂直偏移量
            $horizontalOffset = Typecho_Widget::widget('Widget_Options')->plugin('PostToc')->horizontalOffset; // 获取水平偏移量

            echo '<script>';
            echo 'var defaultDisplay = ' . json_encode($defaultDisplay) . ';';
            echo 'var navbarOffset = ' . json_encode($offset) . ';';
            echo 'var mobileDisplay = ' . json_encode($mobileDisplay) . ';';  // 输出手机端显示设置
            echo 'var textColor = ' . json_encode($textColor) . ';';
            echo 'var activeTextColor = ' . json_encode($activeTextColor) . ';';
            echo 'var backgroundColor = ' . json_encode($backgroundColor) . ';';
            echo 'var verticalOffset = ' . json_encode($verticalOffset) . ';'; // 输出垂直偏移量
            echo 'var horizontalOffset = ' . json_encode($horizontalOffset) . ';'; // 输出水平偏移量
            echo '</script>';
            echo '<script src="' . Helper::options()->pluginUrl . '/PostToc/static/script.js"></script>';
        }
    }
}
