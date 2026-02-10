"""
Migration non destructive pour la table de configuration des départements.

- Crée la table departments si elle n'existe pas.
- Pré-remplit avec les valeurs DISTINCT de assets.departement.
- NE MODIFIE NI NE SUPPRIME aucune donnée existante.
"""

from sqlalchemy import text

from app.database import engine, SessionLocal


def table_exists(conn, table_name: str) -> bool:
  """Vérifie si une table existe déjà dans la base."""
  result = conn.execute(
      text(
          """
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = :table_name
          """
      ),
      {"table_name": table_name},
  )
  return result.first() is not None


def migrate_database() -> None:
  """Crée la table departments et la remplit depuis assets.departement (lecture seule)."""
  db = SessionLocal()
  try:
      print("Début de la migration de la table 'departments'...")

      with engine.connect() as conn:
          if not table_exists(conn, "departments"):
              print("Création de la table 'departments'...")
              conn.execute(
                  text(
                      """
                      CREATE TABLE departments (
                          id        SERIAL PRIMARY KEY,
                          name      TEXT NOT NULL UNIQUE,
                          is_active BOOLEAN NOT NULL DEFAULT TRUE
                      );
                      """
                  )
              )
              conn.commit()
              print("OK - Table 'departments' créée.")
          else:
              print("OK - La table 'departments' existe déjà, aucune modification de structure effectuée.")

          # Pré-remplir avec les départements déjà utilisés dans la table assets
          print("Insertion des départements existants depuis 'assets' (lecture seule)...")
          conn.execute(
              text(
                  """
                  INSERT INTO departments (name)
                  SELECT DISTINCT departement
                  FROM assets
                  WHERE departement IS NOT NULL AND departement <> ''
                  ON CONFLICT (name) DO NOTHING;
                  """
              )
          )
          conn.commit()
          print("OK - Départements existants synchronisés.")

      print("\nMigration terminée avec succès (aucune donnée existante n'a été modifiée).")

  except Exception as e:
      print(f"ERREUR lors de la migration: {e}")
      db.rollback()
  finally:
      db.close()


if __name__ == "__main__":
  migrate_database()

