from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os

#Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

#Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init db
db = SQLAlchemy(app)
#Init ma
ma = Marshmallow(app)

# Class from Terrorist data
class Terror(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    description = db.Column(db.String(200))
    city = db.Column(db.String(200))
    iyear = db.Column(db.Integer)
    imonth = db.Column(db.Integer)
    iday = db.Column(db.Integer)
    latitude = db.Column(db.Integer)
    longitude = db.Column(db.Integer)
    attacktype1_txt = db.Column(db.String(400))

    def __init__(self, name, description, city, iyear, imonth, iday, latitude, longitude, attacktype1_txt):
        self.name = name
        self.description = description
        self.city = city
        self.iyear = iyear
        self.imonth = imonth
        self.iday = iday
        self.latitude = latitude
        self.longitude = longitude
        self.attacktype1_txt = attacktype1_txt

class TerrorSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'description', 'city', 'iyear', 'imonth', 'iday', 'latitude', 'longitude', 'attacktype1_txt')

#Init Schema
terror_schema = TerrorSchema(strict=True)
terrors_schema = TerrorSchema(many=True, strict=True)

# Create a database and add data //not needed for this project, but capturing the code #
@app.route('/terror', methods=['POST'])
def add_terror():
    name = request.json['name']
    description = request.json['description']
    city = request.json['city']
    iyear = request.json['iyear']
    imonth = request.json['imonth']
    iday = request.json['iday']
    latitude = request.json['latitude']
    longitude = request.json['longitude']
    attacktype1_txt = request.json['attacktype1_txt']

    new_terror = Terror(name, description, city, iyear, imonth, iday, latitude, longitude, attacktype1_txt)   

    db.session.add(new_terror)
    db.session.commit()

    return terror_schema.jsonify(new_terror)

# Get All Terror Data
@app.route('/terror', methods =['GET'])
def get_terrors():
  all_terrors = Terror.query.all()
  result = terrors_schema.dump(all_terrors)
  return jsonify(result.data)

# Get Single Terror Data
@app.route('/terror/<id>', methods =['GET'])
def get_terror(id):
  terror = Terror.query.get(id)
  return terror_schema.jsonify(terror)

# UPDATE a database and add data //not needed for this project, but capturing the code #
@app.route('/terror/<id>', methods=['PUT'])
def update_terror(id):
    terror = Terror.query.get(id)
    
    name = request.json['name']
    description = request.json['description']
    city = request.json['city']
    iyear = request.json['iyear']
    imonth = request.json['imonth']
    iday = request.json['iday']
    latitude = request.json['latitude']
    longitude = request.json['longitude']
    attacktype1_txt = request.json['attacktype1_txt']

    terror.name = name
    terror.descripton = description
    terror.city = city
    terror.iyear = iyear
    terror.imonth = imonth
    terror.iday = iday
    terror.latitude = latitude
    terror.longitude = longitude
    attacktype1_txt = attacktype1_txt

    db.session.commit()

    return terror_schema.jsonify(terror)

# Delete Terror Data
@app.route('/terror/<id>', methods =['DELETE'])
def delete_terror(id):
  terror = Terror.query.get(id)
  db.session.delete(terror)
  db.session.commit()

  return terror_schema.jsonify(terror)



# @app.route('/', methods=['GET'])
# def get():
    # return jsonify({ 'msg': 'Hello World' })


#Run Server
if __name__ == '__main__':
    app.run(debug=True)
