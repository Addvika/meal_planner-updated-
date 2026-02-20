import psycopg2
from config import load_config

def insert_many_foods(food_list):
    """ Insert multiple food itmes into the food table  """
    sql = "INSERT INTO food(name) VALUES(%s) RETURNING *"
    config = load_config()
    try:
        with  psycopg2.connect(**config) as conn:
            with  conn.cursor() as cur:
                # execute the INSERT statement
                cur.executemany(sql, food_list)
            # commit the changes to the database
            conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

if __name__ == '__main__':
    #Figure out how to add user input
    """ans=input("Do you want to enter food items?")
    n=[]
    while ans=="Y":
        food=input("Enter food item:")
        n.append([food])
        ans=input("Do you want to enter food items?")"""
    """insert_many_foods([
        ('Pinto Beans',),
        ('Garbanzo Beans',)
    ])"""
