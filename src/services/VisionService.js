/**
 * Service to handle AI Image Recognition.
 * 
 * CURRENT STATUS:
 * We have reverted to STRATEGY 1 (MOCK) for the Demo/Seminar.
 * Reason: On-Device AI (TFJS) was too slow (~1 min) on the current device configuration.
 * 
 * Strategy:
 * - Simulate a scanning delay (2s) for realism.
 * - Return a random creature from the database.
 * - This ensures 100% reliability and smooth UX during the presentation.
 */

import { MOCK_ANIMALS } from '../data/mockCollection';

// ⚠️ REMPLACEZ PAR L'ADRESSE IP DE VOTRE ORDINATEUR (ex: 192.168.1.15)
// Si vous êtes sur Simulateur: 'http://127.0.0.1:5001/analyze'
// Si vous êtes sur Téléphone: 'http://192.168.1.XX:5001/analyze'
// Pour trouver votre IP sur Mac: tapez 'ipconfig getifaddr en0' dans un terminal
const SERVER_URL = 'http://10.213.251.138:5001/analyze';



export const VisionService = {

    analyzeImage: async (imageUri) => {
        console.log(`[VisionService] Uploading to Backend: ${SERVER_URL}`);

        try {
            // 1. Prepare FormData
            const formData = new FormData();
            formData.append('image', {
                uri: imageUri,
                name: 'capture.jpg',
                type: 'image/jpeg',
            });

            // 2. Send to Python Server
            // Note: fetch might throw if server is unreachable
            const response = await fetch(SERVER_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Server Error: ${response.status} - ${text}`);
            }

            const result = await response.json();
            console.log('[VisionService] Backend Identified:', result.name);

            // 3. Construct Final Animal Object
            return {
                id: Date.now().toString(),
                image: imageUri,
                emoji: '🧬',
                ...result, // name, scientificName, rarity, stats, description
            };

        } catch (error) {
            console.error('[VisionService] Backend Connection Failed:', error);
            console.log('[VisionService] Falling back to Simulation Mode for Demo safety.');

            // FAIL-SAFE: Fallback to Mock if server is down (Critical for Demo!)
            // Simulate processed delay
            await new Promise(r => setTimeout(r, 1500));

            const randomIndex = Math.floor(Math.random() * MOCK_ANIMALS.length);
            const baseAnimal = MOCK_ANIMALS[randomIndex];

            return {
                id: Date.now().toString(),
                name: `(Offline) ${baseAnimal.name}`,
                scientificName: "Server Disconnected",
                species: baseAnimal.name,
                rarity: baseAnimal.rarity,
                image: imageUri,
                emoji: '⚠️',
                stats: { speed: 10, defense: 10, hunger: 100 },
                description: "Connection to Python Brain lost. Using localized backup database. Please check SERVER_URL in VisionService.js"
            };
        }
    }
};
