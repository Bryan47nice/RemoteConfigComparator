function createConditionElement(name = '', userType = 0, text = '', color = 0, startTime = '', endTime = '', url = '',isExpand = true) {
    const conditionsContainer = document.getElementById('conditionsContainer');
    const conditionDiv = document.createElement('div');
    conditionDiv.className = 'condition';

    // 生成條件的 HTML 結構
    conditionDiv.innerHTML = isExpand?`
        <dev style="display:flex;flex-direction:row; gap:20px;">
            <input type="text" class="condition-title" styles="flex:1;" value=${name} />
            <button type="button" class="expand-button" style= "width:35px;height:35px;background-color: var(--button-bg);">${" ˄ "}</button>
        </dev>
        <label class="required" for="userType">用戶類型：</label>
        <select required>
            <option value=null">請選擇</option>
            <option value=0 ${userType === 0 ? 'selected' : ''}>全部用戶</option>
            <option value=1 ${userType === 1 ? 'selected' : ''}>專業版用戶</option>
            <option value=2 ${userType === 2 ? 'selected' : ''}>免費版用戶</option>
        </select>

        <label class="required" for="text">文本內容：</label>
        <textarea rows="2" required>${text}</textarea>

        <label for="color">顏色 (預設白)：</label>
        <select>
            ${generateColorOptions(color)}
        </select>

        <label for="startTime">開始時間：</label>
        <input type="text" class="start-time" placeholder="YYYY/MM/DD HH:MM" value="${startTime}">

        <label for="endTime">結束時間：</label>
        <input type="text" class="end-time" placeholder="YYYY/MM/DD HH:MM" value="${endTime}">

        <label for="url">URL (有填寫網址才具備跳轉功能唷！)：</label>
        <input type="url" class="url-input" placeholder="請輸入完整的 URL" value="${url}">

        <button type="button" class="remove-button">刪除條件</button>
    `:
    `
        <dev style="display:flex;flex-direction:row; gap:20px;width:100%;">
            <dev style="flex:1 ;display:flex;flex-direction:row; gap:20px;"width:90%>
                <label class="condition-title"style="white-space: nowrap;">${name}</label>
                <label >${getUserType(userType)}</label>
                <label>${getTimeCondition(startTime,endTime)}</label>
                <div class="marquee" style="flex:1 ;max-width:100%;overflow:hidden"> 
                    <span class="marquee-text">${text}</span>
                </div>
            </dev>
            <button type="button" class="remove-button" style= "width:35px;height:35px;background-color: var(--error-color);">${" x "}</button>
            <button type="button" class="expand-button" style= "width:35px;height:35px;background-color: var(--button-bg);">${" ˅ "}</button>
        </dev>
    `;

    // 將條件元素添加到容器
    conditionsContainer.appendChild(conditionDiv);
    const marqueeText = conditionDiv.querySelector(".marquee-text");
    if(marqueeText!==null){
        marqueeText.style.color = getColor(color);
    }
    // 初始化 Flatpickr 日期選擇器
    const startTimeInput = conditionDiv.querySelector('.start-time');
    const endTimeInput = conditionDiv.querySelector('.end-time');
    if(startTimeInput !== null && endTimeInput !== null){
        let startPicker = flatpickr(startTimeInput, {
            enableTime: true,
            dateFormat: "Y/m/d H:i",
            defaultDate: startTime || null,
            onChange: function (selectedDates) {
                // 當開始時間改變時，更新結束時間的最小值
                if (selectedDates.length > 0) {
                    const minEndTime = selectedDates[0];
                    endPicker.set('minDate', minEndTime);
                }
            }
        });
        let endPicker = flatpickr(endTimeInput, {
            enableTime: true,
            dateFormat: "Y/m/d H:i",
            defaultDate: endTime || null,
            onChange: function (selectedDates) {
                if (selectedDates.length > 0) {
                    const endTime = selectedDates[0];
                    const startTime = startPicker.selectedDates[0];
                    if (startTime && endTime <= startTime) {
                        endPicker.close();
                        endPicker.clear(); // 清空錯誤的結束時間
                    }
                }
            }
        });
    }


    // 綁定刪除按鈕的功能
    const removeButton = conditionDiv.querySelector('.remove-button');
    if(removeButton!==null){
        removeButton.addEventListener('click', () => {
            conditionsContainer.removeChild(conditionDiv);
        });
    }

    return conditionDiv;
}
function getColor(colorInt){
    const colorClasses = [
        `var(--condition-white)` ,
        `var(--condition-black)` ,
        `var(--condition-orange)` ,
        `var(--condition-red)` ,
        `var(--condition-green)` ,
        `var(--condition-blue)` ,
        `var(--condition-purple)` ,
    ];
    return colorClasses[colorInt];
}
function getUserType(userType){
    const userTypeClasses = [
        '全部用戶',
        '專業版用戶',
        '免費版用戶',
    ]
    return userTypeClasses[userType];
}
function getTimeCondition(startTime, endTime){
    return startTime==="" && endTime===""
    ? ""
    :startTime===""
    ?`until ${endTime}`
    :endTime===""
    ?`since ${startTime}`
    :`${startTime} ~ ${endTime}`
}
// 生成顏色選項
function generateColorOptions(selectedColor) {
    const colors = [
        { value: 0, label: '白' },
        { value: 1, label: '黑' },
        { value: 2, label: '橘' },
        { value: 3, label: '紅' },
        { value: 4, label: '綠' },
        { value: 5, label: '藍' },
        { value: 6, label: '紫' },
    ];
    return colors
        .map(color => `<option value=${color.value} ${color.value === selectedColor ? 'selected' : ''}>${color.label}</option>`)
        .join('');
}

// 生成條件名稱（遞增字母：A-Z, AA-ZZ）
function generateConditionName(counter) {
    let name = '';
    while (counter >= 0) {
        name = String.fromCharCode(65 + (counter % 26)) + name;
        counter = Math.floor(counter / 26) - 1;
    }
    return "條件"+name;
}

// 將函數掛載到全域物件上
window.conditionFactory = {
    createConditionElement
};