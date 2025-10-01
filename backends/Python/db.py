import MySQLdb

class Database:
    def __init__(self):
        """Esta función define las propiedades de la conexión a la base de datos MySQL"""
        self.config = {
            'host': 'localhost',        
            'user': 'root',             
            'password': '',             
            'database': 'bdbackfront',  
            'port': 3306                
        }
    
    def conectar(self):
        """Establece y retorna la conexión a la BD"""
        try:
            conexion = MySQLdb.connect(**self.config)
            print("✅ Conexión a BD exitosa")
            return conexion
        except MySQLdb.Error as e:
            print(f"❌ Error conectando a BD: {e}")
            raise e
    
    def get_cursor(self, conexion):
        """Retorna un cursor para ejecutar queries"""
        return conexion.cursor()

# Instancia global para reutilizar
db = Database()