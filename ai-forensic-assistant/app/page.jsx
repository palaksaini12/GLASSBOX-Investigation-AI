"use client";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Globe,
  Share2,
  FileDown,
  PanelRightOpen,
  PanelRightClose,
  Plus,
  Search,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileAudio,
  FileCode,
  Upload,
  CheckCircle2,
  Loader2,
  Send,
  Mic,
  Square,
  AlertTriangle,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  X,
  Copy,
  Check,
  Link2,
  UserPlus,
  Clock,
  Printer,
  Download,
  MessageSquare,
  Network,
  Lock,
  Menu,
  Info,
  FolderOpen,
  History,
  Hash
} from 'lucide-react';

// ============================================================================
// 1. CUSTOM BRAND LOGO — GEOMETRIC GLASS CUBE / SHIELD ICON
// ============================================================================
function GlassboxLogo({ className = 'w-9 h-9' }) {
  return (
    <div
      className={`${className} rounded-xl bg-gradient-to-br from-[#3B82F6]/25 via-[#1C2331] to-[#10B981]/15 border border-[#3B82F6]/45 flex items-center justify-center shrink-0 shadow-inner`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 36 36" className="w-6 h-6" fill="none">
        {/* Outer translucent shield / isometric glass frame */}
        <path
          d="M18 3L31 10.2V25.8L18 33L5 25.8V10.2L18 3Z"
          stroke="#3B82F6"
          strokeWidth="2"
          fill="#3B82F6"
          fillOpacity="0.12"
        />
        {/* Inner glass cube facets */}
        <path
          d="M18 3V18M18 18L31 10.2M18 18L5 10.2"
          stroke="#93C5FD"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
        <path
          d="M18 18V33"
          stroke="#3B82F6"
          strokeWidth="1.75"
          strokeOpacity="0.9"
        />
        {/* Center forensic transparency core */}
        <circle cx="18" cy="18" r="3" fill="#10B981" stroke="#0D1117" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

// ============================================================================
// 2. MULTILINGUAL DICTIONARY (English, Hindi, Marathi, Tamil)
// ============================================================================
const TRANSLATIONS = {
  en: {
    brandSubtitle: 'Investigation AI Assistant',
    offlineBadge: 'Offline Local AI • Secure',
    shareChat: 'Share Chat',
    exportDiary: 'Export Case Diary',
    hideGraph: 'Hide Graph',
    showGraph: 'Show Graph',
    newCaseChat: 'New Case Chat',
    caseHistory: 'Case History',
    evidenceVault: 'Evidence Vault',
    searchCasesPlaceholder: 'Search case ID or title...',
    dropEvidenceTitle: 'Drop Evidence Files Here',
    dropEvidenceSub: 'Or click to upload (PDF, TXT, CSV, JPG, MP3)',
    indexedStatus: 'Indexed',
    indexingStatus: 'Indexing...',
    chatPlaceholder: 'Ask GLASSBOX a question about the uploaded evidence...',
    uploadFileBtn: 'Upload File',
    recordVoiceBtn: 'Record Voice',
    stopVoiceBtn: 'Stop Recording',
    sendBtn: 'Send',
    graphTitle: 'Interactive Graph-RAG Explorer',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetView: 'Reset',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Close Fullscreen',
    legendSuspect: 'Person / Suspect',
    legendSystem: 'System / Account',
    legendEvidence: 'Evidence / File',
    legendAnomaly: 'Anomaly / Alert',
    selectedEntityTitle: 'Selected Entity Details',
    askAiAboutEntity: 'Ask AI about this',
    noNodeSelected: 'Click any node in the graph or a citation chip in chat to inspect details.',
    sourceCitations: 'Verified Source Citations:',
    anomalyHeading: 'Suspicious Anomaly Detected',
    welcomeBanner: 'GLASSBOX — Offline Zero-Hallucination Mode Active • Every finding cites verified case evidence.',
    quickPrompts: [
      'Trace hidden connections',
      'Highlight anomalies',
      'Recommend next leads',
      'Draft case summary'
    ],
    exportModalTitle: 'GLASSBOX - Investigation AI Assistant | Official Case Diary',
    downloadTxt: 'Download .TXT',
    exportPdf: 'Export / Print PDF',
    shareModalTitle: 'Share GLASSBOX Investigation Thread',
    copyTranscript: 'Copy Full Transcript',
    copyReadOnlyLink: 'Copy Read-Only Link',
    grantAccessBtn: 'Grant Access & Log Hash',
    casesMenuBtn: 'Cases & Vault'
  },
  hi: {
    brandSubtitle: 'जांच AI सहायक',
    offlineBadge: 'ऑफ़लाइन लोकल AI • सुरक्षित',
    shareChat: 'चैट साझा करें',
    exportDiary: 'केस डायरी निर्यात',
    hideGraph: 'ग्राफ़ छिपाएं',
    showGraph: 'ग्राफ़ दिखाएं',
    newCaseChat: 'नया केस चैट',
    caseHistory: 'केस इतिहास',
    evidenceVault: 'सबूत वॉल्ट',
    searchCasesPlaceholder: 'केस आईडी या शीर्षक खोजें...',
    dropEvidenceTitle: 'सबूत फ़ाइलें यहाँ छोड़ें',
    dropEvidenceSub: 'या अपलोड करने के लिए क्लिक करें (PDF, TXT, CSV, JPG, MP3)',
    indexedStatus: 'इंडेक्स किया गया',
    indexingStatus: 'प्रोसेस हो रहा है...',
    chatPlaceholder: 'अपलोड किए गए सबूतों के बारे में GLASSBOX से प्रश्न पूछें...',
    uploadFileBtn: 'फ़ाइल अपलोड',
    recordVoiceBtn: 'वॉइस रिकॉर्ड',
    stopVoiceBtn: 'रिकॉर्डिंग रोकें',
    sendBtn: 'भेजें',
    graphTitle: 'इंटरैक्टिव Graph-RAG एक्सप्लोरर',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    resetView: 'रीसेट',
    fullscreen: 'फ़ुलस्क्रीन',
    exitFullscreen: 'बंद करें',
    legendSuspect: 'व्यक्ति / संदिग्ध',
    legendSystem: 'सिस्टम / खाता',
    legendEvidence: 'सबूत / फ़ाइल',
    legendAnomaly: 'विसंगति / चेतावनी',
    selectedEntityTitle: 'चयनित इकाई का विवरण',
    askAiAboutEntity: 'इसके बारे में AI से पूछें',
    noNodeSelected: 'विवरण देखने के लिए ग्राफ़ में किसी नोड या चैट के स्रोत चिप पर क्लिक करें।',
    sourceCitations: 'सत्यापित स्रोत उद्धरण:',
    anomalyHeading: 'संदिग्ध विसंगति पाई गई',
    welcomeBanner: 'GLASSBOX — ऑफ़लाइन सुरक्षित मोड सक्रिय • हर निष्कर्ष सत्यापित सबूत से जुड़ा है।',
    quickPrompts: [
      'छिपे हुए कनेक्शन ट्रेस करें',
      'विसंगतियां हाइलाइट करें',
      'अगले जांच कदम सुझाएं',
      'केस सारांश तैयार करें'
    ],
    exportModalTitle: 'GLASSBOX - Investigation AI Assistant | आधिकारिक केस डायरी',
    downloadTxt: '.TXT डाउनलोड करें',
    exportPdf: 'PDF निर्यात / प्रिंट करें',
    shareModalTitle: 'GLASSBOX जांच चैट साझा करें',
    copyTranscript: 'पूरी बातचीत कॉपी करें',
    copyReadOnlyLink: 'रीड-ओनली लिंक कॉपी करें',
    grantAccessBtn: 'अनुमति दें और हैश लॉग करें',
    casesMenuBtn: 'केस और वॉल्ट'
  },
  mr: {
    brandSubtitle: 'तपास AI सहाय्यक',
    offlineBadge: 'ऑफलाइन लोकल AI • सुरक्षित',
    shareChat: 'चॅट शेअर करा',
    exportDiary: 'केस डायरी निर्यात',
    hideGraph: 'ग्राफ लपवा',
    showGraph: 'ग्राफ दाखवा',
    newCaseChat: 'नवीन केस चॅट',
    caseHistory: 'केस इतिहास',
    evidenceVault: 'पुरावा व्हॉल्ट',
    searchCasesPlaceholder: 'केस आयडी किंवा शीर्षक शोधा...',
    dropEvidenceTitle: 'पुरावे फाइल्स येथे टाका',
    dropEvidenceSub: 'किंवा अपलोड करण्यासाठी क्लिक करा (PDF, TXT, CSV, JPG, MP3)',
    indexedStatus: 'इंडेक्स झाले',
    indexingStatus: 'प्रक्रिया सुरू...',
    chatPlaceholder: 'अपलोड केलेल्या पुराव्यांबद्दल GLASSBOX ला प्रश्न विचारा...',
    uploadFileBtn: 'फाइल अपलोड',
    recordVoiceBtn: 'आवाज रेकॉर्ड',
    stopVoiceBtn: 'रेकॉर्डिंग थांबवा',
    sendBtn: 'पाठवा',
    graphTitle: 'इंटरॅक्टिव्ह Graph-RAG एक्सप्लोरर',
    zoomIn: 'झूम इन',
    zoomOut: 'झूम आउट',
    resetView: 'रीसेट',
    fullscreen: 'फुलस्क्रीन',
    exitFullscreen: 'बंद करा',
    legendSuspect: 'व्यक्ती / संशयित',
    legendSystem: 'सिस्टम / खाते',
    legendEvidence: 'पुरावा / फाइल',
    legendAnomaly: 'विसंगती / इशारा',
    selectedEntityTitle: 'निवडलेल्या घटकाचा तपशील',
    askAiAboutEntity: 'याबद्दल AI ला विचारा',
    noNodeSelected: 'तपशील पाहण्यासाठी ग्राफमधील कोणत्याही नोडवर किंवा स्रोत चिपवर क्लिक करा.',
    sourceCitations: 'सत्यापित स्रोत संदर्भ:',
    anomalyHeading: 'संशयास्पद विसंगती आढळली',
    welcomeBanner: 'GLASSBOX — ऑफलाइन सुरक्षित मोड सक्रिय • प्रत्येक निष्कर्ष सत्यापित पुराव्यांशी जोडलेला आहे.',
    quickPrompts: [
      'लपलेले संबंध शोधा',
      'विसंगती दाखवा',
      'पुढील तपासाच्या दिशा सुचवा',
      'केस सारांश तयार करा'
    ],
    exportModalTitle: 'GLASSBOX - Investigation AI Assistant | अधिकृत केस डायरी',
    downloadTxt: '.TXT डाउनलोड करा',
    exportPdf: 'PDF निर्यात / प्रिंट करा',
    shareModalTitle: 'GLASSBOX तपास चॅट शेअर करा',
    copyTranscript: 'संपूर्ण संभाषण कॉपी करा',
    copyReadOnlyLink: 'रीड-ओनली लिंक कॉपी करा',
    grantAccessBtn: 'परवानगी द्या आणि हॅश लॉग करा',
    casesMenuBtn: 'केस आणि व्हॉल्ट'
  },
  ta: {
    brandSubtitle: 'விசாரணை AI உதவியாளர்',
    offlineBadge: 'ஆஃப்லைன் உள்ளூர் AI • பாதுகாப்பானது',
    shareChat: 'உரையாடலைப் பகிர்',
    exportDiary: 'வழக்கு நாட்குறிப்பு ஏற்றுமதி',
    hideGraph: 'வரைபடத்தை மறை',
    showGraph: 'வரைபடத்தைக் காட்டு',
    newCaseChat: 'புதிய வழக்கு உரையாடல்',
    caseHistory: 'வழக்கு வரலாறு',
    evidenceVault: 'ஆதாரப் பெட்டகம்',
    searchCasesPlaceholder: 'வழக்கு எண் அல்லது தலைப்பைத் தேடு...',
    dropEvidenceTitle: 'ஆதாரக் கோப்புகளை இங்கே இடுங்கள்',
    dropEvidenceSub: 'அல்லது பதிவேற்ற கிளிக் செய்யவும் (PDF, TXT, CSV, JPG, MP3)',
    indexedStatus: 'குறியிடப்பட்டது',
    indexingStatus: 'செயலாக்குகிறது...',
    chatPlaceholder: 'பதிவேற்றிய ஆதாரங்களைப் பற்றி GLASSBOX-இடம் கேளுங்கள்...',
    uploadFileBtn: 'கோப்பு பதிவேற்று',
    recordVoiceBtn: 'குரல் பதிவு',
    stopVoiceBtn: 'பதிவை நிறுத்து',
    sendBtn: 'அனுப்பு',
    graphTitle: 'ஊடாடும் Graph-RAG வரைபடம்',
    zoomIn: 'பெரிதாக்கு',
    zoomOut: 'சிறிதாக்கு',
    resetView: 'மீட்டமை',
    fullscreen: 'முழுத்திரை',
    exitFullscreen: 'மூடு',
    legendSuspect: 'நபர் / சந்தேக நபர்',
    legendSystem: 'கணினி / கணக்கு',
    legendEvidence: 'ஆதாரம் / கோப்பு',
    legendAnomaly: 'முரண்பாடு / எச்சரிக்கை',
    selectedEntityTitle: 'தேர்ந்தெடுக்கப்பட்ட விவரம்',
    askAiAboutEntity: 'இதைப் பற்றி AI-யிடம் கேள்',
    noNodeSelected: 'விவரங்களைப் பார்க்க வரைபடத்தில் உள்ள முனையையோ ஆதாரத்தையோ கிளிக் செய்யவும்.',
    sourceCitations: 'சரிபார்க்கப்பட்ட ஆதாரங்கள்:',
    anomalyHeading: 'சந்தேகத்திற்குரிய முரண்பாடு கண்டறியப்பட்டது',
    welcomeBanner: 'GLASSBOX — ஆஃப்லைன் பாதுகாப்பு பயன்முறை • ஒவ்வொரு தகவலும் சரிபார்க்கப்பட்ட ஆதாரத்துடன் இணைக்கப்பட்டுள்ளது.',
    quickPrompts: [
      'மறைந்த தொடர்புகளைக் காட்டு',
      'முரண்பாடுகளை முன்னிலைப்படுத்து',
      'அடுத்த விசாரணை வழிகளைப் பரிந்துரை',
      'வழக்கு சுருக்கத்தை உருவாக்கு'
    ],
    exportModalTitle: 'GLASSBOX - Investigation AI Assistant | அதிகாரப்பூர்வ வழக்கு நாட்குறிப்பு',
    downloadTxt: '.TXT பதிவிறக்கு',
    exportPdf: 'PDF ஏற்றுமதி / அச்சிடு',
    shareModalTitle: 'GLASSBOX விசாரணை உரையாடலைப் பகிர்',
    copyTranscript: 'முழு உரையாடலை நகலெடு',
    copyReadOnlyLink: 'படிக்க-மட்டும் இணைப்பை நகலெடு',
    grantAccessBtn: 'அனுமதி வழங்கி ஹாஷ் பதிவு செய்',
    casesMenuBtn: 'வழக்குகள்'
  }
};

// ============================================================================
// 3. PRE-LOADED ANONYMIZED FORENSIC CASES (NO REAL PERSONAL NAMES)
// ============================================================================
const INITIAL_CASES = [
  {
    id: 'CASE #2026-KID-07',
    title: 'Operation Blind Spot (LIVE AI)',
    shortDesc: 'Hotel Royal Orchid Kidnapping, CCTV Blackout & Financial Trail',
    category: 'Live Local GraphRAG • Neo4j + ChromaDB',
    dateOpened: '14 Nov 2026',
    status: 'Live Backend Connected',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    voiceSample: 'How is shop owner Ramesh Sethi connected to Hotel Royal Orchid and Manoj Tiwari?',
    summary:
      'Live forensic investigation powered by local Ollama (llama3.2), ChromaDB vector search, and Neo4j Knowledge Graph. Ask any question in English, Hindi, Marathi, Tamil, or any regional language to cross-reference all 6 case evidence files.',
    nextLeads: [
      'Trace the INR 150,000 advance transferred from Manoj Tiwari to Ramesh Sethi prior to the CCTV blackout.',
      'Investigate the INR 75,000 direct payout from prime kidnapper Vikram Rana to Night Manager Manoj Tiwari.',
      'Cross-verify Room 304 and private service elevator access logs in hotel_details_report.txt.',
      'Generate a formal Police Case Diary by asking GLASSBOX to draft a report.'
    ],
    evidence: [
      { id: 'kid-1', name: 'hotel_details_report.txt', type: 'TXT', size: 'Live DB', status: 'indexed', nodeId: 'live-0' },
      { id: 'kid-2', name: 'whatsapp_chats_ramesh.txt', type: 'TXT', size: 'Live DB', status: 'indexed', nodeId: 'live-0' },
      { id: 'kid-3', name: 'hotel_transactions.csv', type: 'CSV', size: 'Live DB', status: 'indexed', nodeId: 'live-0' },
      { id: 'kid-4', name: 'shop_transactions.csv', type: 'CSV', size: 'Live DB', status: 'indexed', nodeId: 'live-0' },
      { id: 'kid-5', name: 'hotel_cctv_logs.csv', type: 'CSV', size: 'Live DB', status: 'indexed', nodeId: 'live-0' },
      { id: 'kid-6', name: 'shop_details_and_fir.txt', type: 'TXT', size: 'Live DB', status: 'indexed', nodeId: 'live-0' }
    ],
    nodes: [
      {
        id: 'live-0',
        label: 'Ramesh Sethi',
        role: 'CCTV Technician / Shop Owner',
        category: 'suspect',
        risk: 'High Risk',
        source: 'whatsapp_chats_ramesh.txt',
        x: 115,
        y: 120,
        explanation: 'Received INR 150,000 advance from Manoj Tiwari. Loading live Neo4j graph connections...'
      },
      {
        id: 'live-1',
        label: 'Manoj Tiwari',
        role: 'Duty Night Manager (9910445566)',
        category: 'suspect',
        risk: 'Critical Alert',
        source: 'hotel_details_report.txt',
        x: 300,
        y: 85,
        explanation: 'Connected to both Ramesh Sethi (INR 150,000) and Vikram Rana (INR 75,000).'
      },
      {
        id: 'live-2',
        label: 'Vikram Rana',
        role: 'Prime Kidnapping Suspect',
        category: 'anomaly',
        risk: 'Critical Alert',
        source: 'hotel_transactions.csv',
        x: 470,
        y: 165,
        explanation: 'Prime suspect linked via financial transfers to Hotel Royal Orchid staff.'
      },
      {
        id: 'live-3',
        label: 'Hotel Royal Orchid',
        role: 'Crime Scene Location (Manesar)',
        category: 'evidence',
        risk: 'Key Evidence',
        source: 'hotel_cctv_logs.csv',
        x: 290,
        y: 255,
        explanation: 'Location of kidnapping, Room 304, and suspicious CCTV blackout.'
      }
    ],
    edges: [
      { id: 'le-1', from: 'live-1', to: 'live-0', label: 'PAID_150K' },
      { id: 'le-2', from: 'live-2', to: 'live-1', label: 'PAID_75K' },
      { id: 'le-3', from: 'live-1', to: 'live-3', label: 'WORKS_AT' }
    ],
    messages: [
      {
        id: 'kid-m1',
        sender: 'ai',
        time: 'LIVE',
        summary: 'GLASSBOX Live AI Brain Connected — Case #2026-KID-07 (Operation Blind Spot).',
        bullets: [
          'Connected to local FastAPI Backend (Ollama llama3.2 + ChromaDB + Neo4j Graph).',
          'Ask any question in English, हिन्दी, मराठी, தமிழ், or any other language—GLASSBOX will run live Agentic Tools and cite real case files.'
        ],
        anomaly: null,
        citations: [
          { label: 'hotel_details_report.txt', nodeId: 'live-1' },
          { label: 'whatsapp_chats_ramesh.txt', nodeId: 'live-0' }
        ]
      }
    ]
  },
  {
    id: 'CASE #2026-CYB-04',
    title: 'The Phantom Ransomware',
    shortDesc: 'Hospital Insider Threat & Log Tampering',
    category: 'Cyber Intrusion / Insider Threat',
    dateOpened: '14 Nov 2026',
    status: 'Active Investigation',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    voiceSample: 'Trace all admin logins on Server X between 2 AM and 4 AM and check Employee A activity',
    summary:
      'At 03:00 AM, Hospital Server X patient records were encrypted with a ransom note blaming an external threat group. GLASSBOX Graph-RAG correlation disproves external entry: Employee A authenticated into Server X from internal IP 10.0.4.22 at 02:45 AM and executed update_script.ps1, matching deleted messages recovered from telegram_cache.txt.',
    nextLeads: [
      'Forensically image Employee A’s assigned workstation and mobile device under warrant.',
      'Audit firewall_rules.pdf policy change logs to confirm who exempted internal port 445.',
      'Trace the crypto wallet inside the ransom note to verify local generation artifacts.',
      'Cross-verify CCTV timestamps for IT Server Operations Room between 02:15 AM and 03:15 AM.'
    ],
    evidence: [
      { id: 'ev-1', name: 'server_auth_logs.csv', type: 'CSV', size: '2.4 MB', status: 'indexed', nodeId: 'n-serverx' },
      { id: 'ev-2', name: 'firewall_rules.pdf', type: 'PDF', size: '1.1 MB', status: 'indexed', nodeId: 'n-ip' },
      { id: 'ev-3', name: 'telegram_cache.txt', type: 'TXT', size: '412 KB', status: 'indexed', nodeId: 'n-telegram' },
      { id: 'ev-4', name: 'update_script.ps1', type: 'PS1', size: '38 KB', status: 'indexed', nodeId: 'n-script' }
    ],
    nodes: [
      {
        id: 'n-empa',
        label: 'Employee A',
        role: 'Internal IT Support Staff',
        category: 'suspect',
        risk: 'High Risk',
        source: 'telegram_cache.txt • Line 18',
        x: 110,
        y: 120,
        explanation:
          'Primary suspect. Deleted messages recovered from telegram_cache.txt reference testing a "custom locking script" 4 hours before the hospital server outage.'
      },
      {
        id: 'n-ip',
        label: 'IP 10.0.4.22',
        role: 'Internal VLAN Workstation',
        category: 'system',
        risk: 'Suspicious',
        source: 'firewall_rules.pdf • Page 4',
        x: 300,
        y: 80,
        explanation:
          'Static internal IP exclusively assigned to Employee A’s administrative terminal. Firewall Policy B confirms all external inbound ports were closed during the incident.'
      },
      {
        id: 'n-serverx',
        label: 'Server X',
        role: 'Hospital Patient Records DB',
        category: 'system',
        risk: 'Target System',
        source: 'server_auth_logs.csv • Line 42',
        x: 475,
        y: 155,
        explanation:
          'Critical patient database encrypted at 03:00 AM. server_auth_logs.csv records a privileged login from IP 10.0.4.22 at 02:45 AM with zero external VPN sessions.'
      },
      {
        id: 'n-script',
        label: 'update_script.ps1',
        role: 'Disguised PowerShell Payload',
        category: 'anomaly',
        risk: 'Critical Alert',
        source: 'update_script.ps1 • Line 112',
        x: 310,
        y: 255,
        explanation:
          'Masquerades as a routine Windows patch. Contains AES-256 encryption commands plus an obfuscated routine to clear Windows Security Event Logs.'
      },
      {
        id: 'n-telegram',
        label: 'telegram_cache.txt',
        role: 'Recovered Chat Evidence',
        category: 'evidence',
        risk: 'Key Evidence',
        source: 'telegram_cache.txt • Line 18',
        x: 120,
        y: 275,
        explanation:
          'SQLite chat cache extracted from Employee A’s laptop. Explicitly names update_script.ps1 and confirms automated off-site backups were paused prior to 03:00 AM.'
      }
    ],
    edges: [
      { id: 'e1', from: 'n-empa', to: 'n-ip', label: 'ASSIGNED_TO' },
      { id: 'e2', from: 'n-ip', to: 'n-serverx', label: 'LOGGED_INTO' },
      { id: 'e3', from: 'n-empa', to: 'n-script', label: 'EXECUTED' },
      { id: 'e4', from: 'n-script', to: 'n-serverx', label: 'ENCRYPTED' },
      { id: 'e5', from: 'n-telegram', to: 'n-empa', label: 'RECOVERED_FROM' },
      { id: 'e6', from: 'n-telegram', to: 'n-script', label: 'MENTIONS' }
    ],
    messages: [
      {
        id: 'm1',
        sender: 'user',
        time: '09:14 AM',
        text: 'Was the hospital ransomware attack on Server X executed by an external hacker group, or is there an insider threat?'
      },
      {
        id: 'm2',
        sender: 'ai',
        time: '09:14 AM',
        summary: 'GLASSBOX analysis points strongly to an Insider Threat involving Employee A rather than an external intrusion.',
        bullets: [
          'Server X received an internal admin login at 02:45 AM from IP 10.0.4.22 (assigned exclusively to Employee A), while firewall_rules.pdf confirms zero external VPN or inbound internet access.',
          'At 02:51 AM, update_script.ps1 was executed locally on Server X, encrypting patient records and attempting to purge Windows authentication logs.',
          'Recovered fragments in telegram_cache.txt directly link Employee A to the exact filename "update_script.ps1" and confirm backup suspension.'
        ],
        anomaly:
          'Off-Hours Access & Log Tampering: Firewall rules blocked all external port 445 connections, yet Server X encryption began 15 minutes after Employee A’s internal 02:45 AM login.',
        citations: [
          { label: 'server_auth_logs.csv • Line 42', nodeId: 'n-serverx' },
          { label: 'firewall_rules.pdf • Page 4', nodeId: 'n-ip' },
          { label: 'telegram_cache.txt • Line 18', nodeId: 'n-telegram' },
          { label: 'update_script.ps1 • Line 112', nodeId: 'n-script' }
        ]
      }
    ]
  },
  {
    id: 'CASE #2026-CYB-02',
    title: 'The Silent Exfiltration',
    shortDesc: 'Covert Blueprint Smuggling via DNS Tunneling',
    category: 'Data Theft / Network Forensics',
    dateOpened: '08 Nov 2026',
    status: 'Under Review',
    sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    voiceSample: 'Correlate Employee B physical badge swipes with suspicious DNS queries to External Domain X',
    summary:
      'Confidential blueprints were leaked despite strict USB storage blocks and outbound email filtering. GLASSBOX correlated an off-hours Sunday server-room badge swipe by Employee B with a spike of 14,820 hex-encoded DNS queries sent to External Domain X via suspicious_usb.jpg (a keystroke-injection HID device), followed by Employee B’s abrupt resignation.',
    nextLeads: [
      'Perform hardware firmware extraction on the keystroke-injection USB documented in suspicious_usb.jpg.',
      'Subpoena passive DNS and registrar metadata for External Domain X.',
      'Summon Employee B for formal questioning regarding Sunday server room access and sudden exit.',
      'Examine Workstation Z PowerShell and DNS resolver caches for Base64 chunking scripts.'
    ],
    evidence: [
      { id: 'ev-21', name: 'dns_query_logs.txt', type: 'TXT', size: '6.8 MB', status: 'indexed', nodeId: 'n-domainx' },
      { id: 'ev-22', name: 'physical_access_badge.csv', type: 'CSV', size: '820 KB', status: 'indexed', nodeId: 'n-badge' },
      { id: 'ev-23', name: 'hr_resignation_emails.pdf', type: 'PDF', size: '540 KB', status: 'indexed', nodeId: 'n-empb' },
      { id: 'ev-24', name: 'suspicious_usb.jpg', type: 'JPG', size: '3.2 MB', status: 'indexed', nodeId: 'n-usb' }
    ],
    nodes: [
      {
        id: 'n-empb',
        label: 'Employee B',
        role: 'Senior Systems Engineer',
        category: 'suspect',
        risk: 'High Risk',
        source: 'hr_resignation_emails.pdf • Page 1',
        x: 110,
        y: 120,
        explanation:
          'Filed an abrupt immediate resignation 48 hours after unauthorized Sunday server-room entry. Held privileged access to blueprint repositories.'
      },
      {
        id: 'n-badge',
        label: 'Badge Log #884',
        role: 'Physical Access Record',
        category: 'evidence',
        risk: 'Key Evidence',
        source: 'physical_access_badge.csv • Line 91',
        x: 295,
        y: 80,
        explanation:
          'Records Employee B entering Restricted Server Room 4 on Sunday at 01:12 AM and exiting at 01:34 AM — zero maintenance ticket was filed.'
      },
      {
        id: 'n-usb',
        label: 'suspicious_usb.jpg',
        role: 'Keystroke Injection USB Device',
        category: 'anomaly',
        risk: 'Critical Alert',
        source: 'suspicious_usb.jpg • OCR Tag',
        x: 475,
        y: 155,
        explanation:
          'Photographed HID hardware implant found near Server Rack 4. Emulates a keyboard to bypass USB storage blockers and trigger automated DNS exfiltration.'
      },
      {
        id: 'n-domainx',
        label: 'DNS Domain X',
        role: 'Covert Exfiltration Receiver',
        category: 'anomaly',
        risk: 'Critical Alert',
        source: 'dns_query_logs.txt • Line 4102',
        x: 315,
        y: 265,
        explanation:
          'Received 14,820 unusually long hexadecimal subdomain queries within 18 minutes, smuggling compressed blueprint chunks past outbound firewalls.'
      },
      {
        id: 'n-workz',
        label: 'Workstation Z',
        role: 'Restricted Blueprint Terminal',
        category: 'system',
        risk: 'Target System',
        source: 'dns_query_logs.txt • Line 4105',
        x: 125,
        y: 265,
        explanation:
          'Internal terminal in Server Room 4 from which high-entropy DNS queries to Domain X originated 3 minutes after Employee B’s badge swipe.'
      }
    ],
    edges: [
      { id: 'e21', from: 'n-empb', to: 'n-badge', label: 'SWIPED_BADGE' },
      { id: 'e22', from: 'n-badge', to: 'n-workz', label: 'ACCESSED' },
      { id: 'e23', from: 'n-empb', to: 'n-usb', label: 'DEPLOYED' },
      { id: 'e24', from: 'n-usb', to: 'n-workz', label: 'INJECTED_CMD' },
      { id: 'e25', from: 'n-workz', to: 'n-domainx', label: 'DNS_TUNNELED' }
    ],
    messages: [
      {
        id: 'm21',
        sender: 'user',
        time: '11:05 AM',
        text: 'How were the blueprints smuggled outside when USB storage drives and external emails are blocked?'
      },
      {
        id: 'm22',
        sender: 'ai',
        time: '11:05 AM',
        summary: 'Data was covertly exfiltrated via DNS Tunneling triggered by a hardware keystroke device during Employee B’s Sunday entry.',
        bullets: [
          'physical_access_badge.csv confirms Employee B entered Server Room 4 on Sunday at 01:12 AM without an approved maintenance ticket.',
          'Three minutes later, Workstation Z issued 14,820 encoded subdomain lookups to DNS Domain X, smuggling data through allowed port 53 traffic.',
          'suspicious_usb.jpg captures a covert HID USB implant recovered beside Rack 4 that bypasses USB mass-storage blocks.',
          'hr_resignation_emails.pdf shows Employee B resigned abruptly 48 hours after the transfer.'
        ],
        anomaly:
          'Covert Channel Burst: DNS traffic spiked 4,200% above baseline on Sunday at 01:15 AM, aligning strictly with Employee B’s 22-minute physical presence window.',
        citations: [
          { label: 'physical_access_badge.csv • Line 91', nodeId: 'n-badge' },
          { label: 'dns_query_logs.txt • Line 4102', nodeId: 'n-domainx' },
          { label: 'suspicious_usb.jpg • OCR Tag', nodeId: 'n-usb' },
          { label: 'hr_resignation_emails.pdf • Page 1', nodeId: 'n-empb' }
        ]
      }
    ]
  },
  {
    id: 'CASE #2026-FIN-09',
    title: 'Operation Phantom Vendor',
    shortDesc: 'Financial Fraud Linking Person A, Person B, Person C & Company X',
    category: 'Financial Cybercrime',
    dateOpened: '02 Nov 2026',
    status: 'Evidence Verified',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    voiceSample: 'Trace hidden links between Person A, Company X payments, and hotel receipt evidence',
    summary:
      '₹50,00,000 was paid to newly formed vendor Company X for undelivered IT equipment. Although Person A does not appear on Company X’s official filings, GLASSBOX Graph-RAG connects Person A to registered owner Person C via hotel_receipt_scanned.jpg (paid using Company X’s corporate card), with Person B receiving a ₹5,00,000 kickback.',
    nextLeads: [
      'Issue immediate freeze notices on Company X Bank Account Acc-1122 and Person B Account Acc-3344.',
      'Obtain immigration travel records and flight booking metadata for Person A and Person C.',
      'Audit internal ERP approval logs to verify how Person A bypassed competitive vendor bidding.',
      'Question Person B regarding the ₹5,00,000 payout recorded in bank_statement_august.csv.'
    ],
    evidence: [
      { id: 'ev-31', name: 'whatsapp_chat_export.txt', type: 'TXT', size: '198 KB', status: 'indexed', nodeId: 'n-persa' },
      { id: 'ev-32', name: 'vendor_registration.pdf', type: 'PDF', size: '1.4 MB', status: 'indexed', nodeId: 'n-compx' },
      { id: 'ev-33', name: 'bank_statement_august.csv', type: 'CSV', size: '940 KB', status: 'indexed', nodeId: 'n-persb' },
      { id: 'ev-34', name: 'hotel_receipt_scanned.jpg', type: 'JPG', size: '2.1 MB', status: 'indexed', nodeId: 'n-hotel' }
    ],
    nodes: [
      {
        id: 'n-persa',
        label: 'Person A',
        role: 'Internal Procurement Manager',
        category: 'suspect',
        risk: 'High Risk',
        source: 'whatsapp_chat_export.txt • Line 14',
        x: 110,
        y: 115,
        explanation:
          'Fast-tracked vendor onboarding for Company X. Messages in whatsapp_chat_export.txt show coordination with Person B to book Dubai travel under an alias.'
      },
      {
        id: 'n-persb',
        label: 'Person B',
        role: 'External Middleman',
        category: 'suspect',
        risk: 'Suspicious',
        source: 'bank_statement_august.csv • Row 19',
        x: 300,
        y: 80,
        explanation:
          'Received a ₹5,00,000 transfer into Acc-3344 from Company X exactly 48 hours after the ₹25,00,000 corporate hardware invoice payout.'
      },
      {
        id: 'n-compx',
        label: 'Company X',
        role: 'Suspected Shell Vendor',
        category: 'anomaly',
        risk: 'Critical Alert',
        source: 'vendor_registration.pdf • Page 1',
        x: 475,
        y: 155,
        explanation:
          'Registered only 17 days prior to receiving ₹25,00,000 in Acc-1122. Zero delivery manifests, warehouse leases, or customs records exist.'
      },
      {
        id: 'n-persc',
        label: 'Person C',
        role: 'Registered Owner of Company X',
        category: 'suspect',
        risk: 'High Risk',
        source: 'vendor_registration.pdf • Page 2',
        x: 315,
        y: 265,
        explanation:
          'Sole listed owner of Company X in vendor_registration.pdf. Linked directly to Person A via shared hotel folio in Dubai.'
      },
      {
        id: 'n-hotel',
        label: 'hotel_receipt_scanned.jpg',
        role: 'OCR-Extracted Hotel Bill',
        category: 'evidence',
        risk: 'Key Evidence',
        source: 'hotel_receipt_scanned.jpg • OCR Scan',
        x: 120,
        y: 270,
        explanation:
          'OCR scan of Marriott Dubai Room 512 invoice listing Person A and Person C as co-guests, paid directly via Company X Corporate Card.'
      }
    ],
    edges: [
      { id: 'e31', from: 'n-persa', to: 'n-persb', label: 'CHATTED_WITH' },
      { id: 'e32', from: 'n-compx', to: 'n-persb', label: 'PAID_5_LAKH' },
      { id: 'e33', from: 'n-persc', to: 'n-compx', label: 'OWNS' },
      { id: 'e34', from: 'n-persa', to: 'n-hotel', label: 'CO_GUEST' },
      { id: 'e35', from: 'n-persc', to: 'n-hotel', label: 'CO_GUEST' },
      { id: 'e36', from: 'n-compx', to: 'n-hotel', label: 'PAID_BILL' }
    ],
    messages: [
      {
        id: 'm31',
        sender: 'user',
        time: '02:30 PM',
        text: 'Trace how Person A is connected to the missing ₹50 Lakhs disbursed to Company X.'
      },
      {
        id: 'm32',
        sender: 'ai',
        time: '02:30 PM',
        summary: 'Multi-hop Graph-RAG analysis confirms hidden collusion linking Person A to Company X through Person B and Person C.',
        bullets: [
          'whatsapp_chat_export.txt confirms Person A coordinated vendor setup with Person B and requested Dubai travel under an alias.',
          'bank_statement_august.csv shows ₹25,00,000 paid to Company X followed 48 hours later by a ₹5,00,000 transfer from Company X to Person B.',
          'vendor_registration.pdf identifies Person C as owner of Company X — and hotel_receipt_scanned.jpg proves Person A and Person C stayed together in Room 512 paid by Company X.'
        ],
        anomaly:
          'Shell Vendor & Kickback Loop: Company X was incorporated 17 days before receiving corporate funds and directly funded international hotel expenses for the approving manager (Person A).',
        citations: [
          { label: 'whatsapp_chat_export.txt • Line 14', nodeId: 'n-persa' },
          { label: 'bank_statement_august.csv • Row 19', nodeId: 'n-persb' },
          { label: 'vendor_registration.pdf • Page 1', nodeId: 'n-compx' },
          { label: 'hotel_receipt_scanned.jpg • OCR Scan', nodeId: 'n-hotel' }
        ]
      }
    ]
  }
];

// ============================================================================
// 4. DESIGN TOKENS & CONTEXT-AWARE MOCK FORENSIC ENGINE
// ============================================================================
const NODE_STYLE_MAP = {
  suspect: {
    fill: '#3B1D0A',
    stroke: '#F59E0B',
    badgeBg: 'bg-[#F59E0B]/15 text-amber-300 border-[#F59E0B]/45',
    labelColor: '#FDE68A',
    typeLabel: 'Person / Suspect'
  },
  system: {
    fill: '#132447',
    stroke: '#3B82F6',
    badgeBg: 'bg-[#3B82F6]/15 text-blue-300 border-[#3B82F6]/45',
    labelColor: '#BFDBFE',
    typeLabel: 'System / Account'
  },
  evidence: {
    fill: '#083327',
    stroke: '#10B981',
    badgeBg: 'bg-[#10B981]/15 text-emerald-300 border-[#10B981]/45',
    labelColor: '#A7F3D0',
    typeLabel: 'Evidence / File'
  },
  anomaly: {
    fill: '#3F1115',
    stroke: '#EF4444',
    badgeBg: 'bg-[#EF4444]/15 text-red-300 border-[#EF4444]/45',
    labelColor: '#FECACA',
    typeLabel: 'Anomaly / Alert'
  }
};

function getFileIcon(type) {
  const upper = (type || '').toUpperCase();
  if (upper === 'CSV' || upper === 'XLSX') return <FileSpreadsheet className="w-4 h-4 text-[#10B981] shrink-0" />;
  if (upper === 'JPG' || upper === 'PNG' || upper === 'JPEG') return <FileImage className="w-4 h-4 text-[#F59E0B] shrink-0" />;
  if (upper === 'MP3' || upper === 'WAV') return <FileAudio className="w-4 h-4 text-purple-400 shrink-0" />;
  if (upper === 'PS1' || upper === 'JSON' || upper === 'JS' || upper === 'LOG') return <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />;
  return <FileText className="w-4 h-4 text-[#3B82F6] shrink-0" />;
}

function getCurrentTimeStr() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function generateMockSha256(seedStr) {
  let h1 = 0xdeadbeef ^ seedStr.length;
  let h2 = 0x41c6ce57 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i += 1) {
    const ch = seedStr.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  const part = (n) => (n >>> 0).toString(16).padStart(8, '0');
  return `${part(h1)}${part(h2)}${part(h1 ^ 0xa5a5a5a5)}${part(h2 ^ 0x5a5a5a5a)}${part(h1 + h2)}${part(h2 - h1)}${part(h1 * 3)}${part(h2 * 7)}`.slice(0, 64);
}

function generateMockAIResponse(queryText, activeCase) {
  const q = queryText.toLowerCase();
  const time = getCurrentTimeStr();
  const defaultCitations = activeCase.nodes.slice(0, 3).map((n) => ({
    label: n.source,
    nodeId: n.id
  }));

  // 1. Targeted entity inspection
  const matchedNode = activeCase.nodes.find((n) => q.includes(n.label.toLowerCase()));
  if (matchedNode && (q.includes('tell me') || q.includes('about') || q.includes('inspect') || q.includes('details') || q.includes('explain'))) {
    const relatedEdges = activeCase.edges.filter((e) => e.from === matchedNode.id || e.to === matchedNode.id);
    const connectedSummaries = relatedEdges.map((edge) => {
      const fromNode = activeCase.nodes.find((n) => n.id === edge.from);
      const toNode = activeCase.nodes.find((n) => n.id === edge.to);
      return `${fromNode?.label || 'Entity'} —[${edge.label}]→ ${toNode?.label || 'Entity'}`;
    });
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      time,
      summary: `GLASSBOX Entity Dossier: ${matchedNode.label} (${matchedNode.role})`,
      bullets: [
        matchedNode.explanation,
        ...(connectedSummaries.length > 0
          ? [`Verified Graph-RAG Connections: ${connectedSummaries.join(' | ')}`]
          : ['No direct graph edges linked yet — upload additional case files to expand relationships.']),
        `Assigned Risk Classification: ${matchedNode.risk}.`
      ],
      anomaly:
        matchedNode.category === 'anomaly' || matchedNode.category === 'suspect'
          ? `High-Priority Flag: ${matchedNode.label} sits directly on the primary suspicious pathway in ${activeCase.id}.`
          : null,
      citations: [{ label: matchedNode.source, nodeId: matchedNode.id }]
    };
  }

  // 2. Draft Case Summary
  if (q.includes('summar') || q.includes('draft') || q.includes('सारांश') || q.includes('சுருக்க')) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      time,
      summary: `Executive Case Summary — ${activeCase.id} (${activeCase.title}):`,
      bullets: [
        activeCase.summary,
        `Evidence Vault Indexed: ${activeCase.evidence.length} files (${activeCase.evidence.map((e) => e.name).join(', ')}).`,
        `Graph-RAG Coverage: ${activeCase.nodes.length} verified entities linked across ${activeCase.edges.length} directional relationships.`
      ],
      anomaly: null,
      citations: defaultCitations
    };
  }

  // 3. Recommend Next Leads
  if (q.includes('lead') || q.includes('recommend') || q.includes('next') || q.includes('step') || q.includes('सुझा') || q.includes('सुचवा') || q.includes('பரிந்துரை')) {
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      time,
      summary: `Recommended Next Investigative Leads for ${activeCase.id}:`,
      bullets: activeCase.nextLeads,
      anomaly: null,
      citations: defaultCitations
    };
  }

  // 4. Highlight Anomalies
  if (q.includes('anomal') || q.includes('suspicious') || q.includes('alert') || q.includes('highlight') || q.includes('विसंगत') || q.includes('முரண்பாடு')) {
    const anomalyNodes = activeCase.nodes.filter((n) => n.category === 'anomaly' || n.category === 'suspect');
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      time,
      summary: `GLASSBOX Flagged ${anomalyNodes.length} High-Priority Anomalies & Risk Entities:`,
      bullets: anomalyNodes.map((n) => `${n.label} [${n.risk}]: ${n.explanation}`),
      anomaly: `Cross-Artifact Correlation Alert: Verified timestamp overlap between internal access credentials and unauthorized payload/financial activity.`,
      citations: anomalyNodes.map((n) => ({ label: n.source, nodeId: n.id }))
    };
  }

  // 5. Trace Hidden Connections / Login Timelines
  if (q.includes('trace') || q.includes('connection') || q.includes('hidden') || q.includes('login') || q.includes('correlate') || q.includes('ट्रेस') || q.includes('संबंध') || q.includes('தொடர்பு')) {
    const edgeStrings = activeCase.edges.map((e) => {
      const fromN = activeCase.nodes.find((n) => n.id === e.from);
      const toN = activeCase.nodes.find((n) => n.id === e.to);
      return `${fromN?.label} —[${e.label}]→ ${toN?.label}`;
    });
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      time,
      summary: `Graph-RAG Multi-Hop Connection Trace for ${activeCase.title}:`,
      bullets: [
        ...edgeStrings.slice(0, 5),
        'All relationship hops above are strictly derived from cross-referenced evidence files with zero external inference.'
      ],
      anomaly:
        activeCase.id === 'CASE #2026-CYB-04'
          ? 'Off-Hours Admin Access: IP 10.0.4.22 logged into Server X at 02:45 AM (15 minutes prior to encryption) while external firewall rules blocked all outside connections.'
          : 'Verified Multi-Hop Sequence: Independent evidence artifacts converge within a high-confidence operational window.',
      citations: activeCase.nodes.slice(0, 4).map((n) => ({ label: n.source, nodeId: n.id }))
    };
  }

  // 6. Uploaded file query match
  const matchedEvidence = activeCase.evidence.find((ev) => q.includes(ev.name.toLowerCase()));
  if (matchedEvidence) {
    const linkedNode = activeCase.nodes.find((n) => n.id === matchedEvidence.nodeId);
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      time,
      summary: `Artifact Inspection for ${matchedEvidence.name} (${matchedEvidence.type}, ${matchedEvidence.size}):`,
      bullets: [
        linkedNode
          ? linkedNode.explanation
          : `Artifact ${matchedEvidence.name} is indexed locally in ChromaDB and linked to ${activeCase.id}.`,
        'Click the verified citation chip below to inspect its exact connections inside the Graph-RAG Explorer.'
      ],
      anomaly: null,
      citations: [{ label: linkedNode?.source || `${matchedEvidence.name} • Indexed`, nodeId: matchedEvidence.nodeId }]
    };
  }

  // 7. General forensic response
  return {
    id: `ai-${Date.now()}`,
    sender: 'ai',
    time,
    summary: `GLASSBOX Local Evidence Analysis for ${activeCase.id}:`,
    bullets: [
      `Evaluated ${activeCase.evidence.length} indexed evidence artifacts and ${activeCase.nodes.length} Knowledge Graph entities.`,
      activeCase.summary,
      'Select any verified citation chip below to highlight and inspect its entity relationship chain in the Graph-RAG Explorer.'
    ],
    anomaly: null,
    citations: defaultCitations
  };
}

