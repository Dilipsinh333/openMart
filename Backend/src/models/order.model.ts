import { Entity } from 'electrodb';
import { tableName, client } from '../config/db';

export const OrderEntity = new Entity(
  {
    model: {
      entity: 'order',
      version: '1',
      service: 'kinderloop'
    },
    attributes: {
      orderId: { type: 'string', required: true },
      userId: { type: 'string', required: true },
      products: {
        type: 'list',
        items: {
          type: 'string'
        },
        required: true
      },
      amount: { type: 'number', required: true },
      status: { type: 'string', default: 'Pending' },
      shippingAddress: { type: 'string', required: false },
      paymentStatus: { type: 'string', required: true },
      paymentId: { type: 'string' },
      expectedDeliveryDate: { type: 'string', required: true },
      orderPlacedDate: { type: 'string', required: true },
      image: { type: 'string', required: true },
      deliveryBoy: { type: 'string', required: false },
      gsi1pk: { type: 'string' },
      gsi1sk: { type: 'string' }
    },
    indexes: {
      order: {
        pk: {
          field: 'pk',
          composite: ['orderId']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      orderById: {
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
