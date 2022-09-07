// 函数库

/**
 * 获取一个元素和多个元素
 * @param str  选择器标识符
 */
function getTag(str) {
    return document.querySelector(str);
}
function getTags(str) {
    return document.querySelectorAll(str);
}

/**
 * 创建一个元素的封装
 * @param str  标签的名称
 */
function createE(str) {
    return document.createElement(str);
}

/**
 * 处理选项卡的切换
 * @param th tab 选项卡的头部切换对象
 * @param tb tab 选项卡的切换内容
 * @param cls 要切换的高亮类名
 */
function tabs(th, tb, cls) {
    getTags(th).forEach(function (item, index) {
        item.addEventListener('click', function () {
            // 排他
            getTags(th).forEach(function (el, i) {
                el.removeAttribute('class')
                getTags(tb)[i].style.display = 'none';
            })
            getTags(th)[index].className = cls;
            getTags(tb)[index].style.display = 'block';
        })
    })
}


/**
 * 获取元素的计算属性
 * @param Elment ele 元素
 * @param String attr css属性名
 * @param String 计算属性值
 */
function getStyle(ele, attr) {
    if (window.getComputedStyle) {
        return getComputedStyle(ele)[attr];
    } else {
        return ele.currentStyle[attr];
    }
}


/**
 * 封装函数，实现选项卡效果
 * @params tabBtns NodeList 选项卡按钮的集合 
 * @params tabItems NodeList 选项卡选项的集合
 * @params activeClass  string 选中之后要添加的类名  默认值 active
 */
function tab(tabBtns, tabItems, activeClass = 'active') {
    // 遍历所有的选项卡按钮
    tabBtns.forEach(function (tabBtn, index) {
        // 给每个按钮监听 click 事件
        tabBtn.addEventListener('click', function () {
            // 排他第一步 所有的按钮以及选项去掉 active 类
            tabBtns.forEach(function (item, itemIndex) {
                item.classList.remove(activeClass); // 去掉所有按钮的 active 类
                tabItems[itemIndex].classList.remove(activeClass);  // 去掉所有选项的 active 类型
            });
            // 排他第二步 当前点击的按钮和对应的选项，添加 active 类型
            tabBtn.classList.add(activeClass);
            tabItems[index].classList.add(activeClass);
        });
    });
};