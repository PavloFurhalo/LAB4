import { Injectable } from '@nestjs/common';
import { LinksDto } from 'src/models/links.dto';
import { Links, LinkDoc } from '../schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserAlreadyExists, UserNotFound , ParametersParsingError, NotFoundException, LinkExpiredError } from '../shared';
import { randomUUID } from 'crypto';

let counter = 0;

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(Links.name)
    private readonly linkModel: Model<LinkDoc>,
  ) {}


  generateLink() {
    counter++;
    return (Math.floor((counter + (Math.random() * 1000) + 1000))).toString();
  }

  
  async links(body: LinksDto, email: string) {
    if (counter == 0) {
      counter = await this.linkModel.countDocuments() + 1;
      console.log('Changed the counter');
      console.log(counter);
    }

    let uniqueId = this.generateLink();
    console.log('Unique id');
    console.log(uniqueId);

    let current = new Date();
    let expired = new Date(current);
    expired.setDate(current.getDate() + 5);



    let objectStorage = new this.linkModel({
      link: body.originalLink,
      shortLink: uniqueId,
      expiredAt: expired,
      createdBy: email
    });
    let link = (await objectStorage.save()).toObject();
    return link;


  }

  async filteredLinks(email: string, body?: string) {
    let paramObject: any = {};
    try {
      if (body) { 
        console.log(body);
        paramObject = JSON.parse(body);
        console.log(paramObject);
      }
    }
    catch (err) {
      throw new ParametersParsingError("Wrong parameters provided");
    }

    let hasGt = paramObject.hasOwnProperty('gt');
    let hasLt = paramObject.hasOwnProperty('lt');
    let comparison = { createdBy: email } as any;
    if (hasGt || hasLt) {
      comparison.expiredAt = {};
      if (hasGt) { comparison.expiredAt.$gt = new Date(paramObject.gt); }
      if (hasLt) { comparison.expiredAt.$lt = new Date(paramObject.lt); }
    }
    console.log(comparison);
    return (await this.linkModel.aggregate([{$match: comparison}]));
  }


  async findOriginalLinkByShortLink(shortLink: string) {
    let foundLink = await this.linkModel.findOne({ shortLink: shortLink });
    if (!foundLink) {
      throw new NotFoundException('This link does not exist');
    }

    if (new Date() > foundLink.expiredAt) {
      throw new LinkExpiredError('This link has expired');
    }

    return foundLink.link;
    
  }
  

  
}
  
