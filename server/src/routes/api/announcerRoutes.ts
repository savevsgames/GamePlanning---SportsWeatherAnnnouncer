import express from "express";
import { announcerController } from "../../controller/announcerController.ts";

const router = express.Router();

router.post("/announcer", announcerController);

export default router;
