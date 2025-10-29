interface Environments {
	readonly APP_ENVIRONMENT: "development" | "production";
	readonly COOKIE_SESSION_SECRET: string;
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Environments {}
	}
}

export {};
