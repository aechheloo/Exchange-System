const pool = require("./config/database");
const {
    formatMoney,
    formatPercent,
    parseMoney,
    displayName
} = require("./utils/format");
const {
    isSuperAdminUser,
    ensureSuperAdminUser,
    canOperateGroup
} = require("./services/authService");
const {
    getGroupByTelegramId,
    listGroups,
    setupGroup,
    updateGroupName,
    updateGroupFee
} = require("./services/groupService");
const {
    addMoney,
    subtractMoney,
    closeDay,
    getTodayTransactions
} = require("./services/transactionService");

const MENU = {
    reply_markup: {
        resize_keyboard: true,
        is_persistent: true,
        keyboard: [
            ["➕ Tiền vào", "➖ Tiền ra"],
            ["📄 Giao dịch", "📊 Báo cáo"],
            ["📋 Chốt"]
        ]
    }
};

function registerBot(bot) {
    const states = new Map();

    function stateKey(msg) {
        return `${msg.chat.id}:${msg.from.id}`;
    }

    async function notifySuperAdmin(text, sourceChatId) {
        const target = process.env.SUPER_ADMIN_CHAT_ID;
        if (!target || String(target) === String(sourceChatId)) return;

        try {
            await bot.sendMessage(target, text);
        } catch (error) {
            console.error("SUPER ADMIN NOTIFY ERROR:", error.message);
        }
    }

    async function requireRegisteredGroup(msg) {
        if (!["group", "supergroup"].includes(msg.chat.type)) {
            await bot.sendMessage(
                msg.chat.id,
                "❌ Chức năng này chỉ dùng trong nhóm Telegram."
            );
            return null;
        }

        const group = await getGroupByTelegramId(msg.chat.id);

        if (!group) {
            await bot.sendMessage(
                msg.chat.id,
`❌ Nhóm này chưa được cài đặt.

Super Admin gửi:
/setupgroup Tên nhóm|6`
            );
            return null;
        }

        return group;
    }

    async function requirePermission(msg, group) {
        const allowed = await canOperateGroup(msg.from.id, group.id);

        if (!allowed) {
            await bot.sendMessage(
                msg.chat.id,
                "❌ Bạn không có quyền thao tác trong nhóm này."
            );
        }

        return allowed;
    }

    bot.onText(/^\/start(?:@\w+)?$/, async (msg) => {
        await ensureSuperAdminUser(msg.from);

        const text =
`✅ Exchange System đang hoạt động.

Lệnh chung:
/id — Xem Chat ID và User ID
/menu — Hiện các nút thao tác
/cancel — Hủy thao tác đang nhập

Super Admin:
/setupgroup Tên nhóm|Phí
/groups
/addstaff UserID|Tên nhân viên
/grant UserID|Mã nhóm
/revoke UserID|Mã nhóm
/setfee Mã nhóm|Phí
/renamegroup Mã nhóm|Tên mới`;

        await bot.sendMessage(msg.chat.id, text, MENU);
    });

    bot.onText(/^\/menu(?:@\w+)?$/, async (msg) => {
        await bot.sendMessage(
            msg.chat.id,
            "Chọn chức năng:",
            MENU
        );
    });

    bot.onText(/^\/id(?:@\w+)?$/, async (msg) => {
        await bot.sendMessage(
            msg.chat.id,
`📌 THÔNG TIN ID

Chat ID:
${msg.chat.id}

User ID:
${msg.from.id}`
        );
    });

    bot.onText(/^\/cancel(?:@\w+)?$/, async (msg) => {
        states.delete(stateKey(msg));
        await bot.sendMessage(msg.chat.id, "✅ Đã hủy thao tác.", MENU);
    });

    bot.onText(/^\/setupgroup(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
        if (!isSuperAdminUser(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, "❌ Bạn không có quyền.");
        }

        if (!["group", "supergroup"].includes(msg.chat.type)) {
            return bot.sendMessage(
                msg.chat.id,
                "❌ Hãy gửi lệnh này ngay trong nhóm cần quản lý."
            );
        }

        const input = (match[1] || "").trim();
        const [rawName, rawFee] = input.split("|").map((part) => part?.trim());

        if (!rawName || rawFee === undefined) {
            return bot.sendMessage(
                msg.chat.id,
`Cách dùng:
/setupgroup Tên nhóm|6

Ví dụ:
/setupgroup Hà Nội VIP|6`
            );
        }

        const fee = Number(rawFee.replace(",", "."));
        if (!Number.isFinite(fee) || fee < 0 || fee > 100) {
            return bot.sendMessage(
                msg.chat.id,
                "❌ Phí phải là số từ 0 đến 100."
            );
        }

        const group = await setupGroup({
            telegramGroupId: msg.chat.id,
            groupName: rawName,
            feePercent: fee,
            actorUserId: msg.from.id
        });

        await bot.sendMessage(
            msg.chat.id,
`✅ ĐÃ CÀI ĐẶT NHÓM

Mã nhóm: ${group.id}
Tên: ${group.group_name}
Phí: ${formatPercent(group.fee_percent)}%
Số dư: ${formatMoney(group.balance)}`,
            MENU
        );
    });

    bot.onText(/^\/groups(?:@\w+)?$/, async (msg) => {
        if (!isSuperAdminUser(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, "❌ Bạn không có quyền.");
        }

        const groups = await listGroups();

        if (groups.length === 0) {
            return bot.sendMessage(
                msg.chat.id,
                "📭 Chưa có nhóm nào."
            );
        }

        let text = `📋 DANH SÁCH NHÓM (${groups.length})\n\n`;

        for (const group of groups) {
            const block =
`#${group.id} — ${group.group_name}
Telegram ID: ${group.telegram_group_id}
Phí: ${formatPercent(group.fee_percent)}%
Số dư: ${formatMoney(group.balance)}
Trạng thái: ${group.active ? "Hoạt động" : "Khóa"}

`;

            if ((text + block).length > 3900) {
                await bot.sendMessage(msg.chat.id, text);
                text = "";
            }

            text += block;
        }

        if (text.trim()) {
            await bot.sendMessage(msg.chat.id, text);
        }
    });

    bot.onText(/^\/addstaff(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
        if (!isSuperAdminUser(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, "❌ Bạn không có quyền.");
        }

        const input = (match[1] || "").trim();
        const [rawUserId, rawName] = input.split("|").map((part) => part?.trim());

        if (!rawUserId || !rawName || !/^\d+$/.test(rawUserId)) {
            return bot.sendMessage(
                msg.chat.id,
`Cách dùng:
/addstaff UserID|Tên nhân viên

Ví dụ:
/addstaff 123456789|Nhân viên A`
            );
        }

        await pool.query(
            `
            INSERT INTO users (
                telegram_user_id,
                display_name,
                role,
                active
            )
            VALUES ($1, $2, 'staff', TRUE)
            ON CONFLICT (telegram_user_id)
            DO UPDATE SET
                display_name = EXCLUDED.display_name,
                active = TRUE,
                updated_at = NOW()
            `,
            [rawUserId, rawName]
        );

        await bot.sendMessage(
            msg.chat.id,
`✅ Đã lưu nhân viên

Tên: ${rawName}
Telegram User ID: ${rawUserId}`
        );
    });

    bot.onText(/^\/grant(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
        if (!isSuperAdminUser(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, "❌ Bạn không có quyền.");
        }

        const input = (match[1] || "").trim();
        const [rawUserId, rawGroupId] = input.split("|").map((part) => part?.trim());

        if (!/^\d+$/.test(rawUserId || "") || !/^\d+$/.test(rawGroupId || "")) {
            return bot.sendMessage(
                msg.chat.id,
`Cách dùng:
/grant UserID|Mã nhóm

Ví dụ:
/grant 123456789|1`
            );
        }

        const result = await pool.query(
            `
            INSERT INTO permissions (user_id, group_id)
            SELECT u.id, g.id
            FROM users u
            JOIN groups g ON g.id = $2
            WHERE u.telegram_user_id = $1
            ON CONFLICT (user_id, group_id) DO NOTHING
            RETURNING id
            `,
            [rawUserId, rawGroupId]
        );

        if (result.rowCount === 0) {
            return bot.sendMessage(
                msg.chat.id,
                "❌ Không tìm thấy nhân viên hoặc nhóm. Hãy dùng /addstaff và /groups trước."
            );
        }

        await bot.sendMessage(
            msg.chat.id,
            `✅ Đã cấp quyền User ${rawUserId} cho nhóm #${rawGroupId}.`
        );
    });

    bot.onText(/^\/revoke(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
        if (!isSuperAdminUser(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, "❌ Bạn không có quyền.");
        }

        const input = (match[1] || "").trim();
        const [rawUserId, rawGroupId] = input.split("|").map((part) => part?.trim());

        if (!/^\d+$/.test(rawUserId || "") || !/^\d+$/.test(rawGroupId || "")) {
            return bot.sendMessage(
                msg.chat.id,
`Cách dùng:
/revoke UserID|Mã nhóm`
            );
        }

        const result = await pool.query(
            `
            DELETE FROM permissions p
            USING users u
            WHERE p.user_id = u.id
              AND u.telegram_user_id = $1
              AND p.group_id = $2
            `,
            [rawUserId, rawGroupId]
        );

        await bot.sendMessage(
            msg.chat.id,
            result.rowCount
                ? "✅ Đã gỡ quyền."
                : "ℹ️ Không tìm thấy quyền cần gỡ."
        );
    });

    bot.onText(/^\/setfee(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
        if (!isSuperAdminUser(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, "❌ Bạn không có quyền.");
        }

        const input = (match[1] || "").trim();
        const [rawGroupId, rawFee] = input.split("|").map((part) => part?.trim());
        const fee = Number((rawFee || "").replace(",", "."));

        if (!/^\d+$/.test(rawGroupId || "") || !Number.isFinite(fee) || fee < 0 || fee > 100) {
            return bot.sendMessage(
                msg.chat.id,
`Cách dùng:
/setfee Mã nhóm|Phí

Ví dụ:
/setfee 1|7`
            );
        }

        const group = await updateGroupFee(
            Number(rawGroupId),
            fee,
            msg.from.id
        );

        await bot.sendMessage(
            msg.chat.id,
            group
                ? `✅ Đã đổi phí ${group.group_name} thành ${formatPercent(group.fee_percent)}%.`
                : "❌ Không tìm thấy nhóm."
        );
    });

    bot.onText(/^\/renamegroup(?:@\w+)?(?:\s+(.+))?$/, async (msg, match) => {
        if (!isSuperAdminUser(msg.from.id)) {
            return bot.sendMessage(msg.chat.id, "❌ Bạn không có quyền.");
        }

        const input = (match[1] || "").trim();
        const separatorIndex = input.indexOf("|");

        if (separatorIndex < 1) {
            return bot.sendMessage(
                msg.chat.id,
`Cách dùng:
/renamegroup Mã nhóm|Tên mới

Ví dụ:
/renamegroup 1|Hà Nội VIP`
            );
        }

        const rawGroupId = input.slice(0, separatorIndex).trim();
        const groupName = input.slice(separatorIndex + 1).trim();

        if (!/^\d+$/.test(rawGroupId) || groupName.length < 2) {
            return bot.sendMessage(
                msg.chat.id,
                "❌ Mã nhóm hoặc tên mới không hợp lệ."
            );
        }

        const group = await updateGroupName(
            Number(rawGroupId),
            groupName,
            msg.from.id
        );

        await bot.sendMessage(
            msg.chat.id,
            group
                ? `✅ Đã đổi tên nhóm thành ${group.group_name}.`
                : "❌ Không tìm thấy nhóm."
        );
    });

    bot.on("message", async (msg) => {
        if (!msg.text || !msg.from) return;
        if (msg.text.startsWith("/")) return;

        const text = msg.text.trim();
        const key = stateKey(msg);

        if (text === "➕ Tiền vào") {
            const group = await requireRegisteredGroup(msg);
            if (!group || !(await requirePermission(msg, group))) return;

            states.set(key, {
                action: "IN",
                groupId: group.id
            });

            return bot.sendMessage(
                msg.chat.id,
                "💰 Nhập số tiền:"
            );
        }

        if (text === "➖ Tiền ra") {
            const group = await requireRegisteredGroup(msg);
            if (!group || !(await requirePermission(msg, group))) return;

            states.set(key, {
                action: "OUT",
                groupId: group.id
            });

            return bot.sendMessage(
                msg.chat.id,
                "💸 Nhập số tiền:"
            );
        }

        if (text === "📊 Báo cáo") {
            const group = await requireRegisteredGroup(msg);
            if (!group || !(await requirePermission(msg, group))) return;

            const current = await getGroupByTelegramId(msg.chat.id);

            return bot.sendMessage(
                msg.chat.id,
`📊 BÁO CÁO HÔM NAY

Nhóm: ${current.group_name}

Tiền vào:
${formatMoney(current.daily_in)}

Tiền ra:
${formatMoney(current.daily_out)}

Tổng phí:
${formatMoney(current.daily_fee)}

Còn lại:
${formatMoney(current.balance)}

Số giao dịch:
${current.daily_tx_count}`
            );
        }

        if (text === "📄 Giao dịch") {
            const group = await requireRegisteredGroup(msg);
            if (!group || !(await requirePermission(msg, group))) return;

            const transactions = await getTodayTransactions(group.id, 10);

            if (transactions.length === 0) {
                return bot.sendMessage(
                    msg.chat.id,
                    "📭 Hôm nay chưa có giao dịch."
                );
            }

            const lines = transactions.map((tx) => {
                const time = new Date(tx.created_at).toLocaleTimeString(
                    "vi-VN",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Asia/Ho_Chi_Minh"
                    }
                );

                const sign = tx.type === "IN" ? "➕" : "➖";

                return `${time} ${sign} ${formatMoney(tx.amount)} — Còn ${formatMoney(tx.balance_after)}`;
            });

            return bot.sendMessage(
                msg.chat.id,
                `📄 GIAO DỊCH HÔM NAY\n\n${lines.join("\n")}`
            );
        }

        if (text === "📋 Chốt") {
            const group = await requireRegisteredGroup(msg);
            if (!group || !(await requirePermission(msg, group))) return;

            const result = await closeDay({
                groupId: group.id,
                telegramUserId: msg.from.id
            });

            const closing = result.closing;

            const response =
`📋 ĐÃ CHỐT CUỐI NGÀY

Nhóm:
${group.group_name}

Tổng tiền vào:
${formatMoney(closing.total_in)}

Tổng tiền ra:
${formatMoney(closing.total_out)}

Tổng phí:
${formatMoney(closing.total_fee)}

Số dư cuối ngày:
${formatMoney(closing.closing_balance)}

Số giao dịch:
${closing.transaction_count}`;

            await bot.sendMessage(msg.chat.id, response, MENU);

            await notifySuperAdmin(
                `${response}\n\nNgười chốt: ${displayName(msg.from)}`,
                msg.chat.id
            );

            return;
        }

        const state = states.get(key);
        if (!state) return;

        const amount = parseMoney(text);

        if (!amount) {
            return bot.sendMessage(
                msg.chat.id,
                "❌ Số tiền không hợp lệ. Ví dụ: 10000000"
            );
        }

        const group = await requireRegisteredGroup(msg);
        if (!group || group.id !== state.groupId) {
            states.delete(key);
            return;
        }

        if (!(await requirePermission(msg, group))) {
            states.delete(key);
            return;
        }

        try {
            if (state.action === "IN") {
                const result = await addMoney({
                    groupId: group.id,
                    amount,
                    telegramUserId: msg.from.id,
                    telegramUsername: msg.from.username || null
                });

                states.delete(key);

                const response =
`✅ Đã cộng tiền

Số tiền:
${formatMoney(result.amount)}

Phí (${formatPercent(result.feePercent)}%):
${formatMoney(result.feeAmount)}

Còn lại:
${formatMoney(result.balance)}`;

                await bot.sendMessage(msg.chat.id, response, MENU);

                await notifySuperAdmin(
`🔔 GIAO DỊCH MỚI

Nhóm:
${group.group_name}

${response}

Người nhập:
${displayName(msg.from)}`,
                    msg.chat.id
                );

                return;
            }

            if (state.action === "OUT") {
                const result = await subtractMoney({
                    groupId: group.id,
                    amount,
                    telegramUserId: msg.from.id,
                    telegramUsername: msg.from.username || null
                });

                states.delete(key);

                const response =
`✅ Đã trừ tiền

Số tiền:
${formatMoney(result.amount)}

Còn lại:
${formatMoney(result.balance)}`;

                await bot.sendMessage(msg.chat.id, response, MENU);

                await notifySuperAdmin(
`🔔 GIAO DỊCH MỚI

Nhóm:
${group.group_name}

${response}

Người nhập:
${displayName(msg.from)}`,
                    msg.chat.id
                );
            }
        } catch (error) {
            console.error("TRANSACTION ERROR:", error);
            await bot.sendMessage(
                msg.chat.id,
                "❌ Không thể lưu giao dịch."
            );
        }
    });
}

module.exports = registerBot;
