// ==UserScript==
// @name         Chat_list_animation(JavaScrip)
// @description  Chat_list_animation的js配置
// @version      0.0.2
// @homepageURL  https://github.com/naahi-i/LiteLoaderQQNT--Transitio--Chat_list_animation
// @author       naahi-i
// ==/UserScript==

// 选择目标容器
const container = document.querySelector('.recent-contact-list .viewport-list .viewport-list__inner');

// 确保目标容器存在
if (container) {
    // 存储每个元素的初始索引
    const elementIndexMap = new Map();

    // 初始化每个元素的位置
    const initializeElementPositions = () => {
        const items = container.querySelectorAll('.list-item');
        items.forEach((item, index) => {
            elementIndexMap.set(item, index);
        });
    };

    // 记录初始顺序
    initializeElementPositions();

    let pendingChanges = false;

    // 创建 MutationObserver 实例
    const observer = new MutationObserver(() => {
        if (!pendingChanges) {
            pendingChanges = true;

            // 使用 requestAnimationFrame 确保所有 DOM 变化处理后再执行动画逻辑
            requestAnimationFrame(() => {
                const items = container.querySelectorAll('.list-item');

                items.forEach((item, index) => {
                    const oldIndex = elementIndexMap.get(item);

                    if (oldIndex !== undefined && index < oldIndex) {
                        // 元素向前移动，应用动画
                        item.classList.add('animate-addin');
                        setTimeout(() => item.classList.remove('animate-addin'), 200);
                    }

                    // 更新元素的位置记录
                    elementIndexMap.set(item, index);
                });

                pendingChanges = false;
            });
        }
    });

    const config = { childList: true, subtree: true };
    observer.observe(container, config);

} else {
    console.warn('没有找到目标容器。');
}
