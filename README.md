# Système de Gestion des Tickets IT

Application de gestion de tickets pour les problèmes IT (matériel et applicatif) développée avec React (frontend) et FastAPI (backend).

## 🚀 Technologies utilisées

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: FastAPI, Python 3.x
- **Base de données**: PostgreSQL
- **Authentification**: JWT (JSON Web Tokens)
- **ORM**: SQLAlchemy

## 📋 Prérequis

- Python 3.8+
- Node.js 18+
- PostgreSQL 12+
- npm ou yarn

## 🔧 Installation

### 1. Cloner le repository

```bash
git clone <votre-url-github>
cd Dossier
```

### 2. Configuration Backend

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configuration de la base de données

Créer un fichier `.env` dans le dossier `backend/` :

```env
POSTGRES_USER=tickets_user
POSTGRES_PASSWORD=password
POSTGRES_DB=tickets_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
SECRET_KEY=CHANGE_ME_SECRET_KEY_VERY_IMPORTANT_TO_CHANGE
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

### 4. Initialiser la base de données

```bash
# Créer la base de données PostgreSQL
createdb tickets_db

# Initialiser les tables et rôles
python init_db.py

# Créer les utilisateurs de test
python create_test_users.py
```

### 5. Configuration Frontend

```bash
cd frontend/ticket-frontend
npm install
```

## 🏃 Lancer l'application

### Backend

```bash
cd backend
venv\Scripts\activate  # Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Le backend sera accessible sur `http://localhost:8000`

### Frontend

```bash
cd frontend/ticket-frontend
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 👥 Comptes de test

| Rôle | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Utilisateur | `user1` | `user123` |
| Technicien 1 | `tech1` | `tech123` |
| Technicien 2 | `tech2` | `tech123` |
| Secrétaire DSI | `secretary1` | `secretary123` |
| Adjoint DSI | `adjoint1` | `adjoint123` |
| DSI | `dsi1` | `dsi123` |

## 📊 Statuts des tickets

1. **EN ATTENTE D'ANALYSE** - Ticket créé, en attente d'assignation
2. **ASSIGNÉ AU TECHNICIEN** - Ticket assigné, en attente de prise en charge
3. **EN COURS** - Technicien travaille sur le ticket
4. **RÉSOLU** - Solution trouvée, en attente de validation utilisateur
5. **REJETÉ** - Utilisateur a rejeté la résolution
6. **CLÔTURÉ** - Ticket validé et archivé

## 🔐 Rôles et permissions

- **Utilisateur**: Créer des tickets, valider/rejeter les résolutions, donner un feedback
- **Technicien**: Voir les tickets assignés, prendre en charge, ajouter des commentaires, marquer comme résolu
- **Secrétaire/Adjoint DSI**: Assigner, réassigner, escalader, clôturer les tickets
- **DSI**: Toutes les permissions + rapports et métriques
- **Admin**: Accès complet au système

## 📝 API Documentation

Une fois le backend lancé, la documentation Swagger est disponible sur :
- `http://localhost:8000/docs`
- `http://localhost:8000/redoc`

## 🗂️ Structure du projet

```
Dossier/
├── backend/
│   ├── app/
│   │   ├── main.py          # Point d'entrée FastAPI
│   │   ├── models.py        # Modèles SQLAlchemy
│   │   ├── schemas.py       # Schémas Pydantic
│   │   ├── security.py      # Authentification JWT
│   │   ├── database.py      # Configuration DB
│   │   └── routers/         # Routes API
│   ├── init_db.py           # Initialisation DB
│   ├── create_test_users.py # Création utilisateurs test
│   └── requirements.txt     # Dépendances Python
├── frontend/
│   └── ticket-frontend/
│       ├── src/
│       │   ├── pages/       # Pages React
│       │   ├── App.tsx      # Composant principal
│       │   └── main.tsx     # Point d'entrée
│       └── package.json     # Dépendances npm
└── README.md
```

## 🔄 Workflow des tickets

1. **Création** → EN ATTENTE D'ANALYSE
2. **Assignation** → ASSIGNÉ AU TECHNICIEN
3. **Prise en charge** → EN COURS
4. **Résolution** → RÉSOLU
5. **Validation** → CLÔTURÉ ou REJETÉ
6. **Si rejeté** → Réouverture et réassignation

## ⚠️ Notes importantes

- Changez le `SECRET_KEY` en production
- Changez les mots de passe par défaut en production
- Configurez correctement CORS pour votre domaine en production
- Les notifications sont créées mais l'envoi email/SMS n'est pas implémenté

## 📄 Licence

Ce projet est développé pour un usage interne.

