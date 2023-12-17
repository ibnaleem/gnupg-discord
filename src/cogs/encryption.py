import gnupg
from discord import app_commands, Interaction
from discord.ext import commands


class Encryption(commands.Cog):
    def __init__(self, client: commands.Bot) -> None:
        super().__init__()
        self.client = client
        self.gpg = gnupg.GPG()

    @app_commands.command(name="encrypt", description="Encrypt text using key fingerprint")
    @app_commands.describe(fingerprint="Recipient's fingerprint used for encryption")
    async def encrypt(self, interaction: Interaction, fingerprint: str, message: str):
        
        encrypted_message = self.encrypt_text(message, fingerprint)

        await interaction.user.send(encrypted_message)
        await interaction.response.send_message(f"{interaction.user.mention} Check your DMs", ephemeral=True)

    def encrypt_text(self, text: str, recipient_fingerprint: str) -> str:
        encrypted_data = self.gpg.encrypt(text, recipients=[recipient_fingerprint])

        if encrypted_data.ok:
            return str(encrypted_data)
        else:
            raise ValueError(f"Encryption failed: {encrypted_data.status}")


async def setup(client: commands.Bot) -> None:
    await client.add_cog(Encryption(client))
