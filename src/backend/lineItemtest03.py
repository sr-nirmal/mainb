import os
import openai
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

openai.api_key = os.getenv('API_KEY')

prompt = """ www.jurcelounge.inCASIDPAIDRolfacosta.RodjacostaCASH/ARECHSF Enterprise, B-9/11(CA)PAIDni Nadia,West Bengal 71Ph# 033258game:CASHSale: 19/06/22HSKYummericaPAID22:03PriesCashier: 1: 63PAIDgables AsheshCASHTemQLYSCASCHAATPrioAmountPAIDMineral WaterI3050.00OK PLEASE!Egg Fried Rcc2130260.009 Manchunanle11701/0.00CASH's ]PAIDShilly Chicken 161200200.00Pcs]Masala KulchaCRAZY165.00Pricken Kadhai10240.00CASHMinit Mojito80320.00PAIDSpicy MexicanI525525.00Large Thin CrustChicken1150140.00CASHShawarmaCASHPAIDTotal Qty:JUICE AUGG Health1961.90your first stop 16COST2.49.05SEST5.5%49.05PAIDwww.juicelounge.inCASHGrand Total2060.00CASTPAIDFSSAT ic No 128170120000GST RobbacostaThank You! AgainsAgain!AIDCAS"""

def get_line_items(prompt):
    global items
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt + "\ngive the line items from the data:",
        temperature=0,
        max_tokens=1024,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    data = (response.choices[0].text).split('\n')
    items = []
    for i in data:
        print(i)
        items.append(i)

# Classify items into sustainable and non sustainable
def create_sustainability_score(items):
    openai.api_key = os.getenv('API_KEY')
    response1 = openai.Completion.create(
        model="text-davinci-003",
        prompt="\n".join(items)+"\nhow you could create a sustainability score 0f 0-10 with reason for each item in the line items:.",
        temperature=0,
        max_tokens=1024,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    data= (response1.choices[0].text).split('\n')
    for i in data:
        print(i)
        

def main():
    get_line_items(prompt)
    create_sustainability_score(items)

# Run the program
if __name__ == '__main__':
    main()
