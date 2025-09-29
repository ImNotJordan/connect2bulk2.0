// src/amplifyConfig.js
import { Amplify } from 'aws-amplify';
import outputs from '../../sandbox/amplify_outputs.json'; // adjust relative path

Amplify.configure(outputs);