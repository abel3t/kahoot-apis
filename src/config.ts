import dotEnv from 'dotenv';

dotEnv.config({ path: '.env' });

export const configuration = (): unknown => ({
  AppSettings: {
    port: process.env.PORT || 8080,
    bodyLimit: '50mb',
    bodyParameterLimit: 50_000_000,
    upStage: process.env.UP_STAGE
  },
  GraphQLSettings: {
    playground: true,
    debug: true,
    introspection: true,
    installSubscriptionHandlers: true
  },
  GraphQL_URLs: [],
  DbSettings: {
    connectionString: process.env.DB_URI
  },
  LoggerSettings: {
    level: 'info',
    silence: ['healthy', 'IntrospectionQuery']
  },
  CorsSettings: {
    allowedOrigins: [],
    allowedUrls: [],
    allowedPaths: [],
    allowedMethods: ['GET', 'POST', 'OPTIONS'],
    allowedCredentials: true
  },
  AwsSettings: {
    accessKeyId: process.env.AWS_MY_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_MY_SECRET_KEY,
    region: process.env.AWS_REGION
  },
  CognitoSettings: {
    region: process.env.COGNITO_REGION,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    appClientId: process.env.COGNITO_APP_CLIENT_ID,
    facebookAppId: process.env.FACEBOOK_APP_ID,
    facebookAppSecret: process.env.FACEBOOK_APP_SECRET,
    facebookCallbackURL: '/auth/facebook/callback',
    googleAppId: process.env.GOOGLE_APP_ID,
    googleAppSecret: process.env.GOOGLE_APP_SECRET,
    googleCallbackURL: '/auth/google/callback'
  },
  FirebaseSettings: {
    type: process.env.TYPE,
    projectId: process.env.PROJECT_ID,
    privateKeyId: process.env.PRIVATE_KEY_ID,
    privateKey: process.env.PRIVATE_KEY,
    clientEmail: process.env.CLIENT_EMAIL,
    clientId: process.env.CLIENT_ID,
    authUri: process.env.AUTH_URI,
    tokenUri: process.env.TOKEN_URI,
    authProviderX509: process.env.AUTH_PROVIDER_X509_CERT_URL,
    clientX509CertUr: process.env.CLIENT_X509_CERT_URL
  }
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getConfig<T>(key: string) {
  const config = configuration();
  return (config[key] as T) || ({} as T);
}
