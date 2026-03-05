# 📊 Simulateur de ROI Emploi & Recrutement

![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![UI](https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC.svg)
![JS](https://img.shields.io/badge/Logic-Vanilla_JS-F7DF1E.svg)

> **Transformez l'impact social en indicateurs de performance économique réelle.**

Ce simulateur est un outil stratégique permettant de calculer le **Retour sur Investissement (ROI)** des actions d'insertion. Il offre une double lecture unique : le gain pour la **Collectivité** (Vue DE) ou le gain direct pour l'**Entreprise** (Vue ENT) et le gain pour les **Acteurs**.

---

## 🎯 Objectifs du Projet

* **[ROI SOCIÉTAL]** : Valoriser l'économie d'allocations et la génération de cotisations.
* **[ROI ENTREPRISE]** : Valoriser la productivité et la sécurisation du recrutement.
* **[PILOTAGE RH]** : Intégrer le coût réel du temps passé via le **TJM (Taux Journalier Moyen)**.



---

## 🚀 Fonctionnalités Clés

* ✅ **Calculateur de TJM** : Ajustement dynamique du coût journalier des moyens humains.
* ✅ **Multiplicateur de Bénéficiaires** : Simulation d'impact sur une cohorte complète.
* ✅ **Cadre de Paramètres Unitaires** : Isolation des variables de gain pour une clarté maximale.
* ✅ **Badges de Totaux** : Visualisation instantanée du **Coût Total** vs **Gains Bruts**.
* ✅ **Graphique Radar** : Évaluation des bénéfices immatériels (Notoriété, Satisfaction).
* ✅ **Export PDF** : Mise en page optimisée pour le format **A4 Paysage**.

---

## 📐 Méthodologie

Le simulateur automatise la formule de performance suivante :

$$ROI = \frac{(\text{Gains Unitaires} \times \text{Nb Bénéficiaires}) - \text{Coût Total}}{\text{Coût Total}} \times 100$$

### 📦 Structure des calculs :
* **Investissement** : Frais fixes + (Jours RH × TJM).
* **Levier** : Multiplicateur par nombre de bénéficiaires.
* **Performance** : Gain Net après amortissement des coûts.



---

## 🛠️ Stack Technique

| Composant | Technologie | Usage |
| :--- | :--- | :--- |
| **Design** | `Tailwind CSS` | UI moderne, responsive et légère |
| **Charts** | `Chart.js` | Visualisation Radar dynamique |
| **Logic** | `JavaScript ES6` | Calculs et manipulation du DOM en temps réel |
| **Print** | `CSS Media Queries` | Optimisation haute définition pour export PDF |

---

## 📖 Guide d'utilisation

1.  **Configuration** : Ajustez le **TJM** et les jours passés dans la colonne "Coût".
2.  **Saisie** : Renseignez les frais logistiques et financiers annexes.
3.  **Volume** : Indiquez le nombre de bénéficiaires dans la zone bleue "Levier".
4.  **Analyse** : Observez le ROI et le Gain Net s'actualiser instantanément au centre.
5.  **Reporting** : Utilisez le bouton "Exporter en PDF" (activer les "Graphiques d'arrière-plan" dans les options d'impression).

---

## ⚖️ Licence

Ce projet est distribué sous licence **MIT**. Vous pouvez l'utiliser, le modifier et le déployer librement pour vos besoins professionnels ou institutionnels.

---
*Développé pour l'aide à la décision stratégique dans le secteur de l'emploi.*
