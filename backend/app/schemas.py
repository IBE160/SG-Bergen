from pydantic import BaseModel
from typing import Optional, Any

class GameBase(BaseModel):
    game_code: str

class GameCreate(GameBase):
    pass

class Game(GameBase):
    id: int
    game_state: Optional[Any]

    class Config:
        orm_mode = True

class PlayerBase(BaseModel):
    player_id: str
    player_name: str

class PlayerCreate(PlayerBase):
    pass

class Player(PlayerBase):
    id: int
    game_id: int

    class Config:
        orm_mode = True
