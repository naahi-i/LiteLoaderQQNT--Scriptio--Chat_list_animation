// ==UserScript==
// @name         Chat_list_animation
// @description  添加会话列表动画
// @version      0.0.3
// @homepageURL  https://github.com/naahi-i/LiteLoaderQQNT--Transitio--Chat_list_animation
// @author       naahi-i
// ==/UserScript==

// 选择目标容器
const container = document.querySelector('.recent-contact-list .viewport-list .viewport-list__inner');

// 创建并插入 CSS 样式到 <head>
const style = document.createElement('style');
style.textContent = `
    /* 刷新效果 */
    .list-item.animate-addin {
        animation: addin 0.15s ease-out !important;
    }

    @keyframes addin {
        from {
            margin-bottom: -50px;
            opacity: 0%;
        }
        to {
            margin-bottom: 0;
            opacity: 100%;
            transform: none;
        }
    }

    /* 选中效果 */
    .list-item.list-item--selected {
        animation: press-and-bounce 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes press-and-bounce {
        0% {
            transform: scale(1) translateY(0);
        }
        50% {
            transform: scale(0.98) translateY(2px);
        }
        100% {
            transform: scale(1) translateY(0);
        }
    }
`;
//======================================================

document.head.appendChild(style);

if (container) {
    const elementIndexMap = new Map();
    const elementPositionMap = new Map(); // 存储元素的位置信息
    let pendingChanges = false;

    // 初始化每个元素的位置
    const initializeElementPositions = () => {
        const items = container.querySelectorAll('.list-item');
        items.forEach((item, index) => {
            elementIndexMap.set(item, index);
            // 存储初始位置信息
            const rect = item.getBoundingClientRect();
            elementPositionMap.set(item, rect.top);
        });
    };

    initializeElementPositions();

    // 创建 MutationObserver 实例
    const observer = new MutationObserver(() => {
        if (!pendingChanges) {
            pendingChanges = true;

            // 使用 requestAnimationFrame 确保所有 DOM 变化处理后再执行动画逻辑
            requestAnimationFrame(() => {
                const items = container.querySelectorAll('.list-item');
                const animationsToApply = [];

                items.forEach((item, index) => {
                    const oldIndex = elementIndexMap.get(item);
                    const oldPosition = elementPositionMap.get(item);
                    const newPosition = item.getBoundingClientRect().top;

                    if (oldIndex !== undefined && index < oldIndex && newPosition < oldPosition) {
                        // 元素因消息更新向前移动，记录需要应用动画的元素
                        animationsToApply.push(item);
                    }

                    // 更新元素的位置记录
                    elementIndexMap.set(item, index);
                    elementPositionMap.set(item, newPosition);
                });

                // 批量应用动画
                requestAnimationFrame(() => {
                    animationsToApply.forEach(item => {
                        item.classList.add('animate-addin');
                        setTimeout(() => item.classList.remove('animate-addin'), 200);
                    });

                    pendingChanges = false;
                });
            });
        }
    });

    const config = { childList: true, subtree: true };
    observer.observe(container, config);

    // 添加滚动事件监听器
    container.addEventListener('scroll', () => {
        console.log('发生滚动');
    });

} else {
    console.warn('没有找到目标容器。');
}
