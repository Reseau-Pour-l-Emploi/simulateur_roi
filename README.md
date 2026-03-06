# ⚡ Simulateur d'Impact — Actions Emploi

> Outil d'évaluation financière, qualitative & contrefactuelle pour les actions d'insertion professionnelle.

![HTML](https://img.shields.io/badge/HTML-single--file-orange?logo=html5)
![Chart.js](https://img.shields.io/badge/Chart.js-4.4-pink?logo=chartdotjs)
![License](https://img.shields.io/badge/licence-MIT-green)
![Aucune dépendance serveur](https://img.shields.io/badge/backend-aucun-blue)

---

## 🎯 À quoi ça sert ?

Ce simulateur permet aux **conseillers emploi, chargés de mission et évaluateurs** de mesurer l'impact réel d'une action d'insertion en corrigeant les 4 grands biais d'évaluation :

| Biais | Description |
|---|---|
| **Sélection** | Ciblage de profils plus employables que la moyenne |
| **Substitution / Proximité** | Déplacement d'un autre candidat ou recrutement via réseau interne |
| **Durabilité** | Emplois ou postes non maintenus à 6 mois |
| **Aubaine** | Résultat qui se serait produit sans l'action |

Le calcul aboutit à un **impact net réel**, un **bilan financier consolidé** et un **ROI pour les finances publiques**.

---

## 🖥️ Démonstration

Le simulateur est un **fichier HTML autonome** — aucune installation, aucun serveur.

```bash
# Cloner le dépôt
git clone https://github.com/votre-org/simulateur-impact-emploi.git

# Ouvrir directement dans le navigateur
open index.html
```

> Compatible Chrome, Firefox, Edge, Safari — testé sur desktop.

---

## 🔀 Deux modes d'évaluation

### 👥 Mode Demandeurs d'Emploi
Conçu pour les actions d'accompagnement vers l'emploi, parcours d'insertion, remobilisation ou formation.

- Volumétrie et taux d'accès à l'emploi brut vs. contrefactuel
- Correction séquentielle : Sélection → Substitution → Durabilité → Aubaine
- Gains société : réduction allocations + cotisations salariales supplémentaires

### 🏢 Mode Entreprises
Conçu pour les actions d'aide au recrutement, accompagnement RH, GPEC, rapprochement offre/demande.

- Taux de pourvoi avec et sans action
- Correction séquentielle : Aubaine → Sélection (entreprises vertueuses) → Proximité → Durabilité
- Gains entreprises (coûts évités, productivité, sourcing, délai d'embauche) + externalités société

> 🔄 Le **bouton de bascule** dans l'en-tête permet de switcher à tout moment entre les deux modes.

---

## ⚙️ Fonctionnalités

- **Calcul en temps réel** — chaque paramètre mis à jour recalcule l'ensemble des indicateurs instantanément
- **Double mode biais** — saisie détaillée biais par biais *ou* niveau de confiance global synthétique
- **KPIs synthétiques** — Impact Net, Coût Total, Gains Société, Gain Net Pur, ROI
- **Bilan financier** — tableau consolidé coûts / gains / solde net
- **Graphiques interactifs** — cascade d'impact (waterfall) + radar qualitatif acteurs
- **Synthèse dynamique** — paragraphe d'analyse généré automatiquement
- **Export rapport A4** — impression PDF via fenêtre dédiée (mise en page paysage optimisée)
- **Tooltips contextuels** — chaque paramètre dispose d'une fiche explicative (définition, méthode de mesure, valeurs de référence)

---

## 📁 Structure du projet

```
simulateur-impact-emploi/
└── index.html          # Application complète (HTML + CSS + JS en un seul fichier)
```

Tout est contenu dans un **unique fichier `index.html`** — pas de build, pas de dépendances locales.

Les seules ressources externes chargées au runtime :
- [Chart.js 4.4](https://cdn.jsdelivr.net/npm/chart.js) — graphiques
- [Google Fonts — Manrope](https://fonts.google.com/specimen/Manrope) — typographie

---

## 📊 Paramètres disponibles

### Coûts (communs aux deux modes)
| Paramètre | Description |
|---|---|
| TJM | Taux journalier moyen des intervenants |
| Jours d'accompagnement | Volume RH mobilisé |
| Logistique, Aides, Prestations, Formations | Autres postes de coût |

### Mode DE — Résultats & Biais
| Paramètre | Description |
|---|---|
| N bénéficiaires | Effectif accompagné |
| Taux emploi action / contrefactuel | Base de l'impact brut |
| Biais de sélection, substitution, durabilité, aubaine | Correction séquentielle (0–100 %) |
| Niveau de confiance | Mode synthétique : correction globale estimée |

### Mode ENT — Résultats & Biais
| Paramètre | Description |
|---|---|
| N recrutements accompagnés | Effectif entreprises |
| Taux de pourvoi action / contrefactuel | Base de l'impact brut |
| Biais aubaine, sélection, proximité, durabilité | Correction séquentielle (0–100 %) |
| Niveau de confiance | Mode synthétique : correction globale estimée |

---

## 🖨️ Export rapport

Le bouton **🖨️ Rapport A4** génère une page d'impression autonome incluant :
- En-tête avec titre, territoire, date et mode
- Bloc KPIs
- Bilan financier complet
- Graphiques (cascade + radar) exportés en image
- Synthèse narrative
- Pied de page avec résumé des biais appliqués

---

## 🤝 Contribution

Les contributions sont bienvenues — bugs, améliorations UX, nouveaux modes d'évaluation.

```bash
# Forker le dépôt, créer une branche
git checkout -b feature/ma-contribution

# Modifier index.html
# Tester dans le navigateur

# Soumettre une Pull Request
```

---

## 📄 Licence

Distribué sous licence **MIT** — libre d'utilisation, de modification et de redistribution.

---

*Simulateur d'Impact — Actions Emploi · Évaluation contrefactuelle des politiques d'insertion*
