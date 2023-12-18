import hashlib
from discord.ext import commands
from discord.app_commands import Choice
from discord import app_commands, Interaction

class Hash(commands.Cog):
    def __init__(self, client: commands.Bot) -> None:
        super().__init__()
        self.client = client

    @app_commands.command(name="hash", description="Generate a hash using various hash functions")
    @app_commands.describe(function="Hash Function", text="The text you want to generate a hash of")
    @app_commands.choices(function=[
        Choice(name="md5", value=1),
        Choice(name="sha1", value=2),
        Choice(name="sha3", value=3),
        Choice(name="sha256", value=4),
        Choice(name="sha384", value=5),
        Choice(name="sha512", value=6)
    ]
    )
    async def generate_hash(self, interaction: Interaction, function: Choice[int], text: str):
        
        if function.name == "md5":
            hash_result = hashlib.md5(text.encode('utf-8')).hexdigest()
        elif function.name == "sha1":
            hash_result = hashlib.sha1(text.encode('utf-8')).hexdigest()
        elif function.name == "sha3":
            hash_result = hashlib.sha3_256(text.encode('utf-8')).hexdigest()
        elif function.name == "sha256":
            hash_result = hashlib.sha256(text.encode('utf-8')).hexdigest()
        elif function.name == "sha384":
            hash_result = hashlib.sha384(text.encode('utf-8')).hexdigest()
        elif function.name == "sha512":
            hash_result = hashlib.sha512(text.encode('utf-8')).hexdigest()

        await interaction.response.send_message(hash_result)

async def setup(client: commands.Bot) -> None:
    await client.add_cog(Hash(client))