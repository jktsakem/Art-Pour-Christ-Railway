# Résumé des erreurs de déploiement — Art pour Christ

## 1. Popup navigateur : "wants to access other apps and services"

**Erreur** : À la première visite sur `artpourchrist.vercel.app`, le navigateur affichait une popup système demandant l'accès à d'autres apps.

**Cause** : Le header `Permissions-Policy` ne bloquait pas les APIs WebAuthn et FedCM, que Chrome/Edge peut déclencher automatiquement.

**Solution** : Ajout de directives dans `art-for-christ-media/vercel.json` :
```json
"Permissions-Policy": "..., publickey-credentials-get=(), publickey-credentials-create=(), identity-credentials-get=()"
```

---

## 2. Vercel Build — `vite: command not found`

**Erreur** :
```
sh: line 1: vite: command not found
Error: Command "vite build" exited with 127
```

**Cause** : Vercel installait les dépendances avec `NODE_ENV=production`, excluant les `devDependencies` (dont `vite`).

**Solution** :
- Ajouter dans `vercel.json` : `"installCommand": "npm install"`
- Configurer le **Root Directory** à `art-for-christ-media` dans les settings Vercel

---

## 3. Git — Perte des commits après `git pull`

**Erreur** : Un `git pull origin main` a écrasé tous les commits locaux en alignant sur le remote (qui était en retard).

**Solution** : Récupération via `reflog` :
```bash
git reflog                        # retrouver le bon commit (ee55167)
git reset --hard ee55167          # restaurer l'état local
git push --force origin main      # remettre le remote à jour
```

---

## 4. Backend Railway — `JWT_SECRET` non résolu

**Erreur** :
```
Could not resolve placeholder 'JWT_SECRET' in value "${JWT_SECRET}"
```

**Cause** : Le profil `prod` exige `JWT_SECRET` sans valeur par défaut.

**Solution** : Ajouter dans Railway Variables :
```
JWT_SECRET = ArtPourChrist2024SecretKeyJWTMinimum32Chars!!
```

---

## 5. Backend Railway — `DATABASE_URL` non résolu

**Erreur** :
```
Driver org.postgresql.Driver claims to not accept jdbcUrl, ${DATABASE_URL}
```

**Cause** : La variable `DATABASE_URL` n'était pas définie. Railway fournit l'URL PostgreSQL en format `postgresql://...` mais Spring Boot attend le format JDBC.

**Solution** :
1. Ajouter un service **PostgreSQL** dans le projet Railway
2. Ajouter ces variables dans le service backend :

```
DATABASE_URL      = jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
DATABASE_USERNAME = ${{Postgres.PGUSER}}
DATABASE_PASSWORD = ${{Postgres.PGPASSWORD}}
```

---

## 6. Backend Railway — `BASE_URL` non résolu

**Erreur** :
```
Could not resolve placeholder 'BASE_URL' in value "${BASE_URL}"
```

**Solution** : Ajouter dans Railway Variables :
```
BASE_URL = https://art-pour-christ-production.up.railway.app
```

---

## 7. Backend Railway — Placeholder imbriqué `MAIL_FROM`

**Erreur** :
```
Could not resolve placeholder 'MAIL_USERNAME' in value "MAIL_FROM:${MAIL_USERNAME}"
```

**Cause** : Spring ne supporte pas les placeholders imbriqués comme `${MAIL_FROM:${MAIL_USERNAME}}`.

**Solution** : Corriger dans `application-prod.properties` :
```properties
# Avant (cassé)
app.contact.from=${MAIL_FROM:${MAIL_USERNAME}}

# Après (corrigé)
app.contact.from=${MAIL_FROM:noreply@artpourchrist.com}
```
Et ajouter dans Railway : `MAIL_FROM = noreply@artpourchrist.com`

---

## 8. Frontend — Network Error (mauvaise URL API)

**Erreur** : `network error when attempting to fetch resources`

**Cause 1** : `VITE_API_URL` sur Vercel utilisait l'URL **interne** Railway (`.railway.internal`) inaccessible depuis l'extérieur.

**Cause 2** : `VITE_API_URL` était configurée **sans `https://`**, ce qui la rendait relative au lieu d'absolue.

**Solution** : Sur Vercel → Environment Variables :
```
VITE_API_URL = https://art-pour-christ-production.up.railway.app/api
```
Puis redéployer sur Vercel pour que la variable soit prise en compte.

---

## 9. Backend Railway — 502 Connection Refused (port mismatch)

**Erreur** :
```
httpStatus: 502
upstreamErrors: connection refused
```

**Cause** : Conflit entre le port configuré dans Railway Networking (3001) et la variable `SERVER_PORT=8080` ajoutée manuellement, qui forçait l'app à écouter sur 8080.

**Solution** :
1. Supprimer `SERVER_PORT=8080` des variables Railway
2. Laisser l'app utiliser `${PORT:3001}` (défaut de `application.properties`)
3. Railway Networking restait configuré sur le port 3001

---

## 10. Backend Railway — App démarrée mais inaccessible

**Erreur** : L'app loggait `Started ArtPourChristApplication` mais Railway retournait "Application failed to respond".

**Cause** : Le binding réseau n'était pas explicitement configuré sur toutes les interfaces, et la résolution du port n'était pas assez robuste.

**Solution** : Ajout dans `application-prod.properties` :
```properties
server.address=0.0.0.0
server.port=${SERVER_PORT:${PORT:3001}}
spring.jpa.open-in-view=false
```
La chaîne de résolution du port devient : `SERVER_PORT` → `PORT` → `3001`.

---

## Récapitulatif des variables d'environnement requises

### Vercel (Frontend)
| Variable | Valeur |
|---|---|
| `VITE_API_URL` | `https://art-pour-christ-production.up.railway.app/api` |

### Railway (Backend)
| Variable | Valeur |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `JWT_SECRET` | clé de 32+ caractères |
| `DATABASE_URL` | `jdbc:postgresql://...` (format JDBC) |
| `DATABASE_USERNAME` | utilisateur PostgreSQL |
| `DATABASE_PASSWORD` | mot de passe PostgreSQL |
| `BASE_URL` | URL publique Railway du backend |
| `CORS_ORIGINS` | `https://artforchrist.vercel.app` |
| `ADMIN_EMAIL` | email du compte admin |
| `ADMIN_PASSWORD` | mot de passe du compte admin |
| `MAIL_FROM` | `noreply@artpourchrist.com` |
