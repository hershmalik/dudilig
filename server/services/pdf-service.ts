import puppeteer from "puppeteer";
import type { AnalysisResult } from "@shared/schema";
import { format } from "date-fns";

export async function generatePDF(analysis: AnalysisResult): Promise<Buffer> {
  const html = generateHTML(analysis);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

function generateHTML(analysis: AnalysisResult): string {
  const tierColor = analysis.tier === "High-Risk" ? "#dc2626" : 
                    analysis.tier === "Limited-Risk" ? "#f59e0b" : "#16a34a";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #1e293b;
    }

    .header {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e2e8f0;
    }

    .header h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 5px;
    }

    .header .meta {
      font-size: 9pt;
      color: #64748b;
    }

    .company-info {
      background: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 15px;
    }

    .company-info h2 {
      font-size: 14pt;
      font-weight: 600;
      margin-bottom: 8px;
      color: #0f172a;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .info-item {
      font-size: 9pt;
    }

    .info-label {
      color: #64748b;
      font-weight: 500;
    }

    .info-value {
      color: #1e293b;
      font-weight: 600;
    }

    .tier-badge {
      background: ${tierColor};
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      display: inline-block;
      margin: 10px 0;
    }

    .section {
      margin-bottom: 15px;
    }

    .section h3 {
      font-size: 12pt;
      font-weight: 600;
      margin-bottom: 8px;
      color: #0f172a;
    }

    .section p {
      font-size: 9pt;
      line-height: 1.5;
      color: #475569;
      margin-bottom: 8px;
    }

    .citations {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }

    .citation {
      font-size: 8pt;
      color: #3b82f6;
      background: #eff6ff;
      padding: 3px 8px;
      border-radius: 3px;
      font-family: 'JetBrains Mono', monospace;
    }

    .gaps {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }

    .gap-card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
      position: relative;
    }

    .gap-status {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .status-red { background: #dc2626; }
    .status-yellow { background: #f59e0b; }
    .status-green { background: #16a34a; }

    .gap-card h4 {
      font-size: 10pt;
      font-weight: 600;
      margin-bottom: 6px;
      padding-right: 20px;
      color: #0f172a;
    }

    .gap-card p {
      font-size: 8pt;
      color: #64748b;
      line-height: 1.4;
    }

    .scenario {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 15px;
    }

    .scenario h3 {
      font-size: 11pt;
      margin-bottom: 4px;
    }

    .scenario .desc {
      font-size: 8pt;
      color: #64748b;
      margin-bottom: 10px;
    }

    .metrics {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }

    .metric {
      background: white;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .metric-label {
      font-size: 8pt;
      color: #64748b;
      margin-bottom: 3px;
    }

    .metric-value {
      font-size: 14pt;
      font-weight: 700;
      color: #0f172a;
    }

    .deal-terms {
      margin-top: 10px;
    }

    .deal-term {
      background: white;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      margin-bottom: 6px;
    }

    .deal-term strong {
      font-size: 9pt;
      color: #0f172a;
      display: block;
      margin-bottom: 3px;
    }

    .deal-term span {
      font-size: 8pt;
      color: #64748b;
    }

    .disclaimer {
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      padding: 10px;
      margin-top: 15px;
    }

    .disclaimer p {
      font-size: 7pt;
      color: #92400e;
      line-height: 1.4;
    }

    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 7pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Compliance Impact Brief</h1>
    <div class="meta">Generated ${format(new Date(analysis.createdAt), "PPpp")} • Dudilig v1.2</div>
  </div>

  <div class="company-info">
    <h2>${analysis.companyName}</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">Sector:</span> 
        <span class="info-value">${analysis.sector}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Geography:</span> 
        <span class="info-value">${analysis.geography}</span>
      </div>
      <div class="info-item">
        <span class="info-label">AI Use Case:</span> 
        <span class="info-value">${analysis.aiUseCase}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Classification:</span> 
        <span class="info-value">${analysis.tier}</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h3>EU AI Act Classification</h3>
    <div class="tier-badge">${analysis.tier}</div>
    <p>${analysis.tierReason}</p>
    <div class="citations">
      ${analysis.citations.map(c => `<span class="citation">${c.article || c.text}</span>`).join('')}
    </div>
  </div>

  <div class="section">
    <h3>Compliance Gaps</h3>
    <div class="gaps">
      ${analysis.gaps.slice(0, 4).map(gap => `
        <div class="gap-card">
          <div class="gap-status status-${gap.status}"></div>
          <h4>${gap.title}</h4>
          <p>${gap.action}</p>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="scenario">
    <h3>${analysis.scenario.name}</h3>
    <p class="desc">${analysis.scenario.description}</p>
    
    <div class="metrics">
      <div class="metric">
        <div class="metric-label">Cost Impact (annually)</div>
        <div class="metric-value">+$${analysis.scenario.costRange.min}-${analysis.scenario.costRange.max}k</div>
      </div>
      <div class="metric">
        <div class="metric-label">Timeline Impact</div>
        <div class="metric-value">+${analysis.scenario.timelineRange.min}-${analysis.scenario.timelineRange.max} mo</div>
      </div>
    </div>

    <div class="deal-terms">
      ${analysis.scenario.dealTerms.map(term => `
        <div class="deal-term">
          <strong>${term.description}</strong>
          <span>${term.impact}</span>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="disclaimer">
    <p><strong>Disclaimer:</strong> This analysis is for informational purposes only and does not constitute legal advice. Consult with qualified legal counsel for compliance decisions. All regulatory citations are accurate as of generation date.</p>
  </div>

  <div class="footer">
    Dudilig v1.2 Demo - From Deck to Deal Terms, with Citations
  </div>
</body>
</html>
  `;
}
