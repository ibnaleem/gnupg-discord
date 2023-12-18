import discord, gnupg
from discord.ext import commands
from discord.ui import Modal, TextInput
from discord import app_commands, Interaction


class PrivateKeyModal(Modal, title="Decrypt Using Private Key"):
    private_key = TextInput(style=discord.TextStyle.long,label="Private Key in ASCII Format (never stored)",required=True, placeholder="ASCII format only")
    passphrase = TextInput(style=discord.TextStyle.long,label="Passphrase (never stored)",required=True,placeholder="Passphrase to unlock private key")
    message = TextInput(style=discord.TextStyle.long,label="Encrypted Message",required=True,placeholder="ASCII format only")

    async def on_submit(self, interaction: Interaction):
        decrypted_text = self.decrypt_text(private_key=self.private_key.value,passphrase=self.passphrase.value,message=self.message.value)

        try:
            await interaction.user.send(decrypted_text, delete_after=300)
            await interaction.response.send_message(f"{interaction.user.mention} Check your DMs", ephemeral=True)
        except discord.Forbidden:
            await interaction.response.send_message(decrypted_text, ephemeral=True)

    def decrypt_text(self, private_key: str, passphrase: str, message: str) -> str:
        
        gpg = gnupg.GPG()
        
        try:
            import_result = gpg.import_keys(private_key)
            key_fingerprint = import_result.fingerprints[0]

            decrypted_data = gpg.decrypt(
                message, passphrase=passphrase, fingerprint=key_fingerprint
            )

            if decrypted_data.ok:
                decrypted_text = decrypted_data.data.decode("utf-8")
            else:
                decrypted_text = f"Decryption failed: {decrypted_data.status}"

        except Exception as e:
            decrypted_text = f"Error during decryption: {str(e)}"

        gpg.delete_keys(key_fingerprint, secret=True)

        return decrypted_text


class Decryption(commands.Cog):
    def __init__(self, client: commands.Bot) -> None:
        super().__init__()
        self.client = client

    @app_commands.command(
        name="decrypt", description="Decrypt text using private key (never stored)"
    )
    async def decrypt(self, interaction: Interaction):
        private_key_modal = PrivateKeyModal()
        await interaction.response.send_modal(private_key_modal)


async def setup(client: commands.Bot) -> None:
    await client.add_cog(Decryption(client))
