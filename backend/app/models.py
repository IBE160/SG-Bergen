from sqlalchemy import Column, Integer, String, JSON
from .database import Base

class Game(Base):
    __tablename__ = "games"

    id = Column(Integer, primary_key=True, index=True)
    game_code = Column(String, unique=True, index=True)
    game_state = Column(JSON)

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    player_id = Column(String, unique=True, index=True)
    game_id = Column(Integer)
    player_name = Column(String)
