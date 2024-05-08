import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import {  UserSchema, Users , LinksSchema , Links} from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { LinksController } from './controllers/links.controller';
import { LinkService } from './service/link.service';
import { ShortLinksController } from './controllers/shortlink.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://pfurgalo2006:Qwer04072006@cluster0.u2am4dj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: 'shorturl' },
    ),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Links.name,
        schema: LinksSchema,
      }
    ]),
  ],
  controllers: [UsersController , LinksController, ShortLinksController],
  providers: [UserService, LinkService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('/links');
  }
}
