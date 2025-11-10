

const forgot_password_email_template = (resetlink) => {
  return `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 30px; color: #333;">
  <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
    
    <div style="background: linear-gradient(135deg, #007bff, #00c2ff); color: white; text-align: center; padding: 25px 15px;">
      <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">NexManage</h1>
    </div>
    
    <div style="padding: 30px;">
      <h2 style="color: #007bff; font-size: 20px; margin-bottom: 10px;">Forgot Your Password?</h2>
      <p style="line-height: 1.6; margin: 8px 0; font-size: 15px; color: #555;">
        Hey there 👋,<br />
        We received a request to reset your password for your <strong>NexManage</strong> account.
      </p>
      <p style="line-height: 1.6; margin: 8px 0; font-size: 15px; color: #555;">
        Click the button below to reset your password. This link will be valid for the next <strong>15 minutes</strong>.
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetlink}"
          style="background: linear-gradient(135deg, #007bff, #00c2ff); color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p style="line-height: 1.6; margin: 8px 0; font-size: 15px; color: #555;">
        If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
      <p style="margin-top: 20px; font-size: 15px; color: #555;">
        Stay productive,<br /><strong>The NexManage Team</strong>
      </p>
    </div>

    <div style="text-align: center; padding: 20px; font-size: 13px; color: #999; background-color: #f9fafb;">
      Need help? <a href="mailto:jinil@nexmanage.tech" style="color: #007bff; text-decoration: none;">Contact Support</a><br />
      © 2025 NexForge Tech. All rights reserved.
    </div>
  </div>
</div>  

  `;
};

export { forgot_password_email_template }; 