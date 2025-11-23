import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>("RESEND_API_KEY");
    this.resend = new Resend(apiKey);
  }

  async sendVerificationEmail(
    email: string,
    fullName: string | null,
    verificationToken: string
  ) {
    const frontendUrl =
      this.configService.get<string>("FRONTEND_URL") || "http://localhost:5173";
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const fromEmail =
      this.configService.get<string>("RESEND_FROM_EMAIL") ||
      "onboarding@resend.dev";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Xác thực Email</h1>
          </div>
          <div class="content">
            <p>Xin chào ${fullName || email},</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản tại EdTech Healthcare Platform!</p>
            <p>Vui lòng click vào nút bên dưới để xác thực email của bạn:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Xác thực Email</a>
            </div>
            <p>Hoặc copy và paste link sau vào trình duyệt:</p>
            <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
            <p><strong>Lưu ý:</strong> Link này sẽ hết hạn sau 7 ngày. Nếu bạn không xác thực trong thời gian này, tài khoản của bạn sẽ bị xóa.</p>
          </div>
          <div class="footer">
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            <p>&copy; ${new Date().getFullYear()} EdTech Healthcare Platform</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      const { data, error } = await this.resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Xác thực email đăng ký tài khoản",
        html: htmlContent,
      });

      if (error) {
        console.error("Resend error:", error);
        // In development, log the verification URL instead of failing
        if (this.configService.get<string>("NODE_ENV") === "development") {
          console.log("Verification URL:", verificationUrl);
          return true;
        }
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log("Email sent successfully:", data);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      // In development, log the verification URL instead of failing
      if (this.configService.get<string>("NODE_ENV") === "development") {
        console.log("Verification URL:", verificationUrl);
        return true;
      }
      throw error;
    }
  }

  async sendResendVerificationEmail(
    email: string,
    fullName: string | null,
    verificationToken: string
  ) {
    return this.sendVerificationEmail(email, fullName, verificationToken);
  }
}
