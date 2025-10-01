from flask import Flask
from flask_cors import CORS
from rutas import configurar_rutas

app = Flask(__name__)
CORS(app)

# Configurar todas las rutas
configurar_rutas(app)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
