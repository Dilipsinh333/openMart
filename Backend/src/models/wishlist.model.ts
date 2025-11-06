import { Entity } from 'electrodb';
import { tableName, client } from '../config/db';

export const WishlistEntity = new Entity(
  {
    model: {
      entity: 'wishlist',
      version: '1',
      service: 'kinderloop'
    },
    attributes: {
      wishlistId: { type: 'string', required: true },
      userId: { type: 'string', required: true },
      productId: { type: 'string', required: true },
      gsi1pk: { type: 'string' },
      gsi1sk: { type: 'string' }
    },
    indexes: {
      wishlist: {
        pk: {
          field: 'pk',
          composite: ['wishlistId']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      wishlistByUser: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['gsi1pk']
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
