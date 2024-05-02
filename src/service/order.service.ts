import { Injectable } from '@nestjs/common';
import { OrderDto } from '../models';
import { Orders, OrdersDoc, Addresses, AddressesDoc } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AddressNotFound } from '../shared';
import { ForbiddenException , NotFoundException } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Orders.name)
    private readonly orderModel: Model<OrdersDoc>,

    @InjectModel(Addresses.name)
    private readonly addressesModel: Model<AddressesDoc>,

  ) {}

  async getOrders(userRole: string, userLogin: string) {
    if (userRole === 'Customer') {
      return this.orderModel.find({ login: userLogin }).exec();
    } else if (userRole === 'Driver') {
      return this.orderModel.find({ login: userLogin, status: 'Active' }).exec();
    } else if (userRole === 'Admin') {
      return this.orderModel.find({}).exec();
    } else {
      throw new Error('Invalid user role');
    }
  }

  async createOrder(body: OrderDto & { login: string }) {
    
    const price = Math.floor(Math.random() * (100 - 20 + 1)) + 20;

    let foundFrom = await this.addressesModel.findOne({ name: body.from });
    let foundTo = await this.addressesModel.findOne({ name: body.to });
    if (!foundFrom || !foundTo) {
      throw new AddressNotFound('Invalid address');
    }

    let lon1 = foundFrom.location.longitude;
    let lat1 = foundFrom.location.latitude;
    let lon2 = foundTo.location.longitude;
    let lat2 = foundTo.location.longitude;

    let distance = this.formula(lon1, lat1, lon2, lat2);
    distance = Math.round(distance * 100) / 100;
    let coeff = {
      "standard": 2.5,
      "lite": 1.5,
      "universal": 3
    }

    const doc = new this.orderModel({
      to: body.to,
      from: body.from,
      type: body.type,
      price: distance * coeff[body.type],
      distance: distance, 
      login: body.login
    });

    const order = await doc.save();

    return order;
  }

  async getLastUniqueAddresses(login: string): Promise<string[]> {
    const lastOrders = await this.orderModel.aggregate([
      {$match: {login: login}},
      {$sort: {_id: -1}},
      {$group: {_id: "$from", doc: {$first: "$$ROOT"}}},
      {$sort: {"doc._id": -1}},
      {$limit: 5},
      {$replaceRoot: {newRoot: "$doc"}},
      {$project: {from: 1, _id: 0}}
     ]);
     console.log("Getting FROM")
     return lastOrders.map((order) => order.from);

  }


  async getLastThreeAddresses(login: string) {
    const lastOrders = await this.orderModel.aggregate([
      {$match: {login: login}},
      {$sort: {_id: -1}},
      {$group: {_id: "$to", doc: {$first: "$$ROOT"}}},
      {$sort: {"doc._id": -1}},
      {$limit: 3},
      {$replaceRoot: {newRoot: "$doc"}},
      {$project: {to: 1, _id: 0}}
     ]);
     console.log(lastOrders);
     console.log("Getting TO")
     return lastOrders.map((order) => order.to);
  }

  async getLowestPrice(login: string) {
    const sortedPrices = await this.orderModel.aggregate([
      {$match: {login: login}},
      {$sort: {price: 1}},
      {$limit: 1}
    ])
    return sortedPrices.length == 0 ? { order: null } : { order: sortedPrices[0] }
  }
  
  async getBiggestPrice(login: string) {
    const sortedPrices = await this.orderModel.aggregate([
      {$match: {login: login}},
      {$sort: {price: -1}},
      {$limit: 1}
    ])
    return sortedPrices.length == 0 ? { order: null } : { order: sortedPrices[0] }
  }

   
formula(longitude_from, latitude_from, longitude_to, latitude_to) {
  const earthRadius = 6371; 

  const latFromRadians = latitude_from * (Math.PI / 180);
  const latToRadians = latitude_to * (Math.PI / 180);
  const lonFromRadians = longitude_from * (Math.PI / 180);
  const lonToRadians = longitude_to * (Math.PI / 180);

  const latDiff = latToRadians - latFromRadians;
  const lonDiff = lonToRadians - lonFromRadians;

  const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2) + Math.cos(latFromRadians) * Math.cos(latToRadians) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c; 

  return distance;
}


async updateOrderStatus(userRole: string, orderId: string, newStatus: string) {
  const order = await this.orderModel.findById(orderId).exec();
  
  if (!order) {
    throw new NotFoundException('Order not found');
  }
  
  const currentStatus = order.status;

  if (userRole === 'Customer') {
    if (currentStatus === 'Active' && newStatus === 'Rejected') {
      order.status = newStatus;
      return order.save();
    } else {
      throw new ForbiddenException('You are not allowed to change the status of this order');
    }
  } else if (userRole === 'Driver') {
    if ((currentStatus === 'Active' && newStatus === 'In progress') || (currentStatus === 'In progress' && newStatus === 'Done')) {
      order.status = newStatus;
      return order.save();
    } else {
      throw new ForbiddenException('You are not allowed to change the status of this order');
    }
  } else if (userRole === 'Admin') {
    if ((currentStatus === 'Active' && newStatus === 'Rejected') ||
        (currentStatus === 'Active' && newStatus === 'In progress') ||
        (currentStatus === 'In progress' && newStatus === 'Done')) {
      order.status = newStatus;
      return order.save();
    } else {
      throw new ForbiddenException('You are not allowed to change the status of this order');
    }
  } else {
    throw new ForbiddenException('You are not allowed to change the status of this order');
  }
}
}
