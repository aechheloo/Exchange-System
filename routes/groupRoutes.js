const express = require("express");

const router = express.Router();

const {

    createGroup,

    getGroups,

    updateFee

} = require("../controllers/groupController");

/*
    Lấy danh sách nhóm
*/

router.get("/", async (req, res) => {

    try {

        const groups = await getGroups();

        res.json(groups);

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Tạo nhóm
*/

router.post("/", async (req, res) => {

    try {

        const group = await createGroup(req.body);

        res.json({

            success: true,

            data: group

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Đổi phí nhóm
*/

router.put("/:id/fee", async (req, res) => {

    try {

        const group = await updateFee(

            req.params.id,

            req.body.fee_percent

        );

        res.json({

            success: true,

            data: group

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;