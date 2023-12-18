import discord, gnupg
from discord.ext import commands
from discord.ui import Modal, TextInput
from discord import app_commands, Interaction


class EncryptionModal(Modal, title="Encrypt Text Using Key Fingerprint"):
    
    fingerprint = TextInput(
        style=discord.TextStyle.short,
        label="Key Fingerprint",
        required=True,
        placeholder="example: 2024EC023F2769E66181C0F581B4A2A862BBADE"
    )

    message = TextInput(
        style=discord.TextStyle.long,
        label="Message",
        required=True,
        placeholder="Your message"
    )

    async def on_submit(self, interaction: Interaction):
        encrypted_text = self.encrypt_text(message=self.message.value, recipient_fingerprint=self.fingerprint.value)

        await interaction.user.send(encrypted_text)
        await interaction.response.send_message(f"{interaction.user.mention} Check your DMs", ephemeral=True)

    def encrypt_text(self, message: str, recipient_fingerprint: str) -> str:
        
        gpg = gnupg.GPG()
        
        encrypted_data = gpg.encrypt(message, recipients=[recipient_fingerprint])

        if encrypted_data.ok:
            return str(encrypted_data)
        else:
            raise ValueError(f"Encryption failed: {encrypted_data.status}")

class Encryption(commands.Cog):
    def __init__(self, client: commands.Bot) -> None:
        super().__init__()
        self.client = client

    @app_commands.command(name="encrypt", description="Encrypt text using key fingerprint")
    @app_commands.describe(fingerprint="Recipient's fingerprint used for encryption")
    async def encrypt(self, interaction: Interaction, fingerprint: str, message: str):

        encryption_modal = EncryptionModal()

        await interaction.response.send_modal(encryption_modal)


async def setup(client: commands.Bot) -> None:
    await client.add_cog(Encryption(client))
