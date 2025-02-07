/**
 * 將各種類型的內容格式化為適合顯示的 HTML
 * @param {*} content - 要格式化的內容
 * @returns {string} 格式化後的 HTML 字串
 */
function formatContent(content) {
    // 處理空值情況
    if (isEmptyValue(content)) {
        return '空值';
    }

    // 處理物件類型
    if (isObject(content)) {
        return formatObjectContent(content);
    }

    // 處理字串類型
    if (typeof content === 'string') {
        return formatStringContent(content);
    }

    // 其他類型直接轉為字串
    return String(content);
}

/**
 * 檢查值是否為空
 */
function isEmptyValue(value) {
    return value === undefined || 
           value === null || 
           value === '' || 
           (typeof value === 'string' && value.trim() === '');
}

/**
 * 檢查是否為物件類型
 */
function isObject(value) {
    return typeof value === 'object' && value !== null;
}

/**
 * 格式化物件內容
 */
function formatObjectContent(content) {
    try {
        const jsonString = JSON.stringify(content, null, 2);
        return jsonString === '{}' 
            ? '空值' 
            : wrapInCodeBlock(jsonString);
    } catch (e) {
        return wrapInCodeBlock(String(content));
    }
}

/**
 * 格式化字串內容
 */
function formatStringContent(content) {
    // 嘗試解析 JSON 字串
    try {
        const parsedJson = JSON.parse(content);
        return wrapInCodeBlock(JSON.stringify(parsedJson, null, 2));
    } catch (e) {
        // 如果不是有效的 JSON，但包含程式碼指示符號
        if (isCode(content)) {
            const cleanContent = removeQuotes(content);
            return wrapInCodeBlock(cleanContent);
        }
        // 一般字串直接返回
        return content;
    }
}

/**
 * 移除字串前後的引號
 */
function removeQuotes(str) {
    return str.trim().replace(/^["']|["']$/g, '');
}

/**
 * 將內容包裝在程式碼區塊中
 */
function wrapInCodeBlock(content) {
    return `<div class="code-block">${content}</div>`;
}

/**
 * 檢查文字是否包含程式碼指示符號
 */
function isCode(text) {
    const codeIndicators = ['{', '}', '[', ']', ':', ','];
    return codeIndicators.some(indicator => String(text).includes(indicator));
}