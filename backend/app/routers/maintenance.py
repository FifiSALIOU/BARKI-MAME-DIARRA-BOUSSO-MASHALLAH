from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from .. import models
from ..database import get_db
from ..security import require_role


router = APIRouter(prefix="/maintenance", tags=["maintenance"])


class TableStats(BaseModel):
    """Statistiques simplifiées pour une table de la base de données."""

    name: str
    row_estimate: int
    rls_enabled: bool


@router.get("/db-stats", response_model=List[TableStats])
def get_database_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_role("Admin", "DSI")),
) -> List[TableStats]:
    """
    Retourne une vue d'ensemble des tables du schéma public avec un
    comptage RÉEL du nombre de lignes (COUNT(*)), basé sur la base
    de données elle-même et non sur les statistiques estimées.
    """

    # 1) Récupérer la liste des tables du schéma public + info RLS
    tables_query = text(
        """
        SELECT
            c.relname AS table_name,
            c.relrowsecurity AS rls_enabled
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE
            n.nspname = 'public'
            AND c.relkind = 'r'
        ORDER BY c.relname
        """
    )

    result = db.execute(tables_query)
    rows = result.fetchall()

    stats: List[TableStats] = []

    # 2) Pour chaque table, faire un COUNT(*) exact
    for row in rows:
        table_name = row.table_name

        # On construit la requête avec le nom de table issu du catalogue
        # (pas d'entrée utilisateur), ce qui évite l'injection SQL.
        count_query = text(f'SELECT COUNT(*) FROM public."{table_name}"')
        count_result = db.execute(count_query).scalar() or 0

        stats.append(
            TableStats(
                name=table_name,
                # On garde le champ row_estimate côté API / front,
                # mais il contient désormais la valeur exacte.
                row_estimate=int(count_result),
                rls_enabled=bool(row.rls_enabled),
            )
        )

    return stats

