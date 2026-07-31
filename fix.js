const fs = require('fs');
let data = fs.readFileSync('c:/mindwell-project/frontend/js/student-dashboard.js', 'utf8');

const targetStr = `function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(\`eye-icon-\${inputId}\`);
    if (!passwordInput || !eyeIcon) return;

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.innerHTML = \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.052 10.052 0 013.453-5.118m7.536 7.536A5.005 5.005 0 0017 12c0-1.38-.56-2.63-1.464-3.536m-7.072 7.072A5.005 5.005 0 017 12c0-1.38.56-2.63 1.464-3.536M2 2l20 20" />\`;
    } else {
        passwordInput.type = "password";
        eyeIcon.innerHTML = \`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />\`;
    }
}`;

const goodIndex = data.indexOf('function togglePasswordVisibility');
if (goodIndex !== -1) {
    let cleaned = data.substring(0, goodIndex) + targetStr;
    
    // Append the unified counselor DB explicitly
    cleaned += `

// --- UNIFIED COUNSELOR DATABASE ---
function getMindwellCounselors() {
    return [
        { id: 1, name: 'Dr. Sarah Jenkins', specialty: 'Anxiety Specialist', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', availability: [1, 3, 5] },
        { id: 2, name: 'Dr. Marcus Wei', specialty: 'Academic Stress', imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', availability: [2, 4] },
        { id: 3, name: 'Elena Rostova, LCSW', specialty: 'General Counseling', imageUrl: 'https://images.unsplash.com/photo-1594824436951-7f1262d0f52d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80', availability: [1, 2, 3, 4, 5] }
    ];
}

function renderFeaturedCounselors() {
    const container = document.getElementById('featured-counselors-list');
    if (!container) return;
    container.innerHTML = '';
    const counselors = getMindwellCounselors();
    counselors.forEach(c => {
        container.innerHTML += \`
            <div class="bg-white rounded-3xl p-6 border border-[#F0EBE1] shadow-sm flex items-center gap-4 hover:shadow-md transition group cursor-pointer" onclick="window.location.href='book-appointment.html?counselor=\${encodeURIComponent(c.name)}'">
                <img src="\${c.imageUrl}" alt="\${c.name}" class="w-16 h-16 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform">
                <div>
                    <h3 class="font-bold text-stone-800 font-['Lora',serif]">\${c.name}</h3>
                    <p class="text-xs text-[#789c8a] font-bold uppercase tracking-wide mt-1">\${c.specialty}</p>
                </div>
            </div>
        \`;
    });
}
`;
    
    fs.writeFileSync('c:/mindwell-project/frontend/js/student-dashboard.js', cleaned, 'utf8');
}
