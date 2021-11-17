const credentials = {
  apiKey: 'b99a024cbe33ce700fb02221b5865c20d737cac7aa64cafa6919eb7359413990',
  username: 'sandbox',
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Africastalking = require('africastalking')(credentials);

// Initialize a service e.g. SMS
const sms = Africastalking.SMS;

// Send message and capture the response or error
export const sendMessage = async (
  phoneNumbers:
    { to: string[]; message: string; from: string; enqueue: boolean }
) => {
  await sms
    .send(phoneNumbers)
    .catch((e: unknown) => console.log(e));
  return true;
};