# Flask app
from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from trp import Document
import pymongo
from pymongo.errors import DuplicateKeyError
import os
import openai
from dotenv import load_dotenv
from datetime import datetime


app = Flask(__name__)
CORS(app)
load_dotenv()
# mongo_url = os.getenv('MONGO_URI')
# openai.api_key = os.getenv('API_KEY')
# ACCESS_ID=os.getenv('ACCES_ID')
# ACCESS_KEY=os.getenv('ACCESS_KEY')

openai.api_key = "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"
ACCESS_ID = "AKIATOBC3PNAGEWM2APL"
mongo_url = 'mongodb+srv://deadshot:deadshot@cluster0.ptitmlu.mongodb.net/?retryWrites=true'

ACCESS_KEY = 'kj34Bw63ExuQ8wAv2MwG6+KJAS1qEzUlM57XRPLO'

count = 0
textract_client = boto3.client('textract', region_name='ap-south-1', aws_access_key_id=ACCESS_ID,
                               aws_secret_access_key=ACCESS_KEY)


# -----------------------------mongodb to python and to react----------------------------------------------------------
@app.route("/get_lineitems", methods=['POST'])
def get_lineitems():
    
    data = request.get_json()
    rec_name = data["rec_name"]
    print(rec_name)
    # print(line_items)
    line_items=[]
    for i in currentLineItems:
        if(i[0]==rec_name):
            line_items=i[1]
    print("Line items",line_items)
    return jsonify(line_items=line_items)
       
    

# displaying recipt list
@app.route("/get_reciepts", methods=['POST'])
def get_reciepts():
    data = request.get_json()
    print(data)
    name = data["name"]
    print("name -> ", name)
    print("current_recipts -> ",currentReciptlist)
    return jsonify(recipt=currentReciptlist)


@app.route("/get_reciepts_score", methods=['POST'])
def get_reciepts_score():
    data = request.get_json()
    print(data)
    name = data["name"]
    print("name -> ", name)
    print("current_recipts -> ",currentReciptlist)
    ret=[int(i[1]) for i in currentReciptlist]
    ratio = [0,0,0]
    for i in ret:
        if(i<3):
            ratio[0]=ratio[0]+1
        elif(i>=3 and i<7):
            ratio[1]=ratio[1]+1
        else:
            ratio[2]=ratio[2]+1
    date=[]
    score=[]
    for i in currentReciptlist:
        date.append(i[2])
        score.append(i[1])
    d={'date':date, 'score': score,'ratio': ratio}
        
    return jsonify(d)
@app.route("/get_lineitems_score", methods=['POST'])
def get_lineitems_score():
    data = request.get_json()
    rec_name = data["rec_name"]
    print(rec_name)
    score=[]
    ratio = [0,0,0]
    for i in currentLineItems:
        if(i[0]==rec_name):
            score=i[1]
    for i in score:
        print("i" ,i)
        if(i[1]<3):
            ratio[0]=ratio[0]+1
        elif(i[1]>=3 and i[1]<7):
            ratio[1]=ratio[1]+1
        else:
            ratio[2]=ratio[2]+1
    date=[]
    score=[]
    for i in currentReciptlist:
        date.append(i[2])
        score.append(i[1])
    d={'date':date, 'score': score,'ratio': ratio}
    print("date => ", date)
    print("score => ", score)
    print("ratio => ",ratio)
    return jsonify(d)

    

def write_in_file(data, file_name='temp.txt'):
    # fin_final_name = (file_name.split('/')[1]).split('.')[0] + ".txt"
    with open(file_name, "w") as fobj:
        for i in data:
            fobj.write(i)
@app.route('/getLinechart', methods=['POST'])
def getLinechart():
    start()
    data = request.get_json()
    date=[]
    score=[]
    for i in currentReciptlist:
        date.append(i[2])
        score.append(i[1])
    d={'date':date, 'score': score}
    print("date => ", date)
    print("score => ", score)
    return jsonify(d)
# -------------------React to python and score to mongodb----------------------------------------------------------
@app.route('/recieve_file', methods=['POST'])
def recieve_file():
    
    files = request.files.getlist('file')
    name = request.form['name']
    print("connecting....")
    client = pymongo.MongoClient(mongo_url)
    db = client["database_01"]
    print("connected.....")

    collection = db["collection_01"]
    reciept_collection = db["collection_02"]
    for file in files:
        file_path = "img/" + file.filename
        file.save(file.filename)
        [data, file_name] = get_plain_text(file.filename)
        line_items = extract_lineitems(data)
        print("total line items ->", line_items)
        line_items = create_sustainability_score(line_items)
        write_line_items(name, file_name ,line_items,collection,reciept_collection)
    load(name,collection,reciept_collection)
    
    
    
    return jsonify(resp='success')


def get_plain_text(file_name):
    with open(file_name, "rb") as fobj:
        img_bytes = fobj.read()
    response = textract_client.detect_document_text(
        Document={
            'Bytes': img_bytes
        }
    )
    doc = Document(response)
    data = ''
    for item in response["Blocks"]:
        # print(item)
        if item["BlockType"] == "LINE":
            data = data + item["Text"]
    return [data, file_name]


