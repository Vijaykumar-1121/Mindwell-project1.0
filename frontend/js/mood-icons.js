/** Mood visuals — weather-style stroke icons matching MindWell UI */

const MOOD_CONFIG = {
    1: {
        label: 'Awful',
        subtitle: 'Really struggling',
        dot: 'bg-red-400',
        ring: 'ring-red-300',
        border: 'border-red-300',
        bg: 'bg-red-50',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a5 5 0 1 1 1.3-9.8A4 4 0 0 1 18 8.5c1.1 0 2.1.4 2.8 1.1"/><path d="M13 11l-2 4h3l-2 4"/></svg>`
    },
    2: {
        label: 'Bad',
        subtitle: 'Not great',
        dot: 'bg-orange-400',
        ring: 'ring-orange-300',
        border: 'border-orange-300',
        bg: 'bg-orange-50',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-500',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a5 5 0 1 1 1.3-9.8A4 4 0 0 1 18 8.5c1.1 0 2.1.4 2.8 1.1"/><path d="M8 19v-2"/><path d="M12 19v-3"/><path d="M16 19v-2"/></svg>`
    },
    3: {
        label: 'Okay',
        subtitle: 'Getting by',
        dot: 'bg-stone-400',
        ring: 'ring-stone-300',
        border: 'border-stone-300',
        bg: 'bg-stone-50',
        iconBg: 'bg-stone-100',
        iconColor: 'text-stone-500',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a5 5 0 1 1 1.3-9.8A4 4 0 0 1 18 8.5c1.1 0 2.1.4 2.8 1.1"/></svg>`
    },
    4: {
        label: 'Good',
        subtitle: 'Feeling fine',
        dot: 'bg-[#789c8a]',
        ring: 'ring-[#789c8a]/40',
        border: 'border-[#789c8a]/50',
        bg: 'bg-[#E8F0EB]',
        iconBg: 'bg-[#D4E4DA]',
        iconColor: 'text-[#5A7A68]',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a5 5 0 1 1 1.3-9.8A4 4 0 0 1 18 8.5c1.1 0 2.1.4 2.8 1.1"/><circle cx="18" cy="6" r="3"/><path d="M18 3v1"/></svg>`
    },
    5: {
        label: 'Great',
        subtitle: 'On top of it',
        dot: 'bg-green-500',
        ring: 'ring-green-300',
        border: 'border-green-300',
        bg: 'bg-green-50',
        iconBg: 'bg-[#EAF0CE]',
        iconColor: 'text-[#556B2F]',
        icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`
    }
};

function getMoodConfig(mood) {
    return MOOD_CONFIG[mood] || MOOD_CONFIG[3];
}

function getMoodIconHtml(mood, size = 'md') {
    const cfg = getMoodConfig(mood);
    const sizes = {
        sm: 'w-9 h-9 [&>svg]:w-[18px] [&>svg]:h-[18px]',
        md: 'w-11 h-11 [&>svg]:w-[22px] [&>svg]:h-[22px]',
        lg: 'w-12 h-12 [&>svg]:w-6 [&>svg]:h-6'
    };
    const cls = sizes[size] || sizes.md;
    return `<span class="mood-icon-badge inline-flex items-center justify-center rounded-full shrink-0 ${cls} ${cfg.iconBg} ${cfg.iconColor}">${cfg.icon}</span>`;
}

function initMoodPicker() {
    const container = document.getElementById('mood-picker');
    if (!container) return;

    container.innerHTML = Object.entries(MOOD_CONFIG).map(([value, cfg]) => `
        <button type="button"
            class="mood-option group flex flex-col items-center gap-2.5 p-3 sm:p-4 rounded-2xl border-2 border-[#E8E2D2] bg-[#FDFCFA] hover:border-stone-300 hover:shadow-sm transition-all duration-200 focus:outline-none"
            data-mood="${value}"
            aria-label="${cfg.label}: ${cfg.subtitle}">
            <span class="inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full ${cfg.iconBg} ${cfg.iconColor} transition-transform duration-200 group-hover:scale-105 [&>svg]:w-[22px] [&>svg]:h-[22px] sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                ${cfg.icon}
            </span>
            <span class="text-center leading-tight">
                <span class="block font-bold text-stone-700 text-sm">${cfg.label}</span>
                <span class="block text-[11px] text-stone-400 font-semibold mt-0.5 hidden sm:block">${cfg.subtitle}</span>
            </span>
        </button>
    `).join('');
}
