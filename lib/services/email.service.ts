// lib/services/email.service.ts
import nodemailer from 'nodemailer'

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  private static async sendEmail(to: string, subject: string, html: string, text?: string): Promise<void> {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email not configured, skipping email send:', { to, subject })
      return
    }

    try {
      await this.transporter.sendMail({
        from: `${process.env.FROM_NAME || 'MentorMatch'} <${process.env.FROM_EMAIL || 'noreply@mentormatch.com'}>`,
        to,
        subject,
        html,
        ...(text ? { text } : {})
      })
    } catch (error) {
      console.error('Email send error:', error)
      throw new Error('Failed to send email')
    }
  }

  static async sendOTPEmail(
    email: string, 
    otp: string, 
    firstName: string, 
    type: 'signup' | 'reset'
  ): Promise<void> {
    const subject = type === 'signup' 
      ? 'Verify your MentorMatch account' 
      : 'Reset your MentorMatch password'
    
    const html = `
      <h2>Hello ${firstName}!</h2>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendWelcomeEmail(email: string, firstName: string, role: string): Promise<void> {
    const subject = 'Welcome to MentorMatch!'
    const html = `
      <h2>Welcome ${firstName}!</h2>
      <p>Your ${role} account has been successfully verified.</p>
      <p>You can now access your dashboard and start using MentorMatch.</p>
      <p>If you have any questions, feel free to contact our support team.</p>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendMentorApprovalEmail(email: string, firstName: string): Promise<void> {
    const subject = 'Welcome to MentorMatch - Your Application is Approved!'
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 30px; }
          .success-icon { background: #d1fae5; color: #065f46; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 24px; }
          .action-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .features-list { background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .features-list ul { margin: 0; padding: 0; list-style: none; }
          .features-list li { padding: 8px 0; padding-left: 24px; position: relative; }
          .features-list li:before { content: "✓"; position: absolute; left: 0; color: #10b981; font-weight: bold; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Application Approved!</h1>
          </div>
          <div class="content">
            <div class="success-icon">✓</div>
            <h2>Congratulations ${firstName}!</h2>
            <p>We're excited to inform you that your mentor application has been <strong>approved</strong>! Welcome to the MentorMatch community.</p>
            
            <div class="features-list">
              <h3>You can now:</h3>
              <ul>
                <li>Complete your profile setup</li>
                <li>Set your availability and pricing</li>
                <li>Start connecting with students</li>
                <li>Schedule mentoring sessions</li>
                <li>Access our mentor resources and training materials</li>
              </ul>
            </div>
            
            <p>Ready to get started? Click the button below to access your mentor dashboard:</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="action-button">Access Your Dashboard</a>
            
            <p>If you have any questions or need assistance, our support team is here to help. Simply reply to this email or contact us at support@mentormatch.com.</p>
            
            <p>Welcome aboard, and thank you for joining our mission to connect learners with expert mentors!</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The MentorMatch Team</p>
            <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendMentorRejectionEmail(email: string, firstName: string, reason: string): Promise<void> {
    const subject = 'MentorMatch Application Update'
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
          .content { padding: 30px; }
          .reason-box { background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .reason-box h3 { color: #dc2626; margin-top: 0; }
          .action-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName},</h2>
            <p>Thank you for your interest in becoming a mentor on MentorMatch. We appreciate the time and effort you put into your application.</p>
            
            <p>After careful review by our team, we are unable to approve your application at this time.</p>
            
            <div class="reason-box">
              <h3>Reason for Decision:</h3>
              <p>${reason}</p>
            </div>
            
            <p>We encourage you to address the feedback provided and consider reapplying in the future. Our requirements are designed to ensure the highest quality experience for our students.</p>
            
            <p>If you have any questions about this decision or would like additional feedback, please don't hesitate to contact our support team.</p>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" class="action-button">Contact Support</a>
            
            <p>Thank you again for your interest in MentorMatch.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The MentorMatch Team</p>
            <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendMentorInfoRequestEmail(email: string, firstName: string, requestedInfo: string): Promise<void> {
    const subject = 'Additional Information Required - MentorMatch Application'
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
          .content { padding: 30px; }
          .info-box { background: #eff6ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .info-box h3 { color: #1d4ed8; margin-top: 0; }
          .action-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
          .steps-list { background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .steps-list ol { margin: 0; padding-left: 20px; }
          .steps-list li { padding: 5px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Additional Information Needed</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName},</h2>
            <p>Thank you for your mentor application. We're currently reviewing your submission and need some additional information to proceed.</p>
            
            <div class="info-box">
              <h3>Required Information:</h3>
              <p>${requestedInfo}</p>
            </div>
            
            <div class="steps-list">
              <h3>Next Steps:</h3>
              <ol>
                <li>Log in to your MentorMatch account</li>
                <li>Navigate to your application/profile section</li>
                <li>Provide the requested information</li>
                <li>Submit your updated application</li>
              </ol>
            </div>
            
            <p>Once you've provided the additional information, our team will continue reviewing your application. We typically respond within 24-48 hours of receiving complete applications.</p>
            
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/onboarding" class="action-button">Update Your Application</a>
            
            <p>If you have any questions about what's needed or need assistance with your application, please don't hesitate to contact our support team.</p>
            
            <p>Thank you for your patience and continued interest in becoming a MentorMatch mentor!</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The MentorMatch Review Team</p>
            <p>This email was sent to ${email}. If you need help, please contact support@mentormatch.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendAdminOTPEmail(email: string, otp: string, firstName: string): Promise<void> {
    const subject = 'MentorMatch Admin Login - Security Code'
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
          .content { padding: 30px; text-align: center; }
          .otp-code { background: #fef2f2; border: 2px solid #fca5a5; color: #dc2626; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: monospace; }
          .warning-box { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: left; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          .security-icon { font-size: 48px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="security-icon">🔒</div>
            <h1>Admin Login Security Code</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName},</h2>
            <p>Someone is attempting to login to the MentorMatch Admin Dashboard.</p>
            <p>Your security code is:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            
            <div class="warning-box">
              <strong>⚠️ Security Notice:</strong><br>
              • If you didn't attempt to login, please ignore this email<br>
              • Never share this code with anyone<br>
              • Contact support immediately if you suspect unauthorized access
            </div>
            
            <p>If you're having trouble logging in, please contact our support team.</p>
          </div>
          <div class="footer">
            <p><strong>MentorMatch Security Team</strong></p>
            <p>This is an automated security email. Please do not reply to this message.</p>
            <p>Login attempt from: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendOnboardingCompletionEmail(email: string, firstName: string): Promise<void> {
    const subject = 'Application Submitted Successfully!'
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
          .content { padding: 30px; }
          .timeline { background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .timeline h3 { margin-top: 0; color: #7c3aed; }
          .timeline-item { padding: 10px 0; border-left: 3px solid #e5e7eb; padding-left: 20px; margin-left: 10px; position: relative; }
          .timeline-item.current { border-left-color: #8b5cf6; }
          .timeline-item.current:before { content: "●"; position: absolute; left: -8px; color: #8b5cf6; background: white; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Application Submitted!</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName},</h2>
            <p>Congratulations! You've successfully completed and submitted your mentor application.</p>
            
            <div class="timeline">
              <h3>What happens next:</h3>
              <div class="timeline-item current">
                <strong>Application Submitted</strong> - Completed ✓
              </div>
              <div class="timeline-item">
                <strong>Initial Review</strong> - We'll review your application within 24-48 hours
              </div>
              <div class="timeline-item">
                <strong>Decision</strong> - You'll receive an email with our decision
              </div>
              <div class="timeline-item">
                <strong>Welcome to MentorMatch</strong> - If approved, you'll get access to your mentor dashboard
              </div>
            </div>
            
            <p>Our review team carefully evaluates each application to ensure we maintain the highest quality standards for our mentoring community.</p>
            
            <p>You'll receive an email notification once our review is complete. In the meantime, if you have any questions, feel free to contact our support team.</p>
            
            <p>Thank you for your interest in becoming a MentorMatch mentor. We're excited about the possibility of having you join our community!</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The MentorMatch Team</p>
            <p>This email was sent to ${email}. Questions? Contact support@mentormatch.com</p>
          </div>
        </div>
      </body>
      </html>
    `

    await this.sendEmail(email, subject, html)
  }


static async sendAdminMessageEmail(
  userEmail: string,
  userName: string,
  message: string,
  adminName: string
): Promise<void> {
  const subject = 'Message from MentorMatch Admin';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Message from Admin</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">MentorMatch</h1>
          <p style="color: #F8F3EE; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Admin Message</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 60px; height: 60px; background-color: #8B4513; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <h2 style="color: #2A2A2A; margin: 0; font-size: 24px; font-weight: 600;">You have a message from our admin team</h2>
          </div>

          <div style="background-color: #F8F3EE; border-radius: 8px; padding: 25px; margin: 20px 0;">
            <p style="color: #2A2A2A; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Hi ${userName},</p>
            <p style="color: #2A2A2A; margin: 0; font-size: 16px; line-height: 1.6;">${message}</p>
          </div>

          <div style="background-color: #E8DDD1; border-radius: 8px; padding: 20px; margin: 25px 0;">
            <p style="color: #8B7355; margin: 0; font-size: 14px; text-align: center;">
              <strong>From:</strong> ${adminName}<br>
              <strong>Sent:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard" 
               style="background-color: #8B4513; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block; transition: background-color 0.3s;">
              View Dashboard
            </a>
          </div>

          <div style="border-top: 1px solid #E8DDD1; padding-top: 25px; margin-top: 30px;">
            <p style="color: #8B7355; font-size: 14px; line-height: 1.6; margin: 0;">
              If you have any questions or need assistance, feel free to reply to this email or contact our support team.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #2A2A2A; padding: 25px 30px; text-align: center;">
          <p style="color: #8B7355; font-size: 14px; margin: 0 0 10px 0;">
            This message was sent by the MentorMatch admin team.
          </p>
          <p style="color: #8B7355; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} MentorMatch. All rights reserved.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  const textContent = `
    Message from MentorMatch Admin
    
    Hi ${userName},
    
    ${message}
    
    From: ${adminName}
    Sent: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
    
    You can view your dashboard at: ${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard
    
    If you have any questions, please contact our support team.
    
    Best regards,
    MentorMatch Team
  `;

  await this.sendEmail(userEmail, subject, htmlContent, textContent);
}
}