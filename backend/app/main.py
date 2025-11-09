from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import random
import string

from . import models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Tillat CORS for å la frontend koble til
origins = [
    "http://localhost:3000",
    "http://localhost:5173", # Vite default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def generate_game_code(length=4):
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))

@app.post("/api/game", response_model=schemas.Game)
def create_game(db: Session = Depends(get_db)):
    game_code = generate_game_code()
    db_game = models.Game(game_code=game_code, game_state={})
    db.add(db_game)
    db.commit()
    db.refresh(db_game)
    return db_game

@app.post("/api/game/{game_code}/join")
def join_game(game_code: str, player: schemas.PlayerCreate, db: Session = Depends(get_db)):
    db_game = db.query(models.Game).filter(models.Game.game_code == game_code).first()
    if db_game is None:
        raise HTTPException(status_code=404, detail="Game not found")
    
    # Her kan du legge til logikk for å legge til spilleren i spillet
    # For nå, returnerer vi bare en suksessmelding

    return {"message": f"Player {player.player_name} joined game {game_code}"}


@app.get("/")
def read_root():
    return {"message": "Gjett Hvem? Backend"}

# Her vil vi legge til WebSocket-logikk senere
