import { Entity } from 'electrodb';
import { tableName, client } from '../config/db';

export const UserEntity = new Entity(
  {
    model: {
      entity: 'User',
      version: '1',
      service: 'kinderloop'
    },
    attributes: {
      userId: { type: 'string', required: true },
      name: { type: 'string', required: true },
      email: { type: 'string', required: true },
      password: { type: 'string', required: true },
      userType: {
        type: 'string',
        required: true,
        validate: (val: string) => ['Customer', 'Seller', 'Admin', 'DeliveryBoy'].includes(val)
      }
    },
    indexes: {
      userPrimary: {
        pk: { field: 'pk', composite: ['userId'] },
        sk: { field: 'sk', composite: [] }
      }
    }
  },
  {
    client,
    table: tableName
  }
);
