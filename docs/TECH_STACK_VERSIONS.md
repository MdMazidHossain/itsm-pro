# Technology Stack & Versions - ITSM Pro

## 1. Important Note on Versions
The Master Prompt requested **Next.js 16**, which does not currently exist as a stable release. To ensure the application is buildable and production-ready, we are using the latest **stable** versions as of the development start date. All chosen versions are mutually compatible.

## 2. Frontend Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| Next.js | 14.x (App Router) | React framework for SSR/SSG |
| React | 18.x | UI library |
| TypeScript | 5.x | Static typing |
| Tailwind CSS | 3.x | Utility-first CSS |
| shadcn/ui | Latest | Accessible UI components |
| TanStack Query | 5.x | Server state management |
| Zod | 3.x | Form and data validation |
| React Hook Form | 7.x | Form handling |
| Recharts | 2.x | Charts and graphs |
| Lucide React | Latest | Icons |

## 3. Backend Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| NestJS | 10.x | Node.js backend framework |
| TypeScript | 5.x | Static typing |
| Prisma | 5.x | ORM for PostgreSQL |
| PostgreSQL | 15+ | Relational database |
| Redis | 7.x | In-memory cache and queues |
| BullMQ | 5.x | Background job processing |
| Passport.js | Latest | Authentication strategies |
| class-validator | Latest | DTO validation |
| class-transformer | Latest | Object transformation |
| bcrypt | Latest | Password hashing |
| Argon2 | Latest | Alternative password hashing |
| Nodemailer | Latest | Email sending |
| Socket.io | Latest | WebSocket communication |

## 4. Windows Agent Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| .NET | 8.0 (LTS) | Runtime for Windows Service |
| C# | 12.x | Programming language |
| System.Management | Latest | WMI queries for hardware info |
| Microsoft.Extensions.Hosting | 8.x | Worker Service hosting |
| Serilog | Latest | Structured logging |

## 5. Network Monitoring Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| net-snmp (Node.js) | Latest | SNMP v3 queries |
| node-ping | Latest | ICMP ping monitoring |
| routeros-api (Node.js) | Latest | MikroTik API integration |

## 6. Testing Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| Jest | 29.x | Unit testing |
| Supertest | 6.x | API integration testing |
| Playwright | 1.x | End-to-end testing |
| @testing-library/react | 14.x | Frontend component testing |

## 7. DevOps & Tooling
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| Turborepo | 2.x | Monorepo management |
| ESLint | 8.x | Code linting |
| Prettier | 3.x | Code formatting |
| Husky | Latest | Git hooks |
| Docker | 24.x | Containerization (for future deployment) |
| pnpm | 9.x | Package manager |

## 8. Environment Requirements
- **Node.js:** v20.x LTS (Minimum v18.x)
- **npm / pnpm / yarn:** Any modern version
- **PostgreSQL:** 15+
- **Redis:** 7+ (for background jobs)
- **.NET SDK:** 8.0 (for Windows Agent only)
- **Windows:** 10/11 (for Agent and local dev)
- **OS for Backend:** Linux/Windows/Mac (Docker recommended for production)

## 9. Compatibility Notes
- Next.js 14 is fully compatible with React 18 and Tailwind 3.
- NestJS 10 requires Node.js 18+.
- Prisma 5 supports PostgreSQL 15.
- .NET 8 is the current LTS release and is compatible with Windows 10/11.