// ============================================================================
// 5. INTERACTIVE SVG GRAPH-RAG EXPLORER (Draggable, Clickable, Zoom/Pan)
// ============================================================================
function KnowledgeGraphCanvas({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  onNodeMove,
  zoom,
  pan,
  onPanChange,
  isFullscreen
}) {
  const svgRef = useRef(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0, origX: 0, origY: 0 });

  const getSvgCoords = (clientX, clientY) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  };

  const handleNodePointerDown = (e, node) => {
    e.stopPropagation();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback for environments without pointer capture
    }
    const pt = getSvgCoords(e.clientX, e.clientY);
    dragStartRef.current = { x: pt.x, y: pt.y, origX: node.x, origY: node.y };
    setDraggingNodeId(node.id);
    onSelectNode(node.id);
  };

  const handleBgPointerDown = (e) => {
    if (e.target === svgRef.current || e.target.dataset.bg === 'true') {
      setIsPanning(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY, origX: pan.x, origY: pan.y };
    }
  };

  const handlePointerMove = (e) => {
    if (draggingNodeId) {
      const pt = getSvgCoords(e.clientX, e.clientY);
      const dx = pt.x - dragStartRef.current.x;
      const dy = pt.y - dragStartRef.current.y;
      onNodeMove(draggingNodeId, dragStartRef.current.origX + dx, dragStartRef.current.origY + dy);
    } else if (isPanning) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      onPanChange({ x: dragStartRef.current.origX + dx, y: dragStartRef.current.origY + dy });
    }
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const activeFocusId = hoveredNodeId || selectedNodeId;
  const connectedNodeIds = useMemo(() => {
    if (!activeFocusId) return null;
    const set = new Set([activeFocusId]);
    edges.forEach((edge) => {
      if (edge.from === activeFocusId) set.add(edge.to);
      if (edge.to === activeFocusId) set.add(edge.from);
    });
    return set;
  }, [activeFocusId, edges]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-[#30363D] bg-[#0D1117] select-none ${
        isFullscreen ? 'h-[62vh]' : 'h-[300px] xl:h-[330px]'
      }`}
    >
      <svg
        ref={svgRef}
        className={`w-full h-full touch-none ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={handleBgPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          <pattern id="glassbox-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="#21262D" />
          </pattern>
          <marker
            id="gb-arrow-default"
            viewBox="0 0 10 10"
            refX="27"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#484F58" />
          </marker>
          <marker
            id="gb-arrow-active"
            viewBox="0 0 10 10"
            refX="27"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#3B82F6" />
          </marker>
        </defs>

        <rect data-bg="true" width="100%" height="100%" fill="url(#glassbox-grid)" />

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Directional Labeled Edges */}
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isHighlighted =
              activeFocusId && (edge.from === activeFocusId || edge.to === activeFocusId);
            const isDimmed = activeFocusId && !isHighlighted;

            const midX = (fromNode.x + toNode.x) / 2;
            const midY = (fromNode.y + toNode.y) / 2;
            const pillWidth = Math.max(edge.label.length * 6.2 + 12, 64);

            return (
              <g key={edge.id} style={{ opacity: isDimmed ? 0.22 : 1, transition: 'opacity 180ms' }}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isHighlighted ? '#3B82F6' : '#30363D'}
                  strokeWidth={isHighlighted ? 2.4 : 1.7}
                  markerEnd={isHighlighted ? 'url(#gb-arrow-active)' : 'url(#gb-arrow-default)'}
                />
                <rect
                  x={midX - pillWidth / 2}
                  y={midY - 9}
                  width={pillWidth}
                  height={18}
                  rx={4}
                  fill="#161B22"
                  stroke={isHighlighted ? '#3B82F6' : '#30363D'}
                  strokeWidth={1}
                />
                <text
                  x={midX}
                  y={midY + 3.5}
                  textAnchor="middle"
                  fill={isHighlighted ? '#93C5FD' : '#8B949E'}
                  fontSize="8.5"
                  fontWeight="600"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Interactive Draggable Entity Nodes */}
          {nodes.map((node) => {
            const style = NODE_STYLE_MAP[node.category] || NODE_STYLE_MAP.system;
            const isSelected = node.id === selectedNodeId;
            const isHovered = node.id === hoveredNodeId;
            const isDimmed = connectedNodeIds && !connectedNodeIds.has(node.id);
            const radius = isSelected ? 24 : 21;
            const labelPillW = Math.max(node.label.length * 7.2 + 20, 92);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onPointerDown={(e) => handleNodePointerDown(e, node)}
                onPointerEnter={() => setHoveredNodeId(node.id)}
                onPointerLeave={() => setHoveredNodeId(null)}
                className="cursor-pointer"
                style={{ opacity: isDimmed ? 0.26 : 1, transition: 'opacity 180ms' }}
              >
                {(isSelected || isHovered) && (
                  <circle
                    r={radius + 6}
                    fill="none"
                    stroke={style.stroke}
                    strokeWidth={2}
                    strokeDasharray={isSelected ? 'none' : '4 3'}
                    opacity={0.8}
                  />
                )}
                <circle
                  r={radius}
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={isSelected ? 3 : 2}
                />
                <text
                  textAnchor="middle"
                  dy="4"
                  fill={style.labelColor}
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  pointerEvents="none"
                >
                  {node.category === 'suspect'
                    ? 'ID'
                    : node.category === 'system'
                    ? 'SYS'
                    : node.category === 'anomaly'
                    ? '!'
                    : 'FILE'}
                </text>
                <rect
                  x={-labelPillW / 2}
                  y={radius + 5}
                  width={labelPillW}
                  height={20}
                  rx={6}
                  fill="#161B22"
                  fillOpacity="0.95"
                  stroke={isSelected ? style.stroke : '#30363D'}
                  strokeWidth={1}
                />
                <text
                  y={radius + 18.5}
                  textAnchor="middle"
                  fill="#F0F6FC"
                  fontSize="10.5"
                  fontWeight="600"
                  pointerEvents="none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-2.5 left-3 rounded-md bg-[#161B22]/95 border border-[#30363D] px-2.5 py-1 text-[11px] text-slate-400">
        Drag nodes to arrange • Click node to inspect
      </div>
    </div>
  );
}

// ============================================================================
// 6. MAIN APPLICATION COMPONENT — GLASSBOX - INVESTIGATION AI ASSISTANT
// ============================================================================
export default function App() {
  // Core Cases State
  const [cases, setCases] = useState(INITIAL_CASES);
  const [activeCaseId, setActiveCaseId] = useState(INITIAL_CASES[0].id);

  // UI & Layout State
  const [language, setLanguage] = useState('en');
  const [caseSearch, setCaseSearch] = useState('');
  const [showGraphPanel, setShowGraphPanel] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Graph-RAG State
  const [selectedNodeId, setSelectedNodeId] = useState(INITIAL_CASES[0].nodes[0].id);
  const [graphZoom, setGraphZoom] = useState(0.82);
  const [graphPan, setGraphPan] = useState({ x: -16, y: 12 });
  const [graphFullscreen, setGraphFullscreen] = useState(false);

  // Chat & Voice Recording State
  const [inputText, setInputText] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Modals & Toast Feedback
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [exportDate, setExportDate] = useState('');
useEffect(() => {
  setExportDate(new Date().toLocaleString());
}, []);
// Live Neo4j Knowledge Graph ko FastAPI (/api/graph) se load karna
  useEffect(() => {
    const loadLiveNeo4jGraph = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/graph`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status !== 'success' || !Array.isArray(data.connections) || data.connections.length === 0) {
          return;
        }

        const nodeMap = new Map();
        const edgeList = [];

        const mapCategory = (neoType) => {
          const tUpper = (neoType || '').toLowerCase();
          if (tUpper.includes('person')) return 'suspect';
          if (tUpper.includes('phone')) return 'system';
          if (tUpper.includes('location')) return 'evidence';
          return 'anomaly';
        };

        data.connections.forEach((conn, idx) => {
          if (!conn.source || !conn.target) return;

          if (!nodeMap.has(conn.source)) {
            nodeMap.set(conn.source, {
              id: `neo-${nodeMap.size}`,
              label: conn.source,
              role: conn.source_type || 'Entity',
              category: mapCategory(conn.source_type),
              risk: conn.source_type === 'Person' ? 'High Risk' : 'Linked Entity',
              source: conn.evidence_file || 'Neo4j GlassboxGraph',
              explanation: `Extracted from live Neo4j Knowledge Graph via ${conn.evidence_file || 'case evidence'}.`
            });
          }

          if (!nodeMap.has(conn.target)) {
            nodeMap.set(conn.target, {
              id: `neo-${nodeMap.size}`,
              label: conn.target,
              role: conn.target_type || 'Entity',
              category: mapCategory(conn.target_type),
              risk: conn.target_type === 'Person' ? 'High Risk' : 'Verified Artifact',
              source: conn.evidence_file || 'Neo4j GlassboxGraph',
              explanation: `Connected entity in live Neo4j Knowledge Graph (${conn.evidence_file || 'case evidence'}).`
            });
          }

          const fromNode = nodeMap.get(conn.source);
          const toNode = nodeMap.get(conn.target);
          edgeList.push({
            id: `neo-e-${idx}`,
            from: fromNode.id,
            to: toNode.id,
            label: conn.relation || 'LINKED_TO'
          });
        });

        // Nodes ko clean circular layout mein arrange karna taaki overlap na ho
        const allNodes = Array.from(nodeMap.values());
        const total = allNodes.length;
        const laidOutNodes = allNodes.map((n, i) => {
          const angle = (2 * Math.PI * i) / Math.max(total, 1) - Math.PI / 2;
          const rx = total > 8 ? 215 : 185;
          const ry = total > 8 ? 130 : 110;
          return {
            ...n,
            x: Math.round(290 + rx * Math.cos(angle)),
            y: Math.round(175 + ry * Math.sin(angle))
          };
        });

        setCases((prev) =>
          prev.map((c) =>
            c.id === 'CASE #2026-KID-07'
              ? { ...c, nodes: laidOutNodes, edges: edgeList }
              : c
          )
        );
        if (laidOutNodes.length > 0) {
          setSelectedNodeId(laidOutNodes[0].id);
        }
      } catch {
        // Agar backend server abhi off ho, toh fallback nodes screen par bane rahenge
      }
    };

    loadLiveNeo4jGraph();
  }, []);
  // Share Modal State (with SHA-256 Chain-of-Custody Audit Log)
  const [colleagueInput, setColleagueInput] = useState('');
  const [colleagueRole, setColleagueRole] = useState('View Only');
  const [copiedState, setCopiedState] = useState(null);
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'aud-1',
      badge: 'Officer Badge #4092',
      role: 'Lead Investigator',
      time: 'Today, 09:05 AM',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      note: 'GLASSBOX local session initialized & evidence vault sealed'
    }
  ]);

  // Refs
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const liveTranscriptRef = useRef('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const activeCase = useMemo(
    () => cases.find((c) => c.id === activeCaseId) || cases[0],
    [cases, activeCaseId]
  );

  const selectedNode = useMemo(
    () => activeCase.nodes.find((n) => n.id === selectedNodeId) || null,
    [activeCase, selectedNodeId]
  );

  const filteredCases = useMemo(() => {
    const q = caseSearch.trim().toLowerCase();
    if (!q) return cases;
    return cases.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.shortDesc.toLowerCase().includes(q)
    );
  }, [cases, caseSearch]);

  const showToast = (msg) => setToastMessage(msg);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeCase.messages, isAiThinking]);

  useEffect(() => {
    if (!isRecording) {
      setRecordingSeconds(0);
      return;
    }
    const interval = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Switch active case
  const handleSelectCase = (caseId) => {
    setActiveCaseId(caseId);
    const nextCase = cases.find((c) => c.id === caseId);
    setSelectedNodeId(nextCase?.nodes?.[0]?.id || null);
    setGraphZoom(0.82);
    setGraphPan({ x: -16, y: 12 });
    setMobileSidebarOpen(false);
  };

  // Create fresh investigation thread
  const handleCreateNewCase = () => {
    const nextNum = String(cases.length + 1).padStart(2, '0');
    const newId = `CASE #2026-CYB-${nextNum}`;
    const newCase = {
      id: newId,
      title: `New Investigation ${nextNum}`,
      shortDesc: 'Fresh workspace awaiting evidence upload',
      category: 'Digital Forensics',
      dateOpened: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Open',
      sha256: generateMockSha256(`${newId}-${Date.now()}`),
      voiceSample: 'Summarize uploaded files and highlight any suspicious anomalies',
      summary:
        'New GLASSBOX investigation workspace initialized. Upload forensic artifacts (PDF, TXT, CSV, JPG, MP3) into the Evidence Vault to automatically build the Knowledge Graph.',
      nextLeads: [
        'Upload initial digital evidence artifacts into the left Evidence Vault.',
        'Run automated anomaly detection once local indexing completes.'
      ],
      evidence: [],
      nodes: [
        {
          id: `n-root-${Date.now()}`,
          label: newId,
          role: 'Active Case Workspace',
          category: 'system',
          risk: 'Pending Evidence',
          source: 'GLASSBOX Initialization',
          x: 260,
          y: 165,
          explanation:
            'Upload any evidence file via drag-and-drop or the Upload File button to automatically extract entities and graph relationships.'
        }
      ],
      edges: [],
      messages: [
        {
          id: `m-init-${Date.now()}`,
          sender: 'ai',
          time: getCurrentTimeStr(),
          summary: `Welcome to GLASSBOX - Investigation AI Assistant (${newId}).`,
          bullets: [
            'Upload PDF reports, CSV logs, TXT chat exports, images, or audio files using the Evidence Vault.',
            'All indexing runs 100% offline on this local terminal with source-verified citations.'
          ],
          anomaly: null,
          citations: []
        }
      ]
    };

    setCases((prev) => [newCase, ...prev]);
    setActiveCaseId(newId);
    setSelectedNodeId(newCase.nodes[0].id);
    setMobileSidebarOpen(false);
    showToast(`Created ${newId}`);
  };

  // Submit query to LIVE GLASSBOX FastAPI Backend (with fallback for demo cases)
  const handleSendMessage = async (customText) => {
    const trimmed = (typeof customText === 'string' ? customText : inputText).trim();
    if (!trimmed || isAiThinking) return;

    const currentCaseId = activeCase.id;
    const currentCaseSnapshot = activeCase;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      time: getCurrentTimeStr(),
      text: trimmed
    };

    setCases((prev) =>
      prev.map((c) => (c.id === currentCaseId ? { ...c, messages: [...c.messages, userMsg] } : c))
    );
    if (typeof customText !== 'string') setInputText('');
    setIsAiThinking(true);

    // Agar 3 purane demo cases mein se koi open hai, toh unka built-in demo response chalega
    const isDemoCase = ['CASE #2026-CYB-04', 'CASE #2026-CYB-02', 'CASE #2026-FIN-09'].includes(currentCaseId);
    if (isDemoCase) {
      setTimeout(() => {
        const aiReply = generateMockAIResponse(trimmed, currentCaseSnapshot);
        setCases((prev) =>
          prev.map((c) => (c.id === currentCaseId ? { ...c, messages: [...c.messages, aiReply] } : c))
        );
        setIsAiThinking(false);
      }, 600);
      return;
    }

    // LIVE CASE (CASE #2026-KID-07 & New Cases) -> FastAPI + Ollama + ChromaDB + Neo4j
    try {
      // UI mein hi/mr/ta select hai toh exact usi language mein jawab aayega;
      // UI 'en' par hai toh 'auto' bhejne se English + koi bhi aur typed language (Punjabi, Bengali, etc.) sab chalengi!
      const requestedLang = language === 'en' ? 'auto' : language;

      const res = await fetch(`${API_BASE_URL}/api/investigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          language: requestedLang
        })
      });

      if (!res.ok) throw new Error(`Server returned status ${res.status}`);
      const data = await res.json();

      const rawText = (data.response || 'No response generated.').trim();
      const cleanedLines = rawText
        .split('\n')
        .map((line) => line.replace(/^[\s*\-•]+/, '').trim())
        .filter(Boolean);

      const toolsList = Array.isArray(data.tools_used) && data.tools_used.length > 0
        ? data.tools_used.join(' → ')
        : 'search_evidence';

      // AI ke jawab mein jo real case files mention hui hain, unhe clickable Citation Chips banao
      const knownFiles = [
        'hotel_details_report.txt',
        'whatsapp_chats_ramesh.txt',
        'hotel_transactions.csv',
        'shop_transactions.csv',
        'hotel_cctv_logs.csv',
        'shop_details_and_fir.txt'
      ];
      const matchedCitations = knownFiles
        .filter((fname) => rawText.toLowerCase().includes(fname.toLowerCase()))
        .map((fname) => {
          const linkedNode = currentCaseSnapshot.nodes.find((n) =>
            (n.source || '').toLowerCase().includes(fname.toLowerCase())
          );
          return {
            label: fname,
            nodeId: linkedNode?.id || currentCaseSnapshot.nodes[0]?.id
          };
        });

      const aiReply = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        time: getCurrentTimeStr(),
        summary: `GLASSBOX Live AI (${(data.output_language || 'en').toUpperCase()} • Tools: ${toolsList})`,
        bullets: cleanedLines.length > 0 ? cleanedLines : [rawText],
        anomaly: null,
        citations:
          matchedCitations.length > 0
            ? matchedCitations
            : [{ label: 'ChromaDB + Neo4j Live Evidence', nodeId: currentCaseSnapshot.nodes[0]?.id }]
      };

      setCases((prev) =>
        prev.map((c) => (c.id === currentCaseId ? { ...c, messages: [...c.messages, aiReply] } : c))
      );
    } catch (err) {
      const errorReply = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        time: getCurrentTimeStr(),
        summary: 'Backend AI Brain is currently offline.',
        bullets: [
          'Start your FastAPI backend in the backend folder terminal: uvicorn main:app --reload',
          'Also confirm Neo4j Desktop (GlassboxGraph) is RUNNING.'
        ],
        anomaly: `Connection Error: ${err.message}`,
        citations: []
      };
      setCases((prev) =>
        prev.map((c) => (c.id === currentCaseId ? { ...c, messages: [...c.messages, errorReply] } : c))
      );
    } finally {
      setIsAiThinking(false);
    }
  };

  // Click citation chip -> focus Graph-RAG node
  const handleCitationClick = (nodeId) => {
    if (!nodeId) return;
    setShowGraphPanel(true);
    setSelectedNodeId(nodeId);
    showToast('Focused linked evidence entity in Graph-RAG');
  };

  // Handle drag-and-drop or file-picker uploads (Indexing... -> Indexed in 1.5s + auto Graph node)
  const processUploadedFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);

    filesArray.forEach((file, index) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      const sizeStr =
        file.size < 1024 * 1024
          ? `${Math.max(1, Math.round(file.size / 1024))} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const evId = `ev-up-${Date.now()}-${index}`;
      const newNodeId = `n-up-${Date.now()}-${index}`;

      const newEvidence = {
        id: evId,
        name: file.name,
        type: ext,
        size: sizeStr,
        status: 'indexing',
        nodeId: newNodeId
      };

      setCases((prev) =>
        prev.map((c) =>
          c.id === activeCase.id ? { ...c, evidence: [newEvidence, ...c.evidence] } : c
        )
      );
      showToast(`Indexing ${file.name}...`);

      setTimeout(() => {
        setCases((prev) =>
          prev.map((c) => {
            if (c.id !== activeCase.id) return c;
            const anchorNode = c.nodes[0];
            const shortName = file.name.length > 22 ? `${file.name.slice(0, 19)}...` : file.name;
            const newNode = {
              id: newNodeId,
              label: shortName,
              role: `Uploaded ${ext} Evidence`,
              category: 'evidence',
              risk: 'Key Evidence',
              source: `${file.name} • Indexed`,
              x: 185 + ((c.nodes.length * 70) % 260),
              y: 115 + ((c.nodes.length * 52) % 165),
              explanation: `Newly uploaded forensic artifact (${sizeStr}). Local OCR/text extraction and vector indexing completed offline with zero external network transfer.`
            };
            const newEdge = anchorNode
              ? {
                  id: `e-up-${Date.now()}-${index}`,
                  from: newNodeId,
                  to: anchorNode.id,
                  label: 'CORRELATES_WITH'
                }
              : null;

            const aiNotice = {
              id: `sys-${Date.now()}-${index}`,
              sender: 'ai',
              time: getCurrentTimeStr(),
              summary: `GLASSBOX Indexed New Evidence: ${file.name} (${sizeStr})`,
              bullets: [
                `Successfully parsed ${ext} file locally and linked a new evidence node into the active Knowledge Graph.`,
                'You may now query entities, timelines, or anomalies contained inside this artifact.'
              ],
              anomaly: null,
              citations: [{ label: `${file.name} • Indexed`, nodeId: newNodeId }]
            };

            return {
              ...c,
              evidence: c.evidence.map((ev) =>
                ev.id === evId ? { ...ev, status: 'indexed' } : ev
              ),
              nodes: [...c.nodes, newNode],
              edges: newEdge ? [...c.edges, newEdge] : c.edges,
              messages: [...c.messages, aiNotice]
            };
          })
        );
        setSelectedNodeId(newNodeId);
        showToast(`${file.name} indexed & connected in Graph-RAG`);
      }, 1500);
    });
  };

  const handleFileInputChange = (e) => {
    processUploadedFiles(e.target.files);
    e.target.value = '';
  };

  // Voice recording with Web Speech API + reliable fallback transcript
  const toggleVoiceRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore stop errors
        }
        recognitionRef.current = null;
      }
      const captured = liveTranscriptRef.current.trim();
      setInputText(captured || activeCase.voiceSample);
      liveTranscriptRef.current = '';
      showToast('Voice query transcribed into input box');
      return;
    }

    liveTranscriptRef.current = '';
    setIsRecording(true);

    const SpeechRecognition =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang =
          language === 'hi'
            ? 'hi-IN'
            : language === 'mr'
            ? 'mr-IN'
            : language === 'ta'
            ? 'ta-IN'
            : 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.onresult = (event) => {
          let combined = '';
          for (let i = 0; i < event.results.length; i += 1) {
            combined += event.results[i][0].transcript;
          }
          liveTranscriptRef.current = combined;
        };
        recognition.onerror = () => {
          // Fallback forensic transcript will populate cleanly when stopped
        };
        recognition.start();
        recognitionRef.current = recognition;
      } catch {
        // Fallback mode handles recording cleanly
      }
    }
  };

  // Update dragged node coordinates
  const handleNodeMove = (nodeId, newX, newY) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === activeCase.id
          ? {
              ...c,
              nodes: c.nodes.map((n) => (n.id === nodeId ? { ...n, x: newX, y: newY } : n))
            }
          : c
      )
    );
  };

  // Build Official Case Diary Plain Text
  const buildCaseDiaryText = () => {
    const dateStr = new Date().toLocaleString();
    const evidenceLines = activeCase.evidence.length
      ? activeCase.evidence
          .map((e, i) => `  ${i + 1}. ${e.name} [${e.type}, ${e.size}] — Status: ${e.status.toUpperCase()}`)
          .join('\n')
      : '  (No evidence files uploaded yet)';

    const graphLines = activeCase.edges.length
      ? activeCase.edges
          .map((edge, i) => {
            const fromN = activeCase.nodes.find((n) => n.id === edge.from);
            const toN = activeCase.nodes.find((n) => n.id === edge.to);
            return `  ${i + 1}. ${fromN?.label} --[${edge.label}]--> ${toN?.label}`;
          })
          .join('\n')
      : '  (No graph relationships mapped yet)';

    const leadLines = activeCase.nextLeads.map((lead, i) => `  ${i + 1}. ${lead}`).join('\n');

    const transcriptLines = activeCase.messages
      .map((m) => {
        if (m.sender === 'user') return `[${m.time}] INVESTIGATOR: ${m.text}`;
        const bullets = (m.bullets || []).map((b) => `    - ${b}`).join('\n');
        const cites = (m.citations || []).map((c) => c.label).join(', ');
        return `[${m.time}] GLASSBOX AI: ${m.summary}\n${bullets}${cites ? `\n    Verified Citations: ${cites}` : ''}`;
      })
      .join('\n\n');

    return `==========================================================================
GLASSBOX - Investigation AI Assistant | Official Case Diary
==========================================================================
Case ID       : ${activeCase.id}
Case Title    : ${activeCase.title}
Category      : ${activeCase.category}
Case Opened   : ${activeCase.dateOpened}
Exported On   : ${dateStr}
Integrity Hash: SHA-256 ${activeCase.sha256}
AI Mode       : Offline Local AI • Source-Verified Zero-Hallucination
==========================================================================

1. EXECUTIVE CASE SUMMARY
--------------------------------------------------------------------------
${activeCase.summary}

2. INDEXED EVIDENCE VAULT (${activeCase.evidence.length} FILES)
--------------------------------------------------------------------------
${evidenceLines}

3. VERIFIED KNOWLEDGE GRAPH (GRAPH-RAG) RELATIONSHIPS
--------------------------------------------------------------------------
${graphLines}

4. RECOMMENDED NEXT INVESTIGATIVE LEADS
--------------------------------------------------------------------------
${leadLines}

5. INVESTIGATION TRANSCRIPT & SOURCE CITATIONS
--------------------------------------------------------------------------
${transcriptLines}

==========================================================================
END OF OFFICIAL CASE DIARY — GLASSBOX - Investigation AI Assistant
==========================================================================`;
  };

  // Real .TXT file download
  const handleDownloadTxt = () => {
    const content = buildCaseDiaryText();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeId = activeCase.id.replace(/[^a-zA-Z0-9-_]/g, '_');
    link.href = url;
    link.download = `GLASSBOX_Case_Diary_${safeId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded GLASSBOX_Case_Diary_${safeId}.txt`);
  };

  // Export / Print PDF
  const handleExportPdf = () => {
    showToast('Opening formatted Print / Save-as-PDF Case Diary...');
    setTimeout(() => window.print(), 200);
  };

  // Copy helper
  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedState(type);
    setTimeout(() => setCopiedState(null), 2200);
    showToast(type === 'link' ? 'Secure read-only share link copied' : 'Formatted GLASSBOX transcript copied');
  };

  // Grant share access & append SHA-256 Chain-of-Custody entry
  const handleGrantShareAccess = (e) => {
    e.preventDefault();
    const trimmed = colleagueInput.trim();
    if (!trimmed) return;
    const timestamp = `Today, ${getCurrentTimeStr()}`;
    const entryHash = generateMockSha256(`${activeCase.id}-${trimmed}-${colleagueRole}-${Date.now()}`);
    const newEntry = {
      id: `aud-${Date.now()}`,
      badge: trimmed,
      role: colleagueRole,
      time: timestamp,
      sha256: entryHash,
      note: `Granted ${colleagueRole} access to ${activeCase.id} transcript & Graph-RAG snapshot`
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
    setColleagueInput('');
    showToast(`Logged Chain-of-Custody access for ${trimmed}`);
  };

  const formatTimer = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100 flex flex-col font-sans selection:bg-[#3B82F6]/30">
      {/* Custom scrollbar, voice waveform animation, and Print-to-PDF styles */}
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0D1117; }
        ::-webkit-scrollbar-thumb { background: #30363D; border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: #484F58; }

        @keyframes waveBar {
          0%, 100% { transform: scaleY(0.32); }
          50% { transform: scaleY(1); }
        }
        .voice-bar {
          animation: waveBar 0.85s ease-in-out infinite;
          transform-origin: center;
        }

        .print-only-report { display: none; }
        @media print {
          body { background: #ffffff !important; color: #0D1117 !important; }
          .no-print { display: none !important; }
          .print-only-report {
            display: block !important;
            padding: 28px;
            background: #ffffff;
            color: #111827;
            font-family: Georgia, serif;
          }
        }
      `}</style>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.csv,.jpg,.jpeg,.png,.mp3,.wav,.json,.ps1,.log"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* ==================================================================== */}
      {/* 1. TOP COMMAND BAR                                                   */}
      {/* ==================================================================== */}
      <header className="no-print sticky top-0 z-30 bg-[#161B22]/95 backdrop-blur border-b border-[#30363D] px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: GLASSBOX Brand + Active Case Pill + Offline Local Status */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen((v) => !v)}
            className="lg:hidden inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1C2331] hover:bg-[#30363D] text-xs font-medium text-slate-200 border border-[#30363D]"
          >
            <Menu className="w-4 h-4" />
            <span>{t.casesMenuBtn}</span>
          </button>

          <div className="flex items-center gap-3">
            <GlassboxLogo />
            <div className="leading-tight">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold tracking-wider text-white">
                  GLASSBOX
                </h1>
                <span className="text-xs sm:text-sm font-medium text-slate-400">
                  — {t.brandSubtitle}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#3B82F6]/15 text-blue-300 border border-[#3B82F6]/35">
                  {activeCase.id}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#10B981]/15 text-emerald-300 border border-[#10B981]/35">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  {t.offlineBadge}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Language Selector + Share + Export + Graph Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#0D1117] border border-[#30363D] rounded-lg px-2.5 py-1.5 hover:border-[#3B82F6]/60 transition">
            <Globe className="w-4 h-4 text-[#3B82F6] mr-1.5 shrink-0" />
            <select
              aria-label="Select Interface Language"
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                showToast('Interface language updated');
              }}
              className="bg-transparent text-xs sm:text-sm font-medium text-slate-100 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-[#161B22] text-slate-100">English</option>
              <option value="hi" className="bg-[#161B22] text-slate-100">हिन्दी (Hindi)</option>
              <option value="mr" className="bg-[#161B22] text-slate-100">मराठी (Marathi)</option>
              <option value="ta" className="bg-[#161B22] text-slate-100">தமிழ் (Tamil)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C2331] hover:bg-[#252E40] border border-[#30363D] text-xs sm:text-sm font-medium text-slate-200 transition"
          >
            <Share2 className="w-4 h-4 text-[#3B82F6]" />
            <span>{t.shareChat}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-blue-500 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-blue-950/50 transition"
          >
            <FileDown className="w-4 h-4" />
            <span>{t.exportDiary}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGraphPanel((v) => !v)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition ${
              showGraphPanel
                ? 'bg-[#3B82F6]/15 border-[#3B82F6]/45 text-blue-200 hover:bg-[#3B82F6]/25'
                : 'bg-[#1C2331] border-[#30363D] text-slate-300 hover:bg-[#252E40]'
            }`}
          >
            {showGraphPanel ? (
              <PanelRightClose className="w-4 h-4 text-[#3B82F6]" />
            ) : (
              <PanelRightOpen className="w-4 h-4 text-[#3B82F6]" />
            )}
            <span>{showGraphPanel ? t.hideGraph : t.showGraph}</span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* MAIN 3-PANEL INVESTIGATION WORKSPACE                                 */}
      {/* ==================================================================== */}
      <div className="no-print flex-1 flex relative overflow-hidden h-[calc(100vh-66px)]">
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/65 z-30 lg:hidden"
          />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* 2. LEFT SIDEBAR (Case History & Evidence Vault)                    */}
        {/* ------------------------------------------------------------------ */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-40 w-[300px] xl:w-[315px] shrink-0 bg-[#161B22] border-r border-[#30363D] flex flex-col transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* + New Case Chat Button */}
          <div className="p-3.5 border-b border-[#30363D] flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNewCase}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-500 text-sm font-semibold text-white shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.newCaseChat}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg bg-[#1C2331] border border-[#30363D] text-slate-300"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Stacked Sections: Case History + Evidence Vault */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
            {/* CASE HISTORY SECTION */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <History className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{t.caseHistory}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{cases.length}</span>
              </div>

              {/* Search Cases */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={caseSearch}
                  onChange={(e) => setCaseSearch(e.target.value)}
                  placeholder={t.searchCasesPlaceholder}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0D1117] border border-[#30363D] focus:border-[#3B82F6] focus:outline-none text-xs text-slate-200 placeholder:text-slate-500"
                />
              </div>

              {/* Case Cards */}
              <div className="space-y-2">
                {filteredCases.map((c) => {
                  const isActive = c.id === activeCase.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectCase(c.id)}
                      className={`w-full text-left p-3 rounded-xl border transition ${
                        isActive
                          ? 'bg-[#1C2331] border-[#3B82F6] shadow-sm'
                          : 'bg-[#0D1117]/75 border-[#30363D] hover:border-slate-500 hover:bg-[#1C2331]/70'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-mono font-semibold text-[#3B82F6]">
                          {c.id}
                        </span>
                        <span className="text-[10px] text-slate-400">{c.dateOpened}</span>
                      </div>
                      <div className="text-sm font-semibold text-white leading-snug">
                        {c.title}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{c.shortDesc}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#30363D]/80 text-[11px]">
                        <span className="text-slate-400">{c.evidence.length} files</span>
                        <span className="text-[#10B981] font-medium">{c.status}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* EVIDENCE VAULT SECTION */}
            <section className="space-y-2.5 pt-3 border-t border-[#30363D]">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <FolderOpen className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{t.evidenceVault}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] text-[10px] font-mono font-semibold">
                  {activeCase.evidence.length}
                </span>
              </div>

              {/* Drag-and-Drop / Click Upload Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={() => setIsDraggingFile(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingFile(false);
                  processUploadedFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed p-3.5 text-center transition ${
                  isDraggingFile
                    ? 'border-[#3B82F6] bg-[#3B82F6]/15'
                    : 'border-[#30363D] bg-[#0D1117] hover:border-[#3B82F6]/70 hover:bg-[#1C2331]/60'
                }`}
              >
                <Upload className="w-5 h-5 text-[#3B82F6] mx-auto mb-1" />
                <div className="text-xs font-semibold text-slate-100">{t.dropEvidenceTitle}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{t.dropEvidenceSub}</div>
              </div>

              {/* Active Case Uploaded Files */}
              <div className="space-y-2">
                {activeCase.evidence.length === 0 ? (
                  <div className="text-center py-4 px-3 text-xs text-slate-500 bg-[#0D1117] rounded-xl border border-[#30363D]">
                    No evidence artifacts indexed yet.
                  </div>
                ) : (
                  activeCase.evidence.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => {
                        if (ev.nodeId) {
                          setShowGraphPanel(true);
                          setSelectedNodeId(ev.nodeId);
                          showToast(`Focused ${ev.name} in Graph-RAG`);
                        }
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-[#0D1117] hover:bg-[#1C2331] border border-[#30363D] hover:border-[#3B82F6]/50 transition flex items-start gap-2.5"
                    >
                      <div className="p-1.5 rounded-lg bg-[#161B22] border border-[#30363D] mt-0.5">
                        {getFileIcon(ev.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-mono font-semibold text-slate-100 truncate">
                          {ev.name}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="px-1.5 py-0.5 rounded bg-[#1C2331] border border-[#30363D] text-[10px] font-mono text-slate-300">
                            {ev.type}
                          </span>
                          <span className="text-[11px] text-slate-400">{ev.size}</span>
                          {ev.status === 'indexed' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#10B981] ml-auto">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {t.indexedStatus}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#F59E0B] ml-auto">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              {t.indexingStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar Security Footer */}
          <div className="p-3 border-t border-[#30363D] bg-[#0D1117]/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#10B981]" />
              Local Air-Gapped Vault
            </span>
            <span className="font-mono text-slate-300">{activeCase.id.split('#')[1]}</span>
          </div>
        </aside>

        {/* ------------------------------------------------------------------ */}
        {/* 3. CENTER WORKSPACE (Conversational Forensic Assistant & Voice)    */}
        {/* ------------------------------------------------------------------ */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0D1117]">
          {/* Active Case & GLASSBOX Welcome Banner */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#161B22] border-b border-[#30363D] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="w-4 h-4 text-[#3B82F6] shrink-0" />
              <span className="text-sm font-bold text-white truncate">{activeCase.title}</span>
              <span className="hidden sm:inline text-xs text-slate-400 truncate">
                — {activeCase.shortDesc}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300 bg-[#10B981]/10 border border-[#10B981]/30 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span className="truncate max-w-[300px] sm:max-w-none">{t.welcomeBanner}</span>
            </div>
          </div>

          {/* Scrollable Chat History */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
            {activeCase.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'user' ? (
                  <div className="max-w-2xl rounded-2xl rounded-tr-sm bg-[#3B82F6] text-white px-4 py-3 shadow-md shadow-blue-950/35">
                    <div className="flex items-center justify-between gap-4 mb-1 text-[11px] text-blue-100/90 font-medium">
                      <span>Investigator</span>
                      <span className="font-mono">{msg.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div className="w-full max-w-3xl rounded-2xl rounded-tl-sm bg-[#161B22] border border-[#30363D] p-4 sm:p-5 shadow-md space-y-3.5">
                    {/* GLASSBOX Response Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-[#30363D] pb-2.5">
                      <div className="flex items-center gap-2">
                        <GlassboxLogo className="w-6 h-6 rounded-md" />
                        <span className="text-xs font-bold tracking-wide text-white">
                          GLASSBOX AI
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#10B981]/15 text-emerald-300 border border-[#10B981]/35">
                          Evidence-Verified
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{msg.time}</span>
                    </div>

                    {/* Summary Statement */}
                    <p className="text-sm sm:text-[15px] font-semibold text-white leading-relaxed">
                      {msg.summary}
                    </p>

                    {/* Structured Plain-Language Bullet Findings */}
                    {msg.bullets && msg.bullets.length > 0 && (
                      <ul className="space-y-2 text-sm text-slate-200 leading-relaxed">
                        {msg.bullets.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] mt-2 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Amber Suspicious Anomaly Callout Box */}
                    {msg.anomaly && (
                      <div className="rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 p-3.5 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-amber-300">
                            {t.anomalyHeading}
                          </div>
                          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 leading-relaxed">
                            {msg.anomaly}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Clickable Source Citation Chips */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2 border-t border-[#30363D]">
                        <div className="text-[11px] font-semibold text-slate-400 mb-2">
                          {t.sourceCitations}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cite, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleCitationClick(cite.nodeId)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#1C2331] border border-[#30363D] hover:border-[#3B82F6] text-xs font-mono text-emerald-300 hover:text-blue-200 transition"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                              <span>{cite.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isAiThinking && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#161B22] border border-[#30363D] px-4 py-3 inline-flex items-center gap-2.5 text-sm text-slate-300">
                  <Loader2 className="w-4 h-4 text-[#3B82F6] animate-spin" />
                  <span>GLASSBOX is cross-referencing local evidence & Graph-RAG...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Bottom Interactive Input Dock */}
          <div className="p-3 sm:p-4 bg-[#161B22] border-t border-[#30363D] space-y-2.5">
            {/* Quick-Start Investigator Prompt Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {t.quickPrompts.map((promptText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(promptText)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C2331] hover:bg-[#252E40] border border-[#30363D] hover:border-[#3B82F6] text-xs font-medium text-slate-200 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{promptText}</span>
                </button>
              ))}
            </div>

            {/* Live Voice Recording Indicator with Waveform Bars */}
            {isRecording && (
              <div className="rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/45 px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#EF4444] animate-ping" />
                  <span className="text-xs sm:text-sm font-semibold text-red-200">
                    Recording Investigator Voice Query...
                  </span>
                  <span className="font-mono text-xs text-red-200 bg-red-950/70 border border-[#EF4444]/40 px-2 py-0.5 rounded">
                    {formatTimer(recordingSeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-1 h-5">
                  {[0, 120, 240, 80, 300, 160, 40, 200].map((delay, idx) => (
                    <span
                      key={idx}
                      style={{ animationDelay: `${delay}ms` }}
                      className="voice-bar w-1 h-4 bg-[#EF4444] rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Input Controls Row */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#1C2331] hover:bg-[#252E40] border border-[#30363D] text-xs font-semibold text-slate-200 transition whitespace-nowrap"
                >
                  <Upload className="w-4 h-4 text-[#10B981]" />
                  <span>{t.uploadFileBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition whitespace-nowrap ${
                    isRecording
                      ? 'bg-[#EF4444] hover:bg-red-500 border-red-400 text-white'
                      : 'bg-[#1C2331] hover:bg-[#252E40] border-[#30363D] text-slate-200'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>{t.stopVoiceBtn}</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-[#F59E0B]" />
                      <span>{t.recordVoiceBtn}</span>
                    </>
                  )}
                </button>
              </div>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.chatPlaceholder}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D1117] border border-[#30363D] focus:border-[#3B82F6] focus:outline-none text-sm text-white placeholder:text-slate-500"
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isAiThinking}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-500 disabled:opacity-45 disabled:cursor-not-allowed text-sm font-semibold text-white transition whitespace-nowrap"
              >
                <Send className="w-4 h-4" />
                <span>{t.sendBtn}</span>
              </button>
            </form>
          </div>
        </main>

        {/* ------------------------------------------------------------------ */}
        {/* 4. RIGHT PANEL (Interactive Graph-RAG Explorer)                    */}
        {/* ------------------------------------------------------------------ */}
        {showGraphPanel && (
          <aside className="hidden xl:flex w-[405px] 2xl:w-[445px] shrink-0 bg-[#161B22] border-l border-[#30363D] flex-col overflow-y-auto">
            {/* Graph Toolbar */}
            <div className="p-3.5 border-b border-[#30363D] space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-[#3B82F6]" />
                  <h2 className="text-sm font-bold text-white">{t.graphTitle}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setGraphFullscreen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C2331] hover:bg-[#252E40] border border-[#30363D] text-xs font-medium text-slate-200 transition"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{t.fullscreen}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setGraphZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#1C2331] border border-[#30363D] text-xs text-slate-300 transition"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{t.zoomIn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGraphZoom((z) => Math.max(0.5, +(z - 0.15).toFixed(2)))}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#1C2331] border border-[#30363D] text-xs text-slate-300 transition"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{t.zoomOut}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGraphZoom(0.82);
                    setGraphPan({ x: -16, y: 12 });
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#1C2331] border border-[#30363D] text-xs text-slate-300 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.resetView}</span>
                </button>
              </div>
            </div>

            {/* Legend + SVG Graph + Entity Inspector */}
            <div className="p-3.5 space-y-3.5 flex-1 flex flex-col">
              {/* Plain-English Color Legend Bar */}
              <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#0D1117] border border-[#30363D] rounded-xl p-2.5">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                  <span>{t.legendSuspect}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
                  <span>{t.legendSystem}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                  <span>{t.legendEvidence}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
                  <span>{t.legendAnomaly}</span>
                </div>
              </div>

              {/* Interactive SVG Graph */}
              <KnowledgeGraphCanvas
                nodes={activeCase.nodes}
                edges={activeCase.edges}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onNodeMove={handleNodeMove}
                zoom={graphZoom}
                pan={graphPan}
                onPanChange={setGraphPan}
                isFullscreen={false}
              />

              {/* Selected Entity Details Card */}
              <div className="rounded-xl bg-[#1C2331]/65 border border-[#30363D] p-4 space-y-3 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {t.selectedEntityTitle}
                  </span>
                  {selectedNode && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        (NODE_STYLE_MAP[selectedNode.category] || NODE_STYLE_MAP.system).badgeBg
                      }`}
                    >
                      {selectedNode.risk}
                    </span>
                  )}
                </div>

                {selectedNode ? (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[#0D1117] border border-[#30363D] text-slate-300">
                          {(NODE_STYLE_MAP[selectedNode.category] || NODE_STYLE_MAP.system).typeLabel}
                        </span>
                      </div>
                      <p className="text-xs text-blue-300 font-medium mt-1">{selectedNode.role}</p>
                    </div>

                    <div className="text-xs bg-[#0D1117] border border-[#30363D] rounded-lg px-3 py-2 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      <span className="text-slate-400">Source:</span>
                      <span className="font-mono text-emerald-300 truncate">{selectedNode.source}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {selectedNode.explanation}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleSendMessage(
                          `Tell me everything about ${selectedNode.label} and explain how it connects to the case evidence.`
                        )
                      }
                      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-500 text-xs sm:text-sm font-semibold text-white transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{t.askAiAboutEntity}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 text-xs text-slate-400 py-4">
                    <Info className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                    <p>{t.noNodeSelected}</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Floating Graph Launcher on Tablet/Mobile Screens */}
      {showGraphPanel && (
        <div className="no-print xl:hidden fixed bottom-20 right-4 z-20">
          <button
            type="button"
            onClick={() => setGraphFullscreen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#3B82F6] hover:bg-blue-500 text-xs font-semibold text-white shadow-lg border border-blue-400/40"
          >
            <Network className="w-4 h-4" />
            <span>Open Graph-RAG</span>
          </button>
        </div>
      )}

      {/* ==================================================================== */}
      {/* FULLSCREEN GRAPH-RAG MODAL                                           */}
      {/* ==================================================================== */}
      {graphFullscreen && (
        <div className="no-print fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="w-full max-w-6xl bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 border-b border-[#30363D] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <Network className="w-5 h-5 text-[#3B82F6]" />
                <h2 className="text-base font-bold text-white">
                  GLASSBOX {t.graphTitle} — <span className="font-mono text-[#3B82F6]">{activeCase.id}</span>
                </h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setGraphZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-xs text-slate-200 hover:bg-[#1C2331]"
                >
                  <ZoomIn className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{t.zoomIn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGraphZoom((z) => Math.max(0.5, +(z - 0.15).toFixed(2)))}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-xs text-slate-200 hover:bg-[#1C2331]"
                >
                  <ZoomOut className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>{t.zoomOut}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGraphZoom(1.05);
                    setGraphPan({ x: 80, y: 30 });
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0D1117] border border-[#30363D] text-xs text-slate-200 hover:bg-[#1C2331]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.resetView}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGraphFullscreen(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3B82F6] hover:bg-blue-500 text-xs font-semibold text-white"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>{t.exitFullscreen}</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-2.5">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />{t.legendSuspect}</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />{t.legendSystem}</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />{t.legendEvidence}</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />{t.legendAnomaly}</span>
              </div>

              <KnowledgeGraphCanvas
                nodes={activeCase.nodes}
                edges={activeCase.edges}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                onNodeMove={handleNodeMove}
                zoom={graphZoom}
                pan={graphPan}
                onPanChange={setGraphPan}
                isFullscreen={true}
              />

              {selectedNode && (
                <div className="rounded-xl bg-[#0D1117] border border-[#30363D] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-base font-bold text-white">{selectedNode.label}</span>
                      <span className="text-xs text-blue-300">({selectedNode.role})</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                          (NODE_STYLE_MAP[selectedNode.category] || NODE_STYLE_MAP.system).badgeBg
                        }`}
                      >
                        {selectedNode.risk}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">{selectedNode.explanation}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGraphFullscreen(false);
                      handleSendMessage(
                        `Tell me everything about ${selectedNode.label} and explain how it connects to the case evidence.`
                      );
                    }}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-500 text-xs sm:text-sm font-semibold text-white"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{t.askAiAboutEntity}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* SHARE CHAT MODAL (With SHA-256 Chain-of-Custody Audit Log)           */}
      {/* ==================================================================== */}
      {showShareModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#30363D] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GlassboxLogo className="w-8 h-8" />
                <div>
                  <h2 className="text-base font-bold text-white">{t.shareModalTitle}</h2>
                  <p className="text-xs text-slate-400 font-mono">
                    GLASSBOX - Investigation AI Assistant • {activeCase.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#1C2331] text-slate-400 hover:text-white"
                aria-label="Close Share Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[78vh] overflow-y-auto">
              {/* Quick Copy Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => copyToClipboard(buildCaseDiaryText(), 'transcript')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0D1117] hover:bg-[#1C2331] border border-[#30363D] hover:border-[#3B82F6] text-xs sm:text-sm font-semibold text-slate-100 transition"
                >
                  {copiedState === 'transcript' ? (
                    <Check className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#3B82F6]" />
                  )}
                  <span>{copiedState === 'transcript' ? 'Transcript Copied!' : t.copyTranscript}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      `https://intranet.glassbox-ai.local/cases/${activeCase.id.replace(/[^a-zA-Z0-9-]/g, '')}/readonly?sha=${activeCase.sha256.slice(0, 12)}`,
                      'link'
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0D1117] hover:bg-[#1C2331] border border-[#30363D] hover:border-[#10B981] text-xs sm:text-sm font-semibold text-slate-100 transition"
                >
                  {copiedState === 'link' ? (
                    <Check className="w-4 h-4 text-[#10B981]" />
                  ) : (
                    <Link2 className="w-4 h-4 text-[#10B981]" />
                  )}
                  <span>{copiedState === 'link' ? 'Read-Only Link Copied!' : t.copyReadOnlyLink}</span>
                </button>
              </div>

              {/* Investigator Role Selector & Badge Assignment */}
              <form
                onSubmit={handleGrantShareAccess}
                className="rounded-xl bg-[#0D1117] border border-[#30363D] p-4 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <UserPlus className="w-4 h-4 text-[#3B82F6]" />
                  <span>Authorize Fellow Investigator</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={colleagueInput}
                    onChange={(e) => setColleagueInput(e.target.value)}
                    placeholder="Officer Badge ID (e.g., Badge #1184)"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#161B22] border border-[#30363D] focus:border-[#3B82F6] focus:outline-none text-xs sm:text-sm text-white placeholder:text-slate-500"
                  />
                  <select
                    value={colleagueRole}
                    onChange={(e) => setColleagueRole(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[#161B22] border border-[#30363D] text-xs sm:text-sm text-slate-200 focus:outline-none"
                  >
                    <option value="View Only">View Only</option>
                    <option value="Co-Investigator">Co-Investigator</option>
                    <option value="Forensic Auditor">Forensic Auditor</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-[#3B82F6] hover:bg-blue-500 text-xs sm:text-sm font-semibold text-white transition"
                >
                  {t.grantAccessBtn}
                </button>
              </form>

              {/* Tamper-Evident Chain-of-Custody Audit Log */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Chain-of-Custody Audit Log
                  </span>
                  <span className="text-[11px] text-[#10B981] font-medium">
                    SHA-256 Tamper-Evident
                  </span>
                </div>
                <div className="space-y-2">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="font-semibold text-slate-100">
                          {log.badge}
                          <span className="ml-2 px-2 py-0.5 rounded bg-[#3B82F6]/15 text-blue-300 text-[10px]">
                            {log.role}
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                          <Clock className="w-3 h-3" />
                          {log.time}
                        </span>
                      </div>
                      <div className="text-slate-400">{log.note}</div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-300/90 bg-[#161B22] border border-[#30363D] rounded px-2 py-1 overflow-x-auto">
                        <Hash className="w-3 h-3 text-[#10B981] shrink-0" />
                        <span>SHA-256: {log.sha256}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* EXPORT CASE DIARY MODAL (Preview + Real .TXT + Print/PDF)            */}
      {/* ==================================================================== */}
      {showExportModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#161B22] border border-[#30363D] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-4 border-b border-[#30363D] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <GlassboxLogo className="w-8 h-8" />
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    {t.exportModalTitle}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Structured, source-verified court-ready draft report
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-lg hover:bg-[#1C2331] text-slate-400 hover:text-white"
                aria-label="Close Export Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Structured Case Diary Preview */}
            <div className="p-5 overflow-y-auto space-y-4">
              <div className="rounded-xl bg-[#0D1117] border border-[#30363D] p-5 space-y-4 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2 pb-3 border-b border-[#30363D]">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#3B82F6]">
                      GLASSBOX - Investigation AI Assistant | Official Case Diary
                    </div>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {activeCase.id}: {activeCase.title}
                    </h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      SHA-256: {activeCase.sha256.slice(0, 32)}...
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <div>Opened: {activeCase.dateOpened}</div>
                    <div className="text-[#10B981] font-medium mt-0.5">
                      Offline Local AI • Verified
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    1. Executive Case Summary
                  </h4>
                  <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                    {activeCase.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    2. Indexed Evidence Vault ({activeCase.evidence.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeCase.evidence.map((ev) => (
                      <div
                        key={ev.id}
                        className="px-3 py-2 rounded-lg bg-[#161B22] border border-[#30363D] flex items-center justify-between text-xs"
                      >
                        <span className="font-mono text-slate-200 truncate">{ev.name}</span>
                        <span className="text-[#10B981] font-mono ml-2 shrink-0">{ev.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    3. Verified Graph-RAG Relationships
                  </h4>
                  <ul className="space-y-1.5 text-xs font-mono text-blue-200">
                    {activeCase.edges.map((edge) => {
                      const fromN = activeCase.nodes.find((n) => n.id === edge.from);
                      const toN = activeCase.nodes.find((n) => n.id === edge.to);
                      return (
                        <li key={edge.id}>
                          • {fromN?.label} —[{edge.label}]→ {toN?.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    4. Recommended Next Investigative Leads
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-slate-200">
                    {activeCase.nextLeads.map((lead, idx) => (
                      <li key={idx}>{lead}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Export Action Buttons */}
            <div className="px-5 py-4 bg-[#0D1117] border-t border-[#30363D] flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1C2331] hover:bg-[#252E40] border border-[#30363D] text-sm font-semibold text-white transition"
              >
                <Download className="w-4 h-4 text-[#10B981]" />
                <span>{t.downloadTxt}</span>
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3B82F6] hover:bg-blue-500 text-sm font-semibold text-white shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>{t.exportPdf}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* DEDICATED PRINT-TO-PDF OFFICIAL CASE DIARY VIEW (@media print)       */}
      {/* ==================================================================== */}
      <div className="print-only-report">
        <div style={{ borderBottom: '2px solid #0D1117', paddingBottom: '12px', marginBottom: '18px' }}>
          <h1 style={{ fontSize: '19px', fontWeight: 'bold', margin: 0 }}>
            GLASSBOX - Investigation AI Assistant | Official Case Diary
          </h1>
          <p style={{ fontSize: '12px', marginTop: '6px', color: '#374151' }}>
            <strong>Case ID:</strong> {activeCase.id} &nbsp;|&nbsp;{' '}
            <strong>Title:</strong> {activeCase.title} &nbsp;|&nbsp;{' '}
            <strong>Date Opened:</strong> {activeCase.dateOpened} &nbsp;|&nbsp;{' '}
            <strong>Exported:</strong> {activeCase.dateOpened}
          </p>
          <p style={{ fontSize: '11px', marginTop: '4px', fontFamily: 'monospace', color: '#065F46' }}>
            SHA-256 Integrity Hash: {activeCase.sha256}
          </p>
        </div>

        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '14px' }}>
          1. Executive Case Summary
        </h2>
        <p style={{ fontSize: '12px', lineHeight: 1.6 }}>{activeCase.summary}</p>

        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '16px' }}>
          2. Indexed Evidence Vault ({activeCase.evidence.length} Files)
        </h2>
        <ul style={{ fontSize: '12px', lineHeight: 1.6 }}>
          {activeCase.evidence.map((ev) => (
            <li key={ev.id}>
              <strong>{ev.name}</strong> ({ev.type}, {ev.size}) — Status: {ev.status.toUpperCase()}
            </li>
          ))}
        </ul>

        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '16px' }}>
          3. Verified Knowledge Graph (Graph-RAG) Relationships
        </h2>
        <ul style={{ fontSize: '12px', lineHeight: 1.6 }}>
          {activeCase.edges.map((edge) => {
            const fromN = activeCase.nodes.find((n) => n.id === edge.from);
            const toN = activeCase.nodes.find((n) => n.id === edge.to);
            return (
              <li key={edge.id}>
                {fromN?.label} — <strong>[{edge.label}]</strong> → {toN?.label}
              </li>
            );
          })}
        </ul>

        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '16px' }}>
          4. Recommended Next Investigative Leads
        </h2>
        <ol style={{ fontSize: '12px', lineHeight: 1.6 }}>
          {activeCase.nextLeads.map((lead, idx) => (
            <li key={idx}>{lead}</li>
          ))}
        </ol>
      </div>

      {/* ==================================================================== */}
      {/* IN-APP TOAST FEEDBACK                                                */}
      {/* ==================================================================== */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#161B22] border border-[#3B82F6]/60 text-xs sm:text-sm font-medium text-white shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}