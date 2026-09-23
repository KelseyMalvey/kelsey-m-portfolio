<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Theme = 'dark' | 'light'

const theme = ref<Theme>(localStorage.getItem('theme') === 'light' ? 'light' : 'dark')

function applyTheme() {
  document.documentElement.dataset.theme = theme.value
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
  applyTheme()
}

onMounted(applyTheme)
</script>

<template>
  <main class="page-shell">
    <div class="background-shape shape-one" aria-hidden="true"></div>
    <div class="background-shape shape-two" aria-hidden="true"></div>

    <button
      class="theme-toggle"
      type="button"
      :aria-label="theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
      :aria-pressed="theme === 'light'"
      @click="toggleTheme"
    >
      <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
      <svg v-else viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
      </svg>
      <span class="sr-only">Toggle color theme</span>
    </button>

    <section class="profile-card" aria-labelledby="profile-name">
      <div class="profile-photo" role="img" aria-label="Profile photo placeholder">KM</div>
      <p class="eyebrow">A little corner of the internet</p>
      <h1 id="profile-name">Kelsey M</h1>
      <p class="tagline">Customer experience strategist, curious human, and believer in making things feel a little more human.</p>

      <nav class="link-list" aria-label="Kelsey's links">
        <a class="link-button" href="https://kelseymalvey.com" target="_blank" rel="noreferrer">
          <span class="link-icon" aria-hidden="true"><span>✦</span></span>
          <span>Portfolio</span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
        <a class="link-button" href="https://dribbble.com" target="_blank" rel="noreferrer">
          <span class="link-icon" aria-hidden="true"><span>◉</span></span>
          <span>Dribbble</span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
        <a class="link-button" href="https://www.linkedin.com/in/kelseymalvey" target="_blank" rel="noreferrer">
          <span class="link-icon" aria-hidden="true"><span>in</span></span>
          <span>LinkedIn</span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
        <a class="link-button" href="mailto:kelsey.malvey@slaloom.com">
          <span class="link-icon" aria-hidden="true"><span>✉</span></span>
          <span>Email</span>
          <span class="arrow" aria-hidden="true">↗</span>
        </a>
      </nav>

      <footer class="site-footer">Made with <span class="spade" aria-hidden="true">♠</span> and Copilot</footer>
    </section>
  </main>
</template>

<style scoped>
.page-shell { position: relative; width: min(100% - 1.25rem, 480px); min-height: 100vh; margin: 0 auto; padding: 1.25rem 0 1.5rem; display: grid; place-items: center; }
.background-shape { position: fixed; z-index: -1; width: 22rem; height: 22rem; border-radius: 50%; filter: blur(2px); opacity: 0.32; pointer-events: none; animation: float 12s ease-in-out infinite alternate; }
.shape-one { top: -8rem; left: -8rem; background: var(--accent-strong); }
.shape-two { right: -10rem; bottom: -10rem; background: var(--accent); animation-delay: -4s; }
.theme-toggle { position: absolute; top: 0.8rem; right: 0; display: grid; width: 2.75rem; height: 2.75rem; place-items: center; color: var(--text); cursor: pointer; background: var(--button-bg); border: 1px solid var(--card-line); border-radius: 50%; transition: transform 0.25s ease, background 0.25s ease; }
.theme-toggle:hover, .theme-toggle:focus-visible { transform: rotate(12deg) scale(1.06); background: var(--button-hover); }
.theme-toggle svg { width: 1.1rem; height: 1.1rem; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.8; }
.theme-toggle svg:last-of-type { fill: currentColor; stroke: none; }
.profile-card { width: 100%; margin-top: 2.75rem; padding: 2rem clamp(1.25rem, 5vw, 2.5rem) 1.75rem; text-align: center; background: var(--card-bg); border: 1px solid var(--card-line); border-radius: 28px; box-shadow: var(--shadow); backdrop-filter: blur(18px); animation: rise-in 0.7s ease both; }
.profile-photo { width: 120px; height: 120px; margin: 0 auto 1.25rem; display: grid; place-items: center; color: white; font-size: 1.9rem; font-weight: 700; letter-spacing: -0.08em; background: linear-gradient(135deg, var(--accent), var(--accent-strong)); border: 5px solid var(--card-bg); border-radius: 50%; box-shadow: 0 0 0 1px var(--card-line), 0 12px 24px rgba(0, 0, 0, 0.18); }
.eyebrow { margin: 0 0 0.4rem; color: var(--accent); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
h1 { margin: 0; font-size: clamp(2rem, 8vw, 2.65rem); letter-spacing: -0.07em; line-height: 1.1; }
.tagline { max-width: 330px; margin: 0.8rem auto 1.75rem; color: var(--muted); font-size: 0.94rem; }
.link-list { display: grid; gap: 0.85rem; }
.link-button { display: grid; grid-template-columns: 2.2rem 1fr 1.25rem; align-items: center; min-height: 4rem; padding: 0.65rem 1rem; color: var(--text); font-size: 0.9rem; font-weight: 600; text-align: left; background: var(--button-bg); border: 1px solid var(--card-line); border-radius: 14px; transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease; }
.link-button:hover, .link-button:focus-visible { transform: translateY(-3px); background: var(--button-hover); border-color: var(--accent); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12); }
.link-icon { display: grid; width: 2rem; height: 2rem; place-items: center; color: var(--accent); font-size: 1.1rem; }
.link-button:nth-child(3) .link-icon { font-size: 0.82rem; font-weight: 800; }
.arrow { color: var(--muted); font-size: 1.15rem; text-align: right; transition: transform 0.25s ease, color 0.25s ease; }
.link-button:hover .arrow, .link-button:focus-visible .arrow { color: var(--accent); transform: translate(2px, -2px); }
.site-footer { margin-top: 2.2rem; color: var(--muted); font-size: 0.72rem; }
.spade { color: var(--accent); font-size: 0.95rem; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@keyframes rise-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes float { from { transform: translate(0, 0) scale(1); } to { transform: translate(20px, 18px) scale(1.08); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; } }
</style>
