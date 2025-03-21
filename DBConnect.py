from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://Serrano31:Aural@database.fe647.mongodb.net/?appName=DataBase"

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

Aural._one({"name":"Marc", "Friends":[], "punctuations":[{"songName":"La macarena","punctuation":2}]})
