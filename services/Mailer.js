const sendgrid = require("sendgrid");
const helper = sendgrid.mail;
const { sendGridKey } = require("../config/keys");

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(sendGridKey);
    this.from_email = new helper.Email("mesfinezekiel@gmail.com");
    this.subject = subject;
    this.body = new helper.Content("text/html", content);
    this.recipients = this.formatAddresses(recipients);

    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      return new helper.Email(email);
    });
  }

  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  addRecipients() {
    const personlize = new helper.Personalization();
    this.recipients.forEach((recipient) => {
      personlize.addTo(recipient);
    });

    this.addPersonalization(personlize);
  }

  async send() {
    const request = this.sgApi.emptyRequest({
      method: "post",
      path: "/v3/mail/send",
      body: this.toJSON(),
    });

    const response = await this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
