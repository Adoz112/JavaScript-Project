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
        'select COALESCE(a.thing, 0) as thing, b.iyear as iyear, b.targtype1_txt as targtype1_txt FROM ( SELECT x.iyear, y.targtype1_txt FROM (SELECT DISTINCT iyear FROM terror_data) x LEFT JOIN (SELECT DISTINCT targtype1_txt FROM terror_data) y ON 1 = 1) b LEFT OUTER JOIN (SELECT targtype1_txt, iyear, count(targtype1_txt) as thing from terror_data GROUP BY iyear, targtype1_txt) a ON a.iyear = b.iyear AND a.targtype1_txt = b.targtype1_txt', conn)

    return df.to_json(orient="records")


@app.route("/bubble/<year>")
def bubble(year):
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query(
        f'select iyear, country, country_txt from terror_data WHERE iyear = (?);', conn, params=(year,))
    return df.to_json()


if __name__ == '__main__':
    app.run(debug=True)
