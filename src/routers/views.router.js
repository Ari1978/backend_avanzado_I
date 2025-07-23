import express from "express";

const router = express.Router();


router.get("/socket", (req, res) => {
    res.render("socket")
})

router.get("/chat", (req, res) => {
    res.render("messages")
})

export default router;
