from flask import Flask, jsonify
import os
import requests
app = Flask(__name__)
app.debug = True

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/x")
def x():
    return "<p>lovelove</p>"

@app.route("/metadata")
def metadata():
    dapr_url = os.environ.get("NODE_DAPR")
    
    if not dapr_url:
        return jsonify({
            "error": "NODE_DAPR environment variable is not set"
        }), 500

    try:
        dapr_response = requests.get(f"http://node:3500/v1.0/state/statestore/pond")
        dapr_response.raise_for_status()  
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": "Failed to fetch Dapr metadata",
            "details": str(e)
        }), 500

    return jsonify({
        "name": "flask",
        "version": "1.0.0",
        "dapr": dapr_url,
        "data": dapr_response.text
    })


