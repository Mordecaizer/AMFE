from sqlalchemy.orm import Session
from app.database import engine
from app.models import User
import bcrypt

def reset_admin_password():
    """Resetear la contraseña del admin con bcrypt directamente"""
    print("🔄 Reseteando contraseña de admin...")
    
    db = Session(bind=engine)
    
    try:
        # Buscar el usuario admin
        admin = db.query(User).filter_by(username="admin").first()
        
        if not admin:
            print("❌ Usuario admin no encontrado")
            return
        
        # Crear un hash simple y válido con bcrypt
        password = "admin123"
        password_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password_bytes, salt)
        
        # Actualizar la contraseña
        admin.password = hashed.decode('utf-8')
        db.commit()
        
        print("✅ Contraseña reseteada exitosamente")
        print(f"   Username: admin")
        print(f"   Password: admin123")
        print(f"   Hash: {admin.password[:50]}...")
        
        # Verificar que funciona
        if bcrypt.checkpw(password_bytes, admin.password.encode('utf-8')):
            print("✅ Verificación exitosa: el hash funciona correctamente")
        else:
            print("❌ Error: el hash no funciona")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin_password()
