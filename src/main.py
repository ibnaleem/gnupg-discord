import discord, os, asyncio, datetime
from discord import app_commands, Intents, Interaction, Embed
from discord.ext import commands
from discord.ext.commands import Greedy, Context
from typing import Literal, Optional

GNUPG_TOKEN = os.environ["GNUPG_TOKEN"]

intents = Intents.all()

client = commands.Bot(command_prefix="!", intents=intents, owner_id=1110526906106904626)


@client.event
async def on_ready() -> None:
    try:
        await client.change_presence(
            activity=discord.Streaming(
                name="/help", url="https://twitch.tv/gothamchess"
            )
        )
        print(
            f"----- GnuPG is Online -----\nServers: {len(client.guilds)}\nMembers: {len(client.users)}"
        )

    except Exception:
        print(Exception)


async def load():
    for file in os.listdir("cogs"):
        if file.endswith(".py"):
            await client.load_extension(f"cogs.{file[:-3]}")


async def main():
    await load()
    await client.start(GNUPG_TOKEN)


asyncio.run(main())
