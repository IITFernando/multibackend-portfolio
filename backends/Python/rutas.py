from flask import request
from controladores import getProductos, actualizarProductos

def configurar_rutas(app):
    # GET - Obtener todos los productos
    @app.route('/', methods=['GET'])
    def get_productos():
        return getProductos()
    
    # PUT - Actualizar productos vendidos  
    @app.route('/actualizarProductos', methods=['PUT'])
    def update_productos():
        data = request.get_json()
        return actualizarProductos(data)