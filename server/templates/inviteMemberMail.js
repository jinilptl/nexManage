const invite_member_email_template = (name, setPasswordLink) => {
  return `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 30px; color: #333;">
    <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #007bff, #00c2ff); color: white; text-align: center; padding: 25px 15px;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">NexManage</h1>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px;">
        <h2 style="color: #007bff; font-size: 20px; margin-bottom: 10px;">
          You've Been Invited!
        </h2>

        <p style="line-height: 1.6; margin: 10px 0; font-size: 15px; color: #555;">
          Hello <strong>${name}</strong>,<br />
          You've been invited to join <strong>NexManage</strong> — a powerful project management platform.
        </p>

        <p style="line-height: 1.6; margin: 8px 0; font-size: 15px; color: #555;">
          To get started, please set your password by clicking the button below:
        </p>

        <!-- Set Password Button -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="${setPasswordLink}" target="_blank"
            style="background: linear-gradient(135deg, #007bff, #00c2ff); color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 15px;">
            Set Your Password
          </a>
        </div>

        <p style="line-height: 1.6; margin: 8px 0; font-size: 14px; color: #888;">
          This link will expire in <strong>24 hours</strong>. If the link expires, ask your admin to resend the invitation.
        </p>

        <div style="background-color: #fff8e1; border-left: 4px solid #ffb300; padding: 12px 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #795548;">
            <strong>⚠️ Security Notice:</strong> If you were not expecting this invitation, please ignore this email. Do not share this link with anyone.
          </p>
        </div>

        <p style="margin-top: 20px; font-size: 15px; color: #555;">
          Welcome aboard,<br /><strong>The NexManage Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; font-size: 13px; color: #999; background-color: #f9fafb;">
        Need help? <a href="mailto:chintan@nexforge.tech" style="color: #007bff; text-decoration: none;">Contact Support</a><br />
        © ${new Date().getFullYear()} NexForge Tech. All rights reserved.
      </div>
    </div>
  </div>
  `;
};

export { invite_member_email_template };
