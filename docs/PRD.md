# Property Viewing Tracker — PRD

## Problem
Admin clerk at a real estate agency tracks client property viewings via spreadsheet + WhatsApp messages. This is tedious, error-prone, and produces no live status overview for follow-up.

## Target User
One admin clerk (single user for now) who logs and updates viewing progress reported by agents.

## Core Objects
- **Client** — name, phone, email, notes
- **Property** — address, listing ref, notes
- **Viewing** — client + property + appointment date/time, stage (1st/2nd/3rd), status (scheduled/completed/missed), result (not_interested / needs_another_viewing / interested_ready_to_commit), agent name, notes

## MVP (v1) — Checklist
- [ ] Add a client (name + phone)
- [ ] Add a property (address)
- [ ] Create a viewing linking client + property + appointment datetime + stage + agent name
- [ ] Mark viewing completed or missed
- [ ] Record viewing result after completion
- [ ] List all viewings at a glance with filters (status, result, agent, date)
- [ ] Works without login (demo-first, seeded data)

## Non-goals (v1)
- No option/Offer-to-Purchase stage tracking
- No deposit tracking
- No agent logins or multi-user roles
- No messaging / WhatsApp integration
- No automated notifications

## Success Criteria
**End-to-end scenario:** I log in to the tracker, add a client (Jane Doe, 0821234567), add a property (12 Oak Ave, Sandton), create a 1st viewing scheduled for tomorrow with agent Sipho. The next day I mark it completed and set result to "interested & ready to commit." I open the Viewings list and see this row with status=completed, result=interested_ready_to_commit, alongside all other viewings — filterable by agent Sipho. Everything I entered persists and survives a refresh.