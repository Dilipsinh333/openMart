import { Entity } from 'electrodb';
import { tableName, client } from '../config/db';

export const CartEntity = new Entity(
  {
    model: {
      entity: 'cart',
      version: '1',
      service: 'kinderloop'
    },
    attributes: {
      cartId: { type: 'string', required: true },
      userId: { type: 'string', required: true },
      productId: { type: 'string', required: true },
      gsi1pk: { type: 'string' },
      gsi1sk: { type: 'string' }
    },
    indexes: {
      cart: {
        pk: {
          field: 'pk',
          composite: ['cartId']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      cartById: {
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
