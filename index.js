window.addEventListener('load', function () {
    // 轮播图
    initCarousel()
    // 获得月数据并渲染折线图
    XHRreq('month', monthHandle)
    // 获得周数据并渲染饼状图和柱状图
    XHRreq('week', weekHandle)
    //  导航条滑块效果
    slid()





})
// 定时器
function dingshiqi(obj, target, callback) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var step = (target - obj.offsetLeft) / 10;
        step = step > 0 ? Math.ceil(step) : Math.floor(step);
        if (obj.offsetLeft == target) {
            clearInterval(obj.timer)
            if (callback) {
                callback();
            }
        }
        obj.style.left = obj.offsetLeft + step + 'px';
    }, 15);
}
// 导航条滑块效果
function slid() {
    let slid = document.querySelector('.slid')
    let navigation = document.querySelectorAll('.content1 .navs span')
    console.log(navigation);
    navigation.forEach((item) => {
        item.addEventListener('mouseover', function () {
            let x = slid.offsetLeft
            let xx = item.offsetLeft
            console.log(x, xx)
            dingshiqi(slid, xx)
        })
        item.addEventListener('mouseout', function () {
            let x = document.querySelector('.courent').offsetLeft
            console.log(x)
            dingshiqi(slid, x)
        })
        item.addEventListener('click', function () {
            navigation.forEach(aa => {
                aa.className = ''
            })
            item.className = 'courent'

        })
    })
}
// 轮播图
function initCarousel() {
    //左右点击
    var left = document.querySelector('.left');
    var right = document.querySelector('.right');
    var bothSides = document.querySelector('.both-sides');
    var lr = document.querySelector('.lr');
    // mouseover/mouseout
    bothSides.addEventListener('mouseover', function () {
        left.style.display = 'block';
        right.style.display = 'block';
        clearInterval(timess);
        timess = null;
    })
    bothSides.addEventListener('mouseout', function () {
        left.style.display = 'none';
        right.style.display = 'none';
        timess = setInterval(function () {
            handle()
        }, 1500)
    })

    var lrwidth = lr.offsetWidth
    // 小圆圈
    var ul = bothSides.querySelector('ul')
    var ol = bothSides.querySelector('.circle')
    for (var i = 0; i < ul.children.length; i++) {
        var li = document.createElement('li');
        li.setAttribute('index', i)
        ol.appendChild(li);
        li.addEventListener('click', function () {

            for (var i = 0; i < ol.children.length; i++) {
                ol.children[i].className = '';
            }
            this.className = 'cur'
            var index = this.getAttribute('index')
            num = yuandian = index;
            console.log(index);
            console.log(bothSideswidth);
            dingshiqi(ul, -index * lrwidth);
        })
    }
    ol.children[0].className = 'cur'
    // 克隆第一张图片放最后
    var diyi = ul.children[0].cloneNode(true)
    ul.appendChild(diyi)

    // 点击左按钮
    var num = 0;
    var yuandian = 0;
    left.addEventListener('click', function () {
        if (num == 0) {
            num = ul.children.length - 1;
            ul.style.left = -num * lrwidth + 'px';

        }
        num--;
        dingshiqi(ul, -num * lrwidth)
        yuandian--
        if (yuandian < 0) {
            yuandian = ol.children.length - 1;
        }
        for (let i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
            ol.children[yuandian].className = 'cur'
        }
    })

    // 点击右按钮
    function handle() {
        if (num == ul.children.length - 1) {
            ul.style.left = 0;
            num = 0
        }
        num++;
        dingshiqi(ul, -num * lrwidth)
        yuandian++
        if (yuandian == ul.children.length - 1) {
            yuandian = 0;
        }
        for (let i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        ol.children[yuandian].className = 'cur'
    }
    right.addEventListener('click', handle)
    // 自动播放
    var timess = setInterval(function () {
        handle()
    }, 1500)

}
// 初始化echarts
function initChart(className, option) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.querySelector(className)
    );
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
// 获得数据
function XHRreq(type, fn) {
    let xhr = new XMLHttpRequest()
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 300) {
                fn(xhr.response.data)
            }
        }

    }
    xhr.open('get', `https://edu.telking.com/api/?type=${type}`, 'false')    //调用open()方法打开链接
    xhr.send()                          //发送请求

}
// 月数据处理函数
function monthHandle(data) {
    // 指定图表的配置项和数据
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.xAxis
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: "{value} 人",
            },
        },
        series: [
            {
                data: data.series,
                type: 'line',
                areaStyle: {},
                label: {
                    show: true,
                    color: "#4587f0"
                },
                areaStyle: {
                    opacity: 0.2,
                    color: "#4587f0"
                },
                lineStyle: {
                    color: "#4587f0"
                },
                itemStyle: {
                    borderWidth: 1,
                    color: "#fff",
                    borderColor: '#9ebef7'
                },
                smooth: true,
                symbol: (value, data) => {
                    let index = data.dataIndex
                    if (index % 2 == 0) {
                        return 'none'
                    } else {
                        return ''
                    }

                },
                symbolSize: 10
            }
        ]
    };
    initChart('.echart', option, data)
}
// 周数据处理函数
function weekHandle(data) {
    let arr = [];
    data.series.forEach((item, index) => {
        let obj = { name: '', value: '' };
        obj.value = item
        obj.name = data.xAxis[index]
        arr.push(obj)
    });
    console.log(arr);




    let pieOption = {
        title: {
            text: '饼状图数据展示',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },

        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '70%',
                // data: [
                //     { value: 1048, name: 'Search Engine' },
                //     { value: 735, name: 'Direct' },
                //     { value: 580, name: 'Email' },
                //     { value: 484, name: 'Union Ads' },
                //     { value: 300, name: 'Video Ads' }
                // ],
                data: arr,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    let barOption = {
        title: {
            text: '柱状图数据展示',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: data.xAxis,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: "商品数",
            }
        ],
        series: [
            {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: data.series
            }
        ]
    };
    initChart('.pie-chart', pieOption, data)
    initChart('.bar-chart', barOption, data)
}

