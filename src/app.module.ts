import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UserService } from './service/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Orders, OrdersSchema, UserSchema, Users } from './schema';
import { UserAuthorizationMiddleware } from './midellware/userAuthorization.middleware';
import { OrdersController } from './controllers/orders.controller';
import { OrderService } from './service';
import { AddressController } from './controllers/address.controller';
import { AddressesSchema , Addresses } from './schema/addresses.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://pfurgalo2006:Qwer04072006@cluster0.u2am4dj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      { dbName: '4CS-11' },
    ),
    MongooseModule.forFeature([
      {
        name: Users.name,
        schema: UserSchema,
      },
      {
        name: Orders.name,
        schema: OrdersSchema,
      },
      {
        name: Addresses.name,
        schema: AddressesSchema,
      }
    ]),
  ],
  controllers: [UsersController, OrdersController , AddressController],
  providers: [UserService, OrderService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserAuthorizationMiddleware).forRoutes('/orders');
    consumer.apply(UserAuthorizationMiddleware).forRoutes('/address');
  }
}
