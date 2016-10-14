from pymongo import MongoClient
import json

client = MongoClient('localhost', 27017)

db = client['test-database']
collection = db['test-collection']

posts = db.posts

posts.insert_one(
        {
            loc : { type: "Point", coordinates: [51.039920, 13.734095] },
            name: "Hauptbahnhof"
            }
        )