def extract_lineitems(prompt):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt + "\ngive the line items with only the item name from the data:",
        temperature=0,
        max_tokens=1024,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    data = (response.choices[0].text).split('\n')
    items = []
    for i in data:
        items.append(i)
    items = list(filter(None, items))
    return items


# Classify items into sustainable and non sustainable
def create_sustainability_score(items,
                                request="provide a sustaibablity score(as single integer) and reason for each of the line items, all three seperated by colon and donot include spaces in score part"):
    response1 = openai.Completion.create(
        model="text-davinci-003",
        prompt="\n".join(items) + request,
        temperature=0,
        max_tokens=1024,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    data = (response1.choices[0].text).split('\n')
    l = []
    data = list(filter(None, data))
    print(data)
    for i in data:
        x = i.split(':')
        temp = [x[0], int(x[1]),x[2]]
        l.append(temp)
    return l

def calculate_score(line_items):
    print("Calculate Score -> ",line_items)
    s=0
    for i in line_items:
        s+=i[1]
    return round(s/len(line_items),2)
def write_line_items(name, file_name,line_items,collection , reciept_collection):
    # print("connecting....")
    # client = pymongo.MongoClient(mongo_url)
    # db = client["database_01"]
    # print("connected.....")

    # collection = db["collection_01"]
    # reciept_collection = db["collection_02"]

    temp = collection.find({"name": name})
    for i in temp:
        temp1 = i["recipts"]

    ltemp1 = len(temp1)
    print(ltemp1)
    ltemp1 = ltemp1 + 1
    recipt_name = file_name
    
    recipts = temp1

    # If the value is not already an array, convert it to one
    if not isinstance(recipts, list):
        recipts = [recipts]

    # Add the new receipt to the array
    recipts.append(recipt_name)
    # Update the 'recipts' field in the document with the new array
    collection.update_one({"name": name}, {"$set": {"recipts": recipts}})
    # query = {"name": name}
    # data ={ "$push": { "recipts": { "$each": [reciept] } } }
    # collection.update_one(query, data)
    reciept_collection.insert_one({"name": name, "rec_name": recipt_name, "line_items": line_items,"score": calculate_score(line_items),"Date": str(datetime.today()).split()[0]})
    
    print("bills -> ", recipts)
    print("line_items ->", line_items)

#-------------------------start----------------------------------------
@app.route("/start", methods=['POST'])
def start():
    data = request.get_json()
    name =data['name']
    
    global currentName
    currentName=name
    print("connecting....")
    client = pymongo.MongoClient(mongo_url)
    db = client["database_01"]
    print("connected.....")

    collection = db["collection_01"]
    reciept_collection=db["collection_02"]

    data= collection.find({"name": name})
    l=[]
    for i in data:
        l.append(i)
    if(len(l)==0):
        collection.insert_one({"name":name,"recipts":"",'score':""})
    print("name -> ",name)
    try:
        if(name==tempData[0]):
            currentReciptlist=tempData[1]
            currentLineItems=tempData[2]
        else:
            load(name,collection,reciept_collection)
    except NameError:
        load(name,collection,reciept_collection)
        
    
        
    return jsonify(response="success")
#-------------------delete a bill------------------
@app.route("/delete_bill", methods=['POST'])
def delete_bill():
    data = request.get_json()
    bill = data['rec_name']
    name = data['name']
    print(bill)
    client = pymongo.MongoClient(mongo_url)
    db = client["database_01"]
    print("connected.....")

    collection = db["collection_01"]
    reciept_collection=db["collection_02"]
    print("bill -> ", bill)
    query = {'rec_name': bill, "name" : name}
    result = reciept_collection.delete_one(query)
    load(name,collection,reciept_collection)
    # Return status message
    
    # for i in range(len(currentReciptlist)):
    #     if(currentReciptlist[i][0]==bill):
    #         currentReciptlist.pop(i)


    return jsonify(response=currentReciptlist)




#------------------------------load-----------------
def load(name,collection,recipt_collection):
    data= recipt_collection.find({"name" : name})
    rec_names=[]
    scores=[]
    line_items=[]
    date=[]
    for i in data:
        print(i)
        rec_names.append(i['rec_name'])
        scores.append(i['score'])
        line_items.append(i['line_items'])
        date.append(i['Date'])
    data=dict(data)
    print(data)
        #print(i['line_items'])
    global tempName
    global tempData
    tempData=['',[],[]]
    global currentReciptlist
    global currentLineItems
    currentReciptlist = []
    currentLineItems = []
    #print(rec_names)
    #print(scores)
    #print(line_items)
    for i in range(len(rec_names)):

        currentReciptlist.append([rec_names[i],int(scores[i]),date[i]])
        currentLineItems.append([rec_names[i],line_items[i]])
    #print(currentLineItems)
    #print(currentReciptlist)
    





if __name__ == '__main__':
    # print("connecting....")
    # client = pymongo.MongoClient("mongodb+srv://deadshot:deadshot@cluster0.ptitmlu.mongodb.net/?retryWrites=true&w=majority")
    # db = client["database_01"]
    # print("connected.....")
    
    # collection=db["collection_01"]
    # reciept_collection =db["collection_02"]

    app.run(debug=True)


