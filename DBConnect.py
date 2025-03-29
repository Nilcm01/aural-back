from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://Serrano31:<db_password>@database.fe647.mongodb.net/?appName=DataBase"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client.Users

Aural = db.Aural

Aural.insert_one({"name":"Marc", "Friends":[], "punctuations":[{"songName":"La macarena","punctuation":2}]})

"""
Per veure la base de dades en si:
    - Instalar MongoDB Compass
    - Donar-li a add new connection
    - Afegir a l'apartat de URI: mongodb+srv://Serrano31:<db_password>@database.fe647.mongodb.net/
"""
