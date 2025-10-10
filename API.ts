/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Firm = {
  __typename: "Firm",
  address?: string | null,
  administrator_email?: string | null,
  administrator_first_name?: string | null,
  administrator_last_name?: string | null,
  brand_color?: string | null,
  city?: string | null,
  country?: string | null,
  createdAt: string,
  dba?: string | null,
  dot?: string | null,
  ein?: string | null,
  firm_name?: string | null,
  firm_type?: FirmFirm_type | null,
  id: string,
  insurance_provider?: string | null,
  load_posts?: number | null,
  mc?: string | null,
  notes?: string | null,
  phone?: string | null,
  policy_expiry?: string | null,
  policy_number?: string | null,
  state?: string | null,
  truck_posts?: number | null,
  updatedAt: string,
  w9_on_file?: boolean | null,
  website?: string | null,
  zip?: string | null,
};

export enum FirmFirm_type {
  Broker = "Broker",
  Carrier = "Carrier",
  Other = "Other",
  Shipper = "Shipper",
}


export type Load = {
  __typename: "Load",
  comment?: string | null,
  createdAt: string,
  created_at?: string | null,
  delivery_date?: string | null,
  destination: string,
  equipment_requirement?: string | null,
  frequency?: string | null,
  id: string,
  load_number: string,
  miles?: number | null,
  origin: string,
  owner?: string | null,
  pickup_date: string,
  rate?: number | null,
  trailer_type?: string | null,
  updatedAt: string,
};

export type Team = {
  __typename: "Team",
  createdAt: string,
  created_at?: string | null,
  description?: string | null,
  id: string,
  manager_email?: string | null,
  manager_id?: string | null,
  manager_name?: string | null,
  members?: number | null,
  name?: string | null,
  updatedAt: string,
};

export type Truck = {
  __typename: "Truck",
  available_date?: string | null,
  comment?: string | null,
  createdAt: string,
  created_at?: string | null,
  destination_preference?: string | null,
  equipment?: string | null,
  id: string,
  length_ft?: number | null,
  origin?: string | null,
  trailer_type?: string | null,
  truck_number?: string | null,
  updatedAt: string,
  weight_capacity?: number | null,
};

export type User = {
  __typename: "User",
  createdAt: string,
  email?: string | null,
  firm_id?: string | null,
  first_name?: string | null,
  id: string,
  last_name?: string | null,
  phone?: string | null,
  role?: UserRole | null,
  updatedAt: string,
};

export enum UserRole {
  Admin = "Admin",
  MANAGER = "MANAGER",
  MEMBER = "MEMBER",
  Manager = "Manager",
  Member = "Member",
  Regular = "Regular",
  SUPER_MANAGER = "SUPER_MANAGER",
}


export type ModelFirmFilterInput = {
  address?: ModelStringInput | null,
  administrator_email?: ModelStringInput | null,
  administrator_first_name?: ModelStringInput | null,
  administrator_last_name?: ModelStringInput | null,
  and?: Array< ModelFirmFilterInput | null > | null,
  brand_color?: ModelStringInput | null,
  city?: ModelStringInput | null,
  country?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dba?: ModelStringInput | null,
  dot?: ModelStringInput | null,
  ein?: ModelStringInput | null,
  firm_name?: ModelStringInput | null,
  firm_type?: ModelFirmFirm_typeInput | null,
  id?: ModelIDInput | null,
  insurance_provider?: ModelStringInput | null,
  load_posts?: ModelIntInput | null,
  mc?: ModelStringInput | null,
  not?: ModelFirmFilterInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelFirmFilterInput | null > | null,
  phone?: ModelStringInput | null,
  policy_expiry?: ModelStringInput | null,
  policy_number?: ModelStringInput | null,
  state?: ModelStringInput | null,
  truck_posts?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  w9_on_file?: ModelBooleanInput | null,
  website?: ModelStringInput | null,
  zip?: ModelStringInput | null,
};

export type ModelStringInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  _null = "_null",
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
}


export type ModelSizeInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelFirmFirm_typeInput = {
  eq?: FirmFirm_type | null,
  ne?: FirmFirm_type | null,
};

export type ModelIDInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  size?: ModelSizeInput | null,
};

export type ModelIntInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelBooleanInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelFirmConnection = {
  __typename: "ModelFirmConnection",
  items:  Array<Firm | null >,
  nextToken?: string | null,
};

