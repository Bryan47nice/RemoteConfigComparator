// DOM 元素參照
const oldFileInput = document.getElementById('oldFile');
const newFileInput = document.getElementById('newFile');
const compareButton = document.getElementById('compareButton');
const resultsDiv = document.getElementById('results');
const fileInfoDiv = document.getElementById('fileInfo');
const changesContentDiv = document.getElementById('changesContent');
const timestampDiv = document.getElementById('timestamp');

// 檢查檔案選擇狀態
function checkFiles() {
    compareButton.disabled = !(oldFileInput.files.length && newFileInput.files.length);
}

// 綁定檔案輸入事件
oldFileInput.addEventListener('change', checkFiles);
newFileInput.addEventListener('change', checkFiles);

// 比較按鈕點擊處理
compareButton.addEventListener('click', async () => {
    const oldFile = oldFileInput.files[0];
    const newFile = newFileInput.files[0];

    try {
        // 讀取並解析 JSON 檔案
        const oldData = JSON.parse(await oldFile.text());
        const newData = JSON.parse(await newFile.text());

        // 比較 JSON 內容
        const changes = compareJson(oldData, newData);
        
        // 更新檔案資訊
        fileInfoDiv.innerHTML = `
            <h3>檔案比較</h3>
            <p>舊檔案: ${oldFile.name}</p>
            <p>新檔案: ${newFile.name}</p>
        `;
        
        // 生成並顯示比較結果
        changesContentDiv.innerHTML = generateChangesHtml(changes);
        
        // 更新時間戳記
        updateTimestamp();
        
        // 顯示結果區域
        resultsDiv.style.display = 'block';
    } catch (error) {
        alert('檔案解析錯誤：' + error.message);
    }
});

/**
 * 更新時間戳記
 */
function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-TW', { 
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    timestampDiv.textContent = `執行時間：${timeString}`;
}