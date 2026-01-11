<!--
Sync Impact Report:
Version change: [CONSTITUTION_VERSION_OLD] -> 1.0.0
List of modified principles:
- [PRINCIPLE_1_NAME] -> I. Security & Isolation
- [PRINCIPLE_2_NAME] -> II. Accuracy & State Integrity
- [PRINCIPLE_3_NAME] -> III. Reliability & Error Handling
- [PRINCIPLE_4_NAME] -> IV. Usability & Responsiveness
- [PRINCIPLE_5_NAME] -> V. Reproducibility & Documentation
Added sections:
- Key Standards
- Constraints
- Success Criteria
Removed sections: none
Templates requiring updates:
- .specify/templates/plan-template.md (✅ updated)
- .specify/templates/spec-template.md (✅ updated)
- .specify/templates/tasks-template.md (✅ updated)
Follow-up TODOs: none
-->

# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Security & Isolation
All authentication flows must ensure strict user isolation and JWT token integrity. Access control must be enforced at every layer to prevent unauthorized data access or modification.

### II. Accuracy & State Integrity
Backend operations must correctly reflect frontend actions and synchronize perfectly with the database state. Data consistency is non-negotiable across all system boundaries.

### III. Reliability & Error Handling
APIs must handle errors gracefully, return appropriate HTTP status codes, and maintain consistent data even under failure conditions. System stability is a primary goal.

### IV. Usability & Responsiveness
The frontend interface must be responsive, intuitive, and user-friendly across both desktop and mobile views. User experience must be consistent and logical.

### V. Reproducibility & Documentation
All operations, configurations, and environment setups must be documented thoroughly. The project must be easily reproducible in a new environment with minimal manual effort.

## Key Standards

- **Authentication**: All API calls require a valid JWT token; unauthorized requests MUST return 401.
- **API Compliance**: Endpoints MUST follow REST conventions with proper HTTP methods and status codes.
- **Database Integrity**: Task ownership MUST be enforced at the schema/query level; data stored persistently in Neon PostgreSQL.
- **Frontend Integration**: Next.js frontend MUST attach JWT to all requests and display server responses accurately.
- **Coding & Documentation**: Clear, readable code with purposeful comments; environment variables MUST be documented in `.env.example`.

## Constraints

- **Feature Set**: Implementation MUST include: task listing, creation, updating, deletion, and toggle status.
- **Viewport Support**: Responsive frontend supporting desktop and mobile views.
- **Security Config**: JWT tokens configured with shared secret via `BETTER_AUTH_SECRET`.
- **Backend Stack**: FastAPI + SQLModel ORM.
- **Frontend Stack**: Next.js 16+ using App Router.
- **Workflow**: 100% of implementation MUST be generated via Spec-Driven Development (SDD) workflow.

## Success Criteria

- All API endpoints functional and secure against unauthorized access.
- User authentication flows (signup/signin) fully operational.
- Task operations correctly linked to authenticated users (no cross-user leakage).
- Responsive UI properly integrated with backend services.
- Documentation complete for setup, JWT integration, and task management.

## Governance

- This constitution supersedes all other project practices.
- Amendments require a version bump and rationale in the Sync Impact Report.
- All implementation tasks must verify compliance with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-01-09 | **Last Amended**: 2026-01-09
