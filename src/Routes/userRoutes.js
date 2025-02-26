import { Router } from "express";
const router = Router();
import { getAllUser, createUser, getOneUser, updateUser, deleteUser } from "../controllers/userController";

router.get("/", getAllUser());
router.post("/", createUser());
router.get("/:id", getOneUser());
router.put("/:id", updateUser());
router.delete("/:id", deleteUser());

