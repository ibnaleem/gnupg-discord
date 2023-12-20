import discord, gnupg, os
from pymongo import MongoClient
from discord.ext import commands
from discord.ui import Modal, TextInput
from discord import app_commands, Embed, Interaction

MONGO_URI = os.environ["MONGO_URI"]

mongo_client = MongoClient(MONGO_URI)
database = mongo_client["GnuPG"]
pub_keys_collection = database.pub_keys


class SendEncryptedMessageModal(Modal, title="Send an Encrypted Message to a User"):
    
    fingerprint = TextInput(
        style=discord.TextStyle.short,
        label="Key Fingerprint",
        required=True,
        placeholder="example: 2024EC023F2769E66181C0F581B4A2A862BBADE"
    )

    user_id = TextInput(
        style=discord.TextStyle.short,
        label="Member ID",
        required=True,
        placeholder="example: 1110526906106904626"
    )

    message = TextInput(
        style=discord.TextStyle.long,
        label="Message",
        required=True,
        placeholder="Your message"
    )

    async def on_submit(self, interaction: Interaction):
        encrypted_text = self.encrypt_text(message=(self.message.value + f"\n\n This message was sent by {interaction.user.name} ({interaction.user.id})"), recipient_fingerprint=self.fingerprint.value)
        
        try:
            user = interaction.client.get_user(int(self.user_id.value))
            await user.send(encrypted_text)
            await interaction.response.send_message(f"{interaction.user.mention} Your encrypted message to {user.name} was sent successfully", ephemeral=True)
        except discord.Forbidden:
            await interaction.response.send_message(f"{interaction.user.mention} {user.name} has their DMs off, or I could not find the user. Your encrypted message:\n\n{encrypted_text}", ephemeral=True)

    def encrypt_text(self, message: str, recipient_fingerprint: str) -> str:
        
        gpg = gnupg.GPG()
        
        encrypted_data = gpg.encrypt(message, recipients=[recipient_fingerprint])

        if encrypted_data.ok:
            return str(encrypted_data)
        else:
            raise ValueError(f"Encryption failed: {encrypted_data.status}")
        
class End2End(commands.Cog):
    def __init__(self, client: commands.Bot) -> None:
        super().__init__()
        self.client = client

    @app_commands.command(name="send", description="Send an encrypted message to a user using their PGP fingerprint")
    async def send(self, interaction: Interaction):
        
        send_encrypted_message_modal = SendEncryptedMessageModal()
        
        await interaction.response.send_modal(send_encrypted_message_modal)


async def setup(client: commands.Bot) -> None:
    await client.add_cog(End2End(client))