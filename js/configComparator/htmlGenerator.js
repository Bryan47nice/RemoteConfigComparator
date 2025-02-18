/**
 * 根據比較結果生成 HTML 內容
 * @param {Object} changes - 包含變更、新增與刪除項目的物件
 * @returns {string} 生成的 HTML 字串
 */
function generateChangesHtml(changes) {
    let html = '';
    
    // 處理變更項目
    if (changes["變更"].length > 0) {
        html += generateChangeTable(changes["變更"]);
    }

    // 處理新增項目
    if (changes["新增"].length > 0) {
        html += generateAdditionTable(changes["新增"]);
    }

    // 處理刪除項目
    if (changes["刪除"].length > 0) {
        html += generateDeletionTable(changes["刪除"]);
    }

    // 如果沒有任何變更
    if (!changes["變更"].length && !changes["新增"].length && !changes["刪除"].length) {
        html = '<p>沒有發現任何差異。</p>';
    }

    return html;
}

/**
 * 生成變更項目的表格
 */
function generateChangeTable(changes) {
    return `
        <h2>變更項目</h2>
        <table class="change-table">
            <thead>
                <tr>
                    <th>parameterGroups</th>
                    <th>parameters</th>
                    <th>類別</th>
                    <th>原本內容</th>
                    <th>變更內容</th>
                </tr>
            </thead>
            <tbody>
                ${changes.map(change => `
                    <tr>
                        <td>${change.group || ''}</td>
                        <td>${change.parameter || ''}</td>
                        <td>${change.valueType || ''}</td>
                        <td>${formatContent(change.oldValue)}</td>
                        <td>${formatContent(change.newValue)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * 生成新增項目的表格
 */
function generateAdditionTable(additions) {
    return `
        <h2>新增項目</h2>
        <table class="add-delete-table">
            <thead>
                <tr>
                    <th>parameterGroups</th>
                    <th>parameters</th>
                    <th>資料類別</th>
                    <th>描述</th>
                    <th>新增內容</th>
                </tr>
            </thead>
            <tbody>
                ${additions.map(addition => `
                    <tr>
                        <td>${addition.group || ''}</td>
                        <td>${addition.parameter || ''}</td>
                        <td>${addition.valueType || ''}</td>
                        <td>${addition.description || ''}</td>
                        <td>${formatContent(addition.value)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * 生成刪除項目的表格
 */
function generateDeletionTable(deletions) {
    return `
        <h2>刪除項目</h2>
        <table class="add-delete-table">
            <thead>
                <tr>
                    <th>parameterGroups</th>
                    <th>parameters</th>
                    <th>資料類別</th>
                    <th>描述</th>
                    <th>刪除內容</th>
                </tr>
            </thead>
            <tbody>
                ${deletions.map(deletion => `
                    <tr>
                        <td>${deletion.group || ''}</td>
                        <td>${deletion.parameter || ''}</td>
                        <td>${deletion.valueType || ''}</td>
                        <td>${deletion.description || ''}</td>
                        <td>${formatContent(deletion.value)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}