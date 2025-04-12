import { expect, test, describe } from "bun:test";
import { randomDomain } from "../utils/random-domain";
import { randomUserAgent } from "../utils/random-user-agent";

describe("Random Functions", () => {
    describe("randomDomain", () => {
        test("should return a valid email format", () => {
            const email = randomDomain();
            expect(email).toMatch(/^[a-z]+[a-z]+@gmail\.com$/);
        });

        test("should return different emails on multiple calls", () => {
            const email1 = randomDomain();
            const email2 = randomDomain();
            expect(email1).not.toBe(email2);
        });
    });

    describe("randomUserAgent", () => {
        test("should return a valid user agent object", () => {
            const userAgent = randomUserAgent();
            if (!userAgent) {
                throw new Error("User agent is undefined");
            }
            expect(typeof userAgent).toBe("object");
        });

        test("should return different user agents on multiple calls", () => {
            const userAgent1 = randomUserAgent();
            const userAgent2 = randomUserAgent();
            if (!userAgent1 || !userAgent2) {
                throw new Error("User agent is undefined");
            }
            expect(userAgent1).not.toBe(userAgent2);
        });
    });
});