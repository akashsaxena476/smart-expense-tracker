## This is a temporary file for creating a postgresql database.........

from database.connection import engine
from database.models import Base
from database.user_models import User

Base.metadata.create_all(bind=engine)

print("Database tables created successfully.")