export type ModelLoadFilterInput = {
  and?: Array< ModelLoadFilterInput | null > | null,
  comment?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  delivery_date?: ModelStringInput | null,
  destination?: ModelStringInput | null,
  equipment_requirement?: ModelStringInput | null,
  frequency?: ModelStringInput | null,
  id?: ModelIDInput | null,
  load_number?: ModelStringInput | null,
  miles?: ModelIntInput | null,
  not?: ModelLoadFilterInput | null,
  or?: Array< ModelLoadFilterInput | null > | null,
  origin?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  pickup_date?: ModelStringInput | null,
  rate?: ModelFloatInput | null,
  trailer_type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelFloatInput = {
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
};

export type ModelLoadConnection = {
  __typename: "ModelLoadConnection",
  items:  Array<Load | null >,
  nextToken?: string | null,
};

export type ModelTeamFilterInput = {
  and?: Array< ModelTeamFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  description?: ModelStringInput | null,
  id?: ModelIDInput | null,
  manager_email?: ModelStringInput | null,
  manager_id?: ModelStringInput | null,
  manager_name?: ModelStringInput | null,
  members?: ModelIntInput | null,
  name?: ModelStringInput | null,
  not?: ModelTeamFilterInput | null,
  or?: Array< ModelTeamFilterInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelTeamConnection = {
  __typename: "ModelTeamConnection",
  items:  Array<Team | null >,
  nextToken?: string | null,
};

export type ModelTruckFilterInput = {
  and?: Array< ModelTruckFilterInput | null > | null,
  available_date?: ModelStringInput | null,
  comment?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  destination_preference?: ModelStringInput | null,
  equipment?: ModelStringInput | null,
  id?: ModelIDInput | null,
  length_ft?: ModelIntInput | null,
  not?: ModelTruckFilterInput | null,
  or?: Array< ModelTruckFilterInput | null > | null,
  origin?: ModelStringInput | null,
  trailer_type?: ModelStringInput | null,
  truck_number?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  weight_capacity?: ModelIntInput | null,
};

export type ModelTruckConnection = {
  __typename: "ModelTruckConnection",
  items:  Array<Truck | null >,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  and?: Array< ModelUserFilterInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  firm_id?: ModelStringInput | null,
  first_name?: ModelStringInput | null,
  id?: ModelIDInput | null,
  last_name?: ModelStringInput | null,
  not?: ModelUserFilterInput | null,
  or?: Array< ModelUserFilterInput | null > | null,
  phone?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type ModelUserRoleInput = {
  eq?: UserRole | null,
  ne?: UserRole | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items:  Array<User | null >,
  nextToken?: string | null,
};

export type ModelFirmConditionInput = {
  address?: ModelStringInput | null,
  administrator_email?: ModelStringInput | null,
  administrator_first_name?: ModelStringInput | null,
  administrator_last_name?: ModelStringInput | null,
  and?: Array< ModelFirmConditionInput | null > | null,
  brand_color?: ModelStringInput | null,
  city?: ModelStringInput | null,
  country?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  dba?: ModelStringInput | null,
  dot?: ModelStringInput | null,
  ein?: ModelStringInput | null,
  firm_name?: ModelStringInput | null,
  firm_type?: ModelFirmFirm_typeInput | null,
  insurance_provider?: ModelStringInput | null,
  load_posts?: ModelIntInput | null,
  mc?: ModelStringInput | null,
  not?: ModelFirmConditionInput | null,
  notes?: ModelStringInput | null,
  or?: Array< ModelFirmConditionInput | null > | null,
  phone?: ModelStringInput | null,
  policy_expiry?: ModelStringInput | null,
  policy_number?: ModelStringInput | null,
  state?: ModelStringInput | null,
  truck_posts?: ModelIntInput | null,
  updatedAt?: ModelStringInput | null,
  w9_on_file?: ModelBooleanInput | null,
  website?: ModelStringInput | null,
  zip?: ModelStringInput | null,
};

export type CreateFirmInput = {
  address?: string | null,
  administrator_email?: string | null,
  administrator_first_name?: string | null,
  administrator_last_name?: string | null,
  brand_color?: string | null,
  city?: string | null,
  country?: string | null,
  dba?: string | null,
  dot?: string | null,
  ein?: string | null,
  firm_name?: string | null,
  firm_type?: FirmFirm_type | null,
  id?: string | null,
  insurance_provider?: string | null,
  load_posts?: number | null,
  mc?: string | null,
  notes?: string | null,
  phone?: string | null,
  policy_expiry?: string | null,
  policy_number?: string | null,
  state?: string | null,
  truck_posts?: number | null,
  w9_on_file?: boolean | null,
  website?: string | null,
  zip?: string | null,
};

export type ModelLoadConditionInput = {
  and?: Array< ModelLoadConditionInput | null > | null,
  comment?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  delivery_date?: ModelStringInput | null,
  destination?: ModelStringInput | null,
  equipment_requirement?: ModelStringInput | null,
  frequency?: ModelStringInput | null,
  load_number?: ModelStringInput | null,
  miles?: ModelIntInput | null,
  not?: ModelLoadConditionInput | null,
  or?: Array< ModelLoadConditionInput | null > | null,
  origin?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  pickup_date?: ModelStringInput | null,
  rate?: ModelFloatInput | null,
  trailer_type?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateLoadInput = {
  comment?: string | null,
  created_at?: string | null,
  delivery_date?: string | null,
  destination: string,
  equipment_requirement?: string | null,
  frequency?: string | null,
  id?: string | null,
  load_number: string,
  miles?: number | null,
  origin: string,
  pickup_date: string,
  rate?: number | null,
  trailer_type?: string | null,
};

export type ModelTeamConditionInput = {
  and?: Array< ModelTeamConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  description?: ModelStringInput | null,
  manager_email?: ModelStringInput | null,
  manager_id?: ModelStringInput | null,
  manager_name?: ModelStringInput | null,
  members?: ModelIntInput | null,
  name?: ModelStringInput | null,
  not?: ModelTeamConditionInput | null,
  or?: Array< ModelTeamConditionInput | null > | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateTeamInput = {
  created_at?: string | null,
  description?: string | null,
  id?: string | null,
  manager_email?: string | null,
  manager_id?: string | null,
  manager_name?: string | null,
  members?: number | null,
  name?: string | null,
};

export type ModelTruckConditionInput = {
  and?: Array< ModelTruckConditionInput | null > | null,
  available_date?: ModelStringInput | null,
  comment?: ModelStringInput | null,
  createdAt?: ModelStringInput | null,
  created_at?: ModelStringInput | null,
  destination_preference?: ModelStringInput | null,
  equipment?: ModelStringInput | null,
  length_ft?: ModelIntInput | null,
  not?: ModelTruckConditionInput | null,
  or?: Array< ModelTruckConditionInput | null > | null,
  origin?: ModelStringInput | null,
  trailer_type?: ModelStringInput | null,
  truck_number?: ModelStringInput | null,
  updatedAt?: ModelStringInput | null,
  weight_capacity?: ModelIntInput | null,
};

export type CreateTruckInput = {
  available_date?: string | null,
  comment?: string | null,
  created_at?: string | null,
  destination_preference?: string | null,
  equipment?: string | null,
  id?: string | null,
  length_ft?: number | null,
  origin?: string | null,
  trailer_type?: string | null,
  truck_number?: string | null,
  weight_capacity?: number | null,
};

export type ModelUserConditionInput = {
  and?: Array< ModelUserConditionInput | null > | null,
  createdAt?: ModelStringInput | null,
  email?: ModelStringInput | null,
  firm_id?: ModelStringInput | null,
  first_name?: ModelStringInput | null,
  last_name?: ModelStringInput | null,
  not?: ModelUserConditionInput | null,
  or?: Array< ModelUserConditionInput | null > | null,
  phone?: ModelStringInput | null,
  role?: ModelUserRoleInput | null,
  updatedAt?: ModelStringInput | null,
};

export type CreateUserInput = {
  email?: string | null,
  firm_id?: string | null,
  first_name?: string | null,
  id?: string | null,
  last_name?: string | null,
  phone?: string | null,
  role?: UserRole | null,
};

export type DeleteFirmInput = {
  id: string,
};

export type DeleteLoadInput = {
  id: string,
};

export type DeleteTeamInput = {
  id: string,
};

export type DeleteTruckInput = {
  id: string,
};

export type DeleteUserInput = {
  id: string,
};

export type UpdateFirmInput = {
  address?: string | null,
  administrator_email?: string | null,
  administrator_first_name?: string | null,
  administrator_last_name?: string | null,
  brand_color?: string | null,
  city?: string | null,
  country?: string | null,
  dba?: string | null,
  dot?: string | null,
  ein?: string | null,
  firm_name?: string | null,
  firm_type?: FirmFirm_type | null,
  id: string,
  insurance_provider?: string | null,
  load_posts?: number | null,
  mc?: string | null,
  notes?: string | null,
  phone?: string | null,
  policy_expiry?: string | null,
  policy_number?: string | null,
  state?: string | null,
  truck_posts?: number | null,
  w9_on_file?: boolean | null,
  website?: string | null,
  zip?: string | null,
};

export type UpdateLoadInput = {
  comment?: string | null,
  created_at?: string | null,
  delivery_date?: string | null,
  destination?: string | null,
  equipment_requirement?: string | null,
  frequency?: string | null,
  id: string,
  load_number?: string | null,
  miles?: number | null,
  origin?: string | null,
  pickup_date?: string | null,
  rate?: number | null,
  trailer_type?: string | null,
};

export type UpdateTeamInput = {
  created_at?: string | null,
  description?: string | null,
  id: string,
  manager_email?: string | null,
  manager_id?: string | null,
  manager_name?: string | null,
  members?: number | null,
  name?: string | null,
};

export type UpdateTruckInput = {
  available_date?: string | null,
  comment?: string | null,
  created_at?: string | null,
  destination_preference?: string | null,
  equipment?: string | null,
  id: string,
  length_ft?: number | null,
  origin?: string | null,
  trailer_type?: string | null,
  truck_number?: string | null,
  weight_capacity?: number | null,
};

export type UpdateUserInput = {
  email?: string | null,
  firm_id?: string | null,
  first_name?: string | null,
  id: string,
  last_name?: string | null,
  phone?: string | null,
  role?: UserRole | null,
};

export type ModelSubscriptionFirmFilterInput = {
  address?: ModelSubscriptionStringInput | null,
  administrator_email?: ModelSubscriptionStringInput | null,
  administrator_first_name?: ModelSubscriptionStringInput | null,
  administrator_last_name?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFirmFilterInput | null > | null,
  brand_color?: ModelSubscriptionStringInput | null,
  city?: ModelSubscriptionStringInput | null,
  country?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  dba?: ModelSubscriptionStringInput | null,
  dot?: ModelSubscriptionStringInput | null,
  ein?: ModelSubscriptionStringInput | null,
  firm_name?: ModelSubscriptionStringInput | null,
  firm_type?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  insurance_provider?: ModelSubscriptionStringInput | null,
  load_posts?: ModelSubscriptionIntInput | null,
  mc?: ModelSubscriptionStringInput | null,
  notes?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionFirmFilterInput | null > | null,
  phone?: ModelSubscriptionStringInput | null,
  policy_expiry?: ModelSubscriptionStringInput | null,
  policy_number?: ModelSubscriptionStringInput | null,
  state?: ModelSubscriptionStringInput | null,
  truck_posts?: ModelSubscriptionIntInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  w9_on_file?: ModelSubscriptionBooleanInput | null,
  website?: ModelSubscriptionStringInput | null,
  zip?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionStringInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIDInput = {
  beginsWith?: string | null,
  between?: Array< string | null > | null,
  contains?: string | null,
  eq?: string | null,
  ge?: string | null,
  gt?: string | null,
  in?: Array< string | null > | null,
  le?: string | null,
  lt?: string | null,
  ne?: string | null,
  notContains?: string | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionIntInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionBooleanInput = {
  eq?: boolean | null,
  ne?: boolean | null,
};

export type ModelSubscriptionLoadFilterInput = {
  and?: Array< ModelSubscriptionLoadFilterInput | null > | null,
  comment?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  delivery_date?: ModelSubscriptionStringInput | null,
  destination?: ModelSubscriptionStringInput | null,
  equipment_requirement?: ModelSubscriptionStringInput | null,
  frequency?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  load_number?: ModelSubscriptionStringInput | null,
  miles?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionLoadFilterInput | null > | null,
  origin?: ModelSubscriptionStringInput | null,
  owner?: ModelStringInput | null,
  pickup_date?: ModelSubscriptionStringInput | null,
  rate?: ModelSubscriptionFloatInput | null,
  trailer_type?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionFloatInput = {
  between?: Array< number | null > | null,
  eq?: number | null,
  ge?: number | null,
  gt?: number | null,
  in?: Array< number | null > | null,
  le?: number | null,
  lt?: number | null,
  ne?: number | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionTeamFilterInput = {
  and?: Array< ModelSubscriptionTeamFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  manager_email?: ModelSubscriptionStringInput | null,
  manager_id?: ModelSubscriptionStringInput | null,
  manager_name?: ModelSubscriptionStringInput | null,
  members?: ModelSubscriptionIntInput | null,
  name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionTeamFilterInput | null > | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type ModelSubscriptionTruckFilterInput = {
  and?: Array< ModelSubscriptionTruckFilterInput | null > | null,
  available_date?: ModelSubscriptionStringInput | null,
  comment?: ModelSubscriptionStringInput | null,
  createdAt?: ModelSubscriptionStringInput | null,
  created_at?: ModelSubscriptionStringInput | null,
  destination_preference?: ModelSubscriptionStringInput | null,
  equipment?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  length_ft?: ModelSubscriptionIntInput | null,
  or?: Array< ModelSubscriptionTruckFilterInput | null > | null,
  origin?: ModelSubscriptionStringInput | null,
  trailer_type?: ModelSubscriptionStringInput | null,
  truck_number?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
  weight_capacity?: ModelSubscriptionIntInput | null,
};

export type ModelSubscriptionUserFilterInput = {
  and?: Array< ModelSubscriptionUserFilterInput | null > | null,
  createdAt?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  firm_id?: ModelSubscriptionStringInput | null,
  first_name?: ModelSubscriptionStringInput | null,
  id?: ModelSubscriptionIDInput | null,
  last_name?: ModelSubscriptionStringInput | null,
  or?: Array< ModelSubscriptionUserFilterInput | null > | null,
  phone?: ModelSubscriptionStringInput | null,
  role?: ModelSubscriptionStringInput | null,
  updatedAt?: ModelSubscriptionStringInput | null,
};

export type GetFirmQueryVariables = {
  id: string,
};

export type GetFirmQuery = {
  getFirm?:  {
    __typename: "Firm",
    address?: string | null,
    administrator_email?: string | null,
    administrator_first_name?: string | null,
    administrator_last_name?: string | null,
    brand_color?: string | null,
    city?: string | null,
    country?: string | null,
    createdAt: string,
    dba?: string | null,
    dot?: string | null,
    ein?: string | null,
    firm_name?: string | null,
    firm_type?: FirmFirm_type | null,
    id: string,
    insurance_provider?: string | null,
    load_posts?: number | null,
    mc?: string | null,
    notes?: string | null,
    phone?: string | null,
    policy_expiry?: string | null,
    policy_number?: string | null,
    state?: string | null,
    truck_posts?: number | null,
    updatedAt: string,
    w9_on_file?: boolean | null,
    website?: string | null,
    zip?: string | null,
  } | null,
};

export type GetLoadQueryVariables = {
  id: string,
};

export type GetLoadQuery = {
  getLoad?:  {
    __typename: "Load",
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    delivery_date?: string | null,
    destination: string,
    equipment_requirement?: string | null,
    frequency?: string | null,
    id: string,
    load_number: string,
    miles?: number | null,
    origin: string,
    owner?: string | null,
    pickup_date: string,
    rate?: number | null,
    trailer_type?: string | null,
    updatedAt: string,
  } | null,
};

export type GetTeamQueryVariables = {
  id: string,
};

export type GetTeamQuery = {
  getTeam?:  {
    __typename: "Team",
    createdAt: string,
    created_at?: string | null,
    description?: string | null,
    id: string,
    manager_email?: string | null,
    manager_id?: string | null,
    manager_name?: string | null,
    members?: number | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type GetTruckQueryVariables = {
  id: string,
};

export type GetTruckQuery = {
  getTruck?:  {
    __typename: "Truck",
    available_date?: string | null,
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    destination_preference?: string | null,
    equipment?: string | null,
    id: string,
    length_ft?: number | null,
    origin?: string | null,
    trailer_type?: string | null,
    truck_number?: string | null,
    updatedAt: string,
    weight_capacity?: number | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    firm_id?: string | null,
    first_name?: string | null,
    id: string,
    last_name?: string | null,
    phone?: string | null,
    role?: UserRole | null,
    updatedAt: string,
  } | null,
};

export type ListFirmsQueryVariables = {
  filter?: ModelFirmFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFirmsQuery = {
  listFirms?:  {
    __typename: "ModelFirmConnection",
    items:  Array< {
      __typename: "Firm",
      address?: string | null,
      administrator_email?: string | null,
      administrator_first_name?: string | null,
      administrator_last_name?: string | null,
      brand_color?: string | null,
      city?: string | null,
      country?: string | null,
      createdAt: string,
      dba?: string | null,
      dot?: string | null,
      ein?: string | null,
      firm_name?: string | null,
      firm_type?: FirmFirm_type | null,
      id: string,
      insurance_provider?: string | null,
      load_posts?: number | null,
      mc?: string | null,
      notes?: string | null,
      phone?: string | null,
      policy_expiry?: string | null,
      policy_number?: string | null,
      state?: string | null,
      truck_posts?: number | null,
      updatedAt: string,
      w9_on_file?: boolean | null,
      website?: string | null,
      zip?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListLoadsQueryVariables = {
  filter?: ModelLoadFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListLoadsQuery = {
  listLoads?:  {
    __typename: "ModelLoadConnection",
    items:  Array< {
      __typename: "Load",
      comment?: string | null,
      createdAt: string,
      created_at?: string | null,
      delivery_date?: string | null,
      destination: string,
      equipment_requirement?: string | null,
      frequency?: string | null,
      id: string,
      load_number: string,
      miles?: number | null,
      origin: string,
      owner?: string | null,
      pickup_date: string,
      rate?: number | null,
      trailer_type?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTeamsQueryVariables = {
  filter?: ModelTeamFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTeamsQuery = {
  listTeams?:  {
    __typename: "ModelTeamConnection",
    items:  Array< {
      __typename: "Team",
      createdAt: string,
      created_at?: string | null,
      description?: string | null,
      id: string,
      manager_email?: string | null,
      manager_id?: string | null,
      manager_name?: string | null,
      members?: number | null,
      name?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListTrucksQueryVariables = {
  filter?: ModelTruckFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTrucksQuery = {
  listTrucks?:  {
    __typename: "ModelTruckConnection",
    items:  Array< {
      __typename: "Truck",
      available_date?: string | null,
      comment?: string | null,
      createdAt: string,
      created_at?: string | null,
      destination_preference?: string | null,
      equipment?: string | null,
      id: string,
      length_ft?: number | null,
      origin?: string | null,
      trailer_type?: string | null,
      truck_number?: string | null,
      updatedAt: string,
      weight_capacity?: number | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      createdAt: string,
      email?: string | null,
      firm_id?: string | null,
      first_name?: string | null,
      id: string,
      last_name?: string | null,
      phone?: string | null,
      role?: UserRole | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CreateFirmMutationVariables = {
  condition?: ModelFirmConditionInput | null,
  input: CreateFirmInput,
};

export type CreateFirmMutation = {
  createFirm?:  {
    __typename: "Firm",
    address?: string | null,
    administrator_email?: string | null,
    administrator_first_name?: string | null,
    administrator_last_name?: string | null,
    brand_color?: string | null,
    city?: string | null,
    country?: string | null,
    createdAt: string,
    dba?: string | null,
    dot?: string | null,
    ein?: string | null,
    firm_name?: string | null,
    firm_type?: FirmFirm_type | null,
    id: string,
    insurance_provider?: string | null,
    load_posts?: number | null,
    mc?: string | null,
    notes?: string | null,
    phone?: string | null,
    policy_expiry?: string | null,
    policy_number?: string | null,
    state?: string | null,
    truck_posts?: number | null,
    updatedAt: string,
    w9_on_file?: boolean | null,
    website?: string | null,
    zip?: string | null,
  } | null,
};

export type CreateLoadMutationVariables = {
  condition?: ModelLoadConditionInput | null,
  input: CreateLoadInput,
};

export type CreateLoadMutation = {
  createLoad?:  {
    __typename: "Load",
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    delivery_date?: string | null,
    destination: string,
    equipment_requirement?: string | null,
    frequency?: string | null,
    id: string,
    load_number: string,
    miles?: number | null,
    origin: string,
    owner?: string | null,
    pickup_date: string,
    rate?: number | null,
    trailer_type?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateTeamMutationVariables = {
  condition?: ModelTeamConditionInput | null,
  input: CreateTeamInput,
};

export type CreateTeamMutation = {
  createTeam?:  {
    __typename: "Team",
    createdAt: string,
    created_at?: string | null,
    description?: string | null,
    id: string,
    manager_email?: string | null,
    manager_id?: string | null,
    manager_name?: string | null,
    members?: number | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type CreateTruckMutationVariables = {
  condition?: ModelTruckConditionInput | null,
  input: CreateTruckInput,
};

export type CreateTruckMutation = {
  createTruck?:  {
    __typename: "Truck",
    available_date?: string | null,
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    destination_preference?: string | null,
    equipment?: string | null,
    id: string,
    length_ft?: number | null,
    origin?: string | null,
    trailer_type?: string | null,
    truck_number?: string | null,
    updatedAt: string,
    weight_capacity?: number | null,
  } | null,
};

export type CreateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    firm_id?: string | null,
    first_name?: string | null,
    id: string,
    last_name?: string | null,
    phone?: string | null,
    role?: UserRole | null,
    updatedAt: string,
  } | null,
};

export type DeleteCognitoUserMutationVariables = {
  userPoolId?: string | null,
  username?: string | null,
};

export type DeleteCognitoUserMutation = {
  deleteCognitoUser?: boolean | null,
};

export type DeleteFirmMutationVariables = {
  condition?: ModelFirmConditionInput | null,
  input: DeleteFirmInput,
};

export type DeleteFirmMutation = {
  deleteFirm?:  {
    __typename: "Firm",
    address?: string | null,
    administrator_email?: string | null,
    administrator_first_name?: string | null,
    administrator_last_name?: string | null,
    brand_color?: string | null,
    city?: string | null,
    country?: string | null,
    createdAt: string,
    dba?: string | null,
    dot?: string | null,
    ein?: string | null,
    firm_name?: string | null,
    firm_type?: FirmFirm_type | null,
    id: string,
    insurance_provider?: string | null,
    load_posts?: number | null,
    mc?: string | null,
    notes?: string | null,
    phone?: string | null,
    policy_expiry?: string | null,
    policy_number?: string | null,
    state?: string | null,
    truck_posts?: number | null,
    updatedAt: string,
    w9_on_file?: boolean | null,
    website?: string | null,
    zip?: string | null,
  } | null,
};

export type DeleteLoadMutationVariables = {
  condition?: ModelLoadConditionInput | null,
  input: DeleteLoadInput,
};

export type DeleteLoadMutation = {
  deleteLoad?:  {
    __typename: "Load",
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    delivery_date?: string | null,
    destination: string,
    equipment_requirement?: string | null,
    frequency?: string | null,
    id: string,
    load_number: string,
    miles?: number | null,
    origin: string,
    owner?: string | null,
    pickup_date: string,
    rate?: number | null,
    trailer_type?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteTeamMutationVariables = {
  condition?: ModelTeamConditionInput | null,
  input: DeleteTeamInput,
};

export type DeleteTeamMutation = {
  deleteTeam?:  {
    __typename: "Team",
    createdAt: string,
    created_at?: string | null,
    description?: string | null,
    id: string,
    manager_email?: string | null,
    manager_id?: string | null,
    manager_name?: string | null,
    members?: number | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteTruckMutationVariables = {
  condition?: ModelTruckConditionInput | null,
  input: DeleteTruckInput,
};

export type DeleteTruckMutation = {
  deleteTruck?:  {
    __typename: "Truck",
    available_date?: string | null,
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    destination_preference?: string | null,
    equipment?: string | null,
    id: string,
    length_ft?: number | null,
    origin?: string | null,
    trailer_type?: string | null,
    truck_number?: string | null,
    updatedAt: string,
    weight_capacity?: number | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    firm_id?: string | null,
    first_name?: string | null,
    id: string,
    last_name?: string | null,
    phone?: string | null,
    role?: UserRole | null,
    updatedAt: string,
  } | null,
};

export type SendResetEmailMutationVariables = {
  firstName?: string | null,
  lastName?: string | null,
  resetUrl?: string | null,
  to?: string | null,
};

export type SendResetEmailMutation = {
  sendResetEmail?: boolean | null,
};

export type UpdateFirmMutationVariables = {
  condition?: ModelFirmConditionInput | null,
  input: UpdateFirmInput,
};

export type UpdateFirmMutation = {
  updateFirm?:  {
    __typename: "Firm",
    address?: string | null,
    administrator_email?: string | null,
    administrator_first_name?: string | null,
    administrator_last_name?: string | null,
    brand_color?: string | null,
    city?: string | null,
    country?: string | null,
    createdAt: string,
    dba?: string | null,
    dot?: string | null,
    ein?: string | null,
    firm_name?: string | null,
    firm_type?: FirmFirm_type | null,
    id: string,
    insurance_provider?: string | null,
    load_posts?: number | null,
    mc?: string | null,
    notes?: string | null,
    phone?: string | null,
    policy_expiry?: string | null,
    policy_number?: string | null,
    state?: string | null,
    truck_posts?: number | null,
    updatedAt: string,
    w9_on_file?: boolean | null,
    website?: string | null,
    zip?: string | null,
  } | null,
};

export type UpdateLoadMutationVariables = {
  condition?: ModelLoadConditionInput | null,
  input: UpdateLoadInput,
};

export type UpdateLoadMutation = {
  updateLoad?:  {
    __typename: "Load",
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    delivery_date?: string | null,
    destination: string,
    equipment_requirement?: string | null,
    frequency?: string | null,
    id: string,
    load_number: string,
    miles?: number | null,
    origin: string,
    owner?: string | null,
    pickup_date: string,
    rate?: number | null,
    trailer_type?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateTeamMutationVariables = {
  condition?: ModelTeamConditionInput | null,
  input: UpdateTeamInput,
};

export type UpdateTeamMutation = {
  updateTeam?:  {
    __typename: "Team",
    createdAt: string,
    created_at?: string | null,
    description?: string | null,
    id: string,
    manager_email?: string | null,
    manager_id?: string | null,
    manager_name?: string | null,
    members?: number | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateTruckMutationVariables = {
  condition?: ModelTruckConditionInput | null,
  input: UpdateTruckInput,
};

export type UpdateTruckMutation = {
  updateTruck?:  {
    __typename: "Truck",
    available_date?: string | null,
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    destination_preference?: string | null,
    equipment?: string | null,
    id: string,
    length_ft?: number | null,
    origin?: string | null,
    trailer_type?: string | null,
    truck_number?: string | null,
    updatedAt: string,
    weight_capacity?: number | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  condition?: ModelUserConditionInput | null,
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    firm_id?: string | null,
    first_name?: string | null,
    id: string,
    last_name?: string | null,
    phone?: string | null,
    role?: UserRole | null,
    updatedAt: string,
  } | null,
};

export type OnCreateFirmSubscriptionVariables = {
  filter?: ModelSubscriptionFirmFilterInput | null,
};

export type OnCreateFirmSubscription = {
  onCreateFirm?:  {
    __typename: "Firm",
    address?: string | null,
    administrator_email?: string | null,
    administrator_first_name?: string | null,
    administrator_last_name?: string | null,
    brand_color?: string | null,
    city?: string | null,
    country?: string | null,
    createdAt: string,
    dba?: string | null,
    dot?: string | null,
    ein?: string | null,
    firm_name?: string | null,
    firm_type?: FirmFirm_type | null,
    id: string,
    insurance_provider?: string | null,
    load_posts?: number | null,
    mc?: string | null,
    notes?: string | null,
    phone?: string | null,
    policy_expiry?: string | null,
    policy_number?: string | null,
    state?: string | null,
    truck_posts?: number | null,
    updatedAt: string,
    w9_on_file?: boolean | null,
    website?: string | null,
    zip?: string | null,
  } | null,
};

export type OnCreateLoadSubscriptionVariables = {
  filter?: ModelSubscriptionLoadFilterInput | null,
  owner?: string | null,
};

export type OnCreateLoadSubscription = {
  onCreateLoad?:  {
    __typename: "Load",
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    delivery_date?: string | null,
    destination: string,
    equipment_requirement?: string | null,
    frequency?: string | null,
    id: string,
    load_number: string,
    miles?: number | null,
    origin: string,
    owner?: string | null,
    pickup_date: string,
    rate?: number | null,
    trailer_type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateTeamSubscriptionVariables = {
  filter?: ModelSubscriptionTeamFilterInput | null,
};

export type OnCreateTeamSubscription = {
  onCreateTeam?:  {
    __typename: "Team",
    createdAt: string,
    created_at?: string | null,
    description?: string | null,
    id: string,
    manager_email?: string | null,
    manager_id?: string | null,
    manager_name?: string | null,
    members?: number | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateTruckSubscriptionVariables = {
  filter?: ModelSubscriptionTruckFilterInput | null,
};

export type OnCreateTruckSubscription = {
  onCreateTruck?:  {
    __typename: "Truck",
    available_date?: string | null,
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    destination_preference?: string | null,
    equipment?: string | null,
    id: string,
    length_ft?: number | null,
    origin?: string | null,
    trailer_type?: string | null,
    truck_number?: string | null,
    updatedAt: string,
    weight_capacity?: number | null,
  } | null,
};

export type OnCreateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    firm_id?: string | null,
    first_name?: string | null,
    id: string,
    last_name?: string | null,
    phone?: string | null,
    role?: UserRole | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteFirmSubscriptionVariables = {
  filter?: ModelSubscriptionFirmFilterInput | null,
};

export type OnDeleteFirmSubscription = {
  onDeleteFirm?:  {
    __typename: "Firm",
    address?: string | null,
    administrator_email?: string | null,
    administrator_first_name?: string | null,
    administrator_last_name?: string | null,
    brand_color?: string | null,
    city?: string | null,
    country?: string | null,
    createdAt: string,
    dba?: string | null,
    dot?: string | null,
    ein?: string | null,
    firm_name?: string | null,
    firm_type?: FirmFirm_type | null,
    id: string,
    insurance_provider?: string | null,
    load_posts?: number | null,
    mc?: string | null,
    notes?: string | null,
    phone?: string | null,
    policy_expiry?: string | null,
    policy_number?: string | null,
    state?: string | null,
    truck_posts?: number | null,
    updatedAt: string,
    w9_on_file?: boolean | null,
    website?: string | null,
    zip?: string | null,
  } | null,
};

export type OnDeleteLoadSubscriptionVariables = {
  filter?: ModelSubscriptionLoadFilterInput | null,
  owner?: string | null,
};

export type OnDeleteLoadSubscription = {
  onDeleteLoad?:  {
    __typename: "Load",
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    delivery_date?: string | null,
    destination: string,
    equipment_requirement?: string | null,
    frequency?: string | null,
    id: string,
    load_number: string,
    miles?: number | null,
    origin: string,
    owner?: string | null,
    pickup_date: string,
    rate?: number | null,
    trailer_type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteTeamSubscriptionVariables = {
  filter?: ModelSubscriptionTeamFilterInput | null,
};

export type OnDeleteTeamSubscription = {
  onDeleteTeam?:  {
    __typename: "Team",
    createdAt: string,
    created_at?: string | null,
    description?: string | null,
    id: string,
    manager_email?: string | null,
    manager_id?: string | null,
    manager_name?: string | null,
    members?: number | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteTruckSubscriptionVariables = {
  filter?: ModelSubscriptionTruckFilterInput | null,
};

export type OnDeleteTruckSubscription = {
  onDeleteTruck?:  {
    __typename: "Truck",
    available_date?: string | null,
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    destination_preference?: string | null,
    equipment?: string | null,
    id: string,
    length_ft?: number | null,
    origin?: string | null,
    trailer_type?: string | null,
    truck_number?: string | null,
    updatedAt: string,
    weight_capacity?: number | null,
  } | null,
};

export type OnDeleteUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    firm_id?: string | null,
    first_name?: string | null,
    id: string,
    last_name?: string | null,
    phone?: string | null,
    role?: UserRole | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateFirmSubscriptionVariables = {
  filter?: ModelSubscriptionFirmFilterInput | null,
};

export type OnUpdateFirmSubscription = {
  onUpdateFirm?:  {
    __typename: "Firm",
    address?: string | null,
    administrator_email?: string | null,
    administrator_first_name?: string | null,
    administrator_last_name?: string | null,
    brand_color?: string | null,
    city?: string | null,
    country?: string | null,
    createdAt: string,
    dba?: string | null,
    dot?: string | null,
    ein?: string | null,
    firm_name?: string | null,
    firm_type?: FirmFirm_type | null,
    id: string,
    insurance_provider?: string | null,
    load_posts?: number | null,
    mc?: string | null,
    notes?: string | null,
    phone?: string | null,
    policy_expiry?: string | null,
    policy_number?: string | null,
    state?: string | null,
    truck_posts?: number | null,
    updatedAt: string,
    w9_on_file?: boolean | null,
    website?: string | null,
    zip?: string | null,
  } | null,
};

export type OnUpdateLoadSubscriptionVariables = {
  filter?: ModelSubscriptionLoadFilterInput | null,
  owner?: string | null,
};

export type OnUpdateLoadSubscription = {
  onUpdateLoad?:  {
    __typename: "Load",
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    delivery_date?: string | null,
    destination: string,
    equipment_requirement?: string | null,
    frequency?: string | null,
    id: string,
    load_number: string,
    miles?: number | null,
    origin: string,
    owner?: string | null,
    pickup_date: string,
    rate?: number | null,
    trailer_type?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateTeamSubscriptionVariables = {
  filter?: ModelSubscriptionTeamFilterInput | null,
};

export type OnUpdateTeamSubscription = {
  onUpdateTeam?:  {
    __typename: "Team",
    createdAt: string,
    created_at?: string | null,
    description?: string | null,
    id: string,
    manager_email?: string | null,
    manager_id?: string | null,
    manager_name?: string | null,
    members?: number | null,
    name?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateTruckSubscriptionVariables = {
  filter?: ModelSubscriptionTruckFilterInput | null,
};

export type OnUpdateTruckSubscription = {
  onUpdateTruck?:  {
    __typename: "Truck",
    available_date?: string | null,
    comment?: string | null,
    createdAt: string,
    created_at?: string | null,
    destination_preference?: string | null,
    equipment?: string | null,
    id: string,
    length_ft?: number | null,
    origin?: string | null,
    trailer_type?: string | null,
    truck_number?: string | null,
    updatedAt: string,
    weight_capacity?: number | null,
  } | null,
};

export type OnUpdateUserSubscriptionVariables = {
  filter?: ModelSubscriptionUserFilterInput | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    createdAt: string,
    email?: string | null,
    firm_id?: string | null,
    first_name?: string | null,
    id: string,
    last_name?: string | null,
    phone?: string | null,
    role?: UserRole | null,
    updatedAt: string,
  } | null,
};
