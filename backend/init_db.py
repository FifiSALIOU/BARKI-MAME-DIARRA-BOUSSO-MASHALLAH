"""
Script d'initialisation de la base de données
Crée les tables et les rôles par défaut
"""
from app.database import Base, engine, SessionLocal
from app import models
from app.security import get_password_hash

def init_roles(db):
    """Crée les rôles par défaut"""
    roles_data = [
        {
            "name": "Utilisateur",
            "description": "Utilisateur standard qui peut créer des tickets et suivre leur statut"
        },
        {
            "name": "Secrétaire DSI",
            "description": "Peut assigner et gérer les tickets"
        },
        {
            "name": "Adjoint DSI",
            "description": "Peut assigner, réassigner, escalader et générer des rapports"
        },
        {
            "name": "Technicien",
            "description": "Peut prendre en charge et résoudre les tickets"
        },
        {
            "name": "DSI",
            "description": "Directeur des Systèmes Informatiques - Accès complet"
        },
        {
            "name": "Admin",
            "description": "Administrateur système avec tous les droits"
        }
    ]
    
    for role_data in roles_data:
        existing = db.query(models.Role).filter(models.Role.name == role_data["name"]).first()
        if not existing:
            role = models.Role(**role_data)
            db.add(role)
            print(f"OK - Role cree: {role_data['name']}")
        else:
            print(f"-> Role existe deja: {role_data['name']}")
    
    db.commit()

def init_admin_user(db):
    """Crée un utilisateur administrateur par défaut"""
    admin_role = db.query(models.Role).filter(models.Role.name == "Admin").first()
    if not admin_role:
        print("ERREUR: Le role Admin n'existe pas")
        return
    
    existing = db.query(models.User).filter(models.User.username == "admin").first()
    if not existing:
        admin_user = models.User(
            full_name="Administrateur",
            email="admin@example.com",
            username="admin",
            password_hash=get_password_hash("admin123"),  # Changez ce mot de passe en production !
            role_id=admin_role.id,
            agency="Agence IT",
            status="actif"
        )
        db.add(admin_user)
        db.commit()
        print("OK - Utilisateur admin cree (username: admin, password: admin123)")
        print("ATTENTION: Changez le mot de passe admin en production !")
    else:
        print("-> Utilisateur admin existe deja")

def main():
    print("Initialisation de la base de donnees...")
    print("-" * 50)
    
    # Créer toutes les tables
    print("\nCreation des tables...")
    Base.metadata.create_all(bind=engine)
    print("OK - Tables creees")
    
    # Initialiser les rôles
    print("\nCreation des roles...")
    db = SessionLocal()
    try:
        init_roles(db)
        init_admin_user(db)
    finally:
        db.close()
    
    print("\n" + "-" * 50)
    print("OK - Initialisation terminee avec succes !")
    print("\nVous pouvez maintenant:")
    print("  - Lancer le backend: uvicorn app.main:app --reload")
    print("  - Vous connecter avec: username=admin, password=admin123")

if __name__ == "__main__":
    main()

