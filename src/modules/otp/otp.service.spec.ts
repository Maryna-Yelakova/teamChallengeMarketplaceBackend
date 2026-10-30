/** Verifies that OTP proof is scoped to the stored session/contact before claims change. */
import { BadRequestException } from "@nestjs/common";
import { OtpService } from "./otp.service";

describe("OtpService registration challenges", () => {
  const contact = { value: "ada@example.com", normalizedValue: "ada@example.com" };
  let sms: { sendOtp: jest.Mock };
  let email: { sendOtp: jest.Mock };
  let store: { canSend: jest.Mock; set: jest.Mock; verify: jest.Mock };
  let registrations: { sendChallenge: jest.Mock; verify: jest.Mock };
  let service: OtpService;

  beforeEach(() => {
    sms = { sendOtp: jest.fn().mockResolvedValue(undefined) };
    email = { sendOtp: jest.fn().mockResolvedValue(undefined) };
    store = {
      canSend: jest.fn().mockReturnValue({ ok: true }),
      set: jest.fn(),
      verify: jest.fn().mockReturnValue({ ok: true })
    };
    registrations = {
      sendChallenge: jest.fn().mockResolvedValue({ contact }),
      verify: jest.fn().mockResolvedValue({ registrationState: { accountStatus: "ACTIVE" } })
    };
    service = new OtpService(sms, email, store as never, registrations as never);
  });

  it("sends to the stored contact and binds the code to its registration and channel", async () => {
    await service.send("user-1", "email");

    expect(store.set).toHaveBeenCalledWith("user-1:email:ada@example.com", expect.any(String));
    expect(email.sendOtp).toHaveBeenCalledWith("ada@example.com", expect.any(String));
    expect(sms.sendOtp).not.toHaveBeenCalled();
  });

  it("does not send or replace a challenge when resend is rate limited", async () => {
    store.canSend.mockReturnValue({ ok: false });

    await expect(service.send("user-1", "email")).rejects.toThrow(BadRequestException);
    expect(store.set).not.toHaveBeenCalled();
    expect(email.sendOtp).not.toHaveBeenCalled();
  });

  it("leaves contact ownership unchanged when OTP proof fails", async () => {
    store.verify.mockReturnValue({ ok: false, reason: "Wrong code" });

    await expect(service.verify("user-1", "email", "123456")).resolves.toMatchObject({
      ok: false,
      message: "Unable to verify code. Check it and try again."
    });
    expect(registrations.verify).not.toHaveBeenCalled();
  });

  it("returns updated registration state after valid OTP proof", async () => {
    await expect(service.verify("user-1", "email", "123456")).resolves.toMatchObject({
      ok: true,
      registrationState: { accountStatus: "ACTIVE" }
    });
    expect(store.verify).toHaveBeenCalledWith("user-1:email:ada@example.com", "123456");
    expect(registrations.verify).toHaveBeenCalledWith("user-1", "email");
  });

  it("uses a different challenge key for another registration with the same contact", async () => {
    await service.verify("user-1", "email", "123456");
    await service.verify("user-2", "email", "123456");

    expect(store.verify).toHaveBeenNthCalledWith(1, "user-1:email:ada@example.com", "123456");
    expect(store.verify).toHaveBeenNthCalledWith(2, "user-2:email:ada@example.com", "123456");
  });

  it("checks a replacement contact against its own challenge", async () => {
    registrations.sendChallenge.mockResolvedValue({
      contact: { value: "new@example.com", normalizedValue: "new@example.com" }
    });

    await service.verify("user-1", "email", "123456");

    expect(store.verify).toHaveBeenCalledWith("user-1:email:new@example.com", "123456");
  });
});
