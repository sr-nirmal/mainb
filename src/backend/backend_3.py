from flask import Flask, request, jsonify,session
from flask_cors import CORS
from flask_sessions import Session
import boto3
from trp import Document
import pymongo
from pymongo.errors import DuplicateKeyError
import os
import openai
from dotenv import load_dotenv
from datetime import datetime
import secrets


app = Flask(__name__)
app.secret_key = os.urandom(16)

openai.api_key = "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"
ACCESS_ID = "AKIATOBC3PNAGEWM2APL"
mongo_url = 'mongodb+srv://deadshot:deadshot@cluster0.ptitmlu.mongodb.net/?retryWrites=true'

ACCESS_KEY = 'kj34Bw63ExuQ8wAv2MwG6+KJAS1qEzUlM57XRPLO'

count = 0
textract_client = boto3.client('textract', region_name='ap-south-1', aws_access_key_id=ACCESS_ID,
                               aws_secret_access_key=ACCESS_KEY)

#-------------------------start----------------------------------------
@app.route("/start", methods=['POST'])
def start():
    data = request.get_json()
    name =data['name']
    
    # print("connecting....")
    # client = pymongo.MongoClient(mongo_url)
    # db = client["database_01"]
    # print("connected.....")

    session['name'].append(name)

    for key, value in session.items():
        print(key, value)
    # collection = db["collection_01"]
    # reciept_collection=db["collection_02"]
    return jsonify({"hello": "world"})

if __name__ == '__main__':

    app.run(debug=True)
