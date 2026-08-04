const express = require("express");

const router = express.Router();

const {

    getReport

} = require("../controllers/reportController");

/*
    Báo cáo theo nhóm
*/

router.get("/:groupId", async (req, res) => {

    try {

        const report = await getReport(

            req.params.groupId

        );

        res.json({

            success: true,

            data: report

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;