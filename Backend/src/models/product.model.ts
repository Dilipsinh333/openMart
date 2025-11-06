import { Entity } from 'electrodb';
import { tableName, client } from '../config/db';
import { pick } from '../utils/objectFilter';

export const ProductEntity = new Entity(
  {
    model: {
      entity: 'product',
      version: '1',
      service: 'kinderloop'
    },
    attributes: {
      productId: { type: 'string', required: true },
      userId: { type: 'string', required: true },
      name: { type: 'string', required: true },
      description: { type: 'string', required: false },
      originalPrice: { type: 'number', required: true },
      currentPrice: { type: 'number', required: true },
      category: { type: 'string', required: true },
      ageGroup: { type: 'string', required: false },
      condition: { type: 'string', required: true },
      sellType: { type: 'string', required: true },
      status: { type: 'string', default: 'Pending' },
      available: { type: 'boolean', default: true },
      itemUrl: { type: 'string', required: false },
      pickupGuy: { type: 'string', required: false },
      pickupAddress: { type: 'string', required: true },
      images: {
        type: 'list',
        items: {
          type: 'map',
          properties: {
            filename: { type: 'string' },
            url: { type: 'string' }
          }
        }
      },
      gsi1pk: { type: 'string' },
      gsi1sk: { type: 'string' }
    },
    indexes: {
      product: {
        pk: {
          field: 'pk',
          composite: ['productId']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      productById: {
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
