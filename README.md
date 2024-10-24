<a href="https://github.com/ibnaleem/gnupg-discord/stargazers"><img src="https://img.shields.io/github/stars/ibnaleem/gnupg-discord.svg?style=for-the-badge"></a>
<a href="https://github.com/ibnaleem/gnupg-discord/blob/main/docs/LICENSE"><img src="https://img.shields.io/github/license/ibnaleem/gnupg-discord?style=for-the-badge"></a>
# GnuPG Discord Bot
An open-source GnuPG Discord bot designed to enable users to efficiently encrypt messages to other Discord members with ease, especially on mobile where GnuPG is not available.

### Invite GnuPG
```
https://discord.com/api/oauth2/authorize?client_id=1186037614797668403&permissions=1084681088065&scope=bot
```
### Verify Invite Link Signature
```
https://pastebin.com/djLgsd15
```

## Commands
- `/encrypt [@member]` - Send an encrypted message to a user. [I do not store this.](https://github.com/ibnaleem/gnupg-discord/blob/main/commands/encrypt.js#L64-L128)
- `/set-gpg-key` - Set your GPG key so other users can encrypt messages to you.
- `/get-gpg-key [@member]` - Get a member's GPG key.
- `/info` - Miscellaneous information about me.
- `/send-key` - Export a key to a keyserver
- `/verify` - Verify signatures

## CHANGELOG
All changes, and major implementations, such as bug fixes and new commands will be documented in [CHANGELOG.md](https://github.com/ibnaleem/gnupg-discord/blob/main/docs/CHANGELOG.md)

## Privacy
Encryption takes place via Discord's API. While this is an open-sourced Discord bot, please refrain from sending any sensitive information through Discord. When you submit a message, it is transmitted through Discord's API to GnuPG Discord, where it encrypts your plaintext message and then sends it to the recipient via the same API.
<div align="center">
    <img src="https://i.ibb.co/TwWFc7R/Screenshot-2024-10-24-at-18-12-21-cleaned.png" width="50%" height="50%">
</div>

Above is a modal, and it has two fields defined as:

```js
const userIdField = new TextInputBuilder({
        customId: 'user-id-field',
        label: "Discord ID",
        placeholder: 'E.g 1110526906106904626',
        style: TextInputStyle.Short,
        required: true,
    });
    
const messageField = new TextInputBuilder({
        customId: 'message-field',
        label: 'Message',
        placeholder: "Disclaimer: Encryption occurs via the Discord API",
        style: TextInputStyle.Paragraph,
        minLength: 1,
        required: true,
    });
```
When the user submits the modal, [`async (modalSubmitInteraction) => {...}`](https://github.com/ibnaleem/gnupg-discord/blob/main/commands/encrypt.js#L64-L65) is triggered, allowing me, the developer, to retreive the values of these fields:

```js
const userId = modalSubmitInteraction.fields.getTextInputValue('user-id-field');
const message = modalSubmitInteraction.fields.getTextInputValue('message-field');
```
The message field—specifically, the one you want to encrypt—remains in plaintext for me because Discord's API doesn’t encrypt it when it’s sent to GnuPG. This is why they recommend against sharing sensitive information through it. Although the message sent to GnuPG is plaintext, I would need to store it in a database; otherwise, it would be lost from memory once the interaction ends. Since GnuPG only stores your GPG key when you use the `/set-gpg-key` command, you don’t need to worry about me decrypting your messages. I don’t have access to your plaintext message after our interaction is complete. The GnuPG bot encrypts your plaintext message and sends it to the recipient, ensuring that Discord cannot access the messages exchanged between you and your recipient. In summary:
```
Bob uses GnuPG Discord to encrypt the message "Hello, my name is Bob" to Alice
GnuPG Discord sends the encrypted message to Alice
Alice reads and decrypts the encrypted message on her device
Alice uses GnuPG Discord to encrypt the message "Hello Bob, my name is Alice
GnuPG Discord sends the encrypted message to Bob
Bob reads and decrypts the encrypted message on his device
...
```
As opposed to
```
Bob: Hello, my name is Bob
Alice: Hello Bob, my name is Alice
```
What's more, all this is happening through a third-party app, meaning Bob and Alice don't even have DMs with each other, or any interaction for that matter:
```
Bob --> GnuPG Bot --> Alice
Alice --> GnuPG Bot --> Bob
Bob <------x------> Alice

```

## Contributing
I welcome contributions from the community and appreciate the time and effort put into making [GnuPG Discord](https://github.com/ibnaleem/gnupg-discord) better. To contribute, please follow the guidelines and steps outlined below:

> Note: **_Your pull request will be closed if you do not specify the changes you've made._**

### Fork the Repository
Start by [forking this repository](https://github.com/ibnaleem/gnupg-discord/fork). You can do this by clicking on the ["Fork"](https://github.com/ibnaleem/gnupg-discord/fork) button located at the top right corner of the GitHub page. This will create a personal copy of the repository under your own GitHub account.

### Clone the Repository
Next, clone the forked repository to your local machine using the following command:
```bash
$ git clone https://github.com/yourusername/gnupg-discord.git
```
Navigate to the cloned directory:
```bash 
$ cd gnupg-discord
```
### Create a New Branch
Before making any changes, it's recommended to create a new branch. This ensures that your changes won't interfere with other contributions and keeps the main branch clean. Use the following command to create and switch to a new branch:
```bash
$ git checkout -b branch-name
```
### Make the Desired Changes
Now, you can proceed to make your desired changes to the project. Whether it's fixing bugs, adding new features, improving documentation, or optimizing code, your efforts will be instrumental in enhancing the project.

### Commit and Push Changes
Once you have made the necessary changes, commit your work using the following commands:
```bash
$ git add .
$ git commit -m "Your commit message"
```
Push the changes to your forked repository:
```bash
$ git push origin branch-name
```
### Submit a Pull Request
Head over to the [original repository](https://github.com/ibnaleem/gnupg-discord) on GitHub and go to the ["Pull requests"](https://github.com/ibnaleem/gnupg-discord/pulls) tab.
1. Click on the "New pull request" button.
2. Select your forked repository and the branch containing your changes.
3. Provide a clear and informative title for your pull request, and use the description box to explain the modifications you have made. **_Your pull request will be closed if you do not specify the changes you've made._**
4. Finally, click on the "Create pull request" button to submit your changes.

## LICENSE
[This repository is under the MIT License](https://github.com/ibnaleem/gnupg-discord/blob/main/docs/LICENSE)

## PGP Fingerprint - Ibn Aleem
```
2024 7EC0 23F2 769E 6618  1C0F 581B 4A2A 862B BADE
```
