from db import db
from flask import jsonify

def getProductos():
    try:
        conexion = db.conectar()
        cursor = db.get_cursor(conexion)
        
        cursor.execute("SELECT Codigo, Descripcion, Precio, Cantidad FROM productos")
        productos = cursor.fetchall()
        
        productos_list = []
        for producto in productos:
            productos_list.append({
                'Codigo': producto[0],
                'Descripcion': producto[1],
                'Precio': producto[2],
                'Cantidad': producto[3]
            })
            
        return jsonify(productos_list)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conexion.close()

def actualizarProductos(data):
    try:
        conexion = db.conectar()
        cursor = db.get_cursor(conexion)
        
        # data = [{"codigo": 1, "cantidad": 5}, {"codigo": 2, "cantidad": 3}]
        for producto in data:
            cursor.execute(
                "UPDATE productos SET Cantidad = Cantidad - %s WHERE Codigo = %s",
                (producto['Cantidad'], producto['Codigo'])
            )
        
        conexion.commit()
        return jsonify({'mensaje': 'Productos actualizados correctamente', 'total': len(data)})
        
    except Exception as e:
        conexion.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conexion.close()