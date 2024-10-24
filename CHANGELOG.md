## 22/10/2024 - 13 Changes
### CommonJS to ES Module
Summary: [j3lte/pastedeno](https://github.com/j3lte/pastedeno) forced me to rewrite the codebase from CommonJS to a ECMAScript module. ([])

## 22/10/2024 - Discord.js Rewrite
Summary: The entire bot's source code has been migrated to [Discord.js](https://discord.js.org) because discord.py has become significantly deprecated, particularly in its interactions with Discord's API. ([f9161b0](https://github.com/ibnaleem/gnupg-discord/commit/7e1d418be3167a974cdbd34e166ff0216da826cf))
- Converted the interaction reply from embed to an ephemeral plaintext message since its more concise. ([fdf5e66](https://github.com/ibnaleem/gnupg-discord/commit/ea6d6aad642fd4a2b5ae13660de8dc6072ec2df2))
- Renamed `/set-public-key` command to `/set-gpg-key` command ([edb21da][https://github.com/ibnaleem/gnupg-discord/commit/fdf5e66496ef64dda62cafa7419168ba4db8e6e6])
- Implemented a check to see if a user is already in the database: if they aren't, they'll be added; if they are, their GPG key will be updated to the new one. Even if it's a resubmission (i.e., the GPG key is the same as the stored one), this operation will still be performed for the sake of simplicity, as adding another check would reduce efficiency. ([05f3d35](https://github.com/ibnaleem/gnupg-discord/commit/edb21da50ba0f7b130f3e249cf2333b62bb3a73b))
- Implemented the `/set-public-key` command to prompt users for their GPG public key and store it in the database. ([c377085](https://github.com/ibnaleem/gnupg-discord/commit/05f3d35b83301497aa56ac466e7382f2e11340c6))
- Created a db.js file to interact with MongoDB Client to store user's GPG keys. ([cab313d
 ](https://github.com/ibnaleem/gnupg-discord/commit/c37708531214e34cd0cff36264dd64add58441e2))
- Initialisation of index.js ([f9161b0](https://github.com/ibnaleem/gnupg-discord/commit/7e1d418be3167a974cdbd34e166ff0216da826cf))

## 20/12/2023 - New Feature
### End-to-End Encrypted Messages ([8eb0c9e](https://github.com/ibnaleem/gnupg-discord/commit/8eb0c9e8fd5b137b991bcc40fa3e3329d9a5a5b2))
* Utilize the [`/send`](https://github.com/ibnaleem/gnupg-discord/blob/main/src/cogs/end2end.py#L63C5-L68C76) command to send End-to-End encrypted messages to other members
* Before sending messages, users need the PGP fingerprint of the recipient. Note: Future updates may include the storage of public fingerprints for ease of access (users can opt-out as always)
* Members can communicate across different servers as long as they share a server with GnuPG. For instance, `User1` in `Server1` and `User2` in `Server2`, not in each other's servers, can exchange encrypted messages if GnuPG is present in both `Server1` and `Server2`
* Encryption is applied to messages prior to their transmission to the Discord API
* No storage of messages occurs
* Users are prompted through a [TextInput Modal](https://discordpy.readthedocs.io/en/stable/interactions/api.html#textinput) to input the PGP fingerprint, user ID, and message
* PGP fingerprints are unique alphanumeric strings generated from a user's *public key*, serving as a distinctive identifier and ensuring the integrity of encrypted communications

## 18/12/2023 - 6 Changes
### Decrypted Messages Will Delete After 5 Minutes in DMs ([b027f54](https://github.com/ibnaleem/gnupg-discord/commit/b027f546ff895a649b1eded7b1a01be39e0c405f))
* After a user receives decrypted text by our bot in their DMs, the message will remain for 5 minutes before the bot deletes it, contrary to the previous feature which allowed decrypted messages to stay in DMs forever

### Bot Will Send Encrypted & Decrypted Text in Command Channel if DMs Are Off ([db3b189](https://github.com/ibnaleem/gnupg-discord/commit/db3b1891cec7b95534192f7a31fbdad651ea218d)) ([70a0958](https://github.com/ibnaleem/gnupg-discord/commit/70a09585d1153f47badf01e95836dbbfcb0baf7d))
* Encrypted and decrypted messages will be sent to the command channel if the interaction user (command invoker) has their DMs off ([`discord.Forbidden`](https://discordpy.readthedocs.io/en/latest/api.html?highlight=forbidden#discord.Forbidden))
* Decrypted messages that are sent in command channels will be ephemeral
### Added TextInput Modal to Encryption Command ([11d0175](https://github.com/ibnaleem/gnupg-discord/commit/11d0175076f06f09600a2aef6f4d88c2b576c545))
* Upon invoking the command, users input their PGP fingerprint and message in a [TextInput Modal](https://discordpy.readthedocs.io/en/stable/interactions/api.html#textinput), just like the decryption command. This allows users to encrypted longer messages

### Added Hash Command ([eb4313f](https://github.com/ibnaleem/gnupg-discord/commit/eb4313ffc64738f4c32a318a4ea70f8edb7c420b))
* Users are prompted with 6 hash functions and a text argument for hashing their text

### Added Decryption Command ([31ee975](https://github.com/ibnaleem/gnupg-discord/commit/31ee975e30914239c32540d0a901e7a4130892fd))
* Upon invoking the command, users input their PGP Private Key and message in a [TextInput Modal](https://discordpy.readthedocs.io/en/stable/interactions/api.html#textinput)
* Private keys and passphrases are imported using [gnupg-python](https://gnupg.readthedocs.io/en/latest/), and deleted after decryption. Private keys and passphrases are not stored. See [How Decryption Works with GnuPG Discord](https://github.com/ibnaleem/gnupg-discord/blob/main/docs/README.md#how-decryption-works-with-gnupg-discord)
* Decrypted messages are sent to users via DMs, accompanied by an ephemeral interaction response prompting them to check DMs


## 17/12/2023 - 1 Change
### Added Encryption Command ([c7715e9](https://github.com/ibnaleem/gnupg-discord/commit/c7715e9fa6cb6da035c07bd86cbdcd19239158fc))
* Upon invoking the command, users input their PGP fingerprint and message in the required command arguments
* Encrypted messages are sent to users via DMs, accompanied by an ephemeral interaction response prompting them to check DMs
