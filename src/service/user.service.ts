import { Injectable } from '@nestjs/common';
import { LoginDto, UserDto } from '../models';
import { UserDoc, Users } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserAlreadyExists, UserNotFound,ParametersParsingError} from '../shared';
import { randomUUID } from 'crypto';



@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name)
    private readonly userModel: Model<UserDoc>,
  ) {}

  async createUser(body: UserDto) {
    
    const doesExist = await this.userModel.findOne({
      login: body.email
    });

    if (doesExist) {
      throw new UserAlreadyExists(
        `User with email ${body.email} already exists`,
      );
    }

    /**
     * Validation of data
     */
    const doc = new this.userModel({...body});
    /**
     * Save to db
     */
    const user = await doc.save();

    return user.toObject();
  }

  async login(body: LoginDto) {
    const user = await this.userModel.findOne({
      email: body.email,
      password: body.password,
    });

    if (!user) {
      throw new UserNotFound(`User with email ${body.email} was not found`);
    }

    user.token = randomUUID();

    await user.save();

    return user.token;
  }


}
