// Sidebar
interface SidebarLinks {
    [key: string]: string
}
const superAdminSidebarLinks: SidebarLinks = {
    "إدارة المسئولين": "/super-admin/manage-admins",
    "إضافة مسئول جديد": "/super-admin/add-admin"
}
const adminSidebarLinks: SidebarLinks = {
    "عرض الرومات": "/admin/display-rooms",
    "إدارة الرومات": "/admin/manage-rooms",
    "إدارة البوفيه": "/admin/manage-buffet",
    "إدارة الفواتير": "/admin/manage-invoices",
    "الإيرادات": "/admin/income",
}
// const operatorSidebarLinks: SidebarLinks = {
//     "إدارة الرومات": "/operator/manage-rooms",
// }

// Manage Rooms
const MANAGE_ROOMS_SELECT_OPTIONS = [
    "الكل",
    "المُفعل فقط",
    "المُعطل فقط"
];

// Manage Rooms
interface Room {
    id?: string;
    name: string;
    isActive: boolean;
    deActiveReason?: string;
    isBooked?: boolean;
    contents: string[];
    costPerHourForSingle: string | number | readonly string[];
    costPerHourForMulti: string | number | readonly string[];
    playingMode?: string;
    startTime?: string;
    endTime?: string | null;
    totalCost?: number;
    maxFreeTime: string | number | readonly string[];
    notes: string;
    userId: string;
    openingInvoiceId?: string;
}

const INITIAL_ROOM_INFO_STRUCTURE : Room = {
    id: "",
    name: "",
    contents: [],
    isActive: true,
    costPerHourForSingle: "",
    costPerHourForMulti: "",
    maxFreeTime: "",
    playingMode: "",
    notes: "",
    userId: "",
    isBooked: false,
    startTime: "",
    endTime: "",
    totalCost: 0,
}

const INITIAL_ROOM_INFO_STRUCTURE_ARRAY = [INITIAL_ROOM_INFO_STRUCTURE]
// Create A New Interface From <Room> Without Specific Props
type EditableRoom = Omit<Room, ('id' | 'isBooked' | 'startTime' | 'endTime' | 'playingMode' | 'totalCost')>; /**** */

const INITIAL_EDITABLE_ROOM_INFO_STRUCTURE : EditableRoom = {
    name: "",
    contents: [],
    isActive: true,
    costPerHourForSingle: "",
    costPerHourForMulti: "",
    maxFreeTime: "",
    notes: "",
    userId: ""
}

const MANAGE_ROOMS_Table_HEADS = [
    "الرقم/الإسم",
    "الحالة",
    "سبب التعطيل",
    "المحتويات",
    "سعر الساعة الفردي",
    "سعر الساعة المالتي",
    "الوقت الحُر",
    "ملاحظات" 
]


interface Buffet {
    id: "",
    name: string;
    price: string;
    discountedPrice: string;
    stock: number;
    userId: string;
}

const INITIAL_BUFFET_INFO : Buffet = {
    id: '',
    name: "",
    price: "",
    discountedPrice: "",
    stock: 0,
    userId: ""
}

const MANAGE_BUFFET_TABLE_HEADS = [
    "الإسم",
    "السعر",
    "السعر بعد الخصم/للعاملين",
    "المخزون"
]
const MANAGE_INVOICES_TABLE_HEADS = [
    "تاريخ",
    "روم",
    "اسم العميل",
    "وضع اللعب",
    "مدة اللعب",
    "البوفيه",
    "إجمالي المبلغ"
]
const MANAGE_ADMINS_TABLE_HEADS = [
    "تاريخ",
    "الإسم",
    "الإيميل",
    "الحالة"
]


// Admin Info
interface Admin {
    name:      string   
    email:     string  
    password?: string
    role:      "ADMIN"
    isActive?: boolean
}


const INITIAL_ADMIN_INFO : Admin = {
    name: "",
    email: "",
    role: 'ADMIN',
    isActive: true
}

type BuffetItem = {
    name: string,
    price: string,
    qty: number;
}

interface Invoice {
    id?: string;
    customerName: string;
    roomName: string;
    playingMode?: string;
    totalSpentHours: number;
    totalSpentMins: number;
    totalBuffetTaken: BuffetItem[];
    totalPlayingPrice: number;
    totalBuffetPrice: number;
    totalPrice: number;
    userId: string;
}

const INITIAL_INVOICE_INFO: Invoice = {
    customerName: '',
    roomName: '',
    playingMode: '',
    totalSpentHours: 0,
    totalSpentMins: 0,
    totalBuffetTaken: [],
    totalPlayingPrice: 0,
    totalBuffetPrice: 0,
    totalPrice: 0,
    userId: '',
}

interface IncomeRecord {
    id: string;
    periodStart: string;
    periodEnd: string;
    playingIncome: number;
    buffetIncome: number;
    totalIncome: number;
    createdAt: string;
    updatedAt: string;
}

interface IncomeSummary {
    playingIncome: number;
    buffetIncome: number;
    totalIncome: number;
}

interface IncomeResponse {
    records: IncomeRecord[];
    summary: IncomeSummary;
}


export {
    superAdminSidebarLinks,
    adminSidebarLinks,
    // operatorSidebarLinks,
    MANAGE_ROOMS_SELECT_OPTIONS,
    MANAGE_ROOMS_Table_HEADS,
    MANAGE_BUFFET_TABLE_HEADS,
    MANAGE_INVOICES_TABLE_HEADS,
    MANAGE_ADMINS_TABLE_HEADS,
    INITIAL_ROOM_INFO_STRUCTURE,
    INITIAL_EDITABLE_ROOM_INFO_STRUCTURE,
    INITIAL_ROOM_INFO_STRUCTURE_ARRAY,
    INITIAL_BUFFET_INFO,
    INITIAL_INVOICE_INFO,
    INITIAL_ADMIN_INFO
}
export type {
    Room,
    Admin,
    EditableRoom, 
    Buffet,
    BuffetItem,
    Invoice,
    IncomeRecord,
    IncomeResponse,
    IncomeSummary
}