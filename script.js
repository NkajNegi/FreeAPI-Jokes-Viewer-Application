const API_BASE_URL = 'https://api.freeapi.app/api/v1/public/randomjokes/joke/random';
let includeExplicit = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const jokeDisplay = document.getElementById('joke-display');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const errorMessage = document.getElementById('error-message');
const controls = document.getElementById('controls');
const nextBtn = document.getElementById('next-joke');
const startBtn = document.getElementById('start-laughing');
const explicitToggle = document.getElementById('explicit-toggle');
const toggleKnob = document.getElementById('toggle-knob');

// Modals
const modalWarning = document.getElementById('modal-warning');
const modalConfirm = document.getElementById('modal-confirm');
const warnYes = document.getElementById('modal-warning-yes');
const warnNo = document.getElementById('modal-warning-no');
const confirmYes = document.getElementById('modal-confirm-yes');
const confirmNo = document.getElementById('modal-confirm-no');

/**
 * Fetch a single joke
 */
async function fetchJoke() {
    // UI Transitions
    welcomeScreen.classList.add('hidden');
    showLoading(true);
    showError(null);
    jokeDisplay.innerHTML = '';
    controls.classList.add('hidden');
    
    try {
        // Use the dedicated random joke endpoint
        const url = `${API_BASE_URL}?inc_explicit=${includeExplicit}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Failed to connect to the laughter server.');
        
        const result = await response.json();
        
        if (result.success && result.data) {
            const joke = result.data;
            
            // Extra safety: manual check for explicit jokes if toggle is OFF
            const isExplicit = joke.categories && 
                             (joke.categories.includes('explicit') || 
                              joke.categories.includes('nsfw') || 
                              joke.categories.includes('adult'));

            if (!includeExplicit && isExplicit) {
                console.warn('Filtered an explicit joke manually.');
                return fetchJoke(); // Recursive call to get a clean one
            }

            renderJoke(joke);
            controls.classList.remove('hidden');
        } else {
            throw new Error('The comedy vault is locked right now. Try again!');
        }
    } catch (err) {
        showError(err.message);
    } finally {
        showLoading(false);
    }
}

/**
 * Render a single joke card
 */
function renderJoke(joke) {
    jokeDisplay.classList.remove('hidden');
    
    // Ensure categories exists and is an array
    const categories = Array.isArray(joke.categories) ? joke.categories : [];
    
    jokeDisplay.innerHTML = `
        <div class="joke-container bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div class="mb-8">
                <div class="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 mb-6">
                    <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"></path><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path></svg>
                </div>
                <div class="text-slate-800 dark:text-slate-100 whitespace-pre-wrap leading-relaxed font-medium text-lg sm:text-xl md:text-2xl italic">
                    "${joke.content}"
                </div>
            </div>
            
            <div class="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                ${categories.map(cat => `
                    <span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        ${cat}
                    </span>
                `).join('')}
                <button id="copy-btn" class="ml-auto text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center gap-1 hover:underline">
                    Share
                </button>
            </div>
        </div>
    `;

    // Add listener for copy button
    document.getElementById('copy-btn').addEventListener('click', () => {
        copyJoke(joke.content);
    });
}

/**
 * UI State Handlers
 */
function showLoading(show) {
    loadingElement.classList.toggle('hidden', !show);
    if (show) {
        jokeDisplay.classList.add('hidden');
    }
}

function showError(msg) {
    if (msg) {
        errorMessage.textContent = msg;
        errorElement.classList.remove('hidden');
        jokeDisplay.classList.add('hidden');
        controls.classList.add('hidden');
    } else {
        errorElement.classList.add('hidden');
    }
}

function updateToggleUI() {
    explicitToggle.classList.toggle('bg-indigo-600', includeExplicit);
    explicitToggle.classList.toggle('bg-slate-300', !includeExplicit);
    explicitToggle.classList.toggle('dark:bg-slate-700', !includeExplicit);
    toggleKnob.style.transform = includeExplicit ? 'translateX(20px)' : 'translateX(0)';
}

function copyJoke(text) {
    navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard! Share the laugh.'));
}

/**
 * Explicit Toggle Flow (Annoying Version)
 */
explicitToggle.addEventListener('click', () => {
    if (!includeExplicit) {
        modalWarning.classList.remove('hidden');
    } else {
        includeExplicit = false;
        updateToggleUI();
        if (welcomeScreen.classList.contains('hidden')) {
            fetchJoke();
        }
    }
});

// Modal 1 Logic
warnYes.addEventListener('click', () => {
    modalWarning.classList.add('hidden');
    setTimeout(() => {
        modalConfirm.classList.remove('hidden');
    }, 300);
});

warnNo.addEventListener('click', () => {
    modalWarning.classList.add('hidden');
});

// Modal 2 Logic
confirmYes.addEventListener('click', () => {
    modalConfirm.classList.add('hidden');
    includeExplicit = true;
    updateToggleUI();
    if (welcomeScreen.classList.contains('hidden')) {
        fetchJoke();
    }
});

confirmNo.addEventListener('click', () => {
    modalConfirm.classList.add('hidden');
});

// Navigation
startBtn.addEventListener('click', fetchJoke);
nextBtn.addEventListener('click', fetchJoke);

// Initial State
document.addEventListener('DOMContentLoaded', () => {
    welcomeScreen.classList.remove('hidden');
    jokeDisplay.classList.add('hidden');
    controls.classList.add('hidden');
});
