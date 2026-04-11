import passport, { Passport } from "passport";
import User from "../model/User";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";


const clientID = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const callbackURL = process.env.GOOGLE_CALLBACK_URL!;

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user);
    }
    catch (error) {
        done(error as Error, undefined);

    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID,
            clientSecret,
            callbackURL
        },

        async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
            try {

                const googleId = profile.id;

                let user = await User.findOne({ googleId: profile.id }).exec();

                if (!user) {
                    user = new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value,
                        image: profile.photos?.[0]?.value
                    });
                }
            }
            catch (error) {
                done(error as Error, undefined);
            }
        })
);

export default passport;