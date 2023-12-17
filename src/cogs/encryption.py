import asyncio, discord, gnupg
from discord import app_commands, Embed, Interaction, TextInput
from discord.ext import commands


class Encryption(commands.Cog):
    def __init__(self, client: commands.Bot) -> None:
        super().__init__()
        self.client = client
        self.gpg = gnupg.GPG()

    @commands.command()
    @commands.is_owner()
    async def sync(self, ctx: commands.Context) -> None:
        await ctx.message.delete()

        fmt = await ctx.bot.tree.sync()

        await ctx.send(f"Synced {len(fmt)} commands", delete_after=3)
        return

    @app_commands.command(name="encrypt", description="Encrypt text or files")
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
