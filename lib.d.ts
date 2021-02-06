declare const ENV: 'dev' | 'prod' | 'test'
declare const logger: typeof console & { dump: (...msgs: any[]) => void };
