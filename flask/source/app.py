from flask import Flask

app = Flask(__name__)
app.debug = True

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/x")
def x():
    return "<p>lovelove</p>"