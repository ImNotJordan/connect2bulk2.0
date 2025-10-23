import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { sendResetEmail as sendResetEmailFn } from '../functions/sendResetEmail/resource';
import { deleteCognitoUser as deleteCognitoUserFn } from '../functions/deleteCognitoUser/resource';

// Define enums
const FirmType = a.enum(['Carrier', 'Shipper', 'Broker', 'Other']);
const Role = a.enum(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER', 'BROKER', 'DISPATCHER', 'ACCOUNTING', 'SALES', 'MARKETING', 'CUSTOMER']);

const schema = a.schema({

  Firm: a.model({
    firm_name: a.string(),
    address: a.string(),
    city: a.string(),
    country: a.string(),
    administrator_email: a.string(),
    administrator_first_name: a.string(),
    administrator_last_name: a.string(),
    state: a.string(),
    zip: a.string(),
    firm_type: FirmType,
    dba: a.string(),
    dot: a.string(),
    mc: a.string(),
    ein: a.string(),
    phone: a.string(),
    website: a.string(),
    insurance_provider: a.string(),
    policy_number: a.string(),
    policy_expiry: a.string(),
    w9_on_file: a.boolean(),
    brand_color: a.string(),
    notes: a.string(),
    load_posts: a.integer(),
    truck_posts: a.integer(),
  }).authorization((allow) => [
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']).to(['create', 'update', 'delete', 'read']),
    allow.authenticated().to(['create', 'read', 'update']),
  ]),

  // ===========================
  // User Model
  // ===========================
  User: a.model({
    first_name: a.string(),
    last_name: a.string(),
    email: a.string(),
    phone: a.string(),
    role: Role,
    firm_id: a.string(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']).to(['create', 'update', 'delete', 'read']),
    allow.authenticated().to(['read']),
  ]),

  // ===========================
  // Load Model
  // ===========================
  Load: a.model({
    id: a.id().required(),
    sent_by: a.string(),
    load_number: a.string().required(),
    pickup_date: a.string().required(),
    delivery_date: a.string(),
    origin: a.string().required(),
    destination: a.string().required(),
    trailer_type: a.string(),
    equipment_requirement: a.string(),
    miles: a.integer(),
    rate: a.float(),
    frequency: a.string(),
    comment: a.string(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']).to(['create', 'read', 'update', 'delete']),
    allow.authenticated().to(['create', 'read', 'update', 'delete']),
  ]),

  // ===========================
  // Truck Model
  // ===========================
  Truck: a.model({
    id: a.id().required(),
    truck_number: a.string(),
    available_date: a.string(),
    origin: a.string(),
    destination_preference: a.string(),
    trailer_type: a.string(),
    equipment: a.string(),
    length_ft: a.integer(),
    weight_capacity: a.integer(),
    comment: a.string(),
    created_at: a.datetime(),
    owner: a.string(),
  }).authorization((allow) => [
    // Allow owners to manage their own trucks
    allow.owner(),
    // Allow admins to manage all trucks
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']).to(['read', 'create', 'update', 'delete']),
    // Allow authenticated users to create and read trucks
    allow.authenticated().to(['create', 'read']),
  ]),

  // ===========================
  // Team Model
  // ===========================
  Team: a.model({
    name: a.string(),
    description: a.string(),
    manager_id: a.string(),
    manager_name: a.string(),
    manager_email: a.string(),
    members: a.integer(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']).to(['create', 'read', 'update', 'delete']),
    allow.authenticated().to(['read']),
  ]),

  // ===========================
  // Custom Function: sendResetEmail
  // ===========================
  sendResetEmail: a.mutation()
    .arguments({
      to: a.string(),
      resetUrl: a.string(),
      firstName: a.string(),
      lastName: a.string(),
    })
    .returns(a.boolean())
    .authorization((allow) => [
      allow.authenticated(),
      allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']),
    ])
    .handler(a.handler.function(sendResetEmailFn)),

  // ===========================
  // Custom Function: deleteCognitoUser
  // ===========================
  deleteCognitoUser: a.mutation()
    .arguments({
      username: a.string(),
      userPoolId: a.string(),
    })
    .returns(a.boolean())
    .authorization((allow) => [
      allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']),
    ])
    .handler(a.handler.function(deleteCognitoUserFn)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // use Cognito user pool auth only
  },
});
