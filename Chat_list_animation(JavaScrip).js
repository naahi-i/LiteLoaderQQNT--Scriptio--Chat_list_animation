// ==UserScript==
// @name         Chat_list_animation(JavaScrip)
// @description  Chat_list_animation的js配置
// @version      0.0.1
// @homepageURL  https://github.com/naahi-i/LiteLoaderQQNT--Transitio--Chat_list_animation
// @author       naahi-i
// ==/UserScript==

// 选择目标容器
const container = document.querySelector('.recent-contact-list .viewport-list .viewport-list__inner');

// 确保目标容器存在
if (container) {
    // 存储 aria-label 属性值的映射，以便比较前后的值
    const ariaLabelMap = new WeakMap();

    // 创建一个 MutationObserver 实例，并将回调函数与之关联
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            const target = mutation.target;

            // 检查目标元素是否是不含 .recent-contact-item--top 的第一个子元素
            const firstNonTopItem = container.querySelector('.list-item:not(.recent-contact-item--top)');
            if (target === firstNonTopItem) {
                // 如果是第一个不含 .recent-contact-item--top 的子元素，跳过接下来的全部逻辑
                continue;
            }

            // 如果是属性变化
            if (mutation.type === 'attributes' && mutation.attributeName === 'aria-label') {
                // 获取 aria-label 属性的新值，并确保它是一个有效的字符串
                const newAriaLabel = target.getAttribute('aria-label') || '';
                
                // 获取 aria-label 属性的旧值，并确保它是一个有效的字符串
                const oldAriaLabel = ariaLabelMap.get(target) || '';
                
                // 忽略 aria-label 中的所有数字
                const removeNumbers = (text) => text.replace(/\d+/g, '').trim();

                const newAriaLabelWithoutNumbers = removeNumbers(newAriaLabel);
                const oldAriaLabelWithoutNumbers = removeNumbers(oldAriaLabel);

                // 比较新旧值，忽略数字
                if (newAriaLabelWithoutNumbers !== oldAriaLabelWithoutNumbers) {
                    // 当 aria-label 变化且新旧值不同（忽略数字）时，添加 data-add-animation 属性
                    target.setAttribute('data-add-animation', 'true');

                    // 使用独立的延迟函数处理动画
                    delayRemoveAnimation(target, 200);
                }

                // 更新 aria-label 映射
                ariaLabelMap.set(target, newAriaLabel);
            }
        }
    });

    // 配置观察选项（观察哪些变更）
    const config = { attributes: true, attributeFilter: ['aria-label'], subtree: true };

    // 开始观察目标容器及其子元素的指定变更
    observer.observe(container, config);

    // 初始化 aria-label 映射
    container.querySelectorAll('.list-item').forEach(item => {
        ariaLabelMap.set(item, item.getAttribute('aria-label') || '');
    });
} else {
    console.warn('没有找到目标容器。');
}

// 延迟移除 data-add-animation 属性的函数
function delayRemoveAnimation(element, delay) {
    // 使用 Promise 和 setTimeout 进行延迟操作
    return new Promise(resolve => {
        setTimeout(() => {
            element.removeAttribute('data-add-animation');
            resolve();
        }, delay);
    });
}
