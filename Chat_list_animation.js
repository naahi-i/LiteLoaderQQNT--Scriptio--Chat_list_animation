// ==UserScript==
// @name         Chat_list_animation
// @description  添加会话列表动画
// @version      1.0.0
// @homepageURL  https://github.com/naahi-i/LiteLoaderQQNT--Transitio--Chat_list_animation
// @author       naahi-i
// ==/UserScript==

// 选择目标容器
const container = document.querySelector('.recent-contact-list .viewport-list .viewport-list__inner');
const placeholder = document.querySelector('.recent-contact-list .viewport-list .viewport-list__placeholder');

let isRefreshAnimationPaused = false; // 标记是否暂停刷新动画

// 创建并插入 CSS 样式到 <head>
const style = document.createElement('style');
style.textContent = `
    /* 刷新效果 */
    .recent-contact-item.animate-addin {
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
    .recent-contact-item.recent-contact-item--selected {
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

document.head.appendChild(style);

if (container) {
    const elementIndexMap = new Map();
    const elementPositionMap = new Map(); // 存储元素的位置信息
    let pendingChanges = false;

    // 初始化每个元素的位置
    const initializeElementPositions = () => {
        const items = container.querySelectorAll('.recent-contact-item');
        items.forEach((item, index) => {
            elementIndexMap.set(item, index);
            const rect = item.getBoundingClientRect();
            elementPositionMap.set(item, rect.top);
        });
    };

    initializeElementPositions();

    // 创建 MutationObserver 实例监听 DOM 变化
    const observer = new MutationObserver(() => {
        if (!pendingChanges) {
            pendingChanges = true;

            requestAnimationFrame(() => {
                const items = container.querySelectorAll('.recent-contact-item');
                const animationsToApply = [];

                items.forEach((item, index) => {
                    const oldIndex = elementIndexMap.get(item);
                    const oldPosition = elementPositionMap.get(item);
                    const newPosition = item.getBoundingClientRect().top;

                    if (!isRefreshAnimationPaused && oldIndex !== undefined && index < oldIndex && newPosition < oldPosition) {
                        animationsToApply.push(item);
                    }

                    elementIndexMap.set(item, index);
                    elementPositionMap.set(item, newPosition);
                });

                animationsToApply.forEach(item => {
                    item.classList.add('animate-addin');
                    setTimeout(() => item.classList.remove('animate-addin'), 150); // 与 CSS 动画时长匹配
                });

                pendingChanges = false;
            });
        }
    });

    observer.observe(container, { childList: true, subtree: true });

} else {
    console.warn('没有找到目标容器。');
}

// 监听 .viewport-list__placeholder 中的 style.height 值变化
if (placeholder) {
    let previousHeight = placeholder.style.height;

    const heightObserver = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const currentHeight = placeholder.style.height;

                if (currentHeight !== previousHeight) {
                    isRefreshAnimationPaused = true;
                    // console.log('Refresh animation paused due to height change.');

                    previousHeight = currentHeight;

                    requestAnimationFrame(() => {
                        isRefreshAnimationPaused = false;
                        // console.log('Refresh animation resumed.');
                    });
                }
            }
        }
    });

    heightObserver.observe(placeholder, { attributes: true, attributeFilter: ['style'] });

} else {
    console.warn('没有找到 .viewport-list__placeholder 元素。');
}