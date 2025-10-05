import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { sendResetEmail as sendResetEmailFn } from '../functions/sendResetEmail/resource';
import { deleteCognitoUser as deleteCognitoUserFn } from '../functions/deleteCognitoUser/resource';

// Define enum for firm_type
const FirmType = a.enum(['Carrier', 'Shipper', 'Broker', 'Other']);

// Define enum for roles
const Role = a.enum(['SUPER_MANAGER', 'MANAGER', 'MEMBER', 'Manager', 'Member', 'Admin', 'Regular']);

// Define schema
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
  }).authorization((allow) => [allow.authenticated()]),

  User: a.model({
    first_name: a.string(),
    last_name: a.string(),
    email: a.string(),
    phone: a.string(),
    role: Role,
    firm_id: a.string(),
  }).authorization((allow) => [allow.authenticated()]),

  Load: a.model({
    id: a.id().required(),
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
    allow.publicApiKey().to(['create', 'read', 'update', 'delete']), // Allow public access for testing
    allow.authenticated().to(['create', 'read', 'update', 'delete'])
  ]),

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
  }).authorization((allow) => [
    allow.publicApiKey().to(['create', 'read', 'update', 'delete']), // Allow public access for testing
    allow.authenticated().to(['create', 'read', 'update', 'delete'])
  ]),

  Team: a.model({
    name: a.string(),
    description: a.string(),
    manager_id: a.string(),
    manager_name: a.string(),
    manager_email: a.string(),
    members: a.integer(),
    created_at: a.datetime(),
  }).authorization((allow) => [allow.authenticated()]),

  sendResetEmail: a.mutation()
    .arguments({
      to: a.string(),
      resetUrl: a.string(),
      firstName: a.string(),
      lastName: a.string(),
    })
    .returns(a.boolean())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(sendResetEmailFn)),

  deleteCognitoUser: a.mutation()
    .arguments({
      username: a.string(),
      userPoolId: a.string(),
    })
    .returns(a.boolean())
    .authorization((allow) => [allow.authenticated()])
    .handler(a.handler.function(deleteCognitoUserFn)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // use Cognito user pool auth
  },
});
