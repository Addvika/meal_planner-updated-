import psycopg2
from config import load_config
def insert_keywords(food_id,keyword):
    """ Insert a new keyword into the keyword table """
    sql = f"""INSERT INTO keywords(food_id,keywords)
             VALUES({food_id},'{keyword}') RETURNING keywords_id;"""
    keywords_id = None
    config = load_config()
    try:
        with  psycopg2.connect(**config) as conn:
            with  conn.cursor() as cur:
                # execute the INSERT statement
                cur.execute(sql, (food_id,keyword,))
                # get the generated id back
                rows = cur.fetchone()
                if rows:
                    keywords_id = rows[0]
                # commit the changes to the database
                conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        return keywords_id
if __name__ == '__main__':
    ans=input("Would you like to insert a row?Y/N")
    if ans=="Y":
        food_id=int(input("Enter food_id:"))
        keywords=input("Enter keywords:")
    insert_keywords(food_id,keywords)
