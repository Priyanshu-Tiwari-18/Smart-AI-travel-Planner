// js/mockData.js

function generateMockItinerary(data) {
    // Basic variables fetch kar rahe hain
    const origin = data.origin || "Delhi";
    const dest = data.dest || "Destination";
    const days = parseInt(data.days) || 3;
    const transport = data.transport || "Bus";
    const budget = data.budget || "medium";
    const interests = data.interests || "exploring and food";

    // 1. SMART TRANSPORT LOGIC (Hill Station Check)
    let alertMsg = "";
    // Famous hill stations jahan direct train nahi jati
    const hillStations = ["manali", "munnar", "leh", "shimla", "ooty", "darjeeling", "spiti"];
    
    if (hillStations.includes(dest.toLowerCase()) && transport.toLowerCase() === "train") {
        alertMsg = `<br><span style="color: #ef4444; font-size: 0.9em; margin-top:8px; display:inline-block; padding: 5px 10px; background: #fef2f2; border-radius: 5px; border: 1px solid #fecaca;">
            ⚠️ <b>Smart Alert:</b> ${dest} does not have a direct railway station. We have routed your train to the nearest major hub (e.g., Chandigarh/Pathankot), followed by a connecting Bus/Cab.
        </span>`;
    }

    // 2. DYNAMIC TIMING LOGIC (Transport ke hisaab se schedule)
    let depTime = "08:30 PM";
    let arrTime = "09:00 AM (Next Day)";
    
    if (transport.toLowerCase() === "flight") {
        depTime = "10:00 AM";
        arrTime = "12:15 PM (Same Day)";
    } else if (transport.toLowerCase() === "car") {
        depTime = "05:00 AM";
        arrTime = "04:30 PM (Same Day)";
    } else if (transport.toLowerCase() === "train") {
        depTime = "09:15 PM";
        arrTime = "07:30 AM (Next Day)";
    }

    // 3. GENERATE ITINERARY BASED ON REACHING TIME
    let itineraryHTML = "";
    for(let i = 1; i <= days; i++) {
        if(i === 1) {
            // Day 1 par arrival time ke hisaab se activity
            itineraryHTML += `
            <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid var(--accent); background: var(--card-bg); border-radius: 0 8px 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <h4 style="margin-bottom: 10px; color: var(--accent); font-size: 1.1rem;">Day 1: Arrival & Local Vibe</h4>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Since you arrive around ${arrTime.split(" ")[0]}, take some time to check into your hotel and acclimatize. In the evening, step out to explore nearby cafes and famous local spots matching your interest in <b>${interests}</b>.</p>
            </div>`;
        } else if (i === days) {
            // Aakhiri din departure
            itineraryHTML += `
            <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid var(--accent); background: var(--card-bg); border-radius: 0 8px 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <h4 style="margin-bottom: 10px; color: var(--accent); font-size: 1.1rem;">Day ${i}: Wrap up & Departure</h4>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Do some last-minute souvenir shopping. Head back to the station/stand to catch your ${transport} back to ${origin}. Safe travels!</p>
            </div>`;
        } else {
            // Beech ke din main activities
            itineraryHTML += `
            <div style="margin-bottom: 20px; padding: 15px; border-left: 4px solid var(--accent); background: var(--card-bg); border-radius: 0 8px 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <h4 style="margin-bottom: 10px; color: var(--accent); font-size: 1.1rem;">Day ${i}: Immersive ${dest} Experience</h4>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Start your day early! Today is heavily focused on <b>${interests}</b>. Your stays and transport are fully optimized for a <b>${budget}</b> budget, ensuring you get the best value without compromising on experience.</p>
            </div>`;
        }
    }

    // FINAL ASSEMBLED HTML UI
    return `
        <div style="text-align: left; padding: 10px;">
            <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 1.3rem; color: var(--text-main);">
                🚆 Transport Schedule
            </h3>
            <ul style="margin-bottom: 25px; line-height: 1.8; color: var(--text-main); background: #f8fafc; padding: 15px 15px 15px 35px; border-radius: 10px;">
                <li><b>Mode:</b> ${transport} from ${origin} to ${dest} ${alertMsg}</li>
                <li><b>Departure:</b> ${depTime} &nbsp;|&nbsp; <b>Arrival:</b> ${arrTime}</li>
            </ul>

            <h3 style="margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 1.3rem; color: var(--text-main);">
                📝 Travel Overview
            </h3>
            <p style="margin-bottom: 30px; line-height: 1.6; color: var(--text-muted);">
                A thrilling ${days}-day trip to <b>${dest}</b> tailored around your interests in <i>${interests}</i>. Based on your <b>${budget}</b> budget preference, we have mapped out the most efficient day-by-day plan.
            </p>

            <h3 style="margin-bottom: 20px; display: flex; align-items: center; gap: 8px; font-size: 1.3rem; color: var(--text-main);">
                📍 Day-by-Day Itinerary
            </h3>
            ${itineraryHTML}
        </div>
    `;
}