const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
	const htmlEmail = `
  <style>
  .sampleH1{
    color: blue;
  }
  </style>
  <h1 class="sampleh1" >Welcome to Task API</h1>
  <div>We hope you find our app useful </div>
  <div>etc etc blah blah blah </div>
  `;
	sgMail.send({
		to: email,
		from: `${process.env.FROM_EMAIL}`,
		subject: 'Thanks for signing up!',
		text: `Hi ${name}! Welcome to your task manager api.`,
		html: htmlEmail,
	});
};

const sendCancellationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: `${process.env.FROM_EMAIL}`,
		subject: 'Sorry to see you go.',
		text: `Bye ${name}. Hope to see you soon.`,
	});
};

const forgotPasswordEmail = (email, token) => {
	const exampleHTMLEmail = `
  <div>Click the link below to reset your password</div>
  <a target="_blank" rel="noopener noreferrer" href="${process.env.APP_URL}/api/password/${token}">Reset Password</a>
  `;

	sgMail.send({
		to: email,
		from: `${process.env.FROM_EMAIL}`,
		subject: 'Password Reset.',
		// text: `Hi ${name}! Please click the link below to reset your password.`
		html: exampleHTMLEmail,
	});
};

module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail,
	forgotPasswordEmail,
};
