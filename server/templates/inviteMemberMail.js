const invite_member_email_template = (
  name,
  email,
  password,
  loginLink
) => {
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
          You’ve Been Invited! 🎉
        </h2>

        <p style="line-height: 1.6; margin: 10px 0; font-size: 15px; color: #555;">
          Hello <strong>${name}</strong>,<br />
          You’ve been invited to join <strong>NexManage</strong>.
        </p>

        <p style="line-height: 1.6; margin: 8px 0; font-size: 15px; color: #555;">
          Below are your login credentials:
        </p>

        <!-- Credentials Box -->
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>

        <p style="line-height: 1.6; margin: 8px 0; font-size: 15px; color: #555;">
          For security reasons, we strongly recommend changing your password after your first login.
        </p>

        <!-- Login Button -->
        <div style="text-align: center; margin: 25px 0;">
          <a href="${loginLink}" target="_blank"
            style="background: linear-gradient(135deg, #007bff, #00c2ff); color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Login to NexManage
          </a>
        </div>

        <p style="line-height: 1.6; margin: 8px 0; font-size: 15px; color: #555;">
          If you were not expecting this invitation, please contact support immediately.
        </p>

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
