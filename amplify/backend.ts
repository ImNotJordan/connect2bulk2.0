import { defineBackend } from '@aws-amplify/backend';
import { Policy, PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { sendResetEmail } from './functions/sendResetEmail/resource';
import { deleteCognitoUser } from './functions/deleteCognitoUser/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
  sendResetEmail,
  deleteCognitoUser,
});

// Add Cognito admin permissions for authenticated users
const cognitoAdminPolicy = new Policy(
  backend.auth.resources.authenticatedUserIamRole.stack,
  'CognitoAdminPolicy',
  {
    statements: [
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          'cognito-idp:ListUsers',
          'cognito-idp:AdminGetUser',
          'cognito-idp:AdminUpdateUserAttributes',
          'cognito-idp:AdminDeleteUser',
        ],
        resources: [backend.auth.resources.userPool.userPoolArn],
      }),
    ],
  }
);

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(cognitoAdminPolicy);
