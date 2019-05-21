from flask import Flask, render_template, jsonify
import pandas as pd
import sqlite3

app = Flask(__name__)


@app.route('/')
@app.route('/home')
def index():
    return render_template('index.html')


@app.route('/named/')
def named():
    conn = sqlite3.connect('db/storage.db')
    df = pd.read_sql_query('select distinct iyear from terror_data;', conn)
    return jsonify(list(df['iyear']))


if __name__ == '__main__':
    app.run(debug=True)
