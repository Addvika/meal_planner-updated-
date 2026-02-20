import psycopg2
from config import load_config
def get_results(ret):
    """ Retrieve data from the food table """
    config  = load_config()
    try:
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                cur.execute(ret)
                print("Number of rows: ",cur.rowcount)
                row = cur.fetchone()
                while row is not None:
                    print(row)
                    row = cur.fetchone()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)

if __name__ == '__main__':
    print("Enter command:")
    command=input()
    get_results(command)
