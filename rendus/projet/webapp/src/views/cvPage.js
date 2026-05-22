module.exports = (profile, views) => `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${profile.title}</title>
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --text: #f1f5f9;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --accent2: #818cf8;
    }
    * { box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      color: var(--text);
      margin: 0;
      min-height: 100vh;
      line-height: 1.6;
    }
    .wrap { max-width: 960px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
    header {
      background: var(--card);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid #334155;
      box-shadow: 0 20px 50px rgba(0,0,0,.35);
    }
    h1 { margin: 0 0 .25rem; font-size: 2.2rem; background: linear-gradient(90deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .role { color: var(--accent); font-weight: 600; margin: 0; }
    .meta { color: var(--muted); font-size: .95rem; margin: .35rem 0; }
    .stats-bar { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1.25rem; }
    .stat {
      background: #0f172a;
      border-radius: 10px;
      padding: .6rem 1rem;
      border: 1px solid #334155;
      font-size: .85rem;
    }
    .stat strong { color: var(--accent); font-size: 1.1rem; display: block; }
    nav.links { margin-top: 1rem; }
    nav.links a { color: var(--accent); margin-right: 1rem; text-decoration: none; }
    nav.links a:hover { text-decoration: underline; }
    section {
      background: var(--card);
      border-radius: 14px;
      padding: 1.5rem;
      margin-top: 1.25rem;
      border: 1px solid #334155;
    }
    h2 { margin-top: 0; color: var(--accent); font-size: 1.15rem; text-transform: uppercase; letter-spacing: .06em; }
    .badge {
      display: inline-block;
      background: rgba(56, 189, 248, .15);
      color: var(--accent);
      padding: .25rem .7rem;
      border-radius: 999px;
      margin: .2rem;
      font-size: .82rem;
      border: 1px solid rgba(56, 189, 248, .3);
    }
    ul { padding-left: 1.2rem; }
    li { margin-bottom: .6rem; }
    form { display: grid; gap: .6rem; max-width: 520px; }
    input, textarea {
      background: #0f172a;
      border: 1px solid #475569;
      color: var(--text);
      border-radius: 8px;
      padding: .65rem;
      font: inherit;
    }
    button {
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      color: #0f172a;
      border: 0;
      font-weight: 700;
      padding: .7rem;
      border-radius: 8px;
      cursor: pointer;
    }
    .comment {
      background: #0f172a;
      border-left: 3px solid var(--accent);
      padding: .75rem 1rem;
      border-radius: 0 8px 8px 0;
      margin: .5rem 0;
    }
    footer { text-align: center; color: var(--muted); margin-top: 2rem; font-size: .85rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>${profile.name}</h1>
      <p class="role">${profile.role}</p>
      <p class="meta">${profile.email} · ${profile.phone} · ${profile.location}</p>
      <div class="stats-bar">
        <div class="stat"><strong id="views">${views}</strong> vues CV</div>
        <div class="stat"><strong id="stat-users">—</strong> utilisateurs API</div>
        <div class="stat"><strong id="stat-comments">—</strong> commentaires</div>
      </div>
      <nav class="links">
        <a href="/api-docs" target="_blank">Swagger UI</a>
        <a href="/health" target="_blank">Health</a>
        <a href="/api/stats" target="_blank">Stats JSON</a>
        <a href="${profile.github}" target="_blank">GitHub</a>
      </nav>
    </header>

    <section>
      <h2>Profil</h2>
      <p>${profile.summary}</p>
    </section>

    <section>
      <h2>Compétences</h2>
      ${profile.skills.map((s) => `<span class="badge">${s}</span>`).join('')}
    </section>

    <section>
      <h2>Expériences</h2>
      <ul>
        ${profile.experiences.map((e) => `<li><strong>${e.title}</strong> — ${e.company} (${e.period})<br/><span class="meta">${e.description}</span></li>`).join('')}
      </ul>
    </section>

    <section>
      <h2>Formation</h2>
      <ul>
        ${profile.education.map((e) => `<li><strong>${e.degree}</strong> — ${e.school} (${e.year})</li>`).join('')}
      </ul>
    </section>

    <section>
      <h2>Langues</h2>
      ${(profile.languages || []).map((l) => `<span class="badge">${l}</span>`).join('')}
    </section>

    <section id="comments">
      <h2>Commentaires</h2>
      <form id="comment-form">
        <input name="author" placeholder="Votre nom" required />
        <textarea name="text" placeholder="Votre commentaire" rows="3" required></textarea>
        <button type="submit">Publier</button>
      </form>
      <div id="comment-list"></div>
    </section>

    <footer>Projet DevOps ECE 2026 — Groupe SI03 — Romain Martin</footer>
  </div>

  <script>
    async function loadStats() {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        if (data.stats) {
          document.getElementById('stat-users').textContent = data.stats.users;
          document.getElementById('stat-comments').textContent = data.stats.comments;
        }
      } catch (e) {}
    }

    async function loadComments() {
      const res = await fetch('/comments');
      const data = await res.json();
      const list = document.getElementById('comment-list');
      list.innerHTML = '';
      (data.comments || []).forEach((c) => {
        const div = document.createElement('div');
        div.className = 'comment';
        div.innerHTML = '<strong>' + c.author + '</strong> — ' + new Date(c.createdAt).toLocaleString('fr-FR') + '<br/>' + c.text;
        list.appendChild(div);
      });
    }

    document.getElementById('comment-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      await fetch('/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: form.author.value, text: form.text.value })
      });
      form.reset();
      loadComments();
      loadStats();
    });

    loadComments();
    loadStats();
  </script>
</body>
</html>`
