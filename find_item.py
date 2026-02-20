import psycopg2
from config import load_config
def find_item(keyword):
    """ Find a food item using the keyword table """
    sql = f"""SELECT * FROM keywords WHERE '{keyword}'=ANY(keywords);"""
    config = load_config()
    try:
        with  psycopg2.connect(**config) as conn:
            with  conn.cursor() as cur:
                # execute the INSERT statement
                cur.execute(sql)
                # get the generated id back
                rows = cur.fetchall();
                print("Printing all matches:")
                if rows:
                    for row in rows:
                        print(row)
                else:
                    print("No matches. Try again.")
                # commit the changes to the database
                #conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        #return keywords_id
        print("Done.")
if __name__ == '__main__':
    ans=input("Would you like to find a food item?Y/N")
    if ans=="Y":
        keyword=input("Enter keyword:")
    find_item(keyword)
