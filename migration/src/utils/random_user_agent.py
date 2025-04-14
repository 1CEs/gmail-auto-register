import csv
import random
import os

def random_user_agent():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(current_dir, '..', 'data')
    user_agents_file = os.path.join(data_dir, 'user-agents.csv')
    
    with open(user_agents_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        user_agents = list(reader)
    
    return random.choice(user_agents) 