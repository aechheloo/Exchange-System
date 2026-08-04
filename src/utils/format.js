function formatMoney(value) {
    const number = Number(value || 0);
    const absolute = Math.abs(Math.round(number));
    const formatted = new Intl.NumberFormat("vi-VN").format(absolute);
    return number < 0 ? `-${formatted}đ` : `${formatted}đ`;
}

function formatPercent(value) {
    const number = Number(value || 0);
    return Number.isInteger(number)
        ? String(number)
        : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function parseMoney(text) {
    if (typeof text !== "string") return null;

    const normalized = text.trim().replace(/[^\d-]/g, "");
    if (!normalized || normalized === "-") return null;

    const value = Number(normalized);
    if (!Number.isSafeInteger(value) || value <= 0) return null;

    return value;
}

function displayName(from) {
    const name = [from.first_name, from.last_name]
        .filter(Boolean)
        .join(" ")
        .trim();

    return name || from.username || String(from.id);
}

module.exports = {
    formatMoney,
    formatPercent,
    parseMoney,
    displayName
};
