from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# TODO: Bruk miljøvariabler for databasedetaljer i en ekte applikasjon
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/gjett-hvem"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
