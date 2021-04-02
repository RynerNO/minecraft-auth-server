import Debug from 'debug';
import config from '@src/config';

const Loggers: Map<string, Logger> = new Map();

class Logger {
	private enabled: boolean;
	private debugger: Debug.Debugger;
	private name: string;
	constructor(name: string) {
		this.name = name;
		this.enabled = config.DEBUG;
		this.debugger = Debug(this.name);
	}
	public log(message: string, data: any = '') {
		if (this.enabled) {
			Debug.enable(`${this.name}`);
			this.debugger(message, data);
		}
	}
}

export function getLogger(name: string) {
	if (!Loggers.has(name)) {
		Loggers.set(name, new Logger(name));
	}

	const log = (message: string, data?: any) => {
		Loggers.get(name).log(message, data);
	};

	return log;
}
