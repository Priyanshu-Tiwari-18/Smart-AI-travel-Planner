const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { Groq } = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch((err) => console.log('❌ MongoDB Connection Failed:', err.message));

// Groq AI Setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/generate-itinerary', async (req, res) => {
    const { origin, dest, days, budget, interests, category } = req.body; 

    // MASTER PROMPT: Fixed Interests Targeting, Strict Indian Budgeting, Professional Chronological Density
    const prompt = `You are an elite travel concierge. Craft a highly tailored, fast-paced, and exceptionally professional ${days}-day itinerary for ${dest}.
    USER PROFILE: Origin: ${origin}, Destinations: ${dest}, Budget Tier: ${budget}, Core Interests: ${interests}, Category: ${category}.

    CRITICAL ALGORITHMIC RULES:
    1. STRICT INTEREST MATCHING (CRUCIAL): You MUST design the core of this trip around the user's specific interests: "${interests}". Do not just give generic placeholder tourist traps. If they specified a vibe like specific cafes, fitness tracking, or unique nature trails, explicitly integrate matching real-world places and mention WHY it aligns with "${interests}".
    2. REALISTIC INDIAN PRICING (MANDATORY): Indian travel routing operates on distinct scales. Obey these strict daily limits under Indian Rupee (INR) conditions:
       - If Budget is "Backpacker (Low Cost)": Cap total cost strictly between ₹1,500 - ₹2,500 per person per day.
       - If Budget is "Standard (Mid Range)": Cap total cost strictly between ₹3,500 - ₹5,500 per person per day.
       - If Budget is "Luxury (High End)": Cap total cost at ₹8,000+ per person per day.
       *CALCULATION:* Multiply the appropriate daily limits by ${days} days. 
       *FAMILY TRIP MODIFIER:* IF Category is "Family Trip", DO NOT show per-person pricing. Multiply the final cost fields by 4 and explicitly title the section "Estimated Trip Cost (Total for 4 People)". For 'Backpacker' family trips, calculate stay cost assuming the group shares one large single suitable room/suite.
    3. HIGH-DENSITY (Action-Packed): Maximize the number of logically accessible places covered per day. Pack the schedule tight as per the user's need.
    4. NO TIME LABELS: DO NOT use explicit chronological markers like "Morning", "Afternoon", "Evening" or "Subah/Dopahar/Shaam". Present the sequence as a clean, continuous vertical structural timeline.
    5. SUNRISE/SUNSET HIGHLIGHTS: If a specific point on the itinerary is iconic for sunrise (🌅) or sunset (🌇), explicitly append the respective emoji next to the place title.

    OUTPUT FORMAT (Return ONLY this HTML. Do NOT wrap in \`\`\`html):

    <h3 style="margin-bottom: 25px; font-size: 1.6rem; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; font-family: 'Poppins', sans-serif;">📍 Tailored ${days}-Day Itinerary: ${dest}</h3>

    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 1.1rem;">🌟 Trip Overview</h4>
        <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">[Provide a crisp professional overview detailing how the packed route directly addresses their interest: ${interests}]. Optimally curated for a ${category}.</p>
    </div>

    <div style="margin-bottom: 35px; font-family: 'Poppins', sans-serif;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;">
                <h4 style="margin: 0; color: #4f46e5; font-size: 1.25rem; font-weight: 700;">Day [Number]: [Engaging Title focusing on ${interests}]</h4>
                <div style="color: #64748b; font-size: 0.9rem; font-weight: 500;">[Weather Icon ☀️/☁️/❄️] Est. Weather</div>
            </div>

            <div style="position: relative; padding-left: 20px; border-left: 2px dashed #cbd5e1; margin-left: 10px;">
                
                <div style="margin-bottom: 25px; position: relative;">
                    <div style="position: absolute; left: -27px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #4f46e5; border: 2px solid #fff; box-shadow: 0 0 0 2px #e0e7ff;"></div>
                    <h5 style="margin: 0 0 5px 0; color: #0f172a; font-size: 1.05rem;">📍 [Place Name] [If applicable: 🌅 Sunrise / 🌇 Sunset]</h5>
                    <p style="margin: 0; color: #475569; font-size: 0.95rem; line-height: 1.6;">[Provide clear, fast-paced logistical value and context. Highlight specifically why this destination matches their interest in ${interests}].</p>
                </div>
                </div>

            <div style="background: #f0fdfa; padding: 15px; border-radius: 12px; color: #0f766e; margin-top: 10px; border-left: 4px solid #14b8a6; display: flex; gap: 10px; align-items: center;">
                <span style="font-size: 1.2rem;">✨</span> 
                <div><strong style="font-weight: 600;">Insider Hack:</strong> [Provide a highly specific local secret or custom optimization trick matching ${interests}]</div>
            </div>
        </div>
    </div>
    <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 25px; margin-top: 40px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); font-family: 'Poppins', sans-serif;">
        <h3 style="margin-bottom: 20px; font-size: 1.25rem; color: #0f172a; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px;">
            💰 [Insert Dynamic Title Here based on Modifier Rules: e.g., Estimated Trip Cost (Total for 4 People) or (Per Person)]
        </h3>
        <p style="font-size: 1.15rem; color: #4f46e5; font-weight: 700; margin-bottom: 15px;">Total Range: ₹[Amount] - ₹[Amount]</p>
        <ul style="list-style: none; padding: 0; margin: 0; color: #475569; font-size: 0.95rem; line-height: 2;">
            <li>🏨 <strong style="color: #0f172a;">Stay:</strong> ₹[Amount] ([Explicitly mention context e.g., Total Stay for Group of 4 or Per Person])</li>
            <li>🍔 <strong style="color: #0f172a;">Food & Drinks:</strong> ₹[Amount] (Total tracking aligned with '${budget}')</li>
            <li>🚕 <strong style="color: #0f172a;">Transport & Entry fees:</strong> ₹[Amount] (Total localized costs included)</li>
        </ul>
        <p style="margin-top: 15px; font-size: 0.85rem; color: #94a3b8; line-height: 1.4;">⚠️ Note: Calculations are mathematically bound by strict Indian standard cost filters matching the '${budget}' tier metrics.</p>
    </div>`;

    try {
        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile", 
            temperature: 0.7,
            max_tokens: 5000 
        });

        res.json({ itineraryHTML: completion.choices[0].message.content });
    } catch (error) {
        console.error("❌ DETAILED AI ERROR:", error.error || error.message);
        res.status(500).json({ error: "Check backend terminal for details" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🚀 TripPilot Backend Active on Port: ${PORT}`);
    console.log(`=========================================\n`);
});