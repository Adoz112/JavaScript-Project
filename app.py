from flask import Flask, render_template, jsonify
import pandas as pd
import sqlite3

app = Flask(__name__)


@app.route('/')
@app.route('/home')
def index():
    return render_template('index.html')


@app.route('/years/')
def years():
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query('select distinct iyear from terror_data;', conn)
    return jsonify(list(df['iyear']))


@app.route('/smallmap/<year>')
def smallmap(year):
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query(
        f'select iyear, centlat, centlong from terror_data WHERE iyear = (?);', conn, params=(year,))
    return df.to_json()


@app.route('/country/<year>')
def country(year):
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query(
        'select distinct country_txt from terror_data WHERE iyear = (?) ORDER BY country_txt ASC;', conn, params=(year,))
    return jsonify(list(df['country_txt']))


@app.route("/position/<year>/<country>/")
def position(year, country):
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query(
        f'select iyear, centlat, centlong, longitude, latitude, attacktype1_txt, targtype1_txt, targsubtype1_txt from terror_data WHERE iyear = (?) and country_txt = (?);', conn, params=(year, country))
    return df.to_json()


@app.route('/highchart/')
def highchart():
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query(
        'select count(targtype1_txt) as thing from terror_data group by iyear;', conn)
    return df.to_json()


@app.route("/bubble/<year>")
def bubble(year):
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query(
        f'select iyear, country, country_txt from terror_data WHERE iyear = (?);', conn, params=(year,))
    return df.to_json()


if __name__ == '__main__':
    app.run(debug=True)
