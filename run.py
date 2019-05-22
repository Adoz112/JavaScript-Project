from flask import Flask, render_template, request
import sqlite3 as sql
import pandas as pd


app = Flask(__name__)


#################################################
# Database Setup
#################################################

@app.route('/')
def home():
   return render_template("index.html")

@app.route('/named/')
def named():
    conn = sql.connect('db/storage.db')
    df = pd.read_sql_query('select distinct iyear, latitude, longitude, city, targtype1_txt, attacktype1_txt, centlat, centlong from terror_data;', conn)
    return df.to_json()

#Code to provide specific data parameters (i.e., by year)
@app.route('/year')
def year():
    if 'iyear' in request.args:
        iyear = int(request.args['iyear'])
        conn = sql.connect('db/storage.db')
        df = pd.read_sql_query(f'select distinct iyear, latitude, longitude, city, targtype1_txt, attacktype1_txt, centlat, centlong from terror_data WHERE iyear = {iyear};', conn)
        return df.to_json() 
    else:
        return "Error: No year was provided. Please specify a year."



if __name__ == "__main__":
    app.run(debug=True)