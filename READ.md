<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚗</text></svg>">
<title>DriveX Pakistan — README</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

  :root {
    --gold: #D4AF37;
    --gold-light: #F0D060;
    --black: #0A0A0A;
    --dark: #111111;
    --dark2: #1A1A1A;
    --dark3: #222222;
    --white: #FFFFFF;
    --gray: #999999;
    --gray-light: #CCCCCC;
    --border: #2A2A2A;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    color: var(--white);
    background: #060600;
    line-height: 1.7;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
  }

  /* ─── PAGE BREAKS ─── */
  .page {
    width: 210mm;
    min-height: 297mm;
    padding: 18mm 20mm;
    background: var(--black);
    page-break-after: always;
    position: relative;
    overflow: hidden;
    margin: 0 auto 32px auto;
    box-shadow: 0 8px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.08);
    border-radius: 4px;
  }
  .page:last-child { page-break-after: auto; }

  /* ─── DECORATIVE BACKGROUND ─── */
  .page::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  /* ─── LOGO HEADER ─── */
  .logo-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  .logo-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #D4AF37, #A07820);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--black);
    flex-shrink: 0;
    box-shadow: 0 4px 16px rgba(212,175,55,0.3);
  }
  .logo-text { display: flex; flex-direction: column; }
  .logo-name {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--white);
    text-transform: uppercase;
  }
  .logo-sub {
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--gray);
    text-transform: uppercase;
  }

  .header-divider {
    border: none;
    border-top: 1px solid var(--border);
    margin: 10px 0 20px;
  }

  /* ─── FOOTER ─── */
  .footer {
    position: absolute;
    bottom: 14mm;
    left: 20mm; right: 20mm;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid var(--border);
    padding-top: 8px;
  }
  .footer-left {
    font-size: 9px;
    letter-spacing: 0.15em;
    color: var(--gray);
    text-transform: uppercase;
  }
  .footer-right {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--gold);
    text-transform: uppercase;
  }

  /* ─── COVER PAGE ─── */
  .cover-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 260mm;
  }
  .cover-badge {
    display: inline-block;
    font-size: 10px;
    letter-spacing: 0.25em;
    color: var(--gold);
    text-transform: uppercase;
    padding: 5px 0;
    margin-bottom: 24px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 14px;
    width: 100%;
  }
  .cover-badge::before {
    content: '— ';
  }
  .cover-badge::after {
    content: ' —';
  }
  .cover-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px;
    font-weight: 700;
    color: var(--white);
    line-height: 0.95;
    letter-spacing: -0.01em;
    margin-bottom: 4px;
  }
  .cover-title span {
    display: inline-block;
    background: var(--gold);
    width: 48px; height: 48px;
    margin-left: 8px;
    vertical-align: middle;
    position: relative;
    top: -4px;
  }
  .cover-sub-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px;
    font-weight: 700;
    color: var(--white);
    line-height: 0.95;
    margin-bottom: 32px;
  }
  .cover-desc {
    font-size: 16px;
    color: var(--gray-light);
    max-width: 85%;
    line-height: 1.6;
    margin-bottom: 48px;
  }
  .cover-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px 48px;
    border-top: 1px solid var(--border);
    padding-top: 24px;
    margin-top: auto;
  }
  .meta-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--gray);
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .meta-value {
    font-size: 14px;
    color: var(--white);
    font-weight: 400;
  }
  .meta-value a, .meta-gold { color: var(--gold); text-decoration: none; }

  /* ─── SECTION HEADINGS ─── */
  .section-num {
    font-size: 11px;
    letter-spacing: 0.2em;
    color: var(--gold);
    font-weight: 600;
    text-transform: uppercase;
    display: block;
    margin-bottom: 6px;
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 40px;
    font-weight: 700;
    color: var(--white);
    line-height: 1;
    margin-bottom: 4px;
  }
  .gold-rule {
    width: 40px;
    height: 3px;
    background: var(--gold);
    margin: 10px 0 20px;
  }
  .section-intro {
    font-size: 14px;
    color: var(--gray-light);
    line-height: 1.75;
    margin-bottom: 24px;
    max-width: 90%;
  }

  /* ─── SUBSECTION HEADINGS ─── */
  .sub-heading {
    font-size: 16px;
    font-weight: 600;
    color: var(--white);
    margin: 22px 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sub-heading::before {
    content: '—';
    color: var(--gold);
    font-weight: 400;
  }

  /* ─── BODY TEXT ─── */
  p {
    font-size: 14px;
    color: #CCCCCC;
    line-height: 1.75;
    margin-bottom: 12px;
  }

  /* ─── HIGHLIGHT BOX ─── */
  .highlight-box {
    background: var(--dark2);
    border-left: 3px solid var(--gold);
    padding: 14px 18px;
    border-radius: 0 8px 8px 0;
    margin: 16px 0;
  }
  .highlight-box strong { color: var(--gold); }
  .highlight-box p { color: #BBBBBB; margin: 0; font-size: 14px; }

  /* ─── BULLET LIST ─── */
  .bullet-list {
    list-style: none;
    padding: 0;
    margin: 10px 0 16px;
  }
  .bullet-list li {
    font-size: 14px;
    color: #CCCCCC;
    line-height: 1.65;
    padding: 6px 0 6px 22px;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .bullet-list li::before {
    content: '•';
    color: var(--gold);
    font-size: 16px;
    position: absolute;
    left: 0;
    top: 5px;
  }
  .bullet-list li strong { color: var(--white); }
  .bullet-list li code { 
    background: var(--dark3); 
    color: var(--gold); 
    padding: 1px 5px; 
    border-radius: 3px; 
    font-size: 12px;
    font-family: 'Courier New', monospace;
  }

  /* ─── FEATURE CARDS GRID ─── */
  .cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 16px 0;
  }
  .card {
    background: var(--dark2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
  }
  .card-num {
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--gold);
    margin-bottom: 6px;
    text-transform: uppercase;
  }
  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 6px;
  }
  .card-body {
    font-size: 13px;
    color: var(--gray-light);
    line-height: 1.6;
  }

  /* ─── TABLE ─── */
  .data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 13px;
  }
  .data-table th {
    background: var(--dark3);
    color: var(--gold);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 10px 12px;
    text-align: left;
    border-bottom: 2px solid var(--gold);
  }
  .data-table td {
    padding: 9px 12px;
    color: #CCCCCC;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
  }
  .data-table tr:hover td { background: rgba(255,255,255,0.02); }
  .data-table code {
    background: var(--dark3);
    color: var(--gold);
    padding: 1px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
  }
  .td-tool { color: var(--gold); font-weight: 500; }

  /* ─── PRICING BOX ─── */
  .pricing-box {
    background: var(--dark2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px 24px;
    margin: 14px 0;
    font-family: 'Courier New', monospace;
    font-size: 14px;
  }
  .pricing-row {
    display: flex;
    justify-content: space-between;
    padding: 7px 0;
    color: #AAAAAA;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .pricing-row:last-child { border-bottom: none; }
  .pricing-row.total {
    color: var(--white);
    font-weight: 700;
    font-size: 15px;
    border-top: 1px solid var(--gold);
    margin-top: 6px;
    padding-top: 10px;
  }
  .price-pos { color: #4CAF50; }
  .price-neg { color: #F44336; }
  .price-total { color: var(--gold); }

  /* ─── THREE COLUMNS ─── */
  .three-cols {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    margin: 16px 0;
  }
  .col-card {
    background: var(--dark2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px;
  }
  .col-label {
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--gold);
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
  }
  .col-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--white);
    margin-bottom: 8px;
  }
  .col-body { font-size: 13px; color: #AAAAAA; line-height: 1.6; }

  /* ─── LAYER BOXES ─── */
  .layer-box {
    background: var(--dark2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px 20px;
    margin-bottom: 8px;
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .layer-num-badge {
    background: var(--gold);
    color: var(--black);
    width: 28px; height: 28px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .layer-content h4 {
    font-size: 15px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 4px;
  }
  .layer-content p { font-size: 13px; color: var(--gray-light); margin: 0; }
  .layer-content code {
    background: rgba(212,175,55,0.12);
    color: var(--gold);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 12px;
    font-family: 'Courier New', monospace;
  }
  .layer-arrow {
    text-align: center;
    color: var(--gold);
    font-size: 18px;
    margin: 2px 0;
  }

  /* ─── FOLDER TABLE ─── */
  .folder-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 13px;
  }
  .folder-table td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    color: #CCCCCC;
  }
  .folder-table td:first-child {
    color: var(--gold);
    font-family: 'Courier New', monospace;
    font-size: 12px;
    width: 35%;
  }

  /* ─── CHALLENGE CARDS ─── */
  .challenge-card {
    background: var(--dark2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 16px;
    margin-bottom: 12px;
  }
  .challenge-card h4 {
    font-size: 15px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 10px;
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .challenge-badge {
    background: var(--gold);
    color: var(--black);
    font-size: 12px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
  }
  .cause-row, .fix-row {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    font-size: 13px;
  }
  .cause-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    color: #E57373;
    font-weight: 700;
    text-transform: uppercase;
    min-width: 36px;
    padding-top: 2px;
  }
  .fix-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    color: #81C784;
    font-weight: 700;
    text-transform: uppercase;
    min-width: 36px;
    padding-top: 2px;
  }
  .cause-row p, .fix-row p { margin: 0; font-size: 13px; color: #BBBBBB; }
  .challenge-card code {
    background: var(--dark3);
    color: var(--gold);
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 11px;
    font-family: 'Courier New', monospace;
  }

  /* ─── ROADMAP ─── */
  .roadmap-section { margin-bottom: 20px; }
  .roadmap-phase {
    font-size: 16px;
    font-weight: 600;
    color: var(--white);
    margin: 16px 0 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .roadmap-phase::before { content: '—'; color: var(--gold); }

  /* ─── CONCLUSION ─── */
  .achieved-list {
    list-style: none;
    padding: 0;
    margin: 0 0 16px;
  }
  .achieved-list li {
    font-size: 14px;
    color: #CCCCCC;
    padding: 8px 0 8px 28px;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .achieved-list li::before {
    content: '✓';
    color: var(--gold);
    font-size: 14px;
    position: absolute;
    left: 0;
    top: 8px;
    font-weight: 700;
  }
  .final-box {
    background: var(--dark2);
    border: 1px solid var(--gold);
    border-radius: 10px;
    padding: 18px 22px;
    margin: 20px 0;
  }
  .final-box strong { color: var(--gold); }
  .final-box p { color: #CCCCCC; margin: 0; font-size: 14px; }

  /* ─── TABLE OF CONTENTS ─── */
  .toc-item {
    display: flex;
    align-items: baseline;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    text-decoration: none;
  }
  .toc-item:hover { background: rgba(212,175,55,0.04); }
  .toc-num {
    font-size: 11px;
    color: var(--gold);
    font-weight: 600;
    min-width: 36px;
    letter-spacing: 0.1em;
  }
  .toc-title {
    font-size: 14px;
    color: var(--white);
    flex: 1;
  }
  .toc-dots {
    flex: 1;
    border-bottom: 1px dotted rgba(255,255,255,0.15);
    margin: 0 12px;
    position: relative;
    top: -4px;
    max-width: 200px;
  }
  .toc-page {
    font-size: 12px;
    color: var(--gray);
    min-width: 24px;
    text-align: right;
  }
  .toc-summary {
    background: var(--dark2);
    border-left: 3px solid var(--gold);
    padding: 14px 18px;
    border-radius: 0 8px 8px 0;
    margin-top: 24px;
  }
  .toc-summary strong { color: var(--gold); }
  .toc-summary p { color: #BBBBBB; margin: 0; font-size: 14px; line-height: 1.7; }

  /* ─── PRINT / PDF ─── */
  @page {
    size: A4;
    margin: 0;
  }

  /* ─── ACTUAL LOGO IMAGE ─── */
  .logo-img-actual {
    height: 44px;
    width: auto;
    object-fit: contain;
    display: block;
  }
  .logo-bar {
    margin-bottom: 8px;
  }

  /* ─── FIXED COVER X ─── */
  .cover-title .cover-x {
    display: inline-block;
    background: transparent;
    color: var(--gold);
    width: auto;
    height: auto;
    font-family: 'Cormorant Garamond', serif;
    font-size: 72px;
    font-weight: 700;
    vertical-align: baseline;
    position: relative;
    top: 0;
    margin-left: 0;
    text-shadow: 0 0 30px rgba(212,175,55,0.6);
  }

  /* ─── GOLDISH BACKGROUND EFFECT ─── */
  .page {
    background: linear-gradient(160deg, #0A0A0A 0%, #0f0c00 40%, #0A0A0A 100%) !important;
  }
  .page::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 350px; height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%);
    pointer-events: none;
  }
  body {
    background: linear-gradient(160deg, #0A0A0A 0%, #0e0b00 100%);
  }

  /* ─── GOLD GLOW ON HOVER ─── */
  .card:hover,
  .col-card:hover,
  .layer-box:hover,
  .challenge-card:hover,
  .highlight-box:hover,
  .pricing-box:hover,
  .toc-summary:hover,
  .final-box:hover,
  .meta-box-gold:hover,
  .team-member-box:hover {
    box-shadow: 0 0 18px 3px rgba(212,175,55,0.35), 0 0 6px 1px rgba(212,175,55,0.2) !important;
    border-color: rgba(212,175,55,0.5) !important;
    transition: box-shadow 0.3s ease, border-color 0.3s ease !important;
  }
  .card, .col-card, .layer-box, .challenge-card, .highlight-box, .pricing-box,
  .toc-summary, .final-box, .meta-box-gold, .team-member-box {
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }

  /* ─── META BOX GOLD ─── */
  .meta-box-gold {
    background: linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(212,175,55,0.03) 100%);
    border: 1px solid rgba(212,175,55,0.25);
    border-radius: 8px;
    padding: 12px 14px;
  }

  /* ─── TEAM SECTION ON COVER ─── */
  .team-section-cover {
    margin-top: 28px;
  }
  .team-heading-box {
    display: inline-block;
    background: linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.06) 100%);
    border: 1px solid var(--gold);
    border-radius: 8px;
    padding: 8px 20px;
    font-size: 12px;
    letter-spacing: 0.2em;
    color: var(--gold);
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 16px;
    box-shadow: 0 0 12px rgba(212,175,55,0.2);
  }
  .team-members-row {
    display: flex;
    gap: 16px;
  }
  .team-member-box {
    flex: 1;
    background: linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%);
    border: 1px solid rgba(212,175,55,0.35);
    border-radius: 10px;
    padding: 16px 20px;
    box-shadow: inset 0 1px 0 rgba(212,175,55,0.15);
  }
  .team-role {
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--gray);
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .team-name {
    font-size: 20px;
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700;
    color: var(--gold);
    line-height: 1.2;
  }

  /* ─── FAR ICON (car favicon emoji support note) ─── */

  @media print {
    body { background: #0A0A0A; }
    .page { page-break-after: always; }
  }
</style>
</head>
<body>

<!-- ══════════════ PAGE 01 — COVER ══════════════ -->
<div class="page">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <div class="cover-page">
    <div>
      <div class="cover-badge">Premium Mobility Platform</div>

      <div class="cover-title">Drive<span class="cover-x">X</span></div>
      <div class="cover-sub-title">Pakistan</div>

      <p class="cover-desc">
        A frontend-only luxury car rental platform engineered with production-grade behaviour, dynamic pricing intelligence, and a fully simulated business backend.
      </p>

      <div class="cover-meta-grid">
        <div class="meta-box-gold">
          <div class="meta-label">Document</div>
          <div class="meta-value"><span class="meta-gold">README</span></div>
        </div>
        <div class="meta-box-gold">
          <div class="meta-label">Stack</div>
          <div class="meta-value">Next.js · TypeScript · Tailwind v4</div>
        </div>
        <div class="meta-box-gold">
          <div class="meta-label">Architecture</div>
          <div class="meta-value">Frontend-only · <span class="meta-gold">Backend-grade</span></div>
        </div>
        <div class="meta-box-gold">
          <div class="meta-label">Year</div>
          <div class="meta-value meta-gold">2026</div>
        </div>
      </div>

      <!-- Team Members Section on Cover Page -->
      <div class="team-section-cover">
        <div class="team-heading-box">Document Architecture Team</div>
        <div class="team-members-row">
          <div class="team-member-box">
            <div class="team-role">Lead Developer</div>
            <div class="team-name">Muhammad Shams Ul Arfeen</div>
          </div>
          <div class="team-member-box">
            <div class="team-role">Co-Developer</div>
            <div class="team-name">Sabeeka Kainat Zahra</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span class="footer-left">Confidential · Project Documentation</span>
    <span class="footer-right">Page 01</span>
  </div>
</div>


<!-- ══════════════ PAGE 02 — TABLE OF CONTENTS ══════════════ -->
<div class="page" id="toc">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">00</span>
  <h1 class="section-title">Table of Contents</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">
    A guided walkthrough of the DriveX project — from architectural decisions and the design system, through customer experience, business intelligence, and engineering challenges, to the future roadmap.
  </p>

  <a class="toc-item" href="#s01"><span class="toc-num">01</span><span class="toc-title">Project Overview &amp; Vision</span><span class="toc-dots"></span><span class="toc-page">03</span></a>
  <a class="toc-item" href="#s02"><span class="toc-num">02</span><span class="toc-title">Tech Stack &amp; Why We Chose It</span><span class="toc-dots"></span><span class="toc-page">04</span></a>
  <a class="toc-item" href="#s03"><span class="toc-num">03</span><span class="toc-title">System Architecture</span><span class="toc-dots"></span><span class="toc-page">05</span></a>
  <a class="toc-item" href="#s04"><span class="toc-num">04</span><span class="toc-title">Design System &amp; Visual Language</span><span class="toc-dots"></span><span class="toc-page">06</span></a>
  <a class="toc-item" href="#s05"><span class="toc-num">05</span><span class="toc-title">Customer Experience &amp; Features</span><span class="toc-dots"></span><span class="toc-page">07</span></a>
  <a class="toc-item" href="#s06"><span class="toc-num">06</span><span class="toc-title">Business Logic &amp; Pricing Intelligence</span><span class="toc-dots"></span><span class="toc-page">08</span></a>
  <a class="toc-item" href="#s07"><span class="toc-num">07</span><span class="toc-title">Data Management &amp; Persistence</span><span class="toc-dots"></span><span class="toc-page">09</span></a>
  <a class="toc-item" href="#s08"><span class="toc-num">08</span><span class="toc-title">Engineering Challenges &amp; Solutions</span><span class="toc-dots"></span><span class="toc-page">10</span></a>
  <a class="toc-item" href="#s09"><span class="toc-num">09</span><span class="toc-title">Roadmap &amp; Future Enhancements</span><span class="toc-dots"></span><span class="toc-page">11</span></a>
  <a class="toc-item" href="#s10"><span class="toc-num">010</span><span class="toc-title">Conclusion &amp; Credits</span><span class="toc-dots"></span><span class="toc-page">12</span></a>

  <div class="toc-summary">
    <p><strong>One-line summary —</strong> DriveX simulates a complete, real-world car rental SaaS using only the browser. There is no server, no database, no hosting cost — yet every interaction (auth, bookings, dynamic pricing, admin operations, cross-tab sync) feels production-grade.</p>
  </div>

  <div class="footer">
    <span class="footer-left">DriveX · README</span>
    <span class="footer-right">Page 02</span>
  </div>
</div>


<!-- ══════════════ PAGE 03 — OVERVIEW ══════════════ -->
<div class="page" id="s01">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">01</span>
  <h1 class="section-title">Project Overview</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">
    DriveX Pakistan is a luxury car rental web application designed to replicate a real-world premium mobility business operating across six major Pakistani cities. The platform delivers an end-to-end customer journey — discovery, search, booking, payment, and post-purchase tracking — alongside a fully featured admin control panel.
  </p>

  <h2 class="sub-heading">The problem we set out to solve</h2>
  <p>Most rental platforms in Pakistan are template-driven, visually inconsistent, and operationally rigid. Pricing is static, promo codes are exposed, payment flows feel unfinished, and admins have no real control over fleet, fees, or discounts. DriveX was built as the antithesis — an editorial-grade interface paired with a flexible, dynamic, admin-controlled engine.</p>

  <h2 class="sub-heading">What makes DriveX different</h2>
  <ul class="bullet-list">
    <li><strong>Frontend-only, backend-grade.</strong> Zero server cost, yet every store behaves like a real database with reactive subscriptions and cross-tab synchronization.</li>
    <li><strong>Dynamic pricing intelligence.</strong> Service fees and weekend / holiday uplifts are layered transparently — users always see the base price, never a hidden surcharge.</li>
    <li><strong>Hidden promo system.</strong> Codes work silently in the background; the UI never advertises them, so only users with prior knowledge can redeem one — exactly like real luxury platforms.</li>
    <li><strong>Self-healing Order IDs.</strong> Globally unique numeric IDs that survive counter resets, tampering, or device migration.</li>
    <li><strong>Editorial design.</strong> A black-gold-white palette with Cormorant Garamond + Inter typography, glassmorphism, and gold-shimmer accents.</li>
  </ul>

  <h2 class="sub-heading">Who it is for</h2>
  <p>This document is written for evaluators, future maintainers, and reviewers who want to understand the entire system at a glance — without reading source code. Every section maps directly to a real implementation decision in the codebase.</p>

  <div class="footer">
    <span class="footer-left">DriveX · Overview</span>
    <span class="footer-right">Page 03</span>
  </div>
</div>


<!-- ══════════════ PAGE 04 — TECH STACK ══════════════ -->
<div class="page" id="s02">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">02</span>
  <h1 class="section-title">Tech Stack &amp; Why</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">A deliberately minimal toolkit. Two primary languages, one framework, and a small set of focused libraries — each chosen for a specific, defendable reason.</p>

  <table class="data-table">
    <thead>
      <tr>
        <th>Tool</th>
        <th>Role</th>
        <th>Why We Picked It</th>
      </tr>
    </thead>
    <tbody>
      <tr><td class="td-tool"><code>TypeScript</code></td><td>Language</td><td>Strict types catch entire classes of bugs at compile time. Every store, engine, and component is typed end-to-end.</td></tr>
      <tr><td class="td-tool"><code>Next.js 16</code></td><td>Framework</td><td>App Router gives us file-based routing, server components, and Turbopack out of the box.</td></tr>
      <tr><td class="td-tool"><code>React 19</code></td><td>UI library</td><td>Stable <code>useSyncExternalStore</code> made our localStorage-as-database pattern reactive and safe.</td></tr>
      <tr><td class="td-tool"><code>Tailwind CSS v4</code></td><td>Styling</td><td>Utility-first design system; theme tokens defined once in <code>globals.css</code>, used everywhere.</td></tr>
      <tr><td class="td-tool"><code>shadcn/ui</code></td><td>UI primitives</td><td>Production-quality components (Button, Dialog, Input, Tabs) that live inside the project — fully customisable.</td></tr>
      <tr><td class="td-tool"><code>Lucide</code></td><td>Icon set</td><td>Clean, minimal stroke icons that align perfectly with the editorial aesthetic.</td></tr>
      <tr><td class="td-tool"><code>Sonner</code></td><td>Notifications</td><td>Slim, accessible toast system for booking confirmations and validation feedback.</td></tr>
      <tr><td class="td-tool"><code>Recharts</code></td><td>Visualisation</td><td>Powers the admin analytics — revenue trends, booking volume, fleet utilisation.</td></tr>
      <tr><td class="td-tool"><code>localStorage</code></td><td>Persistence</td><td>Browser-native key-value store, treated as a JSON document database via custom store wrappers.</td></tr>
    </tbody>
  </table>

  <div class="highlight-box">
    <p><strong>The two main languages —</strong> TypeScript writes every line of logic and UI; Tailwind v4 writes every line of styling. That is the entire technical surface. Everything else is a focused library serving one purpose.</p>
  </div>

  <div class="footer">
    <span class="footer-left">DriveX · Tech Stack</span>
    <span class="footer-right">Page 04</span>
  </div>
</div>


<!-- ══════════════ PAGE 05 — ARCHITECTURE ══════════════ -->
<div class="page" id="s03">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">03</span>
  <h1 class="section-title">System Architecture</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">DriveX is structured as three clean layers. Each layer has one responsibility, talks to the next through a typed interface, and never reaches across boundaries.</p>

  <div class="layer-box">
    <div class="layer-num-badge">1</div>
    <div class="layer-content">
      <h4>Presentation Layer</h4>
      <p>React server &amp; client components in <code>app/</code> and <code>components/</code>. Pages compose feature components; feature components compose UI primitives.</p>
    </div>
  </div>
  <div class="layer-arrow">▼</div>
  <div class="layer-box">
    <div class="layer-num-badge">2</div>
    <div class="layer-content">
      <h4>Logic &amp; Engine Layer</h4>
      <p>Pure TypeScript modules in <code>lib/</code> — discount engine, fees engine, booking engine. Stateless calculators that take inputs and return decisions.</p>
    </div>
  </div>
  <div class="layer-arrow">▼</div>
  <div class="layer-box">
    <div class="layer-num-badge">3</div>
    <div class="layer-content">
      <h4>Persistence Layer</h4>
      <p>Reactive localStorage stores with snapshot caching, cross-tab <code>storage</code> events, and React subscriptions via <code>useSyncExternalStore</code>.</p>
    </div>
  </div>

  <h2 class="sub-heading">Folder organisation</h2>
  <table class="folder-table">
    <tr><td>app/</td><td>Routes — home, cars, checkout, profile, admin, login, register</td></tr>
    <tr><td>components/</td><td>Customer-side UI &amp; admin panel sections</td></tr>
    <tr><td>lib/</td><td>Stores, engines, types — the entire backend simulation</td></tr>
    <tr><td>hooks/</td><td>Reusable React hooks (mobile detection, toast)</td></tr>
    <tr><td>public/</td><td>Static assets, presentation deck, printable docs</td></tr>
    <tr><td>app/globals.css</td><td>Design tokens — colours, fonts, shadows, animation primitives</td></tr>
  </table>

  <h2 class="sub-heading">Why this structure scales</h2>
  <p>Adding a new feature (say, a loyalty tier) requires only three predictable touch points: a new store in <code style="background:var(--dark3);color:var(--gold);padding:1px 5px;border-radius:3px;font-size:12px;font-family:monospace;">lib/</code>, an engine modification, and a UI component. No backend deployment, no schema migration, no API versioning — the entire system updates atomically.</p>

  <div class="footer">
    <span class="footer-left">DriveX · Architecture</span>
    <span class="footer-right">Page 05</span>
  </div>
</div>


<!-- ══════════════ PAGE 06 — DESIGN SYSTEM ══════════════ -->
<div class="page" id="s04">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAyALsDASIAAhEBAxEB/8QAHQAAAQQDAQEAAAAAAAAAAAAAAAEFBgcCBAgDCf/EAEIQAAEDAwIDBAYECwkBAAAAAAECAwQABREGEgchMRMiQVEIFBUyYXFCgZGhFiMzQ1Jic5SxwdIkNUR1gpKjsrPR/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAKhEAAgIBAgUCBgMAAAAAAAAAAAECEQMSIQQFEzFBFFEVIjJiceGBwdH/2gAMAwEAAhEDEQA/AONayQhS1hKUlRPgBk0gp9iNepspA5OKSFOLHvDPPaP51MpaVZUVZoJtU4/m0J+C3UpP2E0vsid+ix+8N/1VvGkrLqsvSjQdtc1tBWWkqA6lDiVgf7Sa0jT8hxSTlJII8q1ruwl1v1pCcOhQDoHQ56K/+/MVUclumQ0NQoNTPg5w+uHE3WrWlrZPiwZDjDjwdkJUUAIxkd0E+NWNN9GW/SG5zOldc6M1Rc7eF+tWyBPzJQUkgp24wFZBGFFPOtCaKGoPWn9jRWr5CUqjaWvkgKdWyks291aVOIyFoBCcFQIVkDpg1O+KHC+DZbLYpujRqu+KfgGTdO3sj7TcXkDkKKANvveJxjOeYpt2MqWjNOcGx3mdbnrlDtM+TBYUEPSWIy1ttqPRKlAYBORyJ8RTk3ou9xLrboup4E/TESc8GkTbnBdaaTn6XNIyB446DnRdCqyNGlzV3OejRrpPElGkPWICoqoZm+2Rv9TDQ6ndjOc4GPjnpVaw9KG469GlLTd4U7fKMdmcncllwj6Y8dvkcc6HJKLk/A4pt0iNGkq2JfA29pelQ7fqXTNxuUVBW7b2Jh9YAHXuFPXp1x1qvY+nb7JiOy4tnuMiOySHXW4q1IQR1ClAYGKwhxOLJ9MjWeCce6GmiplbtDmZwuuWtxctvqMxEb1TsM79xQN2/dy9/pjwr30DoyPc7g4nU3ti1xFQ1yIrzNudd7ZQxjGEnu4Oc9OnMZqvUY0m77C6E7Sog460U6w9PXmdGdl2+03CXFbJBeajLUgfMgED7ae7pw51Pb9IQtUPQ1Kgy9xCEIWXGkjPeWnb3U8uufEVUs2O0m9yejP2IfSU6SrBfI1vTcJFouLUNfuyHIy0tK+SiMGs4umtQyuxMWx3J8PNlxrsoq1b0jqpOBzHMcxTeSK8oHCQ08sUZrNxpbTi23EKQtBKVJUMEEdRisCKa3JaEqSz+U6QCc4cUPvqNVJrh/eEj9qv/sayzeDTGrJTYNIW1/TDGoNR6i9iRpchbMNAhKkLf2e+oAKGEg8s+dbY0FbbvEkq0XqdOoJsVHaOQVQFxnloyAVNhRO/GeY6/dUr0XB0drfTNjtdxnuquFoiutrtyXRHW5vfypwOL7pCUnO0c+X2+em9CaI/CqWzB1qq6vxErVHgxSYjjm1WAA+ruHA/R69RyrxJcU05NtprxX6/s9DHhTS2VPzZU10tlytUgR7pAkwnsZ7OQyptWPkoA1qucrdMPk2k/wDImrO423O0ORLXp6Df5N+kWqTKDkt8lRQhRTtaLh98jaeY5fwqsX+dsnfsk/8AoivR4fJLMlKSo5M2NY5UnZbvoI8/SAif5fI/gKtDh9wh1XobjzdOKOr7pa9P6ajzZk1Trk1JMht0ubUEA4A7wJz4gYBPTjOiu9o57O39c8TblbvRll600JJFtXc9TSgy92SSQyuQ5nCVggFQGTkcsnpT3fNao0zrThBDua0+ydQ2By3TkrICcuJY2KP+rl8lGuBaKQmfQexSdDcH9TaR4SrlxW0y3ZVxW8+rAD5UfVws+B6hJPi2PHFavFO16nk8O9V6euli1HejfZaI9sN1uUF5CH1nuOR0NJSpLaTgnI3ADOOprgKvVb7zqUJddWtLY2oClEhI8h5UUCO/mk2pWj0+ji5raX+F6rAR68FYAX17DOem0e772zxrkfhrYrlpvjzabBd46o8+HcuwfbV9FQz08wRgg+IIqt6BU5Ia4OHuqKhPTJSOi9U6y0JojiZfrxBtV8naoC3G1F9xtMVC1AZKcHdjHmD9XWpVw1i3ZFp0pc03q/3OLKT2j/q8uOiDF3nJbWgpK1YKiBg5BGBjpXJVZBxSOhrzJ8qi8emMt6q3v4r+DsjxsnK5I60iK0vZrFrV/UMQrs7OqApTKUbk5PZlJKfFO4gkfDx6UWaHexxjnXiZPFytNwsTq7U+1+TS1lB7MAcgRnPkcg/LklRUo5KjWPPzqI8opP592q7fj/DR8w+0610RHvV20fYI8ti86cixoI7K4Wy5MCKU7c7nm1HOeXMbTgnr4hou6tT6g4L2tmwahXMbYlvR7tMbfSNsVKlp3KBIJG0BWBzxiuZO0UkYBOD1HnSBah7pwKv4W9evUu99v2T67aq8e52parZObuF3tlwm32726RbigSJ8qOqM+SkZ7JpCQociefTzzyNVxqTVt90xw54aNWSeqKmWhIkYQk9olJRgHI6d41zmpSlAZUT8zWP10sfKadzla22rbZNBk49yVJUWn6UMePH4tTFMNpQXo7Li8eKinBP3VV1IKK9TBi6ONQu6OLLk1ycqEHjUgUsPNJlJBIc/Kfqr8R/P66j1bEOW9GUdmFIPvIUMpV8xTnHUiYyod6K10XOMUjdCWT+o9gfek/xpTc4Q/wAE9+8D+isOnI01pnvXlcHUsQVNHHaP4x8EA5z9ZA+w14qujaebUTveby9/3AAfbTc+6t5wuOKKlnqT1q442nbJlJD7pCAu4i7RmIapcj2epbCENdovcHG+aQATnBPT4052OyvzbJCaj2pb0uPd1CWAxlbTe1GO05ZSnIX73IYNQuit0iSd6Yi2qbf7y3LjQjag/ll1RCEpc7Q9khKgDhK+YI6bcn6IrSh2yVc7TeorNpU5d257SlMR4w7RpH4wLCUpGQkK2ggchyqI0UCbLIt8a3N6k1CgLgRG23GGWn3ITUlDKi4lJ7i+6BnIJHStC3otL2qbvAmWkxoyHHJLbWxPaM9luWW8+CVJCgQCQORGcVBqKkLNma8ZEp18ttt9ooqCG0hKU5PQAdB8KnWuWICNPrVHZjqWh5holmC0wYv4kKIUtPec355FXik1XoopsRYuq4KG9eWiObeWYSp6EIQ5Z2orS070ZCVp/LJx4q8/jWtqOFaxpiTeraxGQHbq2gIwkqjrCXN6Bn6BISoDoQQPCoHRRQEy1Uh64zNPwI8SC27MhML/ALPCaZ3OuEgklCRkdOXQVtawgW1Tlul2tiImNHk+oPBlSVBzaQUOKx9Jad2c/o1BM0lMbZNRa5MHiM/Hk2CQW1vPqjx1Rk95Hf2qQ2sBLmOoT0VjFNuvYbkW+IQ43HaUuM2sobiiKpOR+cZBIbXy5gcuh8ajopaAMaKU0lAgooooAKKKKTAKKKKYkFFFFJjCiiimAUUUUAFFFFABRRRQAUUUUAFFFFABWVFFA0Y0UUUCCiiigD//2Q==" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">04</span>
  <h1 class="section-title">Design System</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">Every visual decision flows from one editorial brief — a luxury black, gold, and white palette inspired by automotive print catalogues. The system is consistent, accessible, and tokenised.</p>

  <div class="three-cols">
    <div class="col-card">
      <span class="col-label">Palette</span>
      <div class="col-title">Black · Gold · White</div>
      <p class="col-body">Three colours form the entire surface. Gold (#d4af37) is reserved for accents and brand moments; never overused.</p>
    </div>
    <div class="col-card">
      <span class="col-label">Typography</span>
      <div class="col-title">Cormorant + Inter</div>
      <p class="col-body">Cormorant Garamond delivers editorial elegance in headlines; Inter handles every functional detail in the UI.</p>
    </div>
    <div class="col-card">
      <span class="col-label">Effects</span>
      <div class="col-title">Glass + Shimmer</div>
      <p class="col-body">Glassmorphism cards with subtle borders, gold-shimmer text, and gold-glow shadows reinforce the premium feel.</p>
    </div>
  </div>

  <h2 class="sub-heading">Motion language</h2>
  <p>Animations are restrained but deliberate — fade + slide entrances, hover lifts on cards, scale-down on press, and staggered reveals on long lists. Nothing bounces; nothing distracts. Every transition uses a soft cubic-bezier curve to feel organic.</p>

  <h2 class="sub-heading">Component philosophy</h2>
  <ul class="bullet-list">
    <li><strong>Accessibility first.</strong> All interactive elements have keyboard support, ARIA roles, and focus states.</li>
    <li><strong>Mobile-first responsiveness.</strong> Layouts collapse gracefully on narrow viewports without losing hierarchy.</li>
    <li><strong>Single source of truth.</strong> Every colour, radius, font, and shadow is a CSS custom property — change it in <code>globals.css</code> and the entire app updates.</li>
  </ul>

  <h2 class="sub-heading">Premium signal moments</h2>
  <p>The cover, hero section, success screen, and admin dashboard each include one carefully placed "wow" moment — animated success ring with confetti burst, gold-shimmer order numbers, and a slowly drifting gradient background — designed to feel deliberate, never decorative.</p>

  <div class="footer">
    <span class="footer-left">DriveX · Design System</span>
    <span class="footer-right">Page 06</span>
  </div>
</div>


<!-- ══════════════ PAGE 07 — CUSTOMER EXPERIENCE ══════════════ -->
<div class="page" id="s05">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">05</span>
  <h1 class="section-title">Customer Experience</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">The customer journey is a deliberately short, premium funnel — from landing page to confirmed booking in under a minute, with every checkpoint reinforcing trust.</p>

  <div class="cards-grid">
    <div class="card">
      <div class="card-num">01</div>
      <div class="card-title">Discover</div>
      <p class="card-body">Hero search with city + date pickers, six city tiles, featured fleet carousel, and editorial banner.</p>
    </div>
    <div class="card">
      <div class="card-num">02</div>
      <div class="card-title">Browse</div>
      <p class="card-body">Filterable fleet (82 cars across 6 categories), front/back hover swap on every car card, real-time availability.</p>
    </div>
    <div class="card">
      <div class="card-num">03</div>
      <div class="card-title">Inspect</div>
      <p class="card-body">Detail page with full image gallery, spec sheet, pricing, and a "book this car" CTA that pre-fills the checkout.</p>
    </div>
    <div class="card">
      <div class="card-num">04</div>
      <div class="card-title">Authenticate</div>
      <p class="card-body">Register / login with name, email, phone, CNIC. Sessions persist via localStorage; logout clears state cleanly.</p>
    </div>
    <div class="card">
      <div class="card-num">05</div>
      <div class="card-title">Checkout</div>
      <p class="card-body">Live price breakdown, promo input, 4 payment methods, per-method validation, staged processing pipeline.</p>
    </div>
    <div class="card">
      <div class="card-num">06</div>
      <div class="card-title">Confirm</div>
      <p class="card-body">Animated success screen with confetti, gold-shimmer order ID, full receipt, and a path to the profile dashboard.</p>
    </div>
  </div>

  <h2 class="sub-heading">Trust signals throughout</h2>
  <ul class="bullet-list">
    <li>Base car price is <strong>always</strong> visible — fees and discounts appear as separate line items, never merged.</li>
    <li>Promo errors return one neutral message ("Invalid or expired") to prevent code enumeration.</li>
    <li>Form validation is immediate and field-specific; users never see false errors.</li>
    <li>The success screen never lies — bookings are saved <em>before</em> the celebration animation runs.</li>
  </ul>

  <div class="footer">
    <span class="footer-left">DriveX · Customer Experience</span>
    <span class="footer-right">Page 07</span>
  </div>
</div>


<!-- ══════════════ PAGE 08 — BUSINESS LOGIC ══════════════ -->
<div class="page" id="s06">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAyALsDASIAAhEBAxEB/8QAHQAAAQQDAQEAAAAAAAAAAAAAAAEFBgcCBAgDCf/EAEIQAAEDAwIDBAYECwkBAAAAAAECAwQABREGEgchMRMiQVEIFBUyYXFCgZGhFiMzQ1Jic5SxwdIkNUR1gpKjsrPR/8QAGQEAAwEBAQAAAAAAAAAAAAAAAAECAwQF/8QAKhEAAgIBAgUCBgMAAAAAAAAAAAECEQMSIQQFEzFBFFEVIjJiceGBwdH/2gAMAwEAAhEDEQA/AONayQhS1hKUlRPgBk0gp9iNepspA5OKSFOLHvDPPaP51MpaVZUVZoJtU4/m0J+C3UpP2E0vsid+ix+8N/1VvGkrLqsvSjQdtc1tBWWkqA6lDiVgf7Sa0jT8hxSTlJII8q1ruwl1v1pCcOhQDoHQ56K/+/MVUclumQ0NQoNTPg5w+uHE3WrWlrZPiwZDjDjwdkJUUAIxkd0E+NWNN9GW/SG5zOldc6M1Rc7eF+tWyBPzJQUkgp24wFZBGFFPOtCaKGoPWn9jRWr5CUqjaWvkgKdWyks291aVOIyFoBCcFQIVkDpg1O+KHC+DZbLYpujRqu+KfgGTdO3sj7TcXkDkKKANvveJxjOeYpt2MqWjNOcGx3mdbnrlDtM+TBYUEPSWIy1ttqPRKlAYBORyJ8RTk3ou9xLrboup4E/TESc8GkTbnBdaaTn6XNIyB446DnRdCqyNGlzV3OejRrpPElGkPWICoqoZm+2Rv9TDQ6ndjOc4GPjnpVaw9KG469GlLTd4U7fKMdmcncllwj6Y8dvkcc6HJKLk/A4pt0iNGkq2JfA29pelQ7fqXTNxuUVBW7b2Jh9YAHXuFPXp1x1qvY+nb7JiOy4tnuMiOySHXW4q1IQR1ClAYGKwhxOLJ9MjWeCce6GmiplbtDmZwuuWtxctvqMxEb1TsM79xQN2/dy9/pjwr30DoyPc7g4nU3ti1xFQ1yIrzNudd7ZQxjGEnu4Oc9OnMZqvUY0m77C6E7Sog460U6w9PXmdGdl2+03CXFbJBeajLUgfMgED7ae7pw51Pb9IQtUPQ1Kgy9xCEIWXGkjPeWnb3U8uufEVUs2O0m9yejP2IfSU6SrBfI1vTcJFouLUNfuyHIy0tK+SiMGs4umtQyuxMWx3J8PNlxrsoq1b0jqpOBzHMcxTeSK8oHCQ08sUZrNxpbTi23EKQtBKVJUMEEdRisCKa3JaEqSz+U6QCc4cUPvqNVJrh/eEj9qv/sayzeDTGrJTYNIW1/TDGoNR6i9iRpchbMNAhKkLf2e+oAKGEg8s+dbY0FbbvEkq0XqdOoJsVHaOQVQFxnloyAVNhRO/GeY6/dUr0XB0drfTNjtdxnuquFoiutrtyXRHW5vfypwOL7pCUnO0c+X2+em9CaI/CqWzB1qq6vxErVHgxSYjjm1WAA+ruHA/R69RyrxJcU05NtprxX6/s9DHhTS2VPzZU10tlytUgR7pAkwnsZ7OQyptWPkoA1qucrdMPk2k/wDImrO423O0ORLXp6Df5N+kWqTKDkt8lRQhRTtaLh98jaeY5fwqsX+dsnfsk/8AoivR4fJLMlKSo5M2NY5UnZbvoI8/SAif5fI/gKtDh9wh1XobjzdOKOr7pa9P6ajzZk1Trk1JMht0ubUEA4A7wJz4gYBPTjOiu9o57O39c8TblbvRll600JJFtXc9TSgy92SSQyuQ5nCVggFQGTkcsnpT3fNao0zrThBDua0+ydQ2By3TkrICcuJY2KP+rl8lGuBaKQmfQexSdDcH9TaR4SrlxW0y3ZVxW8+rAD5UfVws+B6hJPi2PHFavFO16nk8O9V6euli1HejfZaI9sN1uUF5CH1nuOR0NJSpLaTgnI3ADOOprgKvVb7zqUJddWtLY2oClEhI8h5UUCO/mk2pWj0+ji5raX+F6rAR68FYAX17DOem0e772zxrkfhrYrlpvjzabBd46o8+HcuwfbV9FQz08wRgg+IIqt6BU5Ia4OHuqKhPTJSOi9U6y0JojiZfrxBtV8naoC3G1F9xtMVC1AZKcHdjHmD9XWpVw1i3ZFp0pc03q/3OLKT2j/q8uOiDF3nJbWgpK1YKiBg5BGBjpXJVZBxSOhrzJ8qi8emMt6q3v4r+DsjxsnK5I60iK0vZrFrV/UMQrs7OqApTKUbk5PZlJKfFO4gkfDx6UWaHexxjnXiZPFytNwsTq7U+1+TS1lB7MAcgRnPkcg/LklRUo5KjWPPzqI8opP592q7fj/DR8w+0610RHvV20fYI8ti86cixoI7K4Wy5MCKU7c7nm1HOeXMbTgnr4hou6tT6g4L2tmwahXMbYlvR7tMbfSNsVKlp3KBIJG0BWBzxiuZO0UkYBOD1HnSBah7pwKv4W9evUu99v2T67aq8e52parZObuF3tlwm32726RbigSJ8qOqM+SkZ7JpCQociefTzzyNVxqTVt90xw54aNWSeqKmWhIkYQk9olJRgHI6d41zmpSlAZUT8zWP10sfKadzla22rbZNBk49yVJUWn6UMePH4tTFMNpQXo7Li8eKinBP3VV1IKK9TBi6ONQu6OLLk1ycqEHjUgUsPNJlJBIc/Kfqr8R/P66j1bEOW9GUdmFIPvIUMpV8xTnHUiYyod6K10XOMUjdCWT+o9gfek/xpTc4Q/wAE9+8D+isOnI01pnvXlcHUsQVNHHaP4x8EA5z9ZA+w14qujaebUTveby9/3AAfbTc+6t5wuOKKlnqT1q442nbJlJD7pCAu4i7RmIapcj2epbCENdovcHG+aQATnBPT4052OyvzbJCaj2pb0uPd1CWAxlbTe1GO05ZSnIX73IYNQuit0iSd6Yi2qbf7y3LjQjag/ll1RCEpc7Q9khKgDhK+YI6bcn6IrSh2yVc7TeorNpU5d257SlMR4w7RpH4wLCUpGQkK2ggchyqI0UCbLIt8a3N6k1CgLgRG23GGWn3ITUlDKi4lJ7i+6BnIJHStC3otL2qbvAmWkxoyHHJLbWxPaM9luWW8+CVJCgQCQORGcVBqKkLNma8ZEp18ttt9ooqCG0hKU5PQAdB8KnWuWICNPrVHZjqWh5holmC0wYv4kKIUtPec355FXik1XoopsRYuq4KG9eWiObeWYSp6EIQ5Z2orS070ZCVp/LJx4q8/jWtqOFaxpiTeraxGQHbq2gIwkqjrCXN6Bn6BISoDoQQPCoHRRQEy1Uh64zNPwI8SC27MhML/ALPCaZ3OuEgklCRkdOXQVtawgW1Tlul2tiImNHk+oPBlSVBzaQUOKx9Jad2c/o1BM0lMbZNRa5MHiM/Hk2CQW1vPqjx1Rk95Hf2qQ2sBLmOoT0VjFNuvYbkW+IQ43HaUuM2sobiiKpOR+cZBIbXy5gcuh8ajopaAMaKU0lAgooooAKKKKTAKKKKYkFFFFJjCiiimAUUUUAFFFFABRRRQAUUUUAFFFFABWVFFA0Y0UUUCCiiigD//2Q==" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">06</span>
  <h1 class="section-title">Business Logic</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">Behind the editorial surface sits a precise calculation pipeline. Every booking flows through the same deterministic stages, with admin-controlled levers at every step.</p>

  <h2 class="sub-heading">Pricing pipeline (worked example)</h2>
  <div class="pricing-box">
    <div class="pricing-row"><span>Base price (PKR 10,000 × 2 days)</span><span class="price-total">PKR 20,000</span></div>
    <div class="pricing-row"><span>Loyalty discount (5% returning customer)</span><span class="price-neg">− PKR 1,000</span></div>
    <div class="pricing-row"><span>Service fee (5%, applied after discount)</span><span class="price-pos">+ PKR 950</span></div>
    <div class="pricing-row"><span>Weekend uplift (5%, Saturday pickup)</span><span class="price-pos">+ PKR 950</span></div>
    <div class="pricing-row total"><span>Total</span><span class="price-total">PKR 20,900</span></div>
  </div>

  <h2 class="sub-heading">Admin control surfaces</h2>
  <ul class="bullet-list">
    <li><strong>Fleet management</strong> — add, edit, deactivate cars; per-city distribution; category tagging.</li>
    <li><strong>Discount layers</strong> — loyalty thresholds, bulk multipliers, category-wide rules, seasonal windows.</li>
    <li><strong>Promo codes</strong> — full CRUD, expiry, usage limits, category restrictions, minimum-order rules.</li>
    <li><strong>Service fees</strong> — toggle on/off, percentage, weekend/holiday uplift with named special dates.</li>
    <li><strong>Booking workflow</strong> — pending → confirmed → cancelled transitions with audit trail.</li>
  </ul>

  <h2 class="sub-heading">Self-healing Order IDs</h2>
  <p>Order numbers start at 100001 and increment monotonically. The allocator floors every new ID at <code style="background:var(--dark3);color:var(--gold);padding:1px 5px;border-radius:3px;font-size:12px;font-family:monospace;">max(counter+1, highestExisting+1, 100001)</code> — so even if the counter is wiped, tampered with, or restored from a stale backup, the next ID is guaranteed to be strictly greater than every booking already in storage.</p>

  <div class="footer">
    <span class="footer-left">DriveX · Business Logic</span>
    <span class="footer-right">Page 08</span>
  </div>
</div>


<!-- ══════════════ PAGE 09 — DATA MANAGEMENT ══════════════ -->
<div class="page" id="s07">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">07</span>
  <h1 class="section-title">Data Management</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">localStorage is treated as a JSON document database. Each store is a typed wrapper that exposes read, write, subscribe, and reactive React hook APIs.</p>

  <h2 class="sub-heading">Storage schema</h2>
  <table class="data-table">
    <thead>
      <tr><th>Key</th><th>Shape</th><th>Owner</th></tr>
    </thead>
    <tbody>
      <tr><td><code>drivex_users_v1</code></td><td>User[]</td><td>auth-store</td></tr>
      <tr><td><code>drivex_session_v1</code></td><td>&#123; userId, token &#125;</td><td>auth-store</td></tr>
      <tr><td><code>drivex_cars_v1</code></td><td>Car[]</td><td>cars-store</td></tr>
      <tr><td><code>drivex_cities_v1</code></td><td>City[]</td><td>city-store</td></tr>
      <tr><td><code>drivex_bookings_v1</code></td><td>Booking[]</td><td>bookings-store</td></tr>
      <tr><td><code>drivex_order_counter_v1</code></td><td>number</td><td>bookings-store</td></tr>
      <tr><td><code>drivex_discount_settings_v1</code></td><td>DiscountSettings</td><td>discount-settings</td></tr>
      <tr><td><code>drivex_promos_v1</code></td><td>PromoCode[]</td><td>promos-store</td></tr>
      <tr><td><code>drivex_fees_v1</code></td><td>FeeSettings</td><td>fees-store</td></tr>
    </tbody>
  </table>

  <h2 class="sub-heading">Reactive store pattern</h2>
  <p>Every store exposes <code>read()</code>, <code>write()</code>, <code>subscribe()</code>, and a <code>useStore()</code> React hook built on <code>useSyncExternalStore</code>. Snapshot caching ensures stable object references — without this, React would see "new" state on every render and trigger an infinite re-render loop. Cross-tab synchronisation is automatic via the browser's native <code>storage</code> event.</p>

  <h2 class="sub-heading">Integrity guarantees</h2>
  <ul class="bullet-list">
    <li>Append-only bookings — past records are never overwritten.</li>
    <li>Versioned keys (<code>_v1</code> suffix) allow safe future migrations.</li>
    <li>Defensive parsing — corrupt JSON falls back to typed defaults instead of crashing.</li>
  </ul>

  <div class="footer">
    <span class="footer-left">DriveX · Data</span>
    <span class="footer-right">Page 09</span>
  </div>
</div>


<!-- ══════════════ PAGE 10 — ENGINEERING CHALLENGES ══════════════ -->
<div class="page" id="s08">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">08</span>
  <h1 class="section-title">Engineering Challenges</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">Real bugs encountered during development — and the precise fixes that resolved them. Each problem is an opportunity to demonstrate the team's debugging discipline.</p>

  <div class="challenge-card">
    <h4><span class="challenge-badge">1</span>Maximum update depth exceeded</h4>
    <div class="cause-row"><span class="cause-label">Cause</span><p><code>useSyncExternalStore</code> snapshot getters returned a freshly parsed object on every render, triggering an infinite re-render loop on the checkout page.</p></div>
    <div class="fix-row"><span class="fix-label">Fix</span><p>Module-level snapshot cache keyed by the raw JSON string. Re-parse only on actual change; pre-warm the cache on every write so the next read returns the same identity.</p></div>
  </div>

  <div class="challenge-card">
    <h4><span class="challenge-badge">2</span>Checkout payment regression</h4>
    <div class="cause-row"><span class="cause-label">Cause</span><p>No try/catch around <code>addBooking</code>; quota errors in private-mode browsers froze the spinner. Wallet methods had no input UI, so empty data slipped through.</p></div>
    <div class="fix-row"><span class="fix-label">Fix</span><p>Staged pipeline (validating → authorizing → saving → confirmed) wrapped in try/catch/finally. Per-method validation. Inputs disabled during submission. JazzCash and EasyPaisa each got proper phone + PIN flows.</p></div>
  </div>

  <div class="challenge-card">
    <h4><span class="challenge-badge">3</span>Duplicate Order IDs</h4>
    <div class="cause-row"><span class="cause-label">Cause</span><p>Counter resets and storage tampering could produce duplicate IDs across users.</p></div>
    <div class="fix-row"><span class="fix-label">Fix</span><p>Self-healing allocator floors every new ID at <code>max(counter+1, highestExistingOrderNumber+1, 100001)</code>.</p></div>
  </div>

  <div class="challenge-card">
    <h4><span class="challenge-badge">4</span>Wrong car images</h4>
    <div class="cause-row"><span class="cause-label">Cause</span><p>A Suzuki Cultus VXR entry used guessed image URLs that did not exist in the verified dataset.</p></div>
    <div class="fix-row"><span class="fix-label">Fix</span><p>Strict per-car image policy enforced. The unverified entry was removed; the legitimate Cultus VXL remained intact. Misassigned imagery was repurposed as a homepage decorative banner.</p></div>
  </div>

  <div class="challenge-card">
    <h4><span class="challenge-badge">5</span>Promo code over-exposure</h4>
    <div class="cause-row"><span class="cause-label">Cause</span><p>Suggested codes shown in the UI removed the exclusivity associated with promotional offers.</p></div>
    <div class="fix-row"><span class="fix-label">Fix</span><p>Hidden by design. The input shows only "Enter Promo Code". All failure paths collapse into a single neutral "Invalid or expired" message — preventing enumeration attacks and preserving exclusivity.</p></div>
  </div>

  <div class="footer">
    <span class="footer-left">DriveX · Challenges</span>
    <span class="footer-right">Page 10</span>
  </div>
</div>


<!-- ══════════════ PAGE 11 — ROADMAP ══════════════ -->
<div class="page" id="s09">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">09</span>
  <h1 class="section-title">Roadmap</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">DriveX is intentionally complete as a frontend simulation. The path to a live, multi-tenant SaaS product is clear and incremental — every layer below can be replaced without rewriting the UI.</p>

  <h2 class="sub-heading">Near-term (next iteration)</h2>
  <ul class="bullet-list">
    <li><strong>Real backend integration.</strong> Swap the persistence layer for Supabase or Neon. The store interfaces remain identical.</li>
    <li><strong>Live payment gateways.</strong> Replace simulated card / wallet flows with Stripe, JazzCash Business API, and EasyPaisa Merchant API.</li>
    <li><strong>Email + SMS notifications.</strong> Booking confirmations, reminders, and admin alerts via Resend and a local SMS provider.</li>
  </ul>

  <h2 class="sub-heading">Mid-term</h2>
  <ul class="bullet-list">
    <li><strong>Native mobile app.</strong> React Native build sharing the same engines and types.</li>
    <li><strong>AI-assisted concierge.</strong> Natural-language booking ("a luxury sedan in Lahore for the weekend") backed by a tool-using LLM agent.</li>
    <li><strong>Driver-on-demand.</strong> Optional chauffeur booking with real-time matching.</li>
    <li><strong>Multi-currency &amp; multi-language.</strong> Urdu / Roman Urdu / English locale switching.</li>
  </ul>

  <h2 class="sub-heading">Long-term vision</h2>
  <p>Open the platform to fleet partners — independent rental businesses can list their cars, manage availability, and receive bookings through a partner dashboard. DriveX becomes the rails, not just the brand.</p>

  <div class="footer">
    <span class="footer-left">DriveX · Roadmap</span>
    <span class="footer-right">Page 11</span>
  </div>
</div>


<!-- ══════════════ PAGE 12 — CONCLUSION ══════════════ -->
<div class="page" id="s10">
  <div class="logo-bar">
    <img src="data:image/jpeg;base64,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" class="logo-img-actual" alt="DriveX Pakistan">
  </div>
  <hr class="header-divider">

  <span class="section-num">10</span>
  <h1 class="section-title">Conclusion</h1>
  <div class="gold-rule"></div>

  <p class="section-intro">DriveX Pakistan demonstrates that a serious, production-feeling SaaS product can be built entirely on the front-end without compromising on rigour, polish, or maintainability.</p>

  <h2 class="sub-heading">What was achieved</h2>
  <ul class="achieved-list">
    <li>An editorial, accessible, mobile-first interface across 8 distinct route groups.</li>
    <li>A reactive store pattern that turns localStorage into a real-time multi-tab database.</li>
    <li>A dynamic, admin-controlled pricing engine with transparent line-item breakdown.</li>
    <li>A self-healing Order ID allocator and a hardened, staged payment pipeline.</li>
    <li>A complete admin operations suite — fleet, fees, discounts, promos, bookings.</li>
  </ul>

  <h2 class="sub-heading">What was learned</h2>
  <p>Production-grade engineering is less about which framework you pick and more about the discipline of small, predictable abstractions. Three layers, typed end-to-end, with one source of truth per concern — and the system stays understandable as it grows.</p>

  <div class="final-box">
    <p><strong>Final thought —</strong> DriveX is not a tutorial project. It is an opinionated, finished product simulation. Every decision was made deliberately, every bug was investigated to its root cause, and every visual flourish reinforces the brand's premium positioning.</p>
  </div>

  <h2 class="sub-heading">Credits</h2>
  <p>Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lucide, Sonner, and Recharts. Designed and engineered with attention to detail, in 2026.</p>

  <h2 class="sub-heading">Team</h2>
  <p><strong style="color:var(--gold)">Muhammad Shams Ul Arfeen</strong> &amp; <strong style="color:var(--white)">Sabeeka Kainat Zahra</strong></p>

  <div class="footer">
    <span class="footer-left">DriveX · Conclusion</span>
    <span class="footer-right">Page 12</span>
  </div>
</div>

</body>
</html>
