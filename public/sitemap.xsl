<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title>XML Sitemap | Bed Bug Treatment India</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet" />
        <style>
          *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8faf9;
            color: #111827;
            line-height: 1.5;
            padding: 24px 16px 64px 16px;
          }
          .container {
            max-width: 1100px;
            margin: 0 auto;
          }
          .top-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
            padding-bottom: 16px;
            border-bottom: 1px solid #e5e7eb;
          }
          .brand {
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            color: #111827;
          }
          .brand-logo {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #1f8055, #144330);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-size: 18px;
            box-shadow: 0 4px 12px rgba(31, 128, 85, 0.25);
          }
          .brand-title {
            font-size: 18px;
            font-weight: 800;
            letter-spacing: -0.02em;
          }
          .brand-title span {
            color: #1f8055;
          }
          .btn-nav {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 9999px;
            background-color: #1f8055;
            color: #ffffff;
            transition: all 0.15s ease;
          }
          .btn-nav:hover {
            background-color: #17523a;
          }
          .hero-card {
            background: linear-gradient(135deg, #1f8055 0%, #17523a 100%);
            border-radius: 20px;
            padding: 32px 28px;
            color: #ffffff;
            box-shadow: 0 20px 40px -15px rgba(23, 82, 58, 0.3);
            margin-bottom: 24px;
            position: relative;
            overflow: hidden;
          }
          .hero-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 4px 12px;
            border-radius: 9999px;
            margin-bottom: 12px;
          }
          .hero-card h1 {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.02em;
            margin-bottom: 8px;
          }
          .hero-card p {
            font-size: 14px;
            color: #dcf3e6;
            max-width: 680px;
            line-height: 1.6;
          }
          .stats-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 20px;
          }
          .stat-box {
            background-color: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            border-radius: 12px;
            padding: 12px 22px;
            display: inline-flex;
            align-items: center;
            gap: 12px;
          }
          .stat-number {
            font-size: 24px;
            font-weight: 800;
            color: #ffffff;
            line-height: 1;
          }
          .stat-label {
            font-size: 13px;
            color: #dcf3e6;
            font-weight: 500;
          }
          .toolbar {
            margin-bottom: 16px;
          }
          .search-wrap {
            width: 100%;
            position: relative;
          }
          .search-input {
            width: 100%;
            padding: 14px 18px;
            padding-left: 44px;
            font-size: 14px;
            border: 1px solid #d1d5db;
            border-radius: 12px;
            background-color: #ffffff;
            color: #111827;
            outline: none;
            transition: all 0.15s ease;
          }
          .search-input:focus {
            border-color: #1f8055;
            box-shadow: 0 0 0 3px rgba(31, 128, 85, 0.15);
          }
          .search-icon {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 16px;
            pointer-events: none;
          }
          .table-card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04);
          }
          .table-wrap {
            overflow-x: auto;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 13px;
          }
          thead {
            background-color: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
          }
          th {
            padding: 14px 18px;
            font-weight: 700;
            color: #4b5563;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.05em;
          }
          tbody tr {
            border-bottom: 1px solid #f3f4f6;
            transition: background-color 0.1s ease;
          }
          tbody tr:last-child {
            border-bottom: none;
          }
          tbody tr:hover {
            background-color: #f0fcf6;
          }
          td {
            padding: 14px 18px;
            vertical-align: middle;
          }
          .url-cell {
            word-break: break-all;
          }
          .url-link {
            color: #111827;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            transition: color 0.15s ease;
          }
          .url-link:hover {
            color: #1f8055;
            text-decoration: underline;
          }
          .badge {
            display: inline-flex;
            align-items: center;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 6px;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            white-space: nowrap;
          }
          .badge-priority-high { background-color: #dcf3e6; color: #144330; font-weight: 800; }
          .badge-priority-med { background-color: #f3f4f6; color: #374151; font-weight: 600; }
          .date-cell {
            color: #6b7280;
            font-variant-numeric: tabular-nums;
            font-size: 12px;
          }
          .no-results {
            text-align: center;
            padding: 48px 16px;
            color: #6b7280;
            font-size: 14px;
            display: none;
          }
          .footer-note {
            margin-top: 24px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            line-height: 1.6;
          }
          .footer-note a {
            color: #1f8055;
            text-decoration: none;
            font-weight: 600;
          }
          .footer-note a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="top-bar">
            <a href="/" class="brand">
              <div class="brand-logo">B</div>
              <div class="brand-title">BedBug <span>Treatment</span></div>
            </a>
            <a href="/" class="btn-nav">
              &#8592; Back to Website
            </a>
          </div>

          <div class="hero-card">
            <span class="hero-badge">XML Sitemap Directory</span>
            <h1>XML Sitemap</h1>
            <p>
              This sitemap is structured for search engine crawlers (Googlebot, Bingbot) and human visitors to index all published pages, services, locations, and articles across the website.
            </p>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-number" id="stat-total"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                <div class="stat-label">Total Indexed URLs</div>
              </div>
            </div>
          </div>

          <div class="toolbar">
            <div class="search-wrap">
              <span class="search-icon">&#128269;</span>
              <input type="text" id="sitemap-search" class="search-input" oninput="if(window.filterSitemap)window.filterSitemap();" onkeyup="if(window.filterSitemap)window.filterSitemap();" placeholder="Filter by URL or keyword (e.g. bangalore, cost, inspection)..." />
            </div>
          </div>

          <div class="table-card">
            <div class="table-wrap">
              <table id="sitemap-table">
                <thead>
                  <tr>
                    <th style="width: 48px;">#</th>
                    <th>URL</th>
                    <th>Priority</th>
                    <th>Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <xsl:variable name="loc" select="sitemap:loc"/>
                    <xsl:variable name="priority" select="sitemap:priority"/>

                    <tr data-url="{$loc}">
                      <td style="color: #9ca3af; font-weight: 600;"><xsl:value-of select="position()"/></td>
                      <td class="url-cell">
                        <a href="{$loc}" class="url-link" target="_blank" rel="noopener noreferrer">
                          <xsl:value-of select="$loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:choose>
                          <xsl:when test="$priority &gt;= 0.9">
                            <span class="badge badge-priority-high"><xsl:value-of select="$priority"/></span>
                          </xsl:when>
                          <xsl:otherwise>
                            <span class="badge badge-priority-med"><xsl:value-of select="$priority"/></span>
                          </xsl:otherwise>
                        </xsl:choose>
                      </td>
                      <td class="date-cell">
                        <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
              <div id="no-results" class="no-results">
                No URLs found matching your search.
              </div>
            </div>
          </div>

          <div class="footer-note">
            <p>
              Generated by <strong>Bed Bug Treatment India</strong> XML Engine.
              Standards compliant with <a href="https://www.sitemaps.org" target="_blank" rel="noopener noreferrer">Sitemaps.org</a> protocol.
            </p>
          </div>
        </div>

        <script type="text/javascript">
          <![CDATA[
          (function() {
            function filterSitemap() {
              var input = document.getElementById('sitemap-search');
              var query = (input ? input.value : '').toLowerCase().trim();
              var table = document.getElementById('sitemap-table');
              if (!table) return;
              var tbody = table.getElementsByTagName('tbody')[0];
              if (!tbody) return;
              var rows = tbody.getElementsByTagName('tr');
              var noResults = document.getElementById('no-results');
              var visibleCount = 0;

              for (var i = 0; i !== rows.length; i++) {
                var row = rows[i];
                var url = (row.getAttribute('data-url') || '').toLowerCase();
                var text = (row.textContent || row.innerText || '').toLowerCase();

                var matchUrl = url.indexOf(query) !== -1;
                var matchText = text.indexOf(query) !== -1;
                var matches = !query || matchUrl || matchText;

                if (matches) {
                  row.style.display = '';
                  visibleCount++;
                } else {
                  row.style.display = 'none';
                }
              }

              if (noResults) {
                if (visibleCount === 0) {
                  noResults.style.display = 'block';
                } else {
                  noResults.style.display = 'none';
                }
              }
            }

            window.filterSitemap = filterSitemap;

            function initSearch() {
              var input = document.getElementById('sitemap-search');
              if (input) {
                input.addEventListener('input', filterSitemap);
                input.addEventListener('keyup', filterSitemap);
                input.addEventListener('change', filterSitemap);
                input.addEventListener('paste', filterSitemap);
              }
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initSearch);
            } else {
              initSearch();
            }
          })();
          ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
