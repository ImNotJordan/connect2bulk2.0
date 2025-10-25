import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { sendResetEmail as sendResetEmailFn } from '../functions/sendResetEmail/resource';
import { deleteCognitoUser as deleteCognitoUserFn } from '../functions/deleteCognitoUser/resource';

// Define enums
const FirmType = a.enum(['Carrier', 'Shipper', 'Broker', 'Other']);
const Role = a.enum(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER', 'BROKER', 'DISPATCHER', 'DRIVER', 'ACCOUNTING', 'SALES', 'MARKETING', 'CUSTOMER', 'READ_ONLY']);
const LoadStatus = a.enum(['POSTED', 'QUOTED', 'TENDERED', 'BOOKED', 'IN_TRANSIT', 'DELIVERED', 'INVOICED', 'PAID']);
const EventType = a.enum(['PICKUP', 'DELIVERY', 'IN_TRANSIT', 'DELAY', 'ETA_UPDATE', 'LOCATION_PING']);
const RiskLevel = a.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

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
    status: LoadStatus,
    driver_name: a.string(),
    driver_phone: a.string(),
    customer_id: a.string(),
    customer_name: a.string(),
    created_at: a.datetime(),
    updated_at: a.datetime(),
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
  // TrackingEvent Model
  // ===========================
  TrackingEvent: a.model({
    load_id: a.string().required(),
    event_type: EventType,
    location: a.string(),
    latitude: a.float(),
    longitude: a.float(),
    eta: a.datetime(),
    delay_minutes: a.integer(),
    notes: a.string(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']).to(['create', 'read', 'update', 'delete']),
    allow.authenticated().to(['create', 'read']),
  ]),

  // ===========================
  // RiskScore Model
  // ===========================
  RiskScore: a.model({
    load_id: a.string().required(),
    risk_level: RiskLevel,
    score: a.integer(),
    factors: a.string(), // JSON string of risk factors
    weather_risk: a.boolean(),
    route_risk: a.boolean(),
    carrier_risk: a.boolean(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER']).to(['create', 'read', 'update', 'delete']),
    allow.authenticated().to(['read']),
  ]),

  // ===========================
  // AccountsReceivable Model
  // ===========================
  AccountsReceivable: a.model({
    load_id: a.string().required(),
    invoice_number: a.string(),
    amount: a.float().required(),
    amount_paid: a.float(),
    due_date: a.datetime(),
    paid_date: a.datetime(),
    status: a.string(),
    customer_id: a.string(),
    customer_name: a.string(),
    days_outstanding: a.integer(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER', 'ACCOUNTING']).to(['create', 'read', 'update', 'delete']),
    allow.authenticated().to(['read']),
  ]),

  // ===========================
  // RFPUpload Model (for bulk import tracking)
  // ===========================
  RFPUpload: a.model({
    customer_id: a.string(),
    customer_name: a.string().required(),
    file_name: a.string().required(),
    total_lanes: a.integer(),
    processed_lanes: a.integer(),
    status: a.string(), // 'PROCESSING', 'COMPLETED', 'FAILED'
    uploaded_by: a.string(),
    template_id: a.string(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER', 'SALES']).to(['create', 'read', 'update', 'delete']),
    allow.authenticated().to(['read']),
  ]),

  // ===========================
  // RFPLane Model (individual lane from RFP)
  // ===========================
  RFPLane: a.model({
    rfp_upload_id: a.string().required(),
    lane_number: a.string(),
    origin: a.string().required(),
    destination: a.string().required(),
    equipment_type: a.string(),
    frequency: a.string(),
    start_date: a.string(),
    notes: a.string(),
    miles: a.integer(),
    historical_avg_buy_30: a.float(),
    historical_avg_buy_60: a.float(),
    historical_avg_buy_90: a.float(),
    historical_avg_sell_30: a.float(),
    historical_avg_sell_60: a.float(),
    historical_avg_sell_90: a.float(),
    margin_guidance: a.float(),
    backhaul_score: a.float(),
    network_fit_flag: a.boolean(),
    similarity_score: a.float(),
    recommended_rate: a.float(),
    quote_id: a.string(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER', 'SALES']).to(['create', 'read', 'update', 'delete']),
    allow.authenticated().to(['read']),
  ]),

  // ===========================
  // RFPQuote Model (quotes generated from RFP lanes)
  // ===========================
  RFPQuote: a.model({
    rfp_upload_id: a.string().required(),
    rfp_lane_id: a.string().required(),
    customer_id: a.string(),
    customer_name: a.string(),
    origin: a.string().required(),
    destination: a.string().required(),
    equipment_type: a.string(),
    quoted_rate: a.float().required(),
    margin_percent: a.float(),
    status: a.string(), // 'PENDING', 'APPROVED', 'REJECTED', 'SENT'
    approver_id: a.string(),
    approver_name: a.string(),
    approved_at: a.datetime(),
    notes: a.string(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER', 'SALES']).to(['create', 'read', 'update', 'delete']),
    allow.authenticated().to(['read']),
  ]),

  // ===========================
  // CustomerTemplate Model (saved column mappings per customer)
  // ===========================
  CustomerTemplate: a.model({
    customer_id: a.string(),
    customer_name: a.string().required(),
    template_name: a.string().required(),
    column_mappings: a.string().required(), // JSON string of column mappings
    created_by: a.string(),
    last_used: a.datetime(),
    created_at: a.datetime(),
  }).authorization((allow) => [
    allow.owner().to(['create', 'update', 'delete', 'read']),
    allow.groups(['ORGANIZATION_OWNER', 'ADMIN', 'OPERATION_MANAGER', 'SALES']).to(['create', 'read', 'update', 'delete']),
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
