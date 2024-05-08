import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'links' })
export class Links {

  @Prop({ type: String, required: true })
  link: string;

  @Prop({ type:Date, required: true })
  expiredAt: Date;

  @Prop({ type: String, required: true })
  shortLink: string;

  @Prop({ type: String, required: true })
  createdBy: string;

  
}

export const LinksSchema = SchemaFactory.createForClass(Links);

export type LinkDoc = Links & Document;
