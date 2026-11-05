# Deployment Architecture - ITSM Pro

## 1. Overview
This document outlines how ITSM Pro will be deployed to production. **Note:** Deployment is handled by the Product Owner after local development is complete. This is a reference architecture.

## 2. Recommended Production Architecture

```text
[ Internet ]
     |
     v
[ Cloudflare / Nginx (Reverse Proxy + SSL + WAF) ]
     |
     +-------------------------+
     |                         |
     v                         v
[ Next.js Frontend ]     [ NestJS Backend API ]
 (Vercel / Docker)        (Docker Container)
                               |
           +-------------------+-------------------+
           |                   |                   |
           v                   v                   v
     [ PostgreSQL ]        [ Redis ]          [ S3 Storage ]
     (Managed DB)          (Managed Cache)    (File Uploads)
                               |
                               v
                       [ BullMQ Worker ]
                       (Background Jobs)