from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import get_current_user, require_role

router = APIRouter()


class TechnicianWithWorkload(schemas.UserRead):
    """Schéma étendu pour inclure la charge de travail"""
    assigned_tickets_count: int = 0
    in_progress_tickets_count: int = 0

    class Config:
        from_attributes = True


@router.get("/technicians", response_model=List[schemas.UserRead])
def list_technicians(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(
        require_role("Secrétaire DSI", "Adjoint DSI", "DSI", "Admin")
    ),
):
    """Liste tous les techniciens avec leur charge de travail pour l'assignation de tickets"""
    technician_role = db.query(models.Role).filter(models.Role.name == "Technicien").first()
    if not technician_role:
        return []
    
    technicians = (
        db.query(models.User)
        .filter(
            models.User.role_id == technician_role.id,
            models.User.status == "actif"
        )
        .all()
    )
    
    # Ajouter la charge de travail pour chaque technicien
    result = []
    for tech in technicians:
        assigned_count = (
            db.query(models.Ticket)
            .filter(
                models.Ticket.technician_id == tech.id,
                models.Ticket.status.in_([
                    models.TicketStatus.ASSIGNE_TECHNICIEN,
                    models.TicketStatus.EN_COURS
                ])
            )
            .count()
        )
        in_progress_count = (
            db.query(models.Ticket)
            .filter(
                models.Ticket.technician_id == tech.id,
                models.Ticket.status == models.TicketStatus.EN_COURS
            )
            .count()
        )
        
        tech_dict = {
            "id": tech.id,
            "full_name": tech.full_name,
            "email": tech.email,
            "agency": tech.agency,
            "phone": tech.phone,
            "role": {
                "id": tech.role.id,
                "name": tech.role.name,
                "description": tech.role.description
            },
            "status": tech.status,
            "specialization": tech.specialization,
            "assigned_tickets_count": assigned_count,
            "in_progress_tickets_count": in_progress_count
        }
        result.append(tech_dict)
    
    return result

