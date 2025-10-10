/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateFirm = /* GraphQL */ `subscription OnCreateFirm($filter: ModelSubscriptionFirmFilterInput) {
  onCreateFirm(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateFirmSubscriptionVariables,
  APITypes.OnCreateFirmSubscription
>;
export const onCreateLoad = /* GraphQL */ `subscription OnCreateLoad(
  $filter: ModelSubscriptionLoadFilterInput
  $owner: String
) {
  onCreateLoad(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnCreateLoadSubscriptionVariables,
  APITypes.OnCreateLoadSubscription
>;
export const onCreateTeam = /* GraphQL */ `subscription OnCreateTeam($filter: ModelSubscriptionTeamFilterInput) {
  onCreateTeam(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTeamSubscriptionVariables,
  APITypes.OnCreateTeamSubscription
>;
export const onCreateTruck = /* GraphQL */ `subscription OnCreateTruck($filter: ModelSubscriptionTruckFilterInput) {
  onCreateTruck(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateTruckSubscriptionVariables,
  APITypes.OnCreateTruckSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onDeleteFirm = /* GraphQL */ `subscription OnDeleteFirm($filter: ModelSubscriptionFirmFilterInput) {
  onDeleteFirm(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteFirmSubscriptionVariables,
  APITypes.OnDeleteFirmSubscription
>;
export const onDeleteLoad = /* GraphQL */ `subscription OnDeleteLoad(
  $filter: ModelSubscriptionLoadFilterInput
  $owner: String
) {
  onDeleteLoad(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteLoadSubscriptionVariables,
  APITypes.OnDeleteLoadSubscription
>;
export const onDeleteTeam = /* GraphQL */ `subscription OnDeleteTeam($filter: ModelSubscriptionTeamFilterInput) {
  onDeleteTeam(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTeamSubscriptionVariables,
  APITypes.OnDeleteTeamSubscription
>;
export const onDeleteTruck = /* GraphQL */ `subscription OnDeleteTruck($filter: ModelSubscriptionTruckFilterInput) {
  onDeleteTruck(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteTruckSubscriptionVariables,
  APITypes.OnDeleteTruckSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onUpdateFirm = /* GraphQL */ `subscription OnUpdateFirm($filter: ModelSubscriptionFirmFilterInput) {
  onUpdateFirm(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateFirmSubscriptionVariables,
  APITypes.OnUpdateFirmSubscription
>;
export const onUpdateLoad = /* GraphQL */ `subscription OnUpdateLoad(
  $filter: ModelSubscriptionLoadFilterInput
  $owner: String
) {
  onUpdateLoad(filter: $filter, owner: $owner) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateLoadSubscriptionVariables,
  APITypes.OnUpdateLoadSubscription
>;
export const onUpdateTeam = /* GraphQL */ `subscription OnUpdateTeam($filter: ModelSubscriptionTeamFilterInput) {
  onUpdateTeam(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTeamSubscriptionVariables,
  APITypes.OnUpdateTeamSubscription
>;
export const onUpdateTruck = /* GraphQL */ `subscription OnUpdateTruck($filter: ModelSubscriptionTruckFilterInput) {
  onUpdateTruck(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateTruckSubscriptionVariables,
  APITypes.OnUpdateTruckSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
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
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
