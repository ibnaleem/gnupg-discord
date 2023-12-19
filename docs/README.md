<div align="center">
    <img src="https://loganmarchione.com/assets/featured/featured_gnupg.svg" width="50%" height="50%">
</div>
    
<p align="center">The open source repository for GnuPG Discord Bot. Secure your server with the power of GnuPG encryption. Encrypt messages, verify authenticity with digital signatures, and manage keys effortlessly. Use <b>/help</b> for command details.</p>

<div align="center">
    <a href="https://www.buymeacoffee.com/ibnaleem" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
</div>

<div align="center">

<a href="https://github.com/ibnaleem/gnupg-discord/stargazers"><img src="https://img.shields.io/github/stars/ibnaleem/gnupg-discord.svg?style=for-the-badge"></a>
<a href="https://github.com/ibnaleem/gnupg-discord/blob/main/docs/LICENSE"><img src="https://img.shields.io/github/license/ibnaleem/gnupg-discord?style=for-the-badge"></a>
</div>

### Invite GnuPG
```
https://discord.com/api/oauth2/authorize?client_id=1186037614797668403&permissions=1084681088065&scope=bot
```
### Verify Invite Link Signature
```
https://pastebin.com/djLgsd15
```

## Commands
- `/sign` - Create ASCII signatures
- `/send-key` - Export a key to a keyserver
- `/verify` - Verify signatures using fingerprints
- `/fingerprint` - Retrieve public key's fingerprint
- `/encrypt` - Encrypt text using public key fingerprints
- `/hash [hash function] [text]` - Generate a hash with various hash functions
- `/decrypt` - Decrypt text using private key (see [How Decryption Works with GnuPG Discord](#how-decryption-works-with-gnupg-discord))

## Files
File encryption/decryption and signatures will be supported soon.

## CHANGELOG
All changes, and major implementations, such as bug fixes and new commands will be documented in [CHANGELOG.md](https://github.com/ibnaleem/gnupg-discord/new/main/docs/CHANGELOG.md)

## Privacy
GnuPG Discord is and will always be open-sourced, inviting member contributions. We are committed to user privacy, and no data is collected without explicit consent. In the event of necessary data collection, users have the choice to opt-out, and we ensure transparent communication before any such collection occurs. Your trust and privacy matter to us. Any breaches, privacy concerns, or issues will be communicated to all members in servers with GnuPG Discord, even those who haven't interacted with our bot. Our commitment extends beyond an open-sourced code base; we provide clear explanations of every crucial code for users without programming backgrounds, ensuring a comprehensive understanding of our bot's functionality. While we emphasize the importance of users maintaining good operational security (OPSEC) while using our bot, we disclaim responsibility for any irresponsible OPSEC practices by users. Our responsibility lies solely in how our bot handles your private keys, public keys, encryption, and signatures.

## How Decryption Works with GnuPG Discord
GnuPG Discord does not store or collect private keys. Instead, you are mandated to provide your private key and passphrase for signatures and decryption. When you run `/decrypt` or `/sign`, you are met with a Discord TextInput Modal.
<div align="center">
    <img src=https://github.com/ibnaleem/gnupg-discord/blob/main/docs/assets/text-input-modal.png width="50%" height="50%">
</div>

Since most Discord bots are not open-sourced, Discord has placed a warning for users to not share their passwords or sensitive information. This includes private keys and passphrases. Fortuately, GnuPG Discord is completely open sourced, and the handling of this form can be viewed inside the [decryption cog](https://github.com/ibnaleem/gnupg-discord/blob/main/src/cogs/decryption.py#L7C1-L42C30).

```py
class PrivateKeyModal(Modal, title="Decrypt Using Private Key"):
    private_key = TextInput(style=discord.TextStyle.long,label="Private Key in ASCII Format (never stored)",required=True, placeholder="ASCII format only")
    passphrase = TextInput(style=discord.TextStyle.long,label="Passphrase (never stored)",required=True,placeholder="Passphrase to unlock private key")
    message = TextInput(style=discord.TextStyle.long,label="Encrypted Message",required=True,placeholder="ASCII format only")
```
a class is created called `PrivateKeyModal` which inherits from [`discord.ui.Modal`](https://discordpy.readthedocs.io/en/stable/interactions/api.html#modal). This is essential for creating the Modal. `private_key`, `passphrase` and `message` are instances of the `TextInput()` class which creates text fields for users to input text inside of. 

```py
async def on_submit(self, interaction: Interaction):
    decrypted_text = self.decrypt_text(private_key=self.private_key.value,passphrase=self.passphrase.value,message=self.message.value,)
    await interaction.user.send(decrypted_text)
    await interaction.response.send_message(f"{interaction.user.mention} Check your DMs", ephemeral=True)
```
A user does not submit anything until they trigger the `on_submit()` method of the `PrivateKeyModal(Modal)` class. This is done by clicking the ["Submit" button in the Modal](https://github.com/ibnaleem/gnupg-discord/blob/main/docs/assets/text-input-modal.png). To retreive the private key, passphrase, and encrypted message, the `.value` attribute on the `private_key`, `passphrase` and `message` instances is used. These values are sent to the `decrypt_text()` method:
```py
def decrypt_text(self, private_key: str, passphrase: str, message: str) -> str:
    gpg = gnupg.GPG()
    try:
        import_result = gpg.import_keys(private_key)
        key_fingerprint = import_result.fingerprints[0]
        decrypted_data = gpg.decrypt(message, passphrase=passphrase, fingerprint=key_fingerprint)
        if decrypted_data.ok:
            decrypted_text = decrypted_data.data.decode("utf-8")
        else:
            decrypted_text = f"Decryption failed: {decrypted_data.status}"

    except Exception as e:
        decrypted_text = f"Error during decryption: {str(e)}"

    gpg.delete_keys(key_fingerprint, secret=True)

    return decrypted_text
```
The private key is imported and the passphrase is used to unlock it for decryption. After the `decrypted_text` holds a value, the private key is deleted using `gpg.delete_keys(key_fingerprint, secret=True)`. GnuPG Discord cannot retrieve your private key after the `on_submit()` has finished executing because `private_key`, `passphrase` and `message` instances are stored in random access memory (RAM) and the memory is allocated to another program once `on_submit()` has finished executing. 

This is the same procedure that is used for signing messages.

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
Now, you can proceed to make your desired changes to the project. Whether it's fixing grammer mistakes, adding new material to chapters, improving documentation, or optimizing exercises, your efforts will be instrumental in enhancing the project.

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
