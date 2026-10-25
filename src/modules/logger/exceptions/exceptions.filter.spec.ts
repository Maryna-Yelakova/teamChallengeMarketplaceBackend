/** Final registration conflicts must preserve field errors through the global exception filter. */
import { ArgumentsHost, ConflictException } from "@nestjs/common";
import { AllExceptionsFilter } from "./exceptions.filter";

describe("AllExceptionsFilter registration errors", () => {
  it("returns safe field conflicts so the mobile form can keep the user's input", () => {
    const fieldErrors = { email: ["This contact is already linked to another account."] };
    const logger = { error: jest.fn() };
    const filter = new AllExceptionsFilter({ withService: () => logger } as never);
    const response = { status: jest.fn().mockReturnThis(), json: jest.fn(), getHeader: jest.fn() };
    const host = {
      switchToHttp: () => ({
        getRequest: () => ({ path: "/auth/register", method: "POST", headers: {} }),
        getResponse: () => response
      })
    } as unknown as ArgumentsHost;

    filter.catch(
      new ConflictException({
        code: "CONTACT_ALREADY_IN_USE",
        message: "Update the conflicting contacts.",
        fieldErrors
      }),
      host
    );

    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: "CONTACT_ALREADY_IN_USE", fieldErrors })
    );
  });
});
