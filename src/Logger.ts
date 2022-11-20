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
			return typeof params[number] != "undefined" ? params[number] : match;
		});
	}
	
	private static writeToConsole(message: string) {
		if (this.isDebugging) {
			console.log(this.timestamp, consolePrefix, message);
		}
	}
	
	/* 
		message: "This is a {0} message for {1}."
		params: "example","comment"
	 */
	static debug(message: string, ...params: any[]): void {
		if (this.logLevel > LogLevel.Debug && !this.isDebugging) return;
		let formatedMessage:string = message ? this.formatMessage(message, params) : params.join(",") ?? emptyStr;
		Logger.writeToConsole(formatedMessage);
		if (this.output != null && this.logLevel <= LogLevel.Debug) {
			this.output.appendLine(`${this.timestamp} ${formatedMessage}`);
		}
	}

	static info(message: string, ...params: any[]): void {
		if (this.logLevel > LogLevel.Info && !this.isDebugging) return;
		let formatedMessage:string = message ? this.formatMessage(message, params) : params.join(",") ?? emptyStr;
		Logger.writeToConsole(formatedMessage);
		if (this.output != null && this.logLevel <= LogLevel.Info) {
			this.output.appendLine(`${this.timestamp} ${formatedMessage}`);
		}
	}

	static warn(message: string, ...params: any[]): void {
		if (this.logLevel > LogLevel.Warn && !this.isDebugging) return;
		let formatedMessage:string = message ? this.formatMessage(message, params) : params.join(",") ?? emptyStr;
		Logger.writeToConsole(formatedMessage);
		if (this.output != null && this.logLevel <= LogLevel.Warn) {
			this.output.appendLine(`${this.timestamp} ${formatedMessage}`);
		}
	}

	static error(err?: Error, message: string, ...params: any[]): void {
		if (this.logLevel > LogLevel.Error && !this.isDebugging) return;
		let formatedMessage:string = message ? this.formatMessage(message, params) : params.join(",") ?? emptyStr;
		Logger.writeToConsole(formatedMessage);
		if (this.output != null && this.logLevel <= LogLevel.Error) {
			this.output.appendLine(`${this.timestamp} ${formatedMessage}`);
		}
		if (err != undefined){
			this.output.appendLine(err.stack?emptyStr);
		}
	}

}
