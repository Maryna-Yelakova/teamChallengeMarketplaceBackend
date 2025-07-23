import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("google-auth")
export class GoogleAuthController {
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // Redirects to Google OAuth
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req: { user: { id: string; email: string; name: string } }) {
    return {
      message: "Google authentication successful",
      user: req.user
    };
  }
}
