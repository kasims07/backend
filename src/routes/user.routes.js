import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateUser, channel} from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlerware.js"

import { verifyJwt } from "../middlewares/auth.middlerware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//sequre routes

router.route("/logout").post(verifyJwt, logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt, changeCurrentPassword)
router.route("/getprofile").get(verifyJwt, getCurrentUser)
router.route("/update").post(verifyJwt, updateUser)
router.route("/get-channel").post(verifyJwt, channel)







export default router;