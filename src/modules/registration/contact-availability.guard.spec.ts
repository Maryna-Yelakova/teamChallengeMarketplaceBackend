/** Public availability checks are bounded per client and recover after the request window. */
import { ExecutionContext, HttpException } from "@nestjs/common";
import { ContactAvailabilityGuard } from "./contact-availability.guard";

const contextFor = (ip: string) =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ ip, socket: {} }) })
  }) as unknown as ExecutionContext;

describe("ContactAvailabilityGuard", () => {
  afterEach(() => jest.useRealTimers());

  it("limits repeated checks from one client without blocking other clients", () => {
    const guard = new ContactAvailabilityGuard();
    for (let count = 0; count < 30; count += 1)
      expect(guard.canActivate(contextFor("client-a"))).toBe(true);
    expect(() => guard.canActivate(contextFor("client-a"))).toThrow(HttpException);
    expect(guard.canActivate(contextFor("client-b"))).toBe(true);
  });

  it("allows checks again after the window expires", () => {
    jest.useFakeTimers();
    const guard = new ContactAvailabilityGuard();
    for (let count = 0; count < 30; count += 1) guard.canActivate(contextFor("client-a"));
    jest.advanceTimersByTime(60_000);
    expect(guard.canActivate(contextFor("client-a"))).toBe(true);
  });
});
