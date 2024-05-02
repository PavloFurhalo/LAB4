import { Body, Controller, Get, Post, Req, BadRequestException } from '@nestjs/common';
import { OrderService } from '../service';
import { OrderDto } from '../models';
import { UserLeanDoc } from '../schema';
import { AddressNotFound } from '../shared';
import { Patch , Param } from '@nestjs/common';

@Controller({ path: '/orders' })
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Patch('/:orderId')
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') newStatus: string,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;
      const updatedOrder = await this.orderService.updateOrderStatus(user.role, orderId, newStatus);
      return updatedOrder;
    } catch (err) {
      throw err;
    }
  }


  @Post('/')
  async createOrder(
    @Body() body: OrderDto,
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;

      const order = await this.orderService.createOrder({
        ...body,
        login: user.login,
      });
      return order;
    } catch (err) {
      if (err instanceof AddressNotFound) {
        throw new BadRequestException(err.message);
      }
      throw err;
    }
  }

  @Get('/')
  async findOrders(
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;
      const orders = await this.orderService.getOrders(user.role, user.login);
      return orders;
    } catch (err) {
      throw err;
    }
  }

  @Get('/lowest')
  async findLowest(
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;

      const order = await this.orderService.getLowestPrice(user.login)
      return order;
    } catch (err) {
      throw err;
    }
  }

  @Get('/biggest')
  async findBiggest(
    @Req() req: Request & { user: UserLeanDoc },
  ) {
    try {
      const { user } = req;

      const order = await this.orderService.getBiggestPrice(user.login)
      return order;
    } catch (err) {
      throw err;
    }
  }

  
}
