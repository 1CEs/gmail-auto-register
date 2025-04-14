import asyncio

async def delay(ms: int):
    await asyncio.sleep(ms / 1000) 