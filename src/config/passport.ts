import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models';

export const configurePassport = () => {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(new JwtStrategy(jwtOptions as any, async (payload: any, done: any) => {
    try {
      console.log('payload', payload);
      const { id } = payload;
      // const user = await User.findByPk(parseInt(id));
      // if (!user) {
      //   return done(null, false);
      // }
      // return done(null, user.toJSON());
      return done(null, payload);
    } catch (error) {
      return done(error, false);
    }
  }));
};
