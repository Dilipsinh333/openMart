import { Entity } from 'electrodb';
import { client, tableName } from '../config/db';

export const ContactEntity = new Entity(
  {
    model: {
      entity: 'Contact',
      version: '1',
      service: 'kinderloop'
    },
    attributes: {
      contactId: {
        type: 'string',
        required: true
      },
      name: {
        type: 'string',
        required: true
      },
      email: {
        type: 'string',
        required: true
      },
      phone: {
        type: 'string',
        required: true
      },
      subject: {
        type: 'string',
        required: true
      },
      message: {
        type: 'string',
        required: true
      },
      status: {
        type: ['pending', 'in_progress', 'resolved', 'closed'] as const,
        required: true,
        default: 'pending'
      },
      priority: {
        type: ['low', 'medium', 'high', 'urgent'] as const,
        required: true,
        default: 'medium'
      },
      assignedTo: {
        type: 'string',
        required: false // Admin user ID who is handling the inquiry
      },
      response: {
        type: 'string',
        required: false // Admin response to the inquiry
      },
      respondedAt: {
        type: 'string',
        required: false
      },
      respondedBy: {
        type: 'string',
        required: false // Admin user ID who responded
      },
      isRead: {
        type: 'boolean',
        required: true,
        default: false
      },
      source: {
        type: ['website', 'mobile_app', 'phone', 'email'] as const,
        required: true,
        default: 'website'
      },
      category: {
        type: ['general', 'support', 'complaint', 'suggestion', 'business'] as const,
        required: true,
        default: 'general'
      },
      userAgent: {
        type: 'string',
        required: false // Browser/device information
      },
      ipAddress: {
        type: 'string',
        required: false
      },
      createdAt: {
        type: 'string',
        required: true,
        default: () => new Date().toISOString(),
        readOnly: true
      },
      updatedAt: {
        type: 'string',
        required: true,
        default: () => new Date().toISOString(),
        set: () => new Date().toISOString()
      }
    },
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['contactId']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      byEmail: {
        index: 'gsi1',
        pk: {
          field: 'gsi1pk',
          composite: ['email']
        },
        sk: {
          field: 'gsi1sk',
          composite: ['createdAt']
        }
      },
      byStatus: {
        index: 'gsi2',
        pk: {
          field: 'gsi2pk',
          composite: ['status']
        },
        sk: {
          field: 'gsi2sk',
          composite: ['createdAt']
        }
      },
      byAssignedTo: {
        index: 'gsi3',
        pk: {
          field: 'gsi3pk',
          composite: ['assignedTo']
        },
        sk: {
          field: 'gsi3sk',
          composite: ['createdAt']
        }
      },
      byCategory: {
        index: 'gsi4',
        pk: {
          field: 'gsi4pk',
          composite: ['category']
        },
        sk: {
          field: 'gsi4sk',
          composite: ['createdAt']
        }
      }
    }
  },
  { client, table: tableName }
);

export type ContactItem = typeof ContactEntity.schema.attributes;
export type ContactStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';
export type ContactPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ContactSource = 'website' | 'mobile_app' | 'phone' | 'email';
export type ContactCategory = 'general' | 'support' | 'complaint' | 'suggestion' | 'business';
