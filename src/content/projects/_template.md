---
# ============================================================
# Project Card Template
# ============================================================
# To add a new project card to the portfolio:
#   1. Copy this file and rename it (e.g., my-project.md)
#   2. Fill in the frontmatter fields below
#   3. Rebuild the site (npm run build) — the card appears automatically
#
# Required fields: title, visibility (plus description and language for private projects)
# Optional fields: summary, detail, group, stack, url, homepage, status, order
# Public repos only need title, summary, group and order: the GitHub cache supplies the rest.
# Optional blur: set `blur: true` on a private project to mask its details with a placeholder text
# ============================================================

title: "My Project Name"
description: "A short description of what the project does (~120 characters recommended for card display)."
summary: "A plain-language one-liner shown on cards (falls back to description)."
detail: "Technical one-liner for the desktop Projects window (falls back to description)."
group: "other"                       # "security", "web3", "tools", or "other"
language: "Python"
stack: "FastAPI, PostgreSQL"        # Additional tech info (optional)
url: ""                              # GitHub repo URL (leave empty for private)
homepage: ""                         # Live demo URL (optional)
visibility: "private"                # "public" or "private"
status: "active"                     # "active", "ongoing", or "archived"
order: 99                            # Sort priority within the group: lower numbers appear first
---
