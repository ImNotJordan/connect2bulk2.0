/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getFirm = /* GraphQL */ `query GetFirm($id: ID!) {
  getFirm(id: $id) {
    address
    administrator_email
    administrator_first_name
    administrator_last_name
    brand_color
    city
    country
    createdAt
    dba
    dot
    ein
    firm_name
    firm_type
    id
    insurance_provider
    load_posts
    mc
    notes
    phone
    policy_expiry
    policy_number
    state
    truck_posts
    updatedAt
    w9_on_file
    website
    zip
    __typename
  }
}
` as GeneratedQuery<APITypes.GetFirmQueryVariables, APITypes.GetFirmQuery>;
export const getLoad = /* GraphQL */ `query GetLoad($id: ID!) {
  getLoad(id: $id) {
    comment
    createdAt
    created_at
    delivery_date
    destination
    equipment_requirement
    frequency
    id
    load_number
    miles
    origin
    owner
    pickup_date
    rate
    trailer_type
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetLoadQueryVariables, APITypes.GetLoadQuery>;
export const getTeam = /* GraphQL */ `query GetTeam($id: ID!) {
  getTeam(id: $id) {
    createdAt
    created_at
    description
    id
    manager_email
    manager_id
    manager_name
    members
    name
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTeamQueryVariables, APITypes.GetTeamQuery>;
export const getTruck = /* GraphQL */ `query GetTruck($id: ID!) {
  getTruck(id: $id) {
    available_date
    comment
    createdAt
    created_at
    destination_preference
    equipment
    id
    length_ft
    origin
    trailer_type
    truck_number
    updatedAt
    weight_capacity
    __typename
  }
}
` as GeneratedQuery<APITypes.GetTruckQueryVariables, APITypes.GetTruckQuery>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    createdAt
    email
    firm_id
    first_name
    id
    last_name
    phone
    role
    updatedAt
    __typename
  }
}
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listFirms = /* GraphQL */ `query ListFirms(
  $filter: ModelFirmFilterInput
  $limit: Int
  $nextToken: String
) {
  listFirms(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      address
      administrator_email
      administrator_first_name
      administrator_last_name
      brand_color
      city
      country
      createdAt
      dba
      dot
      ein
      firm_name
      firm_type
      id
      insurance_provider
      load_posts
      mc
      notes
      phone
      policy_expiry
      policy_number
      state
      truck_posts
      updatedAt
      w9_on_file
      website
      zip
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListFirmsQueryVariables, APITypes.ListFirmsQuery>;
export const listLoads = /* GraphQL */ `query ListLoads(
  $filter: ModelLoadFilterInput
  $limit: Int
  $nextToken: String
) {
  listLoads(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      comment
      createdAt
      created_at
      delivery_date
      destination
      equipment_requirement
      frequency
      id
      load_number
      miles
      origin
      owner
      pickup_date
      rate
      trailer_type
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListLoadsQueryVariables, APITypes.ListLoadsQuery>;
export const listTeams = /* GraphQL */ `query ListTeams(
  $filter: ModelTeamFilterInput
  $limit: Int
  $nextToken: String
) {
  listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      created_at
      description
      id
      manager_email
      manager_id
      manager_name
      members
      name
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTeamsQueryVariables, APITypes.ListTeamsQuery>;
export const listTrucks = /* GraphQL */ `query ListTrucks(
  $filter: ModelTruckFilterInput
  $limit: Int
  $nextToken: String
) {
  listTrucks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      available_date
      comment
      createdAt
      created_at
      destination_preference
      equipment
      id
      length_ft
      origin
      trailer_type
      truck_number
      updatedAt
      weight_capacity
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTrucksQueryVariables,
  APITypes.ListTrucksQuery
>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      createdAt
      email
      firm_id
      first_name
      id
      last_name
      phone
      role
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
