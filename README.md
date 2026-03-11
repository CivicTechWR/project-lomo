# LoMo

## CivicTechWR Season 7 Project

[![Template Version](https://img.shields.io/badge/template-v1.0.0-blue.svg)](https://github.com/CivicTechWR/CTWR-Project-Template-New/releases)
[![GitHub Pages](https://img.shields.io/badge/docs-GitHub%20Pages-brightgreen.svg)](https://civictechwr.github.io/CTWR-Project-Template-New/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **🚀 New to this template?** Start with the **[Getting Started Guide](GETTING_STARTED.md)** for a 5-minute overview and step-by-step instructions.

## Quick Summary

**Prerequisites (10 minutes):**

- Git 2.30+ (`git --version`)
- Node.js 18+ with npm (`node --version`, `npm --version`)
- GitHub CLI (`gh`) authenticated with:
  - `gh auth login`
  - `gh auth refresh -s project --hostname github.com` (for project automation)
  - `gh auth status` showing `project` and `repo` scopes
- Optional: Python 3.10+, Ruby/Bundler, or Flutter if your project uses them

> Tip: Run `./scripts/setup.sh --check` (new flag) for a prereq-only diagnostic before installing dependencies.

This template provides everything needed for a successful CivicTechWR project: 12-week project lifecycle, comprehensive documentation, GitHub automation, security best practices, and public website hosting.

**Essential first steps:**

1. **[Complete the Getting Started Guide](GETTING_STARTED.md)** - Your roadmap to success
2. **Fill out your Project Pitch** - Define your civic impact
3. **Set up your development environment** - Automated scripts included

> **For detailed guidance:** Read the **[Getting Started Guide](GETTING_STARTED.md)** - it breaks down the entire process with week-by-week instructions, common questions, and success metrics.

## Problem Statement

**What is the problem?**
LoMo is an exploration in building calm, consent-based infrastructure that makes it easier to ask for and offer help without pressure, rage, or performance

**Who is affected?**
Members of the community interested in a sharing economy

**What exists today?**
[How are users solving or mitigating the problem today? Tools, programs, workarounds, policies, past attempts and their gaps]

**Why now?**
If we are to weather the coming climate change effects on our food systems and our personal security, we will need to come together and think in community ways, community wellbeing, community success, as opposed to individual success.

## Solution Overview

A platform for people to ask for help, and match them with others to help

## Team

| Name            | Role                      | Skills               | Weekly Commitment |
| --------------- | ------------------------- | -------------------- | ----------------- |
| Rebecca Sargent | Project Owner             | SME                  |                   |
| Mohamed Fouda   | Technical Product Manager | Product Management   |                   |
| Sara Ahmad      | Project Manager           | Project Management   |                   |
| Chen Lu         | Designer                  | Design               |                   |
| Jay             | Software Developer        | Software Development |                   |
| Chris Craig     | Software Developer        | Software Development |                   |

**What help do we need from the community?**
[Data, introductions, volunteers with certain skills, user interviews, etc.]

**What are we bringing to CTWR?**
[Time, domain knowledge, user access, data, story, test space, feedback cadence, or sponsorship]

## Technical Approach

**Technology Stack:**

- Frontend: [e.g., React, Jekyll, Flutter]
- Backend: [e.g., Python/Django, Node.js, Ruby]
- Database: [e.g., PostgreSQL, SQLite]
- Deployment: [e.g., GitHub Pages, Heroku, Netlify]

**Architecture Decisions:**
[Brief rationale for tech choices - see [TECHNICAL_DESIGN.md](docs/TECHNICAL_DESIGN.md) for details]

## Community Impact

**Success Metrics:**
[Simple outcomes or signals - e.g., fewer missed appointments, faster sign-ups, clearer info]

**How this strengthens Waterloo Region's civic fabric:**
[Connection to broader civic goals and community benefits]

## Project Timeline

- **Week 1-3**: Problem validation and user research
- **Week 4-6**: User research and prototype development
- **Week 7-9**: Core feature development
- **Week 10-11**: Testing and refinement
- **Week 12**: Demo Day presentation

## Setup Summary

**📖 [Complete Getting Started Guide](GETTING_STARTED.md)** - Full walkthrough recommended

**Quick commands after reading the guide:**

### Quick Setup Commands

```bash
# 0. Pre-flight check (optional but recommended)
./scripts/setup.sh --check

# 1. Bootstrap local environment
./scripts/setup.sh

# 2. Provision GitHub Project for project tracking
CTWR_PROJECT_OWNER=CivicTechWR ./scripts/setup-project.sh  # recommend hosting in the CivicTechWR org

# 3. Apply security baseline (branch protection, Dependabot, secrt scanning)
./scripts/setup-security.sh
```

> ⚠️ `./scripts/setup-project.sh` needs `gh` with the `project` scope and permissions **inside the CivicTechWR organization** (recommended home for new repos). Run `gh auth refresh -s project --hostname github.com` first.
>
> ⚠️ `./scripts/setup-security.sh` needs `gh` with `repo` scope plus admin rights. Verify with `gh auth status` and ensure you can edit repository settings.
>
> 📢 **GitHub Pages:** Repos under `github.com/CivicTechWR` can stay private if the org plan allows private Pages. For personal forks, make the repo public or upgrade so the docs site can publish.

**Post-flight checklist:**

- Enable GitHub Pages (Settings → Pages → GitHub Actions)
- Run the project (`./scripts/setup-project.sh`) and security (`./scripts/setup-security.sh`) automation
- Update README, wiki, and CODEOWNERS with real details
- Invite partners/volunteers to the repo and GitHub Project

**For Contributors:** See [CONTRIBUTING.md](docs/CONTRIBUTING.md)

## Project Resources

### Planning & Pitching

- [Project Pitch Template](docs/PROJECT_PITCH.md) - 3-minute pitch format
- [User Research Templates](docs/USER_RESEARCH.md) - Interview guides and personas

### Development

- [Technical Design Document](docs/TECHNICAL_DESIGN.md) - Architecture decisions
- [Security Guide](docs/SECURITY_GUIDE.md) - Security best practices for civic tech
- [Repository Security](docs/REPOSITORY_SECURITY.md) - GitHub security configuration and monitoring
- [Accessibility Guide](docs/ACCESSIBILITY_GUIDE.md) - WCAG 2.1 compliance
- [Contributing Guidelines](docs/CONTRIBUTING.md) - How to get involved
- [Project Management](docs/PROJECT_MANAGEMENT.md) - GitHub Projects setup
- [GitHub Pages Setup](docs/GITHUB_PAGES.md) - Public website hosting and deployment

### Demo Day Preparation

- [Demo Slides Template](docs/DEMO_PREP.md) - 8-step presentation guide
- [Impact Tracking](docs/IMPACT_TRACKING.md) - Metrics and story collection

### Project Wiki Templates

- [Wiki Template Guide](wiki-template/README.md) - Complete GitHub Wiki setup
- [Team & Roles Wiki](wiki-template/Team-and-Roles.md) - Team documentation page

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## Acknowledgments

- CivicTechWR community
- [List any specific partners, data sources, or inspiration]

---

**CivicTechWR Project Template** - Built for Season X • [CTWR Website](https://civictechwr.org)
