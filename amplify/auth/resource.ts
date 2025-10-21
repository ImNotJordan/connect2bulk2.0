import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    givenName: {
      mutable: true,
      required: false,
    },
    familyName: {
      mutable: true,
      required: false,
    },
    phoneNumber: {
      mutable: true,
      required: false,
    },
    // Custom attributes for extended profile data
    'custom:avatarUrl': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 2048,
    },
    'custom:bio': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 2048,
    },
    'custom:city': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 256,
    },
    'custom:country': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 256,
    },
    'custom:countryCode': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 10,
    },
    'custom:countryIso2': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 2,
    },
    'custom:dateOfBirth': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 10,
    },
    'custom:gender': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 50,
    },
    'custom:language': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 10,
    },
    'custom:newsletter': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 10,
    },
    'custom:twoFactor': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 10,
    },
    'custom:timezone': {
      dataType: 'String',
      mutable: true,
      minLen: 0,
      maxLen: 100,
    },
  },
});