/// <reference types="vite/client" />

declare interface Window {
	plausible?: (event: string, opts?: Record<string, any>) => void;
}
