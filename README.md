# NaturaDex (anciennement Darwin-NoteBook)

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)](https://www.figma.com/)
![Three](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Postgres](https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)

## 📖 À Propos

**NaturaDex** est une application mobile de collection en Réalité Augmentée (AR) qui gamifie la découverte de la biodiversité. À la croisée des chemins entre *Pokémon GO* et un outil de science participative.

## 🌍 Le Lore

Dans un monde futuriste, une anomalie cosmique appelée **"L'Érosion"** (une force blanche) commence à effacer la mémoire du vivant. Quand l'Érosion touche une espèce, celle-ci ne fait pas que mourir : elle est oubliée. Son existence même disparaît des mémoires, des livres et de la réalité physique. C'est comme si elle n'avait jamais existé..

Le joueur incarne un **Observateur**, équipé du *NaturaDex*, un outil capable de :
1.  **Scanner** les animaux et végétaux menacés.
2.  **Stabiliser** leur "Essence" en prenant des clichés nets.
3.  **Défendre** les écosystèmes contre les "Vides" (Entité lié a l'érosion) en matérialisant les entités collectés.

## 🎮 Mécaniques de Jeu

### 1. Capture
Le joueur doit prendre en photo des animaux qu'il voit dans la vrai vie, une fois la photo prise, l'espèce est identifiée par l'application et un score de netteté de la photo est calculé.
* **Capture :** Via l'appareil photo.
* **Algorithme de Netteté :** Analyse la stabilité, le focus et le cadrage (Score de 0 à 100).
* **IVs (Individual Values) :** Le score de netteté définit directement les statistiques de l'animal.
    * *Photo Floue (score < 30)* = Animal "Instable" (Faibles stats, glitch visuel).
    * *Photo Parfaite (score > 90)* = Animal "S-Rank" (Stats maximales, aura dorée).

### 2. Collection
* **Faune :** Les unités de combat/défense.
* **Flore :** Les unités de soutien.
* **Combo :** Associer une plante spécifique à un animal (ex: Panda + Bambou) booste ses capacités et sa résistance aux Vides.

### 3. Duel
Dans l'onglet Duel de l'application le joueur peux combattre face a d'autres joueurs mais aussi face a des Vides avec les animaux qu'il a capturé.
* **Méchanique de combat** système de jeux simple, les animaux se font face et combattent tour par tour avec des attaques.
    * *Partie Online avec un système de MMR pour mettre aléatoirement les gens en combat ensemble mais en vérifiant qu'ils aient un niveau similaire.
    * *Partie Carrière avec un système de progression par paliers qui sont des combats contre des vides (de types différents et de force différentes) suivi régulièrement de combat contre des boss.

## 🎨 Identité Visuelle (UI/UX)

https://www.figma.com/design/N25YY0QI7P3XTjiBcTj1YM/Untitled?node-id=0-1&p=f&t=bpbpMT6nnry5x14v-0

L'identité graphique repose sur le concept **"Solarpunk Utility"** : un mix entre **IOS 26** et l'esthétique **Solarpunk**.

### Palette de Couleurs
| Couleur | Hex | Usage |
| :--- | :--- | :--- |
| **Fond** | `#FFFFFF` | Fond principal, propre, épuré. |
| **Action (Vivant)** | `#4CAF50` | Boutons principaux, validation, nature. |
| **Structure** | `#8D6E63` | Bordures, cadres, éléments "Cuivre/Bois". |
| **Tech/AR** | `#00A8E8` | Hologrammes, interfaces scanner, flux de données. |
| **Danger** | `#FF5252` | Alertes, corruption, ennemis. |

### Typographie
* **Titres :** `Poppins` (Bold/SemiBold) - Rond, moderne, accueillant.
* **Corps :** `Roboto` (Regular) - Lisibilité technique maximale.

### Style des Composants
* **Glassmorphism :** Effets de flou pour les menus flottants.
* **Matériaux 3D :** Mélange de verre émeraude, de cuivre poli et de céramique blanche.
* **Formes :** Très arrondies (Border Radius élevé), boutons "pill-shape".

## 🛠️ Stack Technique

* **Mobile :** React Native
* **Framework :** Expo Go (pour itération rapide iOS/Android)
* **3D :** Three.js
* **Design :** Figma (Wireframes & Prototyping)

https://miro.com/app/board/uXjVGNq9eBE=/
