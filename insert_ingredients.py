import psycopg2
from config import load_config
def insert_ingredients(food_id,ingredients):
    """ Insert a new ingredient into the ingredients table """
    sql = f"""INSERT INTO ingredients(food_id,ingredients)
             VALUES({food_id},'{ingredients}') RETURNING ingredients_id;"""
    ingredients_id = None
    config = load_config()
    try:
        with  psycopg2.connect(**config) as conn:
            with  conn.cursor() as cur:
                # execute the INSERT statement
                cur.execute(sql, (food_id,ingredients,))
                # get the generated id back
                rows = cur.fetchone()
                if rows:
                    ingredients_id = rows[0]
                # commit the changes to the database
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return ingredients_id
if __name__ == '__main__':
    ans=input("Would you like to insert a row?Y/N")
    if ans=="Y":
        food_id=int(input("Enter food_id:"))
        ingredients=input("Enter ingredients:")
        print(ingredients)
    insert_ingredients(food_id,ingredients)

