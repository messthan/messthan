// 1. 等页面所有资源加载完毕
// window.onload = function() {}

// 2. 等页面内容加载完毕
document.addEventListener('DOMContentLoaded', function () {

    // 经常需要使用 querySelector  querySelectorAll
    // 2.1 封装  getTag   getTags

    // 2.2 切换选项 - 封装
    tabs('.goods-detail-tab > a', '.category, .brands', 'active');
    tabs('.goods-intro > ul li', '.pro-intros > div', 'active');


    // 3. 处理缩略图
    ; (function () {

        // 3.1 动态展示缩略图的小图
        // 根据 goodsData 中的 imgsrc 这个数组进行遍历
        var imgArr = goodsData.imgsrc || [];
        var ulBox = getTag('.thumb-list > ul');
        imgArr.forEach(function (item, index) {
            var li = document.createElement('li');
            // var img = document.createElement('img');
            var img = new Image();
            // 图片要指定路径
            img.src = item.s;
            li.appendChild(img);
            ulBox.appendChild(li);

            // 给每一个li元素赋值一个索引
            li.dataset.index = index;
        })
        // 动态设置ulBox的宽度
        var liMargin = parseInt(getStyle(ulBox.children[0], 'margin-right'));
        var imgWidth = ulBox.children[0].offsetWidth + liMargin;
        ulBox.style.width = imgWidth * ulBox.children.length + 'px';

        // 3.2 切换显示缩略图的主图
        ulBox.addEventListener('click', function (event) {
            // 根据事件目标元素，判断是否为 LI 
            var target = event.target.parentNode;
            if (target.nodeName === 'LI') {
                // 排他
                for (var i = 0; i < ulBox.children.length; i++) {
                    ulBox.children[i].removeAttribute('class');
                }
                target.className = 'cur';

                // target.dataset.index 是提前在生成li的时候就创建了的
                getTag('#small_img').src = imgArr[target.dataset.index].s;
                getTag('#big_img').src = imgArr[target.dataset.index].b;
            }
        })

        // 3.3 点击左右按钮，滑动缩略图的小图
        var count = 0;
        getTag('#thumb_left').addEventListener('click', function () {
            count -= 2;
            if (count < 0) {
                count = 0;
                return
            }
            if (count === 1) {
                count = 0;
            }
            ulBox.style.transform = 'translate(' + -imgWidth * count + 'px)';
        })
        getTag('#thumb_right').addEventListener('click', function () {
            var maxStep = ulBox.children.length - 5;
            if (count < maxStep) count += 2;
            else {
                count = maxStep - 1;
                return
            }
            if (count > maxStep) count--;
            ulBox.style.transform = 'translate(' + -imgWidth * count + 'px)';
        })


        // 3.4 完成主图和大图的联动
        // 遮罩的大小 / 主图的大小 = 大图盒子的大小 / 大图的大小
        var bigImg = getTag('.big-img');
        var showBigImg = getTag('.show-big-img');
        var bigImage = getTag('#big_img');
        function renderMask() {
            var maskWidth = showBigImg.clientWidth / bigImage.clientWidth * bigImg.clientWidth;
            // console.log(maskWidth);
            getTag('.mask').style.width = maskWidth + 'px';
            getTag('.mask').style.height = maskWidth + 'px';
        }

        // 鼠标经过
        bigImg.addEventListener('mouseover', function () {
            getTag('.mask').style.display = 'block';
            showBigImg.style.display = 'block';
            renderMask();
            // 鼠标经过
            bigImg.addEventListener('mousemove', moveMask);
        })
        bigImg.addEventListener('mouseout', function () {
            getTag('.mask').style.display = 'none';
            showBigImg.style.display = 'none';
            bigImg.removeEventListener('mousemove', moveMask);
        })

        showBigImg.addEventListener('mouseenter', function () {
            getTag('.mask').style.display = 'none';
            showBigImg.style.display = 'none';
        })

        // 鼠标移动的事件处理函数
        function moveMask(event) {
            // console.log(event.clientX, event.clientY);
            var mask = getTag('.mask')
            var obj = this.getBoundingClientRect()

            // 求出可以移动的距离
            var distanceX = event.clientX - obj.left - (mask.offsetWidth / 2);
            var distanceY = event.clientY - obj.top - (mask.offsetWidth / 2);

            if (distanceX <= 0) {
                distanceX = 0;
            }
            if (distanceY <= 0) {
                distanceY = 0;
            }

            var maxMoveX = bigImg.clientWidth - mask.clientWidth;
            var maxMoveY = bigImg.clientHeight - mask.clientHeight;

            if (distanceX >= maxMoveX) {
                distanceX = maxMoveX;
            }

            if (distanceY >= maxMoveY) {
                distanceY = maxMoveY;
            }

            mask.style.top = distanceY + 'px';
            mask.style.left = distanceX + 'px';

            // 根据mask移动的距离计算出大图片移动的距离
            // 主图移动的距离 / 主图能移动的最大距离 = 大图移动的距离 / 大图能移动的最大距离
            var bigMaxMoveX = bigImage.clientWidth - showBigImg.clientWidth;
            var bigMaxMoveY = bigImage.clientHeight - showBigImg.clientHeight;
            var imgx = distanceX / maxMoveX * bigMaxMoveX;
            var imgy = distanceY / maxMoveY * bigMaxMoveY;

            bigImage.style.transform = 'translate(' + -imgx + 'px, ' + -imgy + 'px)';
        }
    })()

})