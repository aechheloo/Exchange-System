const express = require("express");

const router = express.Router();

const {

    createEmployee,

    getEmployees,

    getEmployee,

    updateEmployee,

    deleteEmployee

} = require("../controllers/employeeController");

/*
    Danh sách nhân viên
*/

router.get("/:groupId", async (req, res) => {

    try {

        const employees = await getEmployees(

            req.params.groupId

        );

        res.json({

            success: true,

            data: employees

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Thêm nhân viên
*/

router.post("/", async (req, res) => {

    try {

        const employee = await createEmployee(

            req.body

        );

        res.json({

            success: true,

            data: employee

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Chi tiết nhân viên
*/

router.get("/detail/:id", async (req, res) => {

    try {

        const employee = await getEmployee(

            req.params.id

        );

        res.json({

            success: true,

            data: employee

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Cập nhật nhân viên
*/

router.put("/:id", async (req, res) => {

    try {

        const employee = await updateEmployee(

            req.params.id,

            req.body

        );

        res.json({

            success: true,

            data: employee

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

/*
    Xóa nhân viên
*/

router.delete("/:id", async (req, res) => {

    try {

        const employee = await deleteEmployee(

            req.params.id

        );

        res.json({

            success: true,

            data: employee

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;