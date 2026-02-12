"""
Migration non destructive pour synchroniser les départements des utilisateurs.

- Insère tous les départements DISTINCTS de users.agency dans la table departments.
- NE MODIFIE NI NE SUPPRIME aucune donnée existante.
- Préserve tous les départements déjà présents.
"""

from sqlalchemy import text

from app.database import engine, SessionLocal


def migrate_user_departments() -> None:
    """Synchronise les départements des utilisateurs dans la table departments (lecture seule)."""
    db = SessionLocal()
    try:
        print("Début de la synchronisation des départements utilisateurs...")

        with engine.connect() as conn:
            # Insérer les départements utilisés par les utilisateurs
            print("Insertion des départements depuis 'users.agency' (sans modification des données existantes)...")
            result = conn.execute(
                text(
                    """
                    INSERT INTO departments (name)
                    SELECT DISTINCT agency
                    FROM users
                    WHERE agency IS NOT NULL AND agency <> ''
                    ON CONFLICT (name) DO NOTHING;
                    """
                )
            )
            conn.commit()
            
            # Afficher le nombre de départements ajoutés
            rows_added = result.rowcount
            print(f"OK - {rows_added} nouveau(x) département(s) ajouté(s).")

            # Afficher tous les départements actuels
            departments = conn.execute(
                text("SELECT name FROM departments WHERE is_active = TRUE ORDER BY name")
            ).fetchall()
            
            print(f"\nDépartements actifs dans la base de données ({len(departments)}) :")
            for dept in departments:
                print(f"  - {dept[0]}")

        print("\n[OK] Synchronisation terminee avec succes (aucune donnee n'a ete modifiee ou supprimee).")

    except Exception as e:
        print(f"[ERREUR] Erreur lors de la synchronisation: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    migrate_user_departments()
