const express = require("express");

const router = express.Router();

const {

    addSalaryTransaction,

    getSalaryTransactions,

    getSalarySummary

} = require("../controllers/salaryController");

/*
    Danh sách giao dịch lương
*/

router.get("/:employeeId", async (req, res) => {

    try {

        const transactions = await getSalaryTransactions(

            req.params.employeeId

        );

        res.json({

            success: true,

            data: transactions

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Tổng lương nhân viên
*/

router.get("/summary/:employeeId", async (req, res) => {

    try {

        const summary = await getSalarySummary(

            req.params.employeeId

        );

        res.json({

            success: true,

            data: summary

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Thêm giao dịch lương
*/

router.post("/", async (req, res) => {

    try {

        const transaction = await addSalaryTransaction(

            req.body

        );

        res.json({

            success: true,

            data: transaction

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;