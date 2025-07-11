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

  private static async sendEmail(to: string, subject: string, html: string): Promise<void> {
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
      <h2>Congratulations ${firstName}!</h2>
      <p>We're excited to inform you that your mentor application has been approved.</p>
      <p>You can now:</p>
      <ul>
        <li>Complete your profile setup</li>
        <li>Set your availability</li>
        <li>Start connecting with students</li>
      </ul>
      <p>Login to your dashboard to get started: <a href="${process.env.FRONTEND_URL}/dashboard">Access Dashboard</a></p>
      <p>Welcome to the MentorMatch community!</p>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendMentorRejectionEmail(email: string, firstName: string, reason: string): Promise<void> {
    const subject = 'MentorMatch Application Update'
    const html = `
      <h2>Hello ${firstName},</h2>
      <p>Thank you for your interest in becoming a mentor on MentorMatch.</p>
      <p>After careful review, we are unable to approve your application at this time.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>You're welcome to reapply in the future. If you have any questions, please contact our support team.</p>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendMentorInfoRequestEmail(email: string, firstName: string, requestedInfo: string): Promise<void> {
    const subject = 'Additional Information Required - MentorMatch Application'
    const html = `
      <h2>Hello ${firstName},</h2>
      <p>We're reviewing your mentor application and need some additional information:</p>
      <p><strong>Required Information:</strong> ${requestedInfo}</p>
      <p>Please login to your account and update your application with the requested information.</p>
      <p><a href="${process.env.FRONTEND_URL}/onboarding">Update Application</a></p>
    `

    await this.sendEmail(email, subject, html)
  }

  static async sendOnboardingCompletionEmail(email: string, firstName: string): Promise<void> {
    const subject = 'Application Submitted Successfully!'
    const html = `
      <h2>Hello ${firstName},</h2>
      <p>Thank you for completing your mentor application!</p>
      <p>Our team will review your application within 24-48 hours.</p>
      <p>You'll receive an email notification once the review is complete.</p>
      <p>Thank you for your patience!</p>
    `

    await this.sendEmail(email, subject, html)
  }
}

