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
          .nav-actions {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .btn-nav {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            padding: 8px 14px;
            border-radius: 9999px;
            transition: all 0.15s ease;
          }
          .btn-primary {
            background-color: #1f8055;
            color: #ffffff;
          }
          .btn-primary:hover {
            background-color: #17523a;
          }
          .btn-secondary {
            background-color: #dcf3e6;
            color: #144330;
          }
          .btn-secondary:hover {
            background-color: #bbe7d0;
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
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px;
            margin-top: 24px;
          }
          .stat-box {
            background-color: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            padding: 14px 16px;
          }
          .stat-number {
            font-size: 24px;
            font-weight: 800;
            color: #ffffff;
          }
          .stat-label {
            font-size: 12px;
            color: #dcf3e6;
            font-weight: 500;
          }
          .toolbar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 16px;
          }
          .search-wrap {
            flex: 1;
            min-width: 260px;
            position: relative;
          }
          .search-input {
            width: 100%;
            padding: 12px 16px;
            padding-left: 40px;
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
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 16px;
          }
          .tabs {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            background-color: #e5e7eb;
            padding: 4px;
            border-radius: 12px;
          }
          .tab-btn {
            background: transparent;
            border: none;
            font-size: 12px;
            font-weight: 600;
            padding: 8px 14px;
            border-radius: 8px;
            color: #4b5563;
            cursor: pointer;
            transition: all 0.15s ease;
          }
          .tab-btn.active {
            background-color: #ffffff;
            color: #1f8055;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
            max-width: 520px;
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
          }
          .badge-core { background-color: #e0e7ff; color: #3730a3; }
          .badge-location { background-color: #dcfce7; color: #166534; }
          .badge-blog { background-color: #fef3c7; color: #92400e; }
          .badge-priority-high { background-color: #dcf3e6; color: #144330; font-weight: 800; }
          .badge-priority-med { background-color: #f3f4f6; color: #374151; font-weight: 600; }
          .date-cell {
            color: #6b7280;
            font-variant-numeric: tabular-nums;
            font-size: 12px;
          }
          .freq-cell {
            color: #4b5563;
            font-weight: 500;
            text-transform: capitalize;
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
            <div class="nav-actions">
              <a href="/sitemap" class="btn-nav btn-secondary">
                HTML Directory Sitemap
              </a>
              <a href="/" class="btn-nav btn-primary">
                &#8592; Back to Website
              </a>
            </div>
          </div>

          <div class="hero-card">
            <span class="hero-badge">XML Sitemap Directory</span>
            <h1>Interactive XML Sitemap</h1>
            <p>
              This sitemap is structured for search engine crawlers (Googlebot, Bingbot) to systematically index all certified bed bug treatment services, major Indian city locations, and educational guides.
            </p>
            <div class="stats-grid">
              <div class="stat-box">
                <div class="stat-number" id="stat-total"><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></div>
                <div class="stat-label">Total Indexed URLs</div>
              </div>
              <div class="stat-box">
                <div class="stat-number" id="stat-core">6</div>
                <div class="stat-label">Core Pages</div>
              </div>
              <div class="stat-box">
                <div class="stat-number" id="stat-locations">5</div>
                <div class="stat-label">Major Cities</div>
              </div>
              <div class="stat-box">
                <div class="stat-number" id="stat-blogs">-</div>
                <div class="stat-label">Blog Articles &amp; Guides</div>
              </div>
            </div>
          </div>

          <div class="toolbar">
            <div class="search-wrap">
              <span class="search-icon">&#128269;</span>
              <input type="text" id="sitemap-search" class="search-input" placeholder="Filter by URL or keyword (e.g. bangalore, cost, inspection)..." />
            </div>
            <div class="tabs">
              <button class="tab-btn active" data-filter="all" id="tab-all">All (<xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>)</button>
              <button class="tab-btn" data-filter="core" id="tab-core">Core</button>
              <button class="tab-btn" data-filter="locations" id="tab-locations">Locations</button>
              <button class="tab-btn" data-filter="blogs" id="tab-blogs">Articles</button>
            </div>
          </div>

          <div class="table-card">
            <div class="table-wrap">
              <table id="sitemap-table">
                <thead>
                  <tr>
                    <th style="width: 48px;">#</th>
                    <th>URL</th>
                    <th>Section</th>
                    <th>Priority</th>
                    <th>Frequency</th>
                    <th>Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="sitemap:urlset/sitemap:url">
                    <xsl:variable name="loc" select="sitemap:loc"/>
                    <xsl:variable name="priority" select="sitemap:priority"/>
                    <xsl:variable name="type">
                      <xsl:choose>
                        <xsl:when test="$loc = 'https://bedbugstreatment.co.in' or $loc = 'https://bedbugstreatment.co.in/' or contains($loc, '/services') or contains($loc, '/about') or contains($loc, '/faq') or contains($loc, '/contact') or contains($loc, '/blog') or contains($loc, '/sitemap')">core</xsl:when>
                        <xsl:when test="contains($loc, '/bangalore') or contains($loc, '/delhi') or contains($loc, '/mumbai') or contains($loc, '/noida') or contains($loc, '/pune')">locations</xsl:when>
                        <xsl:otherwise>blogs</xsl:otherwise>
                      </xsl:choose>
                    </xsl:variable>

                    <tr data-type="{$type}" data-url="{$loc}">
                      <td style="color: #9ca3af; font-weight: 600;"><xsl:value-of select="position()"/></td>
                      <td class="url-cell">
                        <a href="{$loc}" class="url-link" target="_blank" rel="noopener noreferrer">
                          <xsl:value-of select="$loc"/>
                        </a>
                      </td>
                      <td>
                        <xsl:choose>
                          <xsl:when test="$type = 'core'">
                            <span class="badge badge-core">Core Page</span>
                          </xsl:when>
                          <xsl:when test="$type = 'locations'">
                            <span class="badge badge-location">City Location</span>
                          </xsl:when>
                          <xsl:otherwise>
                            <span class="badge badge-blog">Blog Post</span>
                          </xsl:otherwise>
                        </xsl:choose>
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
                      <td class="freq-cell">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </td>
                      <td class="date-cell">
                        <xsl:value-of select="substring(sitemap:lastmod, 1, 10)"/>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
              <div id="no-results" class="no-results">
                No URLs found matching your filter criteria.
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

        <script>
          <![CDATA[
          (function() {
            var searchInput = document.getElementById('sitemap-search');
            var table = document.getElementById('sitemap-table');
            if (!table) return;
            var tbody = table.getElementsByTagName('tbody')[0];
            if (!tbody) return;
            var rows = tbody.getElementsByTagName('tr');
            var noResults = document.getElementById('no-results');
            var tabBtns = document.querySelectorAll('.tab-btn');
            var currentFilter = 'all';

            // Calculate exact counts dynamically
            var counts = { all: rows.length, core: 0, locations: 0, blogs: 0 };
            for (var i = 0; i < rows.length; i++) {
              var t = rows[i].getAttribute('data-type') || 'blogs';
              if (counts[t] !== undefined) {
                counts[t]++;
              } else {
                counts.blogs++;
              }
            }

            var statCore = document.getElementById('stat-core');
            var statLoc = document.getElementById('stat-locations');
            var statBlogs = document.getElementById('stat-blogs');
            var tabAll = document.getElementById('tab-all');
            var tabCore = document.getElementById('tab-core');
            var tabLocations = document.getElementById('tab-locations');
            var tabBlogs = document.getElementById('tab-blogs');

            if (statCore) statCore.textContent = counts.core;
            if (statLoc) statLoc.textContent = counts.locations;
            if (statBlogs) statBlogs.textContent = counts.blogs;

            if (tabAll) tabAll.textContent = 'All (' + counts.all + ')';
            if (tabCore) tabCore.textContent = 'Core (' + counts.core + ')';
            if (tabLocations) tabLocations.textContent = 'Locations (' + counts.locations + ')';
            if (tabBlogs) tabBlogs.textContent = 'Articles (' + counts.blogs + ')';

            function filterRows() {
              var query = (searchInput.value || '').toLowerCase().trim();
              var visibleCount = 0;

              for (var j = 0; j < rows.length; j++) {
                var row = rows[j];
                var type = row.getAttribute('data-type');
                var url = (row.getAttribute('data-url') || '').toLowerCase();

                var matchesTab = (currentFilter === 'all') || (type === currentFilter);
                var matchesSearch = !query || (url.indexOf(query) > -1);

                if (matchesTab && matchesSearch) {
                  row.style.display = '';
                  visibleCount++;
                } else {
                  row.style.display = 'none';
                }
              }

              if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
              }
            }

            if (searchInput) {
              searchInput.addEventListener('input', filterRows);
            }

            tabBtns.forEach(function(btn) {
              btn.addEventListener('click', function() {
                tabBtns.forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                filterRows();
              });
            });
          })();
          ]]>
        </script>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
