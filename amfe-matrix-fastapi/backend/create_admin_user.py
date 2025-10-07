from sqlalchemy.orm import Session
from app.database import engine, get_db
from app.models import User
from app.services.auth_service import get_password_hash

def create_admin_user():
    """Crear usuario administrador directamente en la base de datos"""
    print("🔧 Creando usuario administrador en la base de datos")
    print("=" * 50)
    
    db = Session(bind=engine)
    
    try:
        # Verificar si ya existe un admin
        existing_admin = db.query(User).filter_by(username="admin").first()
        
        if existing_admin:
            print(f"ℹ️  Usuario admin ya existe:")
            print(f"   - ID: {existing_admin.id}")
            print(f"   - Username: {existing_admin.username}")
            print(f"   - Email: {existing_admin.email}")
            print(f"   - Rol: {existing_admin.role}")
            
            # Actualizar rol si no es admin
            if existing_admin.role != 'admin':
                print("🔄 Actualizando rol a admin...")
                existing_admin.role = 'admin'
                db.commit()
                print("✅ Rol actualizado a admin")
            else:
                print("✅ El usuario ya tiene rol de admin")
                
            # Verificar/actualizar contraseña
            print("🔄 Actualizando contraseña de admin...")
            existing_admin.password = get_password_hash("admin123")
            db.commit()
            print("✅ Contraseña actualizada")
                
        else:
            print("👤 Creando nuevo usuario admin...")
            
            # Crear el hash de la contraseña
            hashed_password = get_password_hash("admin123")
            
            # Crear usuario admin
            admin_user = User(
                username="admin",
                email="admin@clinica.com",
                password=hashed_password,
                role="admin"
            )
            
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            
            print("✅ Usuario admin creado exitosamente:")
            print(f"   - ID: {admin_user.id}")
            print(f"   - Username: {admin_user.username}")
            print(f"   - Email: {admin_user.email}")
            print(f"   - Rol: {admin_user.role}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
    
    print("\n🔑 Credenciales de admin:")
    print("   Username: admin")
    print("   Password: admin123")
    print("\n🧪 Para probar, ejecuta: python debug_auth.py")

if __name__ == "__main__":
    create_admin_user()
