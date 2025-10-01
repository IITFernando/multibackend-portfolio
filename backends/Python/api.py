from flask import Flask, render_template, url_for

app=Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html"),200

@app.errorhandler(404)
def not_found(error):
    return render_template("error.html"),404



if __name__ == '__main__':
    app.run(debug=True,port=4000)
    print ("Servidor a la espera de conexiones")
