from flask import Flask, request, render_template
import numpy as np
from detector import processImage
import cv2
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route("/")
def index():
    return {"status":"ok","message":"server up and running"}

@app.route("/process",methods=["POST"])
def process():
    try:
        data = request.json.get("data")
        array = np.array(data,dtype="uint8").reshape((416,416,-1))
        array = cv2.cvtColor(array,cv2.COLOR_RGB2BGR)
        out = processImage(array)
        return {"status":True,"data":out}
    except Exception as e:
        return {"status":False,"error":str(e)}

if __name__ == "__main__":
    app.run()