/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createFirm = /* GraphQL */ `mutation CreateFirm(
  $condition: ModelFirmConditionInput
  $input: CreateFirmInput!
) {
  createFirm(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateFirmMutationVariables,
  APITypes.CreateFirmMutation
>;
export const createLoad = /* GraphQL */ `mutation CreateLoad(
  $condition: ModelLoadConditionInput
  $input: CreateLoadInput!
) {
  createLoad(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateLoadMutationVariables,
  APITypes.CreateLoadMutation
>;
export const createTeam = /* GraphQL */ `mutation CreateTeam(
  $condition: ModelTeamConditionInput
  $input: CreateTeamInput!
) {
  createTeam(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTeamMutationVariables,
  APITypes.CreateTeamMutation
>;
export const createTruck = /* GraphQL */ `mutation CreateTruck(
  $condition: ModelTruckConditionInput
  $input: CreateTruckInput!
) {
  createTruck(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateTruckMutationVariables,
  APITypes.CreateTruckMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $condition: ModelUserConditionInput
  $input: CreateUserInput!
) {
  createUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const deleteCognitoUser = /* GraphQL */ `mutation DeleteCognitoUser($userPoolId: String, $username: String) {
  deleteCognitoUser(userPoolId: $userPoolId, username: $username)
}
` as GeneratedMutation<
  APITypes.DeleteCognitoUserMutationVariables,
  APITypes.DeleteCognitoUserMutation
>;
export const deleteFirm = /* GraphQL */ `mutation DeleteFirm(
  $condition: ModelFirmConditionInput
  $input: DeleteFirmInput!
) {
  deleteFirm(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteFirmMutationVariables,
  APITypes.DeleteFirmMutation
>;
export const deleteLoad = /* GraphQL */ `mutation DeleteLoad(
  $condition: ModelLoadConditionInput
  $input: DeleteLoadInput!
) {
  deleteLoad(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteLoadMutationVariables,
  APITypes.DeleteLoadMutation
>;
export const deleteTeam = /* GraphQL */ `mutation DeleteTeam(
  $condition: ModelTeamConditionInput
  $input: DeleteTeamInput!
) {
  deleteTeam(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTeamMutationVariables,
  APITypes.DeleteTeamMutation
>;
export const deleteTruck = /* GraphQL */ `mutation DeleteTruck(
  $condition: ModelTruckConditionInput
  $input: DeleteTruckInput!
) {
  deleteTruck(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteTruckMutationVariables,
  APITypes.DeleteTruckMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $condition: ModelUserConditionInput
  $input: DeleteUserInput!
) {
  deleteUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const sendResetEmail = /* GraphQL */ `mutation SendResetEmail(
  $firstName: String
  $lastName: String
  $resetUrl: String
  $to: String
) {
  sendResetEmail(
    firstName: $firstName
    lastName: $lastName
    resetUrl: $resetUrl
    to: $to
  )
}
` as GeneratedMutation<
  APITypes.SendResetEmailMutationVariables,
  APITypes.SendResetEmailMutation
>;
export const updateFirm = /* GraphQL */ `mutation UpdateFirm(
  $condition: ModelFirmConditionInput
  $input: UpdateFirmInput!
) {
  updateFirm(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateFirmMutationVariables,
  APITypes.UpdateFirmMutation
>;
export const updateLoad = /* GraphQL */ `mutation UpdateLoad(
  $condition: ModelLoadConditionInput
  $input: UpdateLoadInput!
) {
  updateLoad(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateLoadMutationVariables,
  APITypes.UpdateLoadMutation
>;
export const updateTeam = /* GraphQL */ `mutation UpdateTeam(
  $condition: ModelTeamConditionInput
  $input: UpdateTeamInput!
) {
  updateTeam(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTeamMutationVariables,
  APITypes.UpdateTeamMutation
>;
export const updateTruck = /* GraphQL */ `mutation UpdateTruck(
  $condition: ModelTruckConditionInput
  $input: UpdateTruckInput!
) {
  updateTruck(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateTruckMutationVariables,
  APITypes.UpdateTruckMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $condition: ModelUserConditionInput
  $input: UpdateUserInput!
) {
  updateUser(condition: $condition, input: $input) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
