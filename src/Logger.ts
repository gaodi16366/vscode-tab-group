import { off } from "process";
import type { ExtensionContext, OutputChannel } from "vscode";
import { ExtensionMode } from "vscode";

const emptyStr = "";
const outputChannelName = "Tab Group";
const consolePrefix = "[Tab Group]";

export const enum LogLevel {
	Debug,
	Info,
	Warn,
	Error,
	Off,
}

export class Logger {
	private static output: OutputChannel;

	private static _logLevel: LogLevel = LogLevel.Off;
	public static get logLevel(): LogLevel {
		return this._logLevel;
	}
	public static set logLevel(value: LogLevel) {
		this._logLevel = value;
	}

	private static _isDebugging: boolean;
	public static get isDebugging(): boolean {
		return Logger._isDebugging;
	}

	private static get timestamp(): string {
		return `[${new Date().toISOString().replace(/T/, ' ').slice(0, -1)}]`;
	}

	static configure(context: ExtensionContext, logLevel: LogLevel) {
		this._isDebugging = context.extensionMode === ExtensionMode.Development;
		this.logLevel = logLevel;
	}

	static formatMessage(message: string, ...params: any[]):string {
		let regexp = /{(\d+)}/g;
		return message.replace(regexp, function (match, number): string {
			return (number < params.length && typeof params[number] != "undefined") ? params[number] : match;
		});
	}

	/* 
		message: "This is a {0} message for {1}."
		params: "example","comment"
	 */
	static debug(message: string, ...params: any[]): void {
		if (this.logLevel > LogLevel.Debug && !this.isDebugging) return;
		if (this.isDebugging) {
			console.log(this.timestamp, consolePrefix, message ?? emptyStr, params);
		}
		if (this.output != null && this.logLevel > LogLevel.Debug) {
			this.output.appendLine(`${this.timestamp} ${message ? this.formatMessage(message, params) : params ?? emptyStr}`);
		}

	}
}
