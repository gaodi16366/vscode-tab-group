import { test, describe, expect } from "@jest/globals"
import { Logger } from "../Logger"

describe("test logger", () => {
	test("test message fomartter", () => {
		let message = "this is a {0} message for {1}";
		expect(Logger.formatMessage(message, "debug", "test")).toEqual("this is a debug message for test");
	})
});