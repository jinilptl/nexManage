const project_invite_email_template = (
  projectName,
  email,
  actionLink,
  isExistingUser = false,
  roleName = "Observer"
) => {
  return `
  <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; padding: 30px; color: #333;">
    <div style="max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-align: center; padding: 25px 15px;">
        <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">NexManage</h1>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px;">
        <h2 style="color: #6366f1; font-size: 20px; margin-bottom: 15px;">
          Project Invitation: ${projectName}
        </h2>

        <p style="line-height: 1.6; margin: 10px 0; font-size: 15px; color: #555;">
          You've been invited to join the project <strong>${projectName}</strong> on <strong>NexManage</strong> as a <strong>${roleName}</strong>.
        </p>

        ${!isExistingUser ? `
        <p style="line-height: 1.6; margin: 15px 0; font-size: 15px; color: #555;">
          A temporary account has been created for you. Please set your password to activate your account:
        </p>

        <!-- Action Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionLink}" target="_blank"
            style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">
            Set Your Password
          </a>
        </div>

        <p style="line-height: 1.6; margin: 8px 0; font-size: 14px; color: #888;">
          This link will expire in <strong>24 hours</strong>. If the link expires, ask your admin to resend the invitation.
        </p>
        ` : `
        <p style="line-height: 1.6; margin: 15px 0; font-size: 15px; color: #555;">
          Since you already have a NexManage account, you can access the project immediately by logging in.
        </p>

        <!-- Action Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionLink}" target="_blank"
            style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">
            Login to NexManage
          </a>
        </div>
        `}

        <div style="background-color: #fff8e1; border-left: 4px solid #ffb300; padding: 12px 16px; border-radius: 4px; margin: 20px 0;">
          <p style="margin: 0; font-size: 13px; color: #795548;">
            <strong>⚠️ Security Notice:</strong> If you were not expecting this invitation, please ignore this email.
          </p>
        </div>

        <p style="margin-top: 25px; font-size: 14px; color: #888; border-top: 1px solid #eee; padding-top: 20px;">
          Best regards,<br />
          <strong style="color: #333;">The NexManage Team</strong>
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding: 20px; font-size: 12px; color: #aaa; background-color: #fafafa;">
        If you didn't expect this invite, you can safely ignore this email.<br />
        © ${new Date().getFullYear()} NexForge Tech.
      </div>
    </div>
  </div>
  `;
};

export { project_invite_email_template };

