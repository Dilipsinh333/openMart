import { Entity } from 'electrodb';
import { tableName, client } from '../config/db';

export const AddressEntity = new Entity(
  {
    model: {
      entity: 'address',
      version: '1',
      service: 'kinderloop'
    },
    attributes: {
      addressId: { type: 'string', required: true },
      userId: { type: 'string', required: true },
      fullName: { type: 'string', required: true },
      phoneNumber: { type: 'string', required: true },
      addressLine1: { type: 'string', required: true },
      addressLine2: { type: 'string', required: false },
      city: { type: 'string', required: true },
      state: { type: 'string', required: true },
      pinCode: { type: 'string', required: true },
      gsi1pk: { type: 'string' },
      gsi1sk: { type: 'string' }
    },
    indexes: {
      address: {
        pk: {
          field: 'pk',
          composite: ['addressId']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      addressById: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['gsi1pk'],
          template: '${gsi1pk}' // Required when attribute name and field name are the same
        },
        sk: {
          field: 'gsi1sk',
          composite: ['gsi1sk']
        }
      }
    }
  },
  {
    client,
    table: tableName
  }
);
