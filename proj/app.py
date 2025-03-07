from flask import Flask, render_template,request, jsonify
from predict import predict_institutions

app = Flask(__name__)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/contact')
def contact():
    return render_template("contact.html")

@app.route('/login')
def login():
    return render_template("login.html")

@app.route('/predict')
def predict():
    return render_template("predictor.html")

@app.route('/predict', methods=['POST'])
def predict_Coll():
    rank = int(request.form.get('rank'))
    category_gender = request.form.get('categoryGender')
    branch_code = request.form.get('branchCode')
    inst_Reg = request.form.get('inst_reg')
    results = predict_institutions(rank, category_gender, branch_code,inst_Reg)

    return jsonify({"data":results})

if __name__ == '__main__':
    app.run(debug=True)
