import { Router } from "express";
import passport from "../config/passport";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "/auth/failure",
    successRedirect: "/auth/profile"
}))

router.get("/failure", (req: Request, res: Response) => {
    res.send("Authentication failed");
})


function EnsureAuth(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/failure");
}



