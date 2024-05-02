import { Body, Controller, Post, Req, Get } from '@nestjs/common';
import { OrderService } from '../service';
import { OrderDto } from '../models';
import { UserLeanDoc } from '../schema';

@Controller({ path: '/address' })
export class AddressController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/from/last-5')
  async lastfive(
    @Req() req: Request & { user: UserLeanDoc }
  ) {
    try {
      const { user } = req;
      return (await this.orderService.getLastUniqueAddresses(user.login));
    } catch (err) {
      throw err;
    }
  }
  @Get('/to/last-3')
  async lastthree(
    @Req() req: Request & { user: UserLeanDoc }
  ) {
    try {
      const { user } = req;
      return (await this.orderService.getLastThreeAddresses(user.login));
    } catch (err) {
      throw err;
    }
  }
}