# Worker Limit Request Bot

This Worker receives requests from an external Google Form, and forwards them to an internal Google Chat channel as an interactive card.

## Setup

To get started, install dependencies via:

```sh
npm i
```

Update the `name` in `wrangler.toml` if you'd like and then run `npx wrangler deploy` from a terminal to deploy the Worker to Cloudflare.

Copy the deployed Worker's URL for the next step.

### Add Google form

Create a Google form and make sure that it also submits to a spreadsheet. This makes a great backup if some submissions are not forwarded.

From the spreadsheet, open the Apps Script interface, and replace the contents of `code.gs` with the following:

```sh
function mySubmit(e) {
  const url = "<Deployed Worker's URL>"

  const options = {
    'method': 'post',
    'payload': JSON.stringify(e.namedValues)
  }
  UrlFetchApp.fetch(url, options)
}
```

This will send a POST request to your Worker on each form submit.

### Create webhook and add it as a secret

Next, go to Google Chat and add a webhook per these [instructions](https://developers.google.com/chat/how-tos/webhooks#step_1_register_the_incoming_webhook).

Copy the webhook and add it as a secret via Wrangler by running:

```sh
npx wrangler secret put WEBHOOK_URL
```

This will then prompt you to paste the webhook url as the secret's value.

### Update form fields

In `src/index.ts` you will need to edit the form fields in `sanitizedValues` to match the fields coming from your Google form.

Any key values that change should be updated in the  `createCard` function.

## More info

For more information on Workers, view the [docs](https://developers.cloudflare.com/workers/).

For more information on Google webhooks, read the [docs](https://developers.google.com/chat/how-tos/webhooks). 

To read more about the possibilities with Google Card Messages, read the docs [here](https://developers.google.com/chat/api/guides/message-formats/cards).
