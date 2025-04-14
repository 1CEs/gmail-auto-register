import csv
import random
import os

def random_domain():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, '..', 'data')
    thai_nickname_file = os.path.join(data_dir, 'thai-nickname.csv')
    uni_nickname_file = os.path.join(data_dir, 'uni-nickname.csv')
    
    with open(thai_nickname_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        thai_nicknames = list(reader)
    
    with open(uni_nickname_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        uni_nicknames = list(reader)
    
    thai_nickname = random.choice(thai_nicknames)
    uni_nickname = random.choice(uni_nicknames)
    
    return {
        'fullName': f"{thai_nickname['en'].lower().capitalize()} {uni_nickname['firstname'].lower().capitalize()}",
        'domain': f"{thai_nickname['en'].lower()}{uni_nickname['firstname'].lower()}{uni_nickname['nickname'].lower()}"
    } 