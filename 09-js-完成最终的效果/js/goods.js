document.addEventListener('DOMContentLoaded', function () {
    // 商品的信息和参数展示
    var goodsInfo = goodsData.goodsDetail || {};

    // 1. 展示商品的信息
    ; (function () {
        getTag('.goods-price > h3').textContent = goodsInfo.title;
        getTag('.goods-price .tips').textContent = goodsInfo.recommend;
        // getTag('.goods-price #price').textContent = goodsInfo.price;
        // getTag('.goods-price .comment').textContent = goodsInfo.evaluateNum;

        // getTag('.goods-price .sales em').textContent = goodsInfo.promoteSales.type;
        // getTag('.goods-price .sales span').textContent = goodsInfo.promoteSales.content;

        getTag('.goods-price .others-info > li:first-child p').textContent = goodsInfo.support;
        getTag('.goods-price .others-info > li:last-child p').textContent = goodsInfo.address;


        // 传统的es5的写法
        /*
        var str = '\
            <ul>\
                <li>\
                    <span>价格</span>\
                    <p class="func-price">\
                        ¥ <strong>'+ goodsInfo.price + '</strong> 降价通知\
                    </p>\
                    <em>累计评论 <i>'+ goodsInfo.evaluateNum + '</i></em>\
                </li>\
                <li>\
                    <span>促销</span>\
                    <p class="sales">\
                        <em>'+ goodsInfo.promoteSales.type + '</em>\
                        <span>'+ goodsInfo.promoteSales.content + '</span>\
                    </p>\
                </li>\
            </ul>\
        '
        */

        // es6 的写法
        var str = `
            <ul>
                <li>
                    <span>价格</span>
                    <p class="func-price">
                        ¥ <strong>${goodsInfo.price}</strong> 降价通知
                    </p>
                    <em>累计评论 <i>${goodsInfo.evaluateNum}</i></em>
                </li>
                <li>
                    <span>促销</span>
                    <p class="sales">
                        <em>${goodsInfo.promoteSales.type}</em>
                        <span>${goodsInfo.promoteSales.content}</span>
                    </p>
                </li>
            </ul>
        `;

        // 渲染
        getTag('.func').innerHTML = str;
    })();

    // 2. 展示商品的参数
    /*
        `
            <li>
                <span>选择颜色</span>
                <p>
                    <a href="javascript:;">金色</a>
                    <a href="javascript:;">银色</a>
                    <a href="javascript:;">黑色</a>
                </p>
            </li>
        `;
    */

    ; (function () {
        var tagsArr = goodsInfo.crumbData || [];
        var ulBox = getTag('.goods-config > ul');

        // 遍历数组，动态创建li和里面的元素
        tagsArr.forEach(function (item, index) {
            var li = createE('li')
            li.innerHTML = '<span>' + item.title + '</span>';
            var pBox = createE('p');

            // 根据 item.data 遍历产生a标签
            item.data.forEach(function (val, key) {
                var a = createE('a');
                a.href = 'javascript:;';
                a.textContent = val.type
                pBox.appendChild(a);

                // a.onclick = function () {
                //     console.log(index, val);
                // }
                // 把对应的数据给当前的a都存起来
                a.index = index;
                a.val = val;
            })

            li.appendChild(pBox);
            ulBox.appendChild(li)
        })
    })();


    // 3. 根据参数动态展示选择的tag
    // 3.3 取消选中的tag，移出对应的盒子，取消对应的高亮
    var tagsArr = new Array(4);
    ; (function () {
        // 3.1 点击的是上面的a标签，先做样式的排他
        var ulBox = getTag('.goods-config > ul');
        ulBox.addEventListener('click', function (event) {
            var target = event.target;
            if (target.nodeName === 'A') {
                // 排他 
                var tags = target.parentNode.children;
                for (var i = 0; i < tags.length; i++) {
                    tags[i].removeAttribute('class');
                }
                target.className = 'cur';

                // 求对应li的索引会很难，求对应a的价格信息也很很难
                // 3.2 动态展示对应的标签，按位置显示
                // console.log(target.index, target.val);
                tagsArr[target.index] = target.val;

                rednerTags();

                changeFinallPrice();
            }
        })

        function rednerTags() {
            var str = '';
            tagsArr.forEach(function (item, index) {
                if (!item) return
                // `<a href="javascript:;">金色 <i>x</i></a>`;
                str += `<a href="javascript:;">${item.type} <i data-index="${index}">x</i></a>`;
            })
            getTag('.current-chooes').innerHTML = str;
        }

        // 3.3 移除选中的配置 
        getTag('.current-chooes').addEventListener('click', function (event) {
            var target = event.target;
            if (target.nodeName === 'I') {
                var i = target.dataset.index
                // 在数组中移出对应的数据，然后再遍历
                tagsArr[i] = null;

                // 重新渲染dom
                rednerTags();

                // 计算最终价格
                changeFinallPrice();

                // 移除对应的高亮
                var anchors = ulBox.children[i].querySelectorAll('a');
                anchors.forEach(function (el) {
                    el.removeAttribute('class');
                })
            }
        })
    })();

    // 4. 显示商品的联动的价格
    var priceData = {
        _base: goodsInfo.price,
        get base() {
            // 4.1 通过参数计算基本价格
            var total = this._base;
            tagsArr.forEach(function (item) {
                if (!item) return
                total += item.changePrice;
            })

            // 4.2 通过数量，计算基本总价格
            total *= this.num;
            return total;
        },

        // 商品数量
        _num: 1,
        get num() {
            return this._num;
        },
        set num(n) {
            if (n < 1) {
                n = 1;
                alert("最少购买一个喔！")
            }
            this._num = n;
            // 通过DOM更新
            renderPrice();
        },

        // 最终加上套餐的数据
        _finaPrice: 0,
        get finaPrice() {
            return this._finaPrice;
        },
        set finaPrice(n) {
            this._finaPrice = n;
        }
    };

    // 4.3 初次渲染价格
    renderPrice();
    function renderPrice() {
        getTag('.func-price strong').textContent = priceData.base;
        getTag('.chooes-con-left > p > span > i').textContent = priceData.base;
        getTag('#chooes_goods_count').textContent = priceData.num;

        // 特殊的，下面的四个套餐，一个都没有选中才会使用该价格
        var checks = Array.from(getTags('.chooes-con-left > ul input[type=checkbox]'));
        var bool = checks.some(function (el) {
            return el.checked;
        })
        getTag('.price > span').textContent = bool ? priceData.finaPrice : priceData.base;
    }

    // 5. 动态计算商品的价格
    ; (function () {
        var numsInput = getTag('.nums input');
        var addNum = getTag('.nums button:first-child');
        var sumNum = getTag('.nums button:last-child');

        // 点击增加和减少数量的事件
        addNum.addEventListener('click', function () {
            priceData.num++
            numsInput.value = priceData.num;
            changeFinallPrice();
        })
        sumNum.addEventListener('click', function () {
            priceData.num--
            numsInput.value = priceData.num;
            changeFinallPrice();
        })

        // 给输入表单注册一个失去焦点的事件
        numsInput.addEventListener('blur', function () {
            if (!/^\d{1,}$/.test(this.value)) {
                this.value = 1;
                alert('只能输入数字')
                return
            }
            priceData.num = this.value;
            changeFinallPrice();
        })
    })()

    // 6. 选择商品的其他信息，动态修改价格
    // 6.1 找到4个复选框
    var checks = getTags('.chooes-con-left > ul input[type=checkbox]');
    checks.forEach(function (item) {
        item.addEventListener('click', changeFinallPrice);
    })

    function changeFinallPrice() {
        // 重新计算商品的价格，（基于现有的价格，再加上选中的套餐，）
        // 每次点击复选框的时候，都要找一下当前所有选中的input框
        var checkedBox = getTags('.chooes-con-left > ul input:checked');
        var finaNum = priceData.base;
        checkedBox.forEach(function (el) {
            var count = el.nextElementSibling.children[0].textContent - 0;
            // 基于这些数据，对之前的基本数据进行操作
            finaNum += count * priceData.num
            console.log(count);
        })

        // 赋值给对象的那个属性
        priceData.finaPrice = finaNum;
        renderPrice();
    }
})