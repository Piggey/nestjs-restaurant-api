from typing import List, Optional
import psycopg2
import csv

## RZECZY Z NIERELACYJNEJ SA RECZNIE ZROBIONE

POSTGRES_USER = 'postgres_user'
POSTGRES_PASSWORD = 'postgres_password' 
POSTGRES_PORT = 5433

DB_NAME = 'sumatywny'
API_PORT = 3333
APP_PORT = 3000

INDIRECT_PATH = 'python/csv'

postgres = psycopg2.connect(database=DB_NAME, host='localhost', user=POSTGRES_USER, password=POSTGRES_PASSWORD, port=POSTGRES_PORT)

def fetch_all_rows(postgres, cols: List[str], *, table_name: Optional[str] = None, query: Optional[str] = None):
  try:
    cursor = postgres.cursor()

    cols_str = ','.join(['"' + column + '"' for column in cols])
    if table_name:
      cursor.execute(f'SELECT {cols_str} FROM "{table_name}"')
    else:
      cursor.execute(query)

    rows = cursor.fetchall()
    return rows
  except psycopg2.Error as e:
    print('postgres database error: ', e)
  finally:
    cursor.close()

def export_to_csv(outfile: str, col_names: List[str], rows: List[str]):
  with open(outfile, 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(col_names)
    writer.writerows(rows)

# address
address_col_names = ['addressId', 'street', 'streetNo', 'city', 'postalCode', 'country']
address_rows = fetch_all_rows(postgres, address_col_names, table_name='Address')
export_to_csv(f'{INDIRECT_PATH}/address.csv', address_col_names, address_rows)

# manager
manager_col_names = ['managerId', 'firstName', 'lastName', 'salary']
manager_rows = fetch_all_rows(postgres, manager_col_names, query='SELECT "managerId", "firstName", "lastName", "salary" FROM "Manager" JOIN "Employee" ON "Manager"."employeeId" = "Employee"."employeeId"')

# restaurant
restaurant_col_names = ['restaurantId', 'managerId', 'addressId', 'geoLat', 'geoLon']
restaurant_rows = fetch_all_rows(postgres, restaurant_col_names, table_name='Restaurant')
export_to_csv(f'{INDIRECT_PATH}/restaurant.csv', restaurant_col_names, restaurant_rows)

# menu items
menu_col_names = ['itemId', 'categoryId', 'name', 'price', 'rating', 'numberOfRatings']
menu_rows = fetch_all_rows(postgres, menu_col_names, table_name='Menu')
export_to_csv(f'{INDIRECT_PATH}/menu.csv', menu_col_names, menu_rows)

# category
category_col_names = ['categoryId', 'categoryName']
category_rows = fetch_all_rows(postgres, category_col_names, table_name='Category')
export_to_csv(f'{INDIRECT_PATH}/category.csv', category_col_names, category_rows)

# client
client_col_names = ['userId', 'userEmail', 'loyaltyPoints']
client_rows = fetch_all_rows(postgres, client_col_names, table_name='User')
export_to_csv(f'{INDIRECT_PATH}/client.csv', client_col_names, client_rows)
