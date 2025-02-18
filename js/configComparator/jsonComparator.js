/**
 * 比較兩個 JSON 物件的差異
 * @param {Object} old - 舊的 JSON 物件
 * @param {Object} new_ - 新的 JSON 物件
 * @param {string[]} pathArray - 目前比較的路徑陣列
 * @param {string} currentGroup - 目前的群組名稱
 * @returns {Object} 包含變更、新增與刪除項目的物件
 */
function compareJson(old, new_, pathArray = [], currentGroup = "") {
    const changes = {"變更": [], "新增": [], "刪除": []};
    
    if (pathArray.some(p => p.toLowerCase().includes("version"))) {
        return changes;
    }

    if (typeof old === 'object' && old !== null && typeof new_ === 'object' && new_ !== null) {
        const allKeys = new Set([...Object.keys(old), ...Object.keys(new_)]);
        
        for (const key of allKeys) {
            const currentPathArray = [...pathArray, key];
            processKey(currentPathArray, old, new_, key, currentGroup, changes);
        }
    }
    return changes;
}

/**
 * 處理單個鍵值的比較邏輯
 */
function processKey(pathArray, old, new_, key, currentGroup, changes) {
    let groupName = determineGroupName(currentGroup, pathArray, key);
    
    if (!(key in old) && (key in new_)) {
        handleAddition(pathArray, new_, key, groupName, changes);
    } else if ((key in old) && !(key in new_)) {
        handleDeletion(pathArray, old, key, groupName, changes);
    } else if (!isEqual(old[key], new_[key])) {
        handleChange(pathArray, old[key], new_[key], key, groupName, changes);
    }
}

/**
 * 判斷群組名稱
 */
function determineGroupName(currentGroup, pathArray, key) {
    if (pathArray.includes("parameterGroups") && !currentGroup) {
        return key;
    }
    return currentGroup;
}

/**
 * 處理新增項目
 */
function handleAddition(pathArray, new_, key, groupName, changes) {
    const pathString = pathArray.join('.');
    if (pathString.includes("parameters")) {
        let newValue = new_[key].defaultValue ? new_[key].defaultValue.value : new_[key]
        changes["新增"].push({
            group: pathArray[1],
            path: pathArray,
            parameter:formatPathArray(pathArray),
            valueType: getValueType(newValue,pathString,pathArray),
            description: new_[key].description || '',
            value: newValue
        });
    }
}

/**
 * 處理刪除項目
 */
function handleDeletion(pathArray, old, key, groupName, changes) {
    const pathString = pathArray.join('.');
    if (pathString.includes("parameters")) {
        let oldValue = old[key].defaultValue ? old[key].defaultValue.value : old[key]
        changes["刪除"].push({
            group: pathArray[1],
            path: pathArray,
            parameter:formatPathArray(pathArray),
            valueType: getValueType(oldValue,pathString,pathArray),
            description: old[key].description || '',
            value: oldValue
        });
    }
}

/**
 * 處理變更項目
 */
function handleChange(pathArray, oldValue, newValue, key, groupName, changes) {
    const pathString = pathArray.join('.');
    if (typeof oldValue !== 'object' || typeof newValue !== 'object') {
        changes["變更"].push({
            group: pathArray[1],
            path: pathArray,
            parameter:formatPathArray(pathArray),
            oldValue: oldValue,
            newValue: newValue,
            valueType: getValueType(newValue,pathString,pathArray)
        });
    }

    if (typeof oldValue === 'object' && typeof newValue === 'object') {
        const subChanges = compareJson(oldValue, newValue, pathArray, groupName);
        for (const [changeType, entries] of Object.entries(subChanges)) {
            changes[changeType].push(...entries);
        }
    }
}

/**
 * 判斷兩個值是否相等
 */
function isEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => isEqual(a[key], b[key]));
}

/**
 * 根據條件判斷字串內容的類型
 * @param {any} newValue - 要判斷的值
 * @param {string} pathString - 路徑的字串表示
 * @param {Array} pathArray - 路徑的陣列表示
 * @returns {string} - 返回值的類型 (Number, String, Object, Array, URL, 群組描述, 或 Invalid)
 */
function getValueType(newValue, pathString = '', pathArray = []) {
    // 判斷是否為 "群組描述"
    if (pathString.includes("parameterGroups") && pathArray[pathArray.length - 1] === "description") {
        return '群組描述';
    }

    // 判斷是否為數字
    if (typeof newValue === 'string' && !isNaN(Number(newValue))) {
        return 'Number';
    }

    // 判斷是否為 URL，僅支持 http 和 https
    const urlPattern = /^(https?):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
    if (typeof newValue === 'string' && urlPattern.test(newValue)) {
        return 'URL';
    }

    // 判斷是否為陣列 (用 JSON 格式且首尾是方括號)
    if (typeof newValue === 'string' && /^\[.*\]$/.test(newValue)) {
        try {
            const parsed = JSON.parse(newValue);
            if (Array.isArray(parsed)) {
                return 'Array';
            }
        } catch (e) {
            return 'Invalid'; // 無法解析為合法的 JSON
        }
    }

    // 判斷是否為物件 (用 JSON 格式且首尾是大括號)
    if (typeof newValue === 'string' && /^\{.*\}$/.test(newValue)) {
        try {
            const parsed = JSON.parse(newValue);
            if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                return 'Object';
            }
        } catch (e) {
            return 'Invalid'; // 無法解析為合法的 JSON
        }
    }

    // 如果都不符合，則為一般字串
    return 'String';
}

/**
 * 格式化輸入的路徑字串，提取 `parameters` 之後的部分
 * @param {string} pathString - 完整的路徑字串
 * @returns {string} - 格式化後的路徑字串
 */
function formatPathArray(pathArray) {

    // 如果Array的最後部分是 "description"，返回空字串
    if (pathArray[pathArray.length-1] == 'description') {
        return '';
    }

    // 找到 "parameters" 的索引位置
    const parametersIndex = pathArray.indexOf('parameters');
    // 如果 "parameters" 存在，返回其後的部分
    if (parametersIndex !== -1) {
        return pathArray.slice(parametersIndex + 1).join('.');
    }

    // 如果沒有找到 "parameters"，返回原始字串
    return pathString;
}