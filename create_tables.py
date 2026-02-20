import psycopg2
from config import load_config
def create_tables():
    """ Create tables in the PostgreSQL database"""
    commands = (
        """
        CREATE TABLE food(
            food_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL
        )
        """,
        """ CREATE TABLE calories (
                calories_id SERIAL PRIMARY KEY,
                food_id INT,
                FOREIGN KEY(food_id) REFERENCES food(food_id) ON UPDATE CASCADE ON DELETE CASCADE,
                calories INT NOT NULL
                )
        """,
        """
        CREATE TABLE ingredients (
                food_id INT,
                ingredients_id SERIAL PRIMARY KEY,
                FOREIGN KEY(food_id) REFERENCES food(food_id) ON UPDATE CASCADE ON DELETE CASCADE,
                ingredients TEXT
        )
        """,
        """
        CREATE TABLE inventory(
                inventory_id SERIAL PRIMARY KEY,
                ingredients_id INT NOT NULL,
                FOREIGN KEY (ingredients_id)
                    REFERENCES ingredients (ingredients_id)
                    ON UPDATE CASCADE ON DELETE CASCADE
        )
        """,
        """
        CREATE TABLE keywords(
                keywords_id SERIAL PRIMARY KEY,
                food_id INT NOT NULL,
                FOREIGN KEY (food_id)
                    REFERENCES food (food_id)
                    ON UPDATE CASCADE ON DELETE CASCADE
        )
     """

        )
    try:
        config = load_config()
        with psycopg2.connect(**config) as conn:
            with conn.cursor() as cur:
                # execute the CREATE TABLE statement
                for command in commands:
                    cur.execute(command)
    except (psycopg2.DatabaseError, Exception) as error:
        print(error)
if __name__ == '__main__':
    create_tables()
