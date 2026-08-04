const express = require("express");

const router = express.Router();

const {

    addTransaction,

    getTransactions

} = require("../controllers/transactionController");

/*
    Danh sách giao dịch
*/

router.get("/:groupId", async (req, res) => {

    try {

        const data = await getTransactions(

            req.params.groupId

        );

        res.json(data);

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Thêm giao dịch
*/

router.post("/", async (req, res) => {

    try {

        const transaction = await addTransaction(

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