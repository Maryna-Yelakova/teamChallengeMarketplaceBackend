import { EmailProvider } from './email.provider';

export class MockEmailProvider implements EmailProvider {
  sendOtp ( email: string, code: string ): Promise<void>
  {
    console.log( `[MOCK EMAIL] to ${email}: code=${code}` );
    return Promise.resolve();
  }
}
