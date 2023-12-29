import discord, gnupg
from discord.ext import commands
from discord.ui import Modal, TextInput
from discord import app_commands, Interaction
from concurrent.futures import ThreadPoolExecutor


class EncryptionModal(Modal, title="Encrypt Text Using Key Fingerprint"):
    fingerprint = TextInput(
        style=discord.TextStyle.short,
        label="Public Key",
        required=True,
        placeholder="example: 20247EC023F2769E66181C0F581B4A2A862BBADE",
    )

    message = TextInput(
        style=discord.TextStyle.long,
        label="Message",
        required=True,
        placeholder="Your message",
    )

    async def on_submit(self, interaction: Interaction):
        await interaction.response.defer(ephemeral=True, thinking=True)

        fingerprint = self.fingerprint.value
        message = self.message.value

        encrypted_text = encrypt_text(message=message, fingerprint=fingerprint)

        try:
            print(encrypted_text)
            await interaction.user.send(encrypted_text)
            await interaction.followup.send(f"{interaction.user.mention} Check your DMs", ephemeral=True)
        except discord.Forbidden:
            msg = await interaction.followup.send("*Encrypting your text...*")
            await msg.edit(content=encrypted_text)
        except discord.HTTPException as e:
            print(e)

def encrypt_text(message: str, fingerprint: str) -> str:
    gpg = gnupg.GPG()
    result = gpg.encrypt(message, recipients=[fingerprint])
    if result.ok:
        print(str(result))
        return str(result)
    else:
        print(f"Encryption failed: {result.status}")
        return "Encryption failed."

class Encryption(commands.Cog):
    def __init__(self, client: commands.Bot) -> None:
        super().__init__()
        self.client = client

    @app_commands.command(name="encrypt", description="Encrypt text using public key")
    @app_commands.describe()
    async def encrypt(self, interaction: Interaction):
        encryption_modal = EncryptionModal()
        await interaction.response.send_modal(encryption_modal)

async def setup(client: commands.Bot) -> None:
    await client.add_cog(Encryption(client))
