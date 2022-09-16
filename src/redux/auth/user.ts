export interface User {
	email: string;
	token: string;
	refreshToken: string;
	username: string;
}

export interface AWSUser {
	Session:                null;
	attributes:             Attributes;
	authenticationFlowType: string;
	client:                 AWSUSerClient;
	keyPrefix:              string;
	pool:                   Pool;
	preferredMFA:           string;
	signInUserSession:      SignInUserSession;
	userDataKey:            string;
	username:               string;
}

export interface Attributes {
	email: string;
	sub:   string;
}

export interface AWSUSerClient {
	endpoint:     string;
	fetchOptions: FetchOptions;
}

export interface FetchOptions {
}

export interface Pool {
	advancedSecurityDataCollectionFlag: boolean;
	client:                             PoolClient;
	clientId:                           string;
	userPoolId:                         string;
}

export interface PoolClient {
	endpoint: string;
}

export interface SignInUserSession {
	accessToken:  Token;
	clockDrift:   number;
	idToken:      Token;
	refreshToken: RefreshToken;
}

export interface Token {
	jwtToken: string;
}

export interface RefreshToken {
	token: string;
}
