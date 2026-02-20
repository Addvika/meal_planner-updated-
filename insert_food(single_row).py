import psycopg2
from config import load_config
def insert_food(name):
    """ Insert a new food into the food table """
    sql = """INSERT INTO food(name)
             VALUES(%s) RETURNING food_id;"""
    food_id = None
    config = load_config()
    try:
        with  psycopg2.connect(**config) as conn:
            with  conn.cursor() as cur:
                # execute the INSERT statement
                cur.execute(sql, (name,))
                # get the generated id back
                rows = cur.fetchone()
                if rows:
                    food_id = rows[0]
                # commit the changes to the database
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return food_id
if __name__ == '__main__':
    ans=input("Would you like to insert a row?Y/N")
    if ans=="Y":
        food=input("Enter food name:")
    insert_food(food)
