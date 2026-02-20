import psycopg2
from config import load_config
def insert_calories(food_id,calories):
    """ Insert a new calorie into the calories table """
    sql = f"""INSERT INTO calories(food_id,calories)
             VALUES({food_id},{calories}) RETURNING calories_id;"""
    calories_id = None
    config = load_config()
    try:
        with  psycopg2.connect(**config) as conn:
            with  conn.cursor() as cur:
                # execute the INSERT statement
                cur.execute(sql, (food_id,calories,))
                # get the generated id back
                rows = cur.fetchone()
                if rows:
                    calories_id = rows[0]
                # commit the changes to the database
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return calories_id
if __name__ == '__main__':
    ans=input("Would you like to insert a row?Y/N")
    if ans=="Y":
        food_id=int(input("Enter food_id:"))
        calories=int(input("Enter calories:"))
    insert_calories(food_id,calories)
