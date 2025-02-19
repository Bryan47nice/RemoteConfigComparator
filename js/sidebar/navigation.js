/**
 * navigation.js
 * 用於處理右側內容區的導航邏輯，包括加載 HTML/Markdown 文件、記錄歷史檔案路徑、返回上一頁等功能。
 */

// 單例堆疊，用於記錄內容歷史（只存儲檔案路徑）
let contentStack = [];

/**
 * 動態載入 HTML 文件並顯示在右側內容區
 * @param {string} url - 要載入的 HTML 文件路徑
 */
function showContent(url, isStack = true) {
    const content = document.getElementById('content-frame');
    const currentUrl = content.src;
    if(currentUrl === url){
        return;
    }// 在 fetch 成功後的 then 區塊中，處理 HTML 內容和執行 script
    if (isStack && currentUrl !== "") {
        contentStack.push(currentUrl);
    }
    content.src = url;
}

function goRoot(url){
    showContent(url);
    clearStack();
}

function clearStack(){
    contentStack = [];
}
/**
 * 返回上一頁的內容
 */
function goBack() {
    // 如果堆疊為空，顯示提示
    if (contentStack.length === 0) {
        return;
    }

    // 從堆疊中取出上一個檔案路徑
    previousUrl = contentStack.pop();

    // 根據檔案類型加載內容
    showContent(previousUrl,false);
}


/**
 * 處理內部 Markdown 鏈接的點擊事件
 */
function handleInternalLinks() {
    const content = document.getElementById('content-frame');
    const links = content.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href.endsWith('.md')) {
            link.addEventListener('click', event => {
                event.preventDefault();
                showContent(href);
            });
        }
    });
}

function resizeIframe() {
    const content = document.getElementById('content-frame');
    content.style.height = window.innerHeight + 'px'; // 設定 iframe 高度為視窗高度
  }