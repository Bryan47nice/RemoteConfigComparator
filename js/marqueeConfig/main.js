

const conditionArray = [];

// DOM 元素
const addButton = document.getElementById("addButton");
const conditionsContainer = document.getElementById("conditionsContainer");
const jsonOutput = document.getElementById("jsonOutput");

// 點擊 + 按鈕
addButton.addEventListener("click", function () {
    addCondition(conditionArray);
    updateConditionsContainer(conditionArray);
    updateJsonOutput(conditionArray);
});

function addCondition(array) {
    const condition = {
        name: generateConditionName(array.length),
        userType: 0,
        text: "",
        color: 0,
        startTime: "",
        endTime: "",
        url: "",
        isExpand : true
    };
    array.push(condition);
}

// 更新條件容器
function updateConditionsContainer(array) {
    // 清空容器
    conditionsContainer.innerHTML = "";

    // 生成每個條件的表單
    array.forEach((condition, index) => {
        const conditionElement = createConditionElement(
            condition.name,
            condition.userType,
            condition.text,
            condition.color,
            condition.startTime,
            condition.endTime,
            condition.url,
            condition.isExpand
        );

        // 綁定事件：更新陣列內容
        bindConditionEvents(conditionElement, condition, index);

        // 添加到容器
        conditionsContainer.appendChild(conditionElement);
    });
}
// 綁定表單事件
function bindConditionEvents(element, condition, index) {
    const userTypeSelect = element.querySelector("select");
    const textArea = element.querySelector("textarea");
    const colorSelect = element.querySelector("select:nth-of-type(2)");
    const startTimeInput = element.querySelector(".start-time");
    const endTimeInput = element.querySelector(".end-time");
    const urlInput = element.querySelector(".url-input");
    const nameInput = element.querySelector(".condition-title");
    const removeButton = element.querySelector(".remove-button");
    const isExpenedButton = element.querySelector(".expand-button");

    // 更新陣列內容並同步 JSON
    nameInput?.addEventListener("input", () => {
        condition.name = nameInput.value; // 僅更新 UI 的名稱
    });
    userTypeSelect?.addEventListener("change", () => {
        condition.userType = parseInt(userTypeSelect.value);
        updateJsonOutput(conditionArray);
    });
    textArea?.addEventListener("input", () => {
        condition.text = textArea.value;
        updateJsonOutput(conditionArray);
    });
    colorSelect?.addEventListener("change", () => {
        condition.color = parseInt(colorSelect.value);
        updateJsonOutput(conditionArray);
    });
    startTimeInput?.addEventListener("input", () => {
        condition.startTime = startTimeInput.value;
        updateJsonOutput(conditionArray);
    });
    endTimeInput?.addEventListener("input", () => {
        condition.endTime = endTimeInput.value;
        updateJsonOutput(conditionArray);
    });
    urlInput?.addEventListener("input", () => {
        condition.url = urlInput.value;
        updateJsonOutput(conditionArray);
    });
    isExpenedButton?.addEventListener("click", () => {
        condition.isExpand = !condition.isExpand;
        updateConditionsContainer(conditionArray);
    });

    // 刪除按鈕事件處理
    removeButton?.addEventListener("click", () => {
        // 從陣列中移除對應條件
        conditionArray.splice(index, 1);

        // 更新條件容器和 JSON 輸出
        updateConditionsContainer(conditionArray);
        updateJsonOutput(conditionArray);
    });
}

// 更新右側 JSON 輸出
function updateJsonOutput(array) {
    // 過濾掉 `name` 屬性
    const filteredArray = JSON.stringify(array, (key, value) => {
        if (key === "name" || key ==="isExpand" ) return undefined; // 過濾掉 name
        return value;
    }, 2);

    jsonOutput.textContent = filteredArray;
}
