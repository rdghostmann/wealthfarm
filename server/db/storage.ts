import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  User,
  Product,
  Order,
  PaymentTransaction,
  Task,
  TaskSubmission,
  Course,
  CourseEnrollment,
  SupportTicket,
  Notification,
  AuditLog,
  SiteContent
} from '../../src/types/index.js';

interface DatabaseSchema {
  users: (User & { passwordHash: string })[];
  products: Product[];
  orders: Order[];
  payments: PaymentTransaction[];
  tasks: Task[];
  submissions: TaskSubmission[];
  courses: Course[];
  enrollments: CourseEnrollment[];
  supportTickets: SupportTicket[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  siteContent: SiteContent[];
}

// Password hashing utility with PBKDF2 (SHA-512, 100k rounds)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(originalHash));
}

// Simple signed token generator (HMAC-SHA256)
const AUTH_SECRET = process.env.AUTH_SECRET || 'wealthfarm_secure_institution_key_2026_default';

export function createToken(payload: { id: string; email: string; role: string; name: string }): string {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64url');
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyToken(token: string): { id: string; email: string; role: 'USER' | 'ADMIN'; name: string } | null {
  if (!token || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

class StorageEngine {
  private db: DatabaseSchema = {
    users: [],
    products: [],
    orders: [],
    payments: [],
    tasks: [],
    submissions: [],
    courses: [],
    enrollments: [],
    supportTickets: [],
    notifications: [],
    auditLogs: [],
    siteContent: [],
  };

  private dataFilePath: string;

  constructor() {
    const dataDir = path.resolve(process.cwd(), '.data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.error('Failed to create data dir:', err);
      }
    }
    this.dataFilePath = path.join(dataDir, 'wealthfarm_db.json');
    this.loadFromDisk();
  }

  private loadFromDisk() {
    if (fs.existsSync(this.dataFilePath)) {
      try {
        const raw = fs.readFileSync(this.dataFilePath, 'utf8');
        this.db = JSON.parse(raw);
        console.log('[Storage] Loaded persisted database from disk.');
        return;
      } catch (e) {
        console.warn('[Storage] Could not parse disk DB, reseeding initial data:', e);
      }
    }
    this.seedInitialData();
    this.saveToDisk();
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.db, null, 2), 'utf8');
    } catch (e) {
      console.error('[Storage] Save error:', e);
    }
  }

  public seedInitialData(force = false) {
    if (this.db.users.length > 0 && !force) return;

    console.log('[Storage] Seeding WealthFarm institutional demonstration data...');

    // 1. Initial Users
    const adminPasswordHash = hashPassword('WealthFarm@2026');
    const userPasswordHash = hashPassword('WealthFarm@2026');

    const adminUser: User & { passwordHash: string } = {
      id: 'usr_admin_01',
      name: 'Dr. Babatunde Adeleke',
      email: 'admin@wealthfarm.ng',
      passwordHash: adminPasswordHash,
      phone: '+234 803 555 0192',
      role: 'ADMIN',
      company: 'WealthFarm Directorate',
      state: 'Lagos State',
      status: 'ACTIVE',
      createdAt: '2026-01-10T08:00:00Z',
    };

    const regularUser: User & { passwordHash: string } = {
      id: 'usr_member_01',
      name: 'Chidi Okonkwo',
      email: 'investor@wealthfarm.ng',
      passwordHash: userPasswordHash,
      phone: '+234 812 345 6789',
      role: 'USER',
      company: 'Apex Ventures & Commercial Holdings Ltd',
      state: 'Lagos State',
      status: 'ACTIVE',
      createdAt: '2026-02-14T10:30:00Z',
    };

    // 2. Approved Products (Commercial land, haulage & logistics, precision infrastructure, incubation)
    const initialProducts: Product[] = [
      {
        id: 'prd_land_ogun_01',
        slug: 'sagamu-commercial-farmland-50ha',
        name: 'Sagamu Commercial Land & Agricultural Estate (50 Hectares)',
        category: 'property',
        description: 'Prime, demarcated commercial title land along the Sagamu-Benin expressway economic corridor. Ideal for commercial agriculture, agribusiness ventures, or light industrial development, featuring perennial water resources and 33kV power grid proximity.',
        detailedSpecs: {
          'Total Area': '50 Hectares (Demarcated & Registered)',
          'Title Document': 'Governor’s Consent & Certificate of Occupancy (C of O)',
          'Topography & Soil': 'Level Terrain, Fertile Sandy-Loam Topsoil, High Load-Bearing Ground',
          'Access Road': 'Paved Dual Carriage Expressway within 800m',
          'Utilities': 'Perennial Water Stream + 2 Heavy Duty Industrial Boreholes',
          'Security & Zoning': 'Fenced Boundary with Designated Agro-Industrial Zoning'
        },
        location: 'Sagamu Economic Corridor, Ogun State',
        price: 35000000, // ₦35,000,000
        availability: 'AVAILABLE',
        featured: true,
        status: 'PUBLISHED',
        imageUrl: '/src/assets/images/product_agri_land_1792745952212.jpg',
        galleryImages: ['/src/assets/images/wealthfarm_hero_1792745951252.jpg'],
        createdAt: '2026-02-01T09:00:00Z',
        updatedAt: '2026-02-01T09:00:00Z',
      },
      {
        id: 'prd_truck_haulage_01',
        slug: 'mercedes-atego-15-ton-coldchain-truck',
        name: 'Mercedes-Benz Atego 15-Ton Interstate Logistics & Haulage Truck',
        category: 'vehicle',
        description: 'Vetted, road-certified commercial transport asset configured for interstate supply chains, agricultural produce transit, and FMCG cold distribution. Equipped with Carrier Supra refrigeration, satellite GPS telematics, and real-time digital temperature logging.',
        detailedSpecs: {
          'Engine & Powertrain': 'OM 904 LA Euro 4 Turbocharged Diesel, High Torque',
          'Payload Capacity': '15 Metric Tons (32 Standard Commercial Pallets)',
          'Refrigeration / Cargo': 'Carrier Supra 850 (-20°C to +15°C Range) Multi-Temp Capability',
          'Telematics & Security': 'Dual-SIM GPS, Fuel Level Probes, Remote Cold-Chain Alarms',
          'Fleet Audit': 'Pre-Inspected & Certified by WealthFarm Mechanical Directorate'
        },
        location: 'Ikeja Logistics Depot, Lagos State',
        price: 48500000, // ₦48,500,000
        availability: 'AVAILABLE',
        featured: true,
        status: 'PUBLISHED',
        imageUrl: '/src/assets/images/product_haulage_truck_1792745953456.jpg',
        createdAt: '2026-02-10T11:00:00Z',
        updatedAt: '2026-02-10T11:00:00Z',
      },
      {
        id: 'prd_greenhouse_modular_01',
        slug: 'commercial-precision-hydroponic-greenhouse-unit',
        name: 'Turnkey Commercial Precision Hydroponic Agribusiness Unit',
        category: 'infrastructure',
        description: 'Complete high-tunnel galvanized commercial production facility with UV-stabilized 200-micron poly cover, climate exhaust ventilation, and automated micro-drip fertigation manifold. Built for continuous high-value horticultural and agribusiness yields.',
        detailedSpecs: {
          'Dimensions & Footprint': '10m x 40m (400 sqm enclosed production area)',
          'Framing Structure': 'Hot-Dipped Galvanized RHS Steel Framing (10-Yr Warranty)',
          'Fertigation Automation': 'Micro-Drip Controller with Automated EC/pH Dosing Pumps',
          'Production Capacity': 'Up to 14.5 Tons of Premium High-Value Produce Annually',
          'Commissioning': 'Includes Onsite Ground Prep & 14-Day Technical Training'
        },
        location: 'Epe Agribusiness Cluster, Lagos State',
        price: 18500000, // ₦18,500,000
        availability: 'AVAILABLE',
        featured: true,
        status: 'PUBLISHED',
        imageUrl: '/src/assets/images/product_greenhouse_unit_1792745954044.jpg',
        createdAt: '2026-02-15T14:00:00Z',
        updatedAt: '2026-02-15T14:00:00Z',
      },
      {
        id: 'prd_land_ibadan_02',
        slug: 'ibadan-moniya-agro-industrial-plots-10ha',
        name: 'Moniya Enterprise Logistics & Warehousing Park (10 Hectares)',
        category: 'property',
        description: 'Strategically located within 4km of the Lagos-Ibadan Train Freight Depot. Designated industrial zoning for enterprise warehouses, bulk commodity storage, and distribution hubs with verified title documents and perimeter survey.',
        detailedSpecs: {
          'Total Area': '10 Hectares (Subdivisible into 2ha tracts)',
          'Title Status': 'Registered Gazette with Approved Master Survey Plan',
          'Topography': 'Dry Flat Ground, High Load-Bearing Structural Capacity',
          'Logistics Connectivity': 'Direct Arterial Access to Moniya Dry Port and Expressway'
        },
        location: 'Moniya Corridor, Ibadan, Oyo State',
        price: 22000000, // ₦22,000,000
        availability: 'RESERVED',
        featured: false,
        status: 'PUBLISHED',
        imageUrl: '/src/assets/images/product_agri_land_1792745952212.jpg',
        createdAt: '2026-02-18T16:00:00Z',
        updatedAt: '2026-02-18T16:00:00Z',
      }
    ];

    // 3. Educational Masterclasses & Programmes (Multi-disciplinary: Wealth Creation, Business, Agribusiness)
    const initialCourses: Course[] = [
      {
        id: 'crs_wealth_foundations_02',
        slug: 'commercial-asset-ownership-and-wealth-creation',
        title: 'Commercial Asset Ownership, Financial Modeling & Enterprise Growth',
        summary: 'Core institutional masterclass on building real, defensible wealth in Nigeria through physical commercial assets, legal due diligence, cash-flow structuring, and risk mitigation.',
        description: 'Designed for entrepreneurs, professionals, and prospective asset owners. Learn how to evaluate real estate titles, structure commercial asset purchases, manage business cash flow, protect assets from macroeconomic volatility, and develop scalable business ventures.',
        instructorName: 'Dr. Folashade Adeleke & Engr. Tunde Coker',
        instructorTitle: 'Asset Valuation Lead & Commercial Enterprise Advisor',
        coverImage: '/src/assets/images/course_agribusiness_1792745953830.jpg',
        price: 75000, // ₦75,000
        status: 'PUBLISHED',
        lessonsCount: 5,
        totalDurationHours: 4.0,
        lessons: [
          {
            id: 'lsn_wf_1',
            title: 'Module 1: Principles of Real Wealth Creation & Asset Classes in Nigeria',
            description: 'Distinguishing productive assets from speculative schemes. Understanding commercial real estate, logistics fleets, enterprise infrastructure, and cash-flow generators.',
            durationMinutes: 45,
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: true,
          },
          {
            id: 'lsn_wf_2',
            title: 'Module 2: Legal Title Due Diligence, Conveyance & Cadastral Searches',
            description: 'Forensic property search protocols: verifying Certificates of Occupancy (C of O), Governor’s Consent, Gazette Excisions, and avoiding communal disputes.',
            durationMinutes: 50,
            order: 2,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          },
          {
            id: 'lsn_wf_3',
            title: 'Module 3: Enterprise Financial Modeling & Capital Structure',
            description: 'Building practical financial models, cash-flow projections, working capital management, and cost-of-capital benchmarking in emerging markets.',
            durationMinutes: 50,
            order: 3,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          },
          {
            id: 'lsn_wf_4',
            title: 'Module 4: Logistics, Fleet & Supply Chain Asset Economics',
            description: 'Evaluating commercial haulage economics, maintenance reserves, telematics, and structured commercial freight contracts.',
            durationMinutes: 45,
            order: 4,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          },
          {
            id: 'lsn_wf_5',
            title: 'Module 5: Digital Opportunities & Scaling Modern Business Ventures',
            description: 'Leveraging digital platforms, inventory software, and automated billing to scale regional Nigerian businesses into national brands.',
            durationMinutes: 50,
            order: 5,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          }
        ],
        createdAt: '2026-02-05T10:00:00Z',
      },
      {
        id: 'crs_agribusiness_exec_01',
        slug: 'commercial-agribusiness-management-masterclass',
        title: 'Executive Agribusiness Management & Commercial Farm Economics',
        summary: 'Specialized executive masterclass covering agro-ecological economics, precision soil optimization, mechanization procurement, and corporate offtake contracts.',
        description: 'Led by seasoned agronomists and commercial agricultural financiers, teaching practical operational frameworks for profitable crop production and agro-processing in Nigeria without speculative guesswork.',
        instructorName: 'Dr. Folashade Adeleke, Ph.D.',
        instructorTitle: 'Principal Agronomist & Former Director of Crop Strategy',
        coverImage: '/src/assets/images/product_greenhouse_unit_1792745954044.jpg',
        price: 85000, // ₦85,000
        status: 'PUBLISHED',
        lessonsCount: 6,
        totalDurationHours: 4.5,
        lessons: [
          {
            id: 'lsn_1',
            title: 'Module 1: Agro-Ecological Zones & Commercial Crop Viability in Nigeria',
            description: 'Understanding rainfall distributions, soil horizons, and climatic suitability across the South-West, Middle Belt, and Northern economic corridors.',
            durationMinutes: 45,
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: true,
          },
          {
            id: 'lsn_2',
            title: 'Module 2: Land Due Diligence, Title Verification, and Community Engagement',
            description: 'Crucial legal steps to verify C of O, Gazette, Excision, Survey plans, and building lasting relations with host communities in agricultural zones.',
            durationMinutes: 40,
            order: 2,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          },
          {
            id: 'lsn_3',
            title: 'Module 3: Precision Irrigation, Soil Remediation, and Fertilizer Optimization',
            description: 'Calculating drip emitter spacing, soil organic amendments, micro-nutrients dosing, and water borehole volume calculations.',
            durationMinutes: 50,
            order: 3,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          },
          {
            id: 'lsn_4',
            title: 'Module 4: Mechanization & Agricultural Machinery Fleet Management',
            description: 'Tractor implement selection (disc ploughs, harrows, ridgers, seed drills) and diesel consumption benchmarking.',
            durationMinutes: 45,
            order: 4,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          },
          {
            id: 'lsn_5',
            title: 'Module 5: Post-Harvest Loss Mitigation & Cold-Chain Transit Protocols',
            description: 'Proper harvesting maturity indices, sorting sheds, evaporative pre-cooling, and transit reefer set-points.',
            durationMinutes: 45,
            order: 5,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          },
          {
            id: 'lsn_6',
            title: 'Module 6: Enterprise Financial Modeling & Market Offtaker Contracts',
            description: 'Drafting structured forward contracts with corporate food processors, FMCG buyers, and export off-takers.',
            durationMinutes: 45,
            order: 6,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            isPreviewFree: false,
          }
        ],
        createdAt: '2026-02-12T12:00:00Z',
      }
    ];

    // 4. Operational & Business Tasks (Field surveys, logistics audits, market feasibility)
    const initialTasks: Task[] = [
      {
        id: 'tsk_01',
        slug: 'sagamu-farmland-soil-sampling-report',
        title: 'Commercial Land Cadastral Mapping & Topsoil Verification Log',
        category: 'Asset Inspection & Property Survey',
        description: 'Conduct standardized physical boundary and soil consistency verification on Sector 3 (Coordinates: 6.8402°N, 3.6514°E). Validate boundary beacons and record 10 GPS waypoints across the demarcated acreage.',
        instructions: 'Follow the WealthFarm Field Manual Protocol: 1) Record GPS coordinates for all boundary markers; 2) Take geotagged photo of land condition; 3) Complete the standard physical due diligence checklist.',
        requirements: [
          'Submit PDF or Word document containing geotagged field photos',
          'Include GPS waypoints table with date/timestamp',
          'Document road access clearance and boundary perimeter status'
        ],
        submissionType: 'ALL',
        deadline: '2026-11-15T18:00:00Z',
        status: 'PUBLISHED',
        priority: 'HIGH',
        createdAt: '2026-10-15T09:00:00Z',
        submissionsCount: 1,
      },
      {
        id: 'tsk_02',
        slug: 'hauler-truck-pre-trip-telematics-audit',
        title: 'Fleet Vehicle WF-TRK-04 Pre-Departure Mechanical & Safety Checklist',
        category: 'Logistics & Fleet Operations',
        description: 'Perform a comprehensive 42-point pre-trip roadworthiness inspection on the Mercedes Atego 15-ton logistics unit prior to scheduled interstate transit.',
        instructions: 'Check tyre tread depths (>3mm), oil pressure, brake air pressure reservoir, refrigeration compressor oil level, and digital temperature data logger battery backup.',
        requirements: [
          'Complete verified mechanical audit checklist',
          'Provide photographic proof of odometer, temperature setpoint, and safety gear'
        ],
        submissionType: 'FILE',
        deadline: '2026-11-20T12:00:00Z',
        status: 'PUBLISHED',
        priority: 'NORMAL',
        createdAt: '2026-10-18T14:30:00Z',
        submissionsCount: 0,
      },
      {
        id: 'tsk_03',
        slug: 'greenhouse-microclimate-calibration-audit',
        title: 'Enterprise Market Feasibility & Offtaker Demand Assessment',
        category: 'Business Development & Research',
        description: 'Conduct a regional commercial demand audit for high-value agricultural and processed consumer goods across selected commercial retail and wholesale markets in Lagos/Ogun state.',
        instructions: 'Survey 5 commercial wholesale distribution points. Record prevailing wholesale pricing, weekly volume turnover, payment terms, and packaging requirements.',
        requirements: [
          'Submit market survey comparison table (wholesale prices & demand volumes)',
          'Provide contact details of 3 verified commercial procurement managers interviewed'
        ],
        submissionType: 'TEXT',
        deadline: '2026-11-30T17:00:00Z',
        status: 'PUBLISHED',
        priority: 'NORMAL',
        createdAt: '2026-10-20T10:00:00Z',
        submissionsCount: 0,
      }
    ];

    // 5. Initial Submission
    const initialSubmissions: TaskSubmission[] = [
      {
        id: 'sub_01',
        taskId: 'tsk_01',
        taskTitle: 'Commercial Land Cadastral Mapping & Topsoil Verification Log',
        userId: 'usr_member_01',
        userName: 'Chidi Okonkwo',
        userEmail: 'investor@wealthfarm.ng',
        submissionType: 'ALL',
        contentText: 'Completed field survey across Sector 3. Verified 8 boundary beacons with handheld GPS unit. Topsoil demonstrates rich humic characteristics with clear road access.',
        evidenceUrl: 'https://docs.google.com/document/d/sample-asset-survey-report',
        fileName: 'Sector_3_Boundary_Audit_Report.pdf',
        fileSize: '2.4 MB',
        status: 'UNDER_REVIEW',
        reviewerFeedback: 'Initial field documentation received. Survey department cross-referencing with State cadastral records.',
        reviewedBy: 'Dr. Babatunde Adeleke',
        reviewedAt: '2026-10-21T11:20:00Z',
        createdAt: '2026-10-20T16:45:00Z',
        updatedAt: '2026-10-21T11:20:00Z',
      }
    ];

    // 6. Initial Orders
    const initialOrders: Order[] = [
      {
        id: 'ord_1001',
        orderNumber: 'WF-ORD-2026-1001',
        userId: 'usr_member_01',
        userName: 'Chidi Okonkwo',
        userEmail: 'investor@wealthfarm.ng',
        items: [
          {
            productId: 'prd_greenhouse_modular_01',
            name: 'Turnkey Commercial Precision Hydroponic Agribusiness Unit',
            category: 'infrastructure',
            price: 18500000,
            quantity: 1,
          }
        ],
        totalAmount: 18500000,
        status: 'PROCESSING',
        paymentRef: 'pstk_ref_9921820491',
        notes: 'Commercial asset allocation approved. Technical commissioning team scheduled for Epe sector.',
        createdAt: '2026-10-18T13:20:00Z',
        updatedAt: '2026-10-18T13:25:00Z',
      }
    ];

    // 7. Initial Payments
    const initialPayments: PaymentTransaction[] = [
      {
        id: 'pay_1001',
        reference: 'pstk_ref_9921820491',
        orderId: 'ord_1001',
        userId: 'usr_member_01',
        userEmail: 'investor@wealthfarm.ng',
        amount: 18500000,
        currency: 'NGN',
        channel: 'bank_transfer',
        status: 'SUCCESS',
        gateway: 'PAYSTACK',
        paidAt: '2026-10-18T13:25:00Z',
        createdAt: '2026-10-18T13:20:00Z',
      }
    ];

    // 8. Initial Course Enrollment
    const initialEnrollments: CourseEnrollment[] = [
      {
        id: 'enr_01',
        courseId: 'crs_wealth_foundations_02',
        userId: 'usr_member_01',
        enrolledAt: '2026-10-19T08:15:00Z',
        completedLessonIds: ['lsn_wf_1'],
        progressPercent: 20,
        status: 'ACTIVE',
      }
    ];

    // 9. Initial Support Tickets
    const initialTickets: SupportTicket[] = [
      {
        id: 'tkt_101',
        ticketNumber: 'WF-SUP-101',
        userId: 'usr_member_01',
        userName: 'Chidi Okonkwo',
        userEmail: 'investor@wealthfarm.ng',
        subject: 'Title deed delivery schedule for Commercial Enterprise Asset Cluster',
        category: 'ASSET',
        priority: 'MEDIUM',
        status: 'IN_PROGRESS',
        assignedStaff: 'Dr. Babatunde Adeleke',
        messages: [
          {
            id: 'msg_01',
            senderId: 'usr_member_01',
            senderName: 'Chidi Okonkwo',
            senderRole: 'USER',
            message: 'Good morning Directorate team. We would like to confirm the physical signing and deed handover schedule for our commercial asset allocation at the Epe enterprise site.',
            createdAt: '2026-10-21T09:30:00Z'
          },
          {
            id: 'msg_02',
            senderId: 'usr_admin_01',
            senderName: 'Dr. Babatunde Adeleke',
            senderRole: 'ADMIN',
            message: 'Good morning Mr. Okonkwo. Your allocation deed has been executed by our Legal Directorate. The verified file and survey coordinates are ready for pickup at our Victoria Island Corporate Office, or we can dispatch via insured courier.',
            createdAt: '2026-10-21T11:05:00Z'
          }
        ],
        createdAt: '2026-10-21T09:30:00Z',
        updatedAt: '2026-10-21T11:05:00Z',
      }
    ];

    // 10. Initial Notifications
    const initialNotifications: Notification[] = [
      {
        id: 'notif_01',
        userId: 'usr_member_01',
        title: 'Asset Order Approved & Processing',
        message: 'Your purchase order WF-ORD-2026-1001 for the Commercial Hydroponic Agribusiness Unit has been verified and allocated.',
        type: 'ORDER',
        read: false,
        link: '/dashboard/orders',
        createdAt: '2026-10-18T13:26:00Z',
      },
      {
        id: 'notif_02',
        userId: 'usr_member_01',
        title: 'Task Submission Received for Review',
        message: 'Your boundary due diligence report for Sector 3 is currently under technical review by our inspection team.',
        type: 'TASK',
        read: true,
        link: '/dashboard/tasks',
        createdAt: '2026-10-20T16:45:00Z',
      }
    ];

    // 11. Initial Audit Logs
    const initialAuditLogs: AuditLog[] = [
      {
        id: 'aud_01',
        action: 'ORDER_STATUS_UPDATE',
        actorId: 'usr_admin_01',
        actorEmail: 'admin@wealthfarm.ng',
        actorRole: 'ADMIN',
        entity: 'Order',
        entityId: 'ord_1001',
        details: 'Updated status from PENDING_PAYMENT to PROCESSING following verified Paystack ref pstk_ref_9921820491',
        timestamp: '2026-10-18T13:26:00Z',
      },
      {
        id: 'aud_02',
        action: 'TASK_PUBLISHED',
        actorId: 'usr_admin_01',
        actorEmail: 'admin@wealthfarm.ng',
        actorRole: 'ADMIN',
        entity: 'Task',
        entityId: 'tsk_03',
        details: 'Published Enterprise Market Feasibility & Offtaker Demand Assessment to operational tasks register.',
        timestamp: '2026-10-20T10:00:00Z',
      }
    ];

    // 12. Site Content
    const initialSiteContent: SiteContent[] = [
      {
        key: 'announcement',
        headline: 'Q4 2026 Commercial Asset Allocations & Executive Academy Enrollments Now Active',
        noticeText: 'All commercial real estate, logistics vehicles, and business assets undergo forensic title due diligence and inspection audits prior to publication.',
        updatedAt: '2026-10-01T08:00:00Z',
      }
    ];

    this.db = {
      users: [adminUser, regularUser],
      products: initialProducts,
      orders: initialOrders,
      payments: initialPayments,
      tasks: initialTasks,
      submissions: initialSubmissions,
      courses: initialCourses,
      enrollments: initialEnrollments,
      supportTickets: initialTickets,
      notifications: initialNotifications,
      auditLogs: initialAuditLogs,
      siteContent: initialSiteContent,
    };

    console.log('[Storage] Initial demonstration database initialized.');
  }

  // --- Users ---
  public findUserByEmail(email: string) {
    return this.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string) {
    const user = this.db.users.find((u) => u.id === id);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  public createUser(userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    company?: string;
    state?: string;
  }): User {
    const existing = this.findUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User & { passwordHash: string } = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      passwordHash: hashPassword(userData.password),
      phone: userData.phone?.trim() || '',
      company: userData.company?.trim() || '',
      state: userData.state?.trim() || 'Lagos State',
      role: 'USER', // Users can NEVER register themselves as ADMIN
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    this.db.users.push(newUser);
    this.saveToDisk();

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  }

  public getAllUsers(): User[] {
    return this.db.users.map(({ passwordHash: _, ...u }) => u);
  }

  public updateUserRole(userId: string, newRole: 'USER' | 'ADMIN', actor: { id: string; email: string; role: 'USER' | 'ADMIN' }) {
    if (actor.role !== 'ADMIN') throw new Error('Unauthorized');
    const user = this.db.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    user.role = newRole;
    this.addAuditLog({
      action: 'USER_ROLE_UPDATED',
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      entity: 'User',
      entityId: userId,
      details: `Role changed to ${newRole}`
    });
    this.saveToDisk();
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  // --- Products ---
  public getProducts(filters?: {
    category?: string;
    availability?: string;
    status?: string;
    search?: string;
  }): Product[] {
    let list = [...this.db.products];
    if (filters?.category && filters.category !== 'all') {
      list = list.filter((p) => p.category === filters.category);
    }
    if (filters?.availability && filters.availability !== 'all') {
      list = list.filter((p) => p.availability === filters.availability);
    }
    if (filters?.status) {
      list = list.filter((p) => p.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getProductBySlug(slug: string): Product | null {
    return this.db.products.find((p) => p.slug === slug) || null;
  }

  public getProductById(id: string): Product | null {
    return this.db.products.find((p) => p.id === id) || null;
  }

  public createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, actor: { id: string; email: string; role: 'USER' | 'ADMIN' }): Product {
    if (actor.role !== 'ADMIN') throw new Error('Only administrators can create products');
    const newProduct: Product = {
      ...data,
      id: `prd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.products.unshift(newProduct);
    this.addAuditLog({
      action: 'PRODUCT_CREATED',
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      entity: 'Product',
      entityId: newProduct.id,
      details: `Created product: ${newProduct.name} (${newProduct.category})`
    });
    this.saveToDisk();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>, actor: { id: string; email: string; role: 'USER' | 'ADMIN' }): Product {
    if (actor.role !== 'ADMIN') throw new Error('Unauthorized');
    const idx = this.db.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Product not found');
    this.db.products[idx] = {
      ...this.db.products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.addAuditLog({
      action: 'PRODUCT_UPDATED',
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      entity: 'Product',
      entityId: id,
      details: `Updated fields: ${Object.keys(updates).join(', ')}`
    });
    this.saveToDisk();
    return this.db.products[idx];
  }

  // --- Orders & Authoritative Price Calculation ---
  public createOrder(userId: string, productId: string, quantity = 1, notes?: string): Order {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');
    const product = this.getProductById(productId);
    if (!product) throw new Error('Product not found');
    if (product.availability === 'SOLD_OUT') {
      throw new Error('This asset is currently sold out.');
    }

    // Authoritative server-side price calculation
    const totalAmount = product.price * quantity;
    const orderNumber = `WF-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      userId,
      userName: user.name,
      userEmail: user.email,
      items: [
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          quantity,
        }
      ],
      totalAmount,
      status: 'PENDING_PAYMENT',
      notes: notes?.trim() || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.orders.unshift(newOrder);

    // Notify user
    this.addNotification({
      userId,
      title: 'Order Created',
      message: `Your order ${orderNumber} for ${product.name} is awaiting payment verification.`,
      type: 'ORDER',
      link: '/dashboard/orders'
    });

    this.saveToDisk();
    return newOrder;
  }

  public getUserOrders(userId: string): Order[] {
    return this.db.orders.filter((o) => o.userId === userId);
  }

  public getAllOrders(): Order[] {
    return this.db.orders;
  }

  public getOrderById(id: string): Order | null {
    return this.db.orders.find((o) => o.id === id) || null;
  }

  public updateOrderStatus(orderId: string, status: Order['status'], actor: { id: string; email: string; role: 'USER' | 'ADMIN' }): Order {
    if (actor.role !== 'ADMIN') throw new Error('Unauthorized');
    const order = this.getOrderById(orderId);
    if (!order) throw new Error('Order not found');
    order.status = status;
    order.updatedAt = new Date().toISOString();

    this.addAuditLog({
      action: 'ORDER_STATUS_UPDATED',
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      entity: 'Order',
      entityId: orderId,
      details: `Status set to ${status}`
    });

    this.addNotification({
      userId: order.userId,
      title: `Order Status: ${status}`,
      message: `Your order ${order.orderNumber} has been updated to ${status}.`,
      type: 'ORDER',
      link: '/dashboard/orders'
    });

    this.saveToDisk();
    return order;
  }

  // --- Payments & Paystack ---
  public recordPayment(paymentData: Omit<PaymentTransaction, 'id' | 'createdAt'>): PaymentTransaction {
    // Check idempotency by reference
    const existing = this.db.payments.find(p => p.reference === paymentData.reference);
    if (existing) {
      if (paymentData.status === 'SUCCESS' && existing.status !== 'SUCCESS') {
        existing.status = 'SUCCESS';
        existing.paidAt = new Date().toISOString();
        if (existing.orderId) {
          const ord = this.getOrderById(existing.orderId);
          if (ord) ord.status = 'PAID';
        }
        this.saveToDisk();
      }
      return existing;
    }

    const newPayment: PaymentTransaction = {
      ...paymentData,
      id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };

    this.db.payments.unshift(newPayment);

    // Update associated order if marked success
    if (newPayment.status === 'SUCCESS' && newPayment.orderId) {
      const ord = this.getOrderById(newPayment.orderId);
      if (ord) {
        ord.status = 'PAID';
        ord.paymentRef = newPayment.reference;
      }
    }

    this.saveToDisk();
    return newPayment;
  }

  public getPaymentsByUser(userId: string): PaymentTransaction[] {
    return this.db.payments.filter(p => p.userId === userId);
  }

  public getAllPayments(): PaymentTransaction[] {
    return this.db.payments;
  }

  // --- Tasks & Submissions ---
  public getTasks(role?: 'USER' | 'ADMIN'): Task[] {
    if (role === 'ADMIN') return this.db.tasks;
    return this.db.tasks.filter((t) => t.status === 'PUBLISHED');
  }

  public getTaskById(id: string): Task | null {
    return this.db.tasks.find((t) => t.id === id) || null;
  }

  public createTask(data: Omit<Task, 'id' | 'createdAt' | 'submissionsCount'>, actor: { id: string; email: string; role: 'USER' | 'ADMIN' }): Task {
    if (actor.role !== 'ADMIN') throw new Error('Unauthorized');
    const newTask: Task = {
      ...data,
      id: `tsk_${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissionsCount: 0,
    };
    this.db.tasks.unshift(newTask);
    this.addAuditLog({
      action: 'TASK_CREATED',
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      entity: 'Task',
      entityId: newTask.id,
      details: `Created task: ${newTask.title}`
    });
    this.saveToDisk();
    return newTask;
  }

  public submitTaskEvidence(data: {
    taskId: string;
    userId: string;
    submissionType: Task['submissionType'];
    contentText?: string;
    evidenceUrl?: string;
    fileName?: string;
    fileSize?: string;
  }): TaskSubmission {
    const task = this.getTaskById(data.taskId);
    if (!task) throw new Error('Task not found');
    const user = this.findUserById(data.userId);
    if (!user) throw new Error('User not found');

    const newSub: TaskSubmission = {
      id: `sub_${Date.now()}`,
      taskId: data.taskId,
      taskTitle: task.title,
      userId: data.userId,
      userName: user.name,
      userEmail: user.email,
      submissionType: data.submissionType,
      contentText: data.contentText?.trim() || '',
      evidenceUrl: data.evidenceUrl?.trim() || '',
      fileName: data.fileName || '',
      fileSize: data.fileSize || '',
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.submissions.unshift(newSub);
    task.submissionsCount = (task.submissionsCount || 0) + 1;

    this.addNotification({
      userId: data.userId,
      title: 'Task Submission Received',
      message: `Evidence for "${task.title}" has been submitted and queued for review.`,
      type: 'TASK',
      link: '/dashboard/tasks'
    });

    this.saveToDisk();
    return newSub;
  }

  public getSubmissionsByUser(userId: string): TaskSubmission[] {
    return this.db.submissions.filter((s) => s.userId === userId);
  }

  public getAllSubmissions(): TaskSubmission[] {
    return this.db.submissions;
  }

  public reviewSubmission(
    submissionId: string,
    status: TaskSubmission['status'],
    feedback: string,
    actor: { id: string; email: string; name: string; role: 'USER' | 'ADMIN' }
  ): TaskSubmission {
    if (actor.role !== 'ADMIN') throw new Error('Unauthorized');
    const sub = this.db.submissions.find((s) => s.id === submissionId);
    if (!sub) throw new Error('Submission not found');
    sub.status = status;
    sub.reviewerFeedback = feedback.trim();
    sub.reviewedBy = actor.name;
    sub.reviewedAt = new Date().toISOString();
    sub.updatedAt = new Date().toISOString();

    this.addNotification({
      userId: sub.userId,
      title: `Task Submission Reviewed: ${status}`,
      message: `Your evidence for "${sub.taskTitle}" has been marked as ${status}. Review notes: "${feedback.slice(0, 80)}..."`,
      type: 'TASK',
      link: '/dashboard/tasks'
    });

    this.addAuditLog({
      action: 'TASK_SUBMISSION_REVIEWED',
      actorId: actor.id,
      actorEmail: actor.email,
      actorRole: actor.role,
      entity: 'TaskSubmission',
      entityId: submissionId,
      details: `Marked as ${status}`
    });

    this.saveToDisk();
    return sub;
  }

  // --- Courses & Learning ---
  public getCourses(): Course[] {
    return this.db.courses;
  }

  public getCourseById(id: string): Course | null {
    return this.db.courses.find((c) => c.id === id || c.slug === id) || null;
  }

  public enrollInCourse(userId: string, courseId: string): CourseEnrollment {
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('Course not found');
    const existing = this.db.enrollments.find((e) => e.userId === userId && e.courseId === course.id);
    if (existing) return existing;

    const newEnrollment: CourseEnrollment = {
      id: `enr_${Date.now()}`,
      courseId: course.id,
      userId,
      enrolledAt: new Date().toISOString(),
      completedLessonIds: [],
      progressPercent: 0,
      status: 'ACTIVE',
    };

    this.db.enrollments.push(newEnrollment);

    this.addNotification({
      userId,
      title: 'Course Enrolled Successfully',
      message: `You now have full access to ${course.title}. Start learning today!`,
      type: 'SUCCESS',
      link: `/dashboard/learning/${course.id}`
    });

    this.saveToDisk();
    return newEnrollment;
  }

  public getUserEnrollments(userId: string): CourseEnrollment[] {
    return this.db.enrollments.filter((e) => e.userId === userId);
  }

  public updateLessonProgress(userId: string, courseId: string, lessonId: string, completed: boolean): CourseEnrollment {
    const enrollment = this.db.enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (!enrollment) throw new Error('Enrollment not found');

    const course = this.getCourseById(courseId);
    const totalLessons = course?.lessons.length || 1;

    let completedSet = new Set(enrollment.completedLessonIds);
    if (completed) {
      completedSet.add(lessonId);
    } else {
      completedSet.delete(lessonId);
    }

    enrollment.completedLessonIds = Array.from(completedSet);
    enrollment.progressPercent = Math.round((enrollment.completedLessonIds.length / totalLessons) * 100);
    if (enrollment.progressPercent >= 100) {
      enrollment.status = 'COMPLETED';
    }

    this.saveToDisk();
    return enrollment;
  }

  // --- Support Tickets ---
  public createSupportTicket(data: {
    userId: string;
    subject: string;
    category: SupportTicket['category'];
    priority: SupportTicket['priority'];
    initialMessage: string;
  }): SupportTicket {
    const user = this.findUserById(data.userId);
    if (!user) throw new Error('User not found');

    const ticketNumber = `WF-SUP-${Math.floor(100 + Math.random() * 900)}`;
    const newTicket: SupportTicket = {
      id: `tkt_${Date.now()}`,
      ticketNumber,
      userId: data.userId,
      userName: user.name,
      userEmail: user.email,
      subject: data.subject.trim(),
      category: data.category,
      priority: data.priority,
      status: 'OPEN',
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderId: data.userId,
          senderName: user.name,
          senderRole: user.role,
          message: data.initialMessage.trim(),
          createdAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.supportTickets.unshift(newTicket);
    this.saveToDisk();
    return newTicket;
  }

  public addTicketMessage(ticketId: string, sender: { id: string; name: string; role: 'USER' | 'ADMIN' }, message: string): SupportTicket {
    const ticket = this.db.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');

    // Only requester or admin can reply
    if (sender.role !== 'ADMIN' && ticket.userId !== sender.id) {
      throw new Error('Unauthorized');
    }

    ticket.messages.push({
      id: `msg_${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    });

    if (sender.role === 'ADMIN' && ticket.status === 'OPEN') {
      ticket.status = 'IN_PROGRESS';
      ticket.assignedStaff = sender.name;
    }

    ticket.updatedAt = new Date().toISOString();

    // If admin replied, notify user
    if (sender.role === 'ADMIN') {
      this.addNotification({
        userId: ticket.userId,
        title: 'New Support Reply',
        message: `Staff member ${sender.name} replied to ticket ${ticket.ticketNumber}`,
        type: 'INFO',
        link: `/dashboard/support/${ticket.id}`
      });
    }

    this.saveToDisk();
    return ticket;
  }

  public updateTicketStatus(ticketId: string, status: SupportTicket['status'], actor: { id: string; role: 'USER' | 'ADMIN' }): SupportTicket {
    if (actor.role !== 'ADMIN') throw new Error('Unauthorized');
    const ticket = this.db.supportTickets.find((t) => t.id === ticketId);
    if (!ticket) throw new Error('Ticket not found');
    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    this.saveToDisk();
    return ticket;
  }

  public getUserTickets(userId: string): SupportTicket[] {
    return this.db.supportTickets.filter((t) => t.userId === userId);
  }

  public getAllTickets(): SupportTicket[] {
    return this.db.supportTickets;
  }

  public getTicketById(id: string): SupportTicket | null {
    return this.db.supportTickets.find((t) => t.id === id) || null;
  }

  // --- Notifications ---
  public addNotification(data: Omit<Notification, 'id' | 'createdAt' | 'read'> & { read?: boolean }): Notification {
    const notif: Notification = {
      ...data,
      id: `ntf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      read: data.read || false,
      createdAt: new Date().toISOString(),
    };
    this.db.notifications.unshift(notif);
    this.saveToDisk();
    return notif;
  }

  public getUserNotifications(userId: string): Notification[] {
    return this.db.notifications.filter((n) => n.userId === userId);
  }

  public markNotificationAsRead(notifId: string, userId: string) {
    const notif = this.db.notifications.find((n) => n.id === notifId && n.userId === userId);
    if (notif) {
      notif.read = true;
      this.saveToDisk();
    }
  }

  // --- Audit Logs ---
  public addAuditLog(data: Omit<AuditLog, 'id' | 'timestamp'>) {
    const log: AuditLog = {
      ...data,
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.db.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.db.auditLogs.length > 200) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 200);
    }
    this.saveToDisk();
  }

  public getAuditLogs(): AuditLog[] {
    return this.db.auditLogs;
  }

  // --- Site Content ---
  public getSiteContent(): SiteContent[] {
    return this.db.siteContent;
  }

  public updateSiteContent(key: string, headline: string, noticeText: string): SiteContent {
    let item = this.db.siteContent.find((s) => s.key === key);
    if (!item) {
      item = { key, headline, noticeText, updatedAt: new Date().toISOString() };
      this.db.siteContent.push(item);
    } else {
      item.headline = headline;
      item.noticeText = noticeText;
      item.updatedAt = new Date().toISOString();
    }
    this.saveToDisk();
    return item;
  }

  // --- Metrics ---
  public getAdminMetrics() {
    const totalUsers = this.db.users.length;
    const publishedProducts = this.db.products.filter(p => p.status === 'PUBLISHED').length;
    const totalOrders = this.db.orders.length;
    const verifiedPayments = this.db.payments
      .filter(p => p.status === 'SUCCESS')
      .reduce((sum, p) => sum + p.amount, 0);
    const tasksAwaitingReview = this.db.submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'UNDER_REVIEW').length;
    const courseEnrollments = this.db.enrollments.length;
    const openTickets = this.db.supportTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

    return {
      totalUsers,
      publishedProducts,
      totalOrders,
      verifiedPayments,
      tasksAwaitingReview,
      courseEnrollments,
      openTickets,
    };
  }
}

export const storage = new StorageEngine();
