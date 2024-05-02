import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ collection: 'addresses' })
export class Addresses {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: { longitude: Number, latitude: Number }, required: true })
  location: { longitude: Number, latitude: Number }
}

export const AddressesSchema = SchemaFactory.createForClass(Addresses);

export type AddressesDoc = Addresses & Document;