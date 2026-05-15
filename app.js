function uid() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const SUPABASE_URL = "https://fcizffijtbfsixqpyiof.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_kV_lCtSEz-1o7stgnLyv0w_CoyXx2cr";
const CLOUD_STATE_ID = "cerberus-main";
const cloudClient = window.supabase?.createClient?.(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
let cloudSaveTimer = null;
let cloudSaving = false;
let suppressCloudSave = false;

const locationOptions = {
  countries: ["Молдова", "ПМР"],
  cities: {
    "Молдова": ["Кишинев", "Бельцы", "Бендеры", "Комрат", "Кагул", "Унгены", "Оргеев", "Сороки", "Хынчешты", "Чадыр-Лунга", "Дрокия", "Страшены", "Единцы", "Каушаны", "Рышканы", "Флорешты", "Чимишлия", "Калараш", "Ниспорены", "Леова", "Фалешты", "Тараклия", "Теленешты", "Резина", "Штефан-Водэ", "Окница", "Бричаны", "Дондюшаны", "Шолданешты", "Басарабяска", "Криуляны", "Яловены", "Глодяны", "Сынжерей", "Кантемир"],
    "ПМР": ["Тирасполь", "Бендеры", "Рыбница", "Дубоссары", "Слободзея", "Григориополь", "Каменка", "Днестровск"]
  },
  districts: {
    "Молдова": ["Кишинев", "Бельцы", "Бендеры", "Гагаузия", "Анений Ной", "Басарабяска", "Бричаны", "Кагул", "Кантемир", "Калараш", "Каушаны", "Чимишлия", "Криуляны", "Дондюшаны", "Дрокия", "Дубоссары", "Единцы", "Фалешты", "Флорешты", "Глодяны", "Хынчешты", "Яловены", "Леова", "Ниспорены", "Окница", "Оргеев", "Резина", "Рышканы", "Сынжерей", "Сороки", "Страшены", "Шолданешты", "Штефан-Водэ", "Тараклия", "Теленешты", "Унгены"],
    "ПМР": ["Тирасполь", "Бендеры", "Каменский район", "Рыбницкий район", "Дубоссарский район", "Григориопольский район", "Слободзейский район"]
  }
};
const chisinauDistricts = ["Центр", "Ботаника", "Буюканы", "Рышкановка", "Чеканы", "Телецентр", "Скулянка", "Старая Почта", "Дурлешты", "Кодру", "Аэропорт"];
const iconOptions = ["❄️", "💎", "💊", "🍫", "🌳", "🎆", "💉", "🏥", "🧊", "🪪", "💱", "🧳"];

const defaultProducts = [
  {
    id: uid(),
    name: "Продажа ❄️",
    category: "Мерч",
    price: 0,
    vendor: "snowboard",
    city: "Кишинев",
    countries: ["Молдова"],
    cities: ["Кишинев"],
    districts: chisinauDistricts,
    iconTags: ["❄️"],
    rating: 4.9,
    description: "Связь с оператором SnowBoard по карточке профиля.",
    image: "assets/snowboard.jpg",
    weight: "1 заявка",
    locationType: "Онлайн",
    stockItems: [
      { id: uid(), text: "SnowBoard: заявка принята, оператор свяжется с вами в чате.", sold: false }
    ]
  },
  {
    id: uid(),
    name: "Обмен криптовалюты",
    category: "Заявки",
    price: 0,
    vendor: "cryptonyx",
    city: "Молдова",
    countries: ["Молдова"],
    cities: [...locationOptions.cities["Молдова"]],
    districts: [...locationOptions.districts["Молдова"]],
    iconTags: ["💱", "🧳"],
    rating: 4.9,
    description: "1$ = 19 лей",
    image: "assets/cryptonyx.jpg",
    weight: "1 заявка",
    locationType: "Онлайн",
    stockItems: [
      { id: uid(), text: "CryptonyX: заявка на обмен криптовалюты принята, оператор свяжется с вами в чате.", sold: false }
    ]
  },
  {
    id: uid(),
    name: "Обнал криптовалюты",
    category: "Заявки",
    price: 0,
    vendor: "cryptonyx",
    city: "Молдова",
    countries: ["Молдова"],
    cities: [...locationOptions.cities["Молдова"]],
    districts: [...locationOptions.districts["Молдова"]],
    iconTags: ["💱", "🧳"],
    rating: 4.9,
    description: "1$ = 17 лей",
    image: "assets/cryptonyx.jpg",
    weight: "1 заявка",
    locationType: "Онлайн",
    stockItems: [
      { id: uid(), text: "CryptonyX: заявка на обнал криптовалюты принята, оператор свяжется с вами в чате.", sold: false }
    ]
  },
  {
    id: uid(),
    name: "Покупка верификацией карточек/кошельков",
    category: "Услуги",
    price: 150,
    vendor: "redqueen",
    city: "Молдова и ПМР",
    countries: ["Молдова", "ПМР"],
    cities: [...locationOptions.cities["Молдова"], ...locationOptions.cities["ПМР"]],
    districts: [...locationOptions.districts["Молдова"], ...locationOptions.districts["ПМР"]],
    iconTags: ["🪪", "💱"],
    rating: 4.88,
    description: "Покупка/Продажа карт и кошельков верификации.",
    image: "assets/red-queen-buy-card-verification.jpg",
    weight: "1 заявка",
    locationType: "Онлайн",
    stockItems: [
      { id: uid(), text: "Red Queen: заявка на покупку верификацией принята, оператор свяжется с вами в чате.", sold: false },
      { id: uid(), text: "Red Queen: резервная заявка на покупку верификацией.", sold: false }
    ]
  },
  {
    id: uid(),
    name: "Продажа верификаций карточек и кошельков",
    category: "Услуги",
    price: 180,
    vendor: "redqueen",
    city: "Молдова и ПМР",
    countries: ["Молдова", "ПМР"],
    cities: [...locationOptions.cities["Молдова"], ...locationOptions.cities["ПМР"]],
    districts: [...locationOptions.districts["Молдова"], ...locationOptions.districts["ПМР"]],
    iconTags: ["🪪", "💱"],
    rating: 4.86,
    description: "Покупка/Продажа карт и кошельков верификации.",
    image: "assets/red-queen-sell-card-verification.jpg",
    weight: "1 заявка",
    locationType: "Онлайн",
    stockItems: [
      { id: uid(), text: "Red Queen: заявка на продажу верификаций принята, оператор свяжется с вами в чате.", sold: false },
      { id: uid(), text: "Red Queen: резервная заявка на продажу верификаций.", sold: false }
    ]
  }
];

const defaultAnnouncements = [
  {
    id: uid(),
    title: "Добро пожаловать в Cerberus",
    type: "Новость",
    body: "Cerberus запущен: витрина, корзина, профили, сообщения и заказы доступны после входа.",
    createdAt: new Date().toLocaleString("ru-RU"),
    read: false
  },
  {
    id: uid(),
    title: "Сохрани сайт на главный экран",
    type: "Важное",
    body: "Нажми «Добавить на экран» в верхней панели, чтобы открыть инструкцию для iPhone, Android и Windows.",
    createdAt: new Date().toLocaleString("ru-RU"),
    read: false
  }
];

const defaultAccounts = [
  {
    login: "admin2",
    loginKey: "admin2",
    password: "admin12345",
    role: "admin",
    createdAt: new Date().toISOString()
  },
  {
    login: "admin",
    loginKey: "admin",
    password: "admin12345",
    role: "admin",
    createdAt: new Date().toISOString()
  }
];

function ensureDefaultAccounts() {
  accounts = (Array.isArray(accounts) ? accounts : []).map((account) => ({
    ...account,
    login: String(account.login || "").trim(),
    loginKey: String(account.loginKey || account.login || "").trim().toLowerCase()
  })).filter((account) => account.login);

  defaultAccounts.forEach((defaultAccount) => {
    const existing = accounts.find((account) => account.loginKey === defaultAccount.loginKey);
    if (!existing) {
      accounts.push({ ...defaultAccount });
      return;
    }
    existing.role = defaultAccount.role;
    if (!existing.password) {
      existing.password = defaultAccount.password;
    }
  });
}

const defaultVendors = [
  {
    id: uid(),
    name: "snowboard",
    login: "snowboard_owner",
    password: "market123",
    status: "Активен",
    description: "Профиль SnowBoard с аватаркой, описанием, каталогом и личными сообщениями.",
    title: "SnowBoard",
    type: "Магазины",
    avatar: "assets/snowboard.jpg",
    city: "Кишинев",
    countries: ["Молдова"],
    cities: ["Кишинев"],
    districts: chisinauDistricts,
    iconTags: ["❄️"],
    telegram: "https://t.me/snowboardmdbot",
    featured: true,
    topOrder: 1,
    paymentMode: "planned",
    paymentCurrency: "USDT",
    paymentNote: "Крипто-оплата подключается через защищенный сервер."
  },
  {
    id: uid(),
    name: "cryptonyx",
    login: "cryptonyx_owner",
    password: "market123",
    status: "Активен",
    description: "Профиль обменника CryptonyX с заявками, каталогом и сообщениями.",
    title: "CryptonyX",
    type: "Обменники",
    avatar: "assets/cryptonyx.jpg",
    city: "Молдова",
    countries: ["Молдова"],
    cities: [...locationOptions.cities["Молдова"]],
    districts: [...locationOptions.districts["Молдова"]],
    telegram: "https://t.me/cryptonyxor",
    featured: true,
    topOrder: 2,
    paymentMode: "planned",
    paymentCurrency: "USDT",
    paymentNote: "Крипто-оплата подключается через защищенный сервер."
  },
  {
    id: uid(),
    name: "redqueen",
    login: "redqueen_owner",
    password: "market123",
    status: "Активен",
    description: "Скупка/Продажа карт/кошельков.",
    title: "Red Queen",
    type: "Услуги",
    avatar: "assets/red-queen.jpg",
    city: "Молдова и ПМР",
    telegram: "https://t.me/redqueenmd",
    countries: ["Молдова", "ПМР"],
    cities: [...locationOptions.cities["Молдова"], ...locationOptions.cities["ПМР"]],
    districts: [...locationOptions.districts["Молдова"], ...locationOptions.districts["ПМР"]],
    iconTags: ["🪪", "💱"],
    featured: true,
    topOrder: 3,
    paymentMode: "planned",
    paymentCurrency: "USDT",
    paymentNote: "Крипто-оплата подключается через защищенный сервер."
  }
];

const storage = {
  memory: {},
  get(key, fallback) {
    try {
      const stored = localStorage.getItem(key);
      if (stored === null && Object.prototype.hasOwnProperty.call(this.memory, key)) {
        return this.memory[key];
      }
      return JSON.parse(stored) ?? fallback;
    } catch {
      return Object.prototype.hasOwnProperty.call(this.memory, key) ? this.memory[key] : fallback;
    }
  },
  set(key, value) {
    this.memory[key] = value;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }
};

let products = storage.get("cerberusProducts", defaultProducts);
let cart = storage.get("cerberusCart", []);
let orders = storage.get("cerberusOrders", []);
const defaultProfile = { nickname: "", avatar: "", bio: "", photoUrl: "", city: "", contact: "", completedDeals: 0 };
let profiles = storage.get("cerberusProfiles", {});
let profile = storage.get("cerberusProfile", defaultProfile);
let wallet = storage.get("cerberusWallet", { balance: 500, activity: ["Стартовый баланс: +500 CRB"] });
let accounts = storage.get("cerberusAccounts", defaultAccounts);
let session = storage.get("cerberusSession", null);
let vendors = storage.get("cerberusVendors", defaultVendors);
let conversations = storage.get("cerberusConversations", []);
let activeConversationId = storage.get("cerberusActiveConversation", null);
let globalChat = storage.get("cerberusGlobalChat", []);
let announcements = storage.get("cerberusAnnouncements", defaultAnnouncements);
let reviews = storage.get("cerberusReviews", []);
let selectedVendorName = storage.get("cerberusSelectedVendor", vendors[0]?.name || "");
let activeFilters = storage.get("cerberusFilters", {
  country: "",
  city: "",
  district: "",
  icon: ""
});
let selectedPayment = "wallet";
let activeCategory = "Все";
let activeDirectoryType = storage.get("cerberusDirectoryType", "Все");
if (!["Все", "Магазины", "Обменники", "Услуги"].includes(activeDirectoryType)) {
  activeDirectoryType = "Все";
}
let authMode = "login";
let captchaAnswer = 0;

products = products.map((product, index) => ({ order: index, ...product }));
profile = {
  ...defaultProfile,
  ...profile
};
profiles = profiles && typeof profiles === "object" && !Array.isArray(profiles) ? profiles : {};
ensureDefaultAccounts();
vendors = (vendors.length ? vendors : defaultVendors).map((vendor) => ({
  title: vendor.name,
  type: "Магазины",
  avatar: "assets/cerberus-logo-transparent.png",
  city: "Online",
  ...vendor,
  login: String(vendor.login || "").trim(),
  loginKey: String(vendor.loginKey || vendor.login || "").trim().toLowerCase()
}));
defaultVendors.forEach((defaultVendor) => {
  if (!vendors.some((vendor) => vendor.name === defaultVendor.name)) {
    vendors.push({
      ...defaultVendor,
      id: uid(),
      loginKey: normalizeLogin(defaultVendor.login)
    });
  }
});
const pinnedVendorNames = ["snowboard", "cryptonyx", "redqueen"];
products = products.filter((product) => pinnedVendorNames.includes(product.vendor));
defaultProducts.forEach((defaultProduct) => {
  if (!products.some((product) => product.vendor === defaultProduct.vendor && product.name === defaultProduct.name)) {
    products.push({
      ...defaultProduct,
      id: uid(),
      order: products.length
    });
  }
});

function ensurePinnedDefaults() {
  vendors = (vendors.length ? vendors : defaultVendors).map((vendor) => ({
    title: vendor.name,
    type: "Магазины",
    avatar: "assets/cerberus-logo-transparent.png",
    city: "Online",
    ...vendor,
    login: String(vendor.login || "").trim(),
    loginKey: String(vendor.loginKey || vendor.login || "").trim().toLowerCase()
  }));
  defaultVendors.forEach((defaultVendor) => {
    const existingVendor = vendors.find((vendor) => vendor.name === defaultVendor.name);
    if (!existingVendor) {
      vendors.push({
        ...defaultVendor,
        id: uid(),
        loginKey: normalizeLogin(defaultVendor.login)
      });
    } else if (defaultVendor.name === "redqueen") {
      Object.assign(existingVendor, {
        description: defaultVendor.description,
        countries: defaultVendor.countries,
        cities: defaultVendor.cities,
        districts: defaultVendor.districts,
        iconTags: defaultVendor.iconTags,
        city: defaultVendor.city,
        type: defaultVendor.type,
        avatar: defaultVendor.avatar,
        telegram: defaultVendor.telegram,
        topOrder: defaultVendor.topOrder,
        featured: true
      });
    } else if (["snowboard", "cryptonyx"].includes(defaultVendor.name)) {
      Object.assign(existingVendor, {
        countries: defaultVendor.countries,
        cities: defaultVendor.cities,
        districts: defaultVendor.districts,
        iconTags: defaultVendor.iconTags,
        city: defaultVendor.city,
        telegram: defaultVendor.telegram,
        topOrder: defaultVendor.topOrder,
        featured: true
      });
    }
  });
  products = products
    .filter((product) => pinnedVendorNames.includes(product.vendor))
    .map((product, index) => ({ order: index, ...product }));
  const defaultProductNamesByVendor = defaultProducts.reduce((acc, product) => {
    acc[product.vendor] = acc[product.vendor] || new Set();
    acc[product.vendor].add(product.name);
    return acc;
  }, {});
  products = products.filter((product) => {
    if (!["cryptonyx", "snowboard"].includes(product.vendor)) return true;
    return defaultProductNamesByVendor[product.vendor]?.has(product.name);
  });
  defaultProducts.forEach((defaultProduct) => {
    const existingProduct = products.find((product) => product.vendor === defaultProduct.vendor && product.name === defaultProduct.name);
    if (!existingProduct) {
      products.push({
        ...defaultProduct,
        id: uid(),
        order: products.length
      });
    } else if (["redqueen", "cryptonyx", "snowboard"].includes(defaultProduct.vendor)) {
      Object.assign(existingProduct, {
        category: defaultProduct.category,
        name: defaultProduct.name,
        description: defaultProduct.description,
        countries: defaultProduct.countries,
        cities: defaultProduct.cities,
        districts: defaultProduct.districts,
        iconTags: defaultProduct.iconTags,
        city: defaultProduct.city,
        image: defaultProduct.image,
        weight: defaultProduct.weight,
        locationType: defaultProduct.locationType
      });
    }
  });
}

ensurePinnedDefaults();

const el = {
  authScreen: document.querySelector("#authScreen"),
  authForm: document.querySelector("#authForm"),
  authTitle: document.querySelector("#authTitle"),
  authSubmit: document.querySelector("#authSubmit"),
  authError: document.querySelector("#authError"),
  authTabs: document.querySelectorAll("[data-auth-mode]"),
  captchaQuestion: document.querySelector("#captchaQuestion"),
  captchaRefresh: document.querySelector("#captchaRefresh"),
  logout: document.querySelector("#logoutButton"),
  installOpen: document.querySelector("#installOpen"),
  installFromProfile: document.querySelector("#installFromProfile"),
  installDrawer: document.querySelector("#installDrawer"),
  installClose: document.querySelector("#installClose"),
  filterOpen: document.querySelector("#filterOpen"),
  filterDrawer: document.querySelector("#filterDrawer"),
  filterClose: document.querySelector("#filterClose"),
  filterReset: document.querySelector("#filterReset"),
  filterForm: document.querySelector("#filterForm"),
  paymentDrawer: document.querySelector("#paymentDrawer"),
  paymentClose: document.querySelector("#paymentClose"),
  paymentWalletAmount: document.querySelector("#paymentWalletAmount"),
  confirmPayment: document.querySelector("#confirmPayment"),
  paymentOptions: document.querySelectorAll(".payment-option"),
  announcementModal: document.querySelector("#announcementModal"),
  announcementTitle: document.querySelector("#announcementTitle"),
  announcementBody: document.querySelector("#announcementBody"),
  announcementClose: document.querySelector("#announcementClose"),
  announcementOk: document.querySelector("#announcementOk"),
  navItems: document.querySelectorAll(".nav-item"),
  views: document.querySelectorAll(".view"),
  search: document.querySelector("#searchInput"),
  categoryTabs: document.querySelector("#categoryTabs"),
  marketTitle: document.querySelector("#marketTitle"),
  productGrid: document.querySelector("#productGrid"),
  productTemplate: document.querySelector("#productTemplate"),
  directoryTemplate: document.querySelector("#directoryTemplate"),
  cartToggle: document.querySelector("#cartToggle"),
  cartClose: document.querySelector("#cartClose"),
  cartDrawer: document.querySelector("#cartDrawer"),
  cartCount: document.querySelector("#cartCount"),
  cartList: document.querySelector("#cartList"),
  cartTotal: document.querySelector("#cartTotal"),
  checkout: document.querySelector("#checkoutButton"),
  ordersList: document.querySelector("#ordersList"),
  clearOrders: document.querySelector("#clearOrders"),
  conversationList: document.querySelector("#conversationList"),
  chatTitle: document.querySelector("#chatTitle"),
  chatThread: document.querySelector("#chatThread"),
  chatForm: document.querySelector("#chatForm"),
  newSupportChat: document.querySelector("#newSupportChat"),
  globalChatList: document.querySelector("#globalChatList"),
  globalChatForm: document.querySelector("#globalChatForm"),
  newsList: document.querySelector("#newsList"),
  markNewsRead: document.querySelector("#markNewsRead"),
  walletBalance: document.querySelector("#walletBalance"),
  addCredits: document.querySelector("#addCredits"),
  activityList: document.querySelector("#activityList"),
  profileForm: document.querySelector("#profileForm"),
  profilePreview: document.querySelector("#profilePreview"),
  productForm: document.querySelector("#productForm"),
  vendorForm: document.querySelector("#vendorForm"),
  broadcastForm: document.querySelector("#broadcastForm"),
  adminList: document.querySelector("#adminList"),
  adminVendorList: document.querySelector("#adminVendorList"),
  vendorCabinetSelect: document.querySelector("#vendorCabinetSelect"),
  vendorSummary: document.querySelector("#vendorSummary"),
  vendorProductList: document.querySelector("#vendorProductList"),
  vendorMessageList: document.querySelector("#vendorMessageList"),
  vendorProfileForm: document.querySelector("#vendorProfileForm"),
  vendorItemForm: document.querySelector("#vendorItemForm"),
  paymentSettingsForm: document.querySelector("#paymentSettingsForm"),
  profileDrawer: document.querySelector("#profileDrawer"),
  profileDrawerClose: document.querySelector("#profileDrawerClose"),
  publicProfileTitle: document.querySelector("#publicProfileTitle"),
  publicProfile: document.querySelector("#publicProfile"),
  resetCatalog: document.querySelector("#resetCatalog"),
  themeToggle: document.querySelector("#themeToggle"),
  statOrders: document.querySelector("#statOrders"),
  statProducts: document.querySelector("#statProducts")
};

function persist() {
  syncActiveProfile();
  const results = [
    storage.set("cerberusProducts", products),
    storage.set("cerberusCart", cart),
    storage.set("cerberusOrders", orders),
    storage.set("cerberusProfiles", profiles),
    storage.set("cerberusProfile", profile),
    storage.set("cerberusWallet", wallet),
    storage.set("cerberusAccounts", accounts),
    storage.set("cerberusSession", session),
    storage.set("cerberusVendors", vendors),
    storage.set("cerberusConversations", conversations),
    storage.set("cerberusActiveConversation", activeConversationId),
    storage.set("cerberusGlobalChat", globalChat),
    storage.set("cerberusAnnouncements", announcements),
    storage.set("cerberusReviews", reviews),
    storage.set("cerberusSelectedVendor", selectedVendorName),
    storage.set("cerberusFilters", activeFilters),
    storage.set("cerberusDirectoryType", activeDirectoryType)
  ];
  if (!suppressCloudSave) {
    scheduleCloudSave();
  }
  return results.every(Boolean);
}

function money(value) {
  return `${Number(value).toLocaleString("ru-RU")} CRB`;
}

function normalizeLogin(value) {
  return String(value || "").trim().toLowerCase();
}

async function hashPassword(loginKey, password) {
  const source = `${normalizeLogin(loginKey)}:${String(password || "")}`;
  const bytes = new TextEncoder().encode(source);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureCredentialHashes() {
  const groups = [accounts, vendors];
  for (const group of groups) {
    for (const item of group) {
      if (!item.passwordHash && item.password) {
        item.passwordHash = await hashPassword(item.loginKey || item.login, item.password);
      }
      delete item.password;
    }
  }
}

async function credentialMatches(item, loginKey, password) {
  if (!item) return false;
  if (item.passwordHash) {
    return item.passwordHash === await hashPassword(loginKey, password);
  }
  if (item.password === password) {
    item.passwordHash = await hashPassword(loginKey, password);
    delete item.password;
    return true;
  }
  return false;
}

function normalizeProfile(value) {
  return { ...defaultProfile, ...(value && typeof value === "object" ? value : {}) };
}

function activeLoginKey() {
  return normalizeLogin(session?.loginKey || session?.login);
}

function isOwnerAdmin() {
  return activeLoginKey() === "admin2";
}

function vendorForSession() {
  const key = activeLoginKey();
  return vendors.find((vendor) => (vendor.loginKey || normalizeLogin(vendor.login)) === key);
}

function canUseVendorCabinet() {
  return isOwnerAdmin() || Boolean(vendorForSession());
}

function enforceAccessView(name) {
  if (name === "admin" && !isOwnerAdmin()) return "market";
  if (name === "vendor" && !canUseVendorCabinet()) return "market";
  return name;
}

function syncActiveProfile() {
  const key = activeLoginKey();
  if (!key) return;
  profiles[key] = normalizeProfile(profile);
}

function loadActiveProfile() {
  const key = activeLoginKey();
  if (!key) return;
  profile = normalizeProfile(profiles[key] || profile);
  profile.nickname = profile.nickname || session.login || "";
  profiles[key] = profile;
}

function cloudState() {
  syncActiveProfile();
  return {
    products,
    cart,
    orders,
    profiles,
    wallet,
    accounts,
    vendors,
    conversations,
    activeConversationId,
    globalChat,
    announcements,
    reviews,
    selectedVendorName,
    activeFilters,
    activeDirectoryType
  };
}

function applyCloudState(data) {
  if (!data || typeof data !== "object") return;
  products = Array.isArray(data.products) ? data.products : products;
  cart = Array.isArray(data.cart) ? data.cart : cart;
  orders = Array.isArray(data.orders) ? data.orders : orders;
  profiles = data.profiles && typeof data.profiles === "object" && !Array.isArray(data.profiles) ? data.profiles : profiles;
  wallet = data.wallet && typeof data.wallet === "object" ? data.wallet : wallet;
  accounts = Array.isArray(data.accounts) ? data.accounts : accounts;
  vendors = Array.isArray(data.vendors) ? data.vendors : vendors;
  conversations = Array.isArray(data.conversations) ? data.conversations : conversations;
  activeConversationId = typeof data.activeConversationId === "string" ? data.activeConversationId : activeConversationId;
  globalChat = Array.isArray(data.globalChat) ? data.globalChat : globalChat;
  announcements = Array.isArray(data.announcements) ? data.announcements : announcements;
  reviews = Array.isArray(data.reviews) ? data.reviews : reviews;
  selectedVendorName = typeof data.selectedVendorName === "string" ? data.selectedVendorName : selectedVendorName;
  activeFilters = data.activeFilters && typeof data.activeFilters === "object" ? data.activeFilters : activeFilters;
  activeDirectoryType = typeof data.activeDirectoryType === "string" ? data.activeDirectoryType : activeDirectoryType;
  ensureDefaultAccounts();
  ensurePinnedDefaults();
  loadActiveProfile();
}

async function loadCloudState() {
  if (!cloudClient) return;
  const { data, error } = await cloudClient
    .from("cerberus_state")
    .select("data")
    .eq("id", CLOUD_STATE_ID)
    .maybeSingle();
  if (error) {
    console.warn("Supabase load failed", error.message);
    return;
  }
  if (data?.data) {
    suppressCloudSave = true;
    applyCloudState(data.data);
    persist();
    suppressCloudSave = false;
    scheduleCloudSave();
  }
}

function scheduleCloudSave() {
  if (!cloudClient || suppressCloudSave) return;
  window.clearTimeout(cloudSaveTimer);
  cloudSaveTimer = window.setTimeout(saveCloudState, 650);
}

async function saveCloudState() {
  if (!cloudClient || cloudSaving) return;
  cloudSaving = true;
  await ensureCredentialHashes();
  const { error } = await cloudClient
    .from("cerberus_state")
    .upsert({
      id: CLOUD_STATE_ID,
      data: cloudState(),
      updated_at: new Date().toISOString()
    });
  if (error) {
    console.warn("Supabase save failed", error.message);
  }
  cloudSaving = false;
}

function currentUserName() {
  return profile.nickname?.trim() || session?.login || "Пользователь";
}

function profileAvatar() {
  return profile.avatar?.trim() || "assets/cerberus-logo-transparent.png";
}

function profileScore() {
  return orders.length + Number(profile.completedDeals || 0);
}

function rankForScore(score) {
  if (score >= 50) return { name: "Легенда", className: "rank-legend" };
  if (score >= 25) return { name: "Элита", className: "rank-elite" };
  if (score >= 12) return { name: "Ветеран", className: "rank-veteran" };
  if (score >= 7) return { name: "Сержант", className: "rank-sergeant" };
  if (score >= 3) return { name: "Рядовой", className: "rank-private" };
  return { name: "Новичок", className: "rank-newbie" };
}

function currentRank() {
  return rankForScore(profileScore());
}

function renderMedia(message) {
  if (!message.mediaUrl) return "";
  const url = escapeHtml(message.mediaUrl);
  if (message.mediaType === "image") {
    return `<img class="chat-media" src="${url}" alt="">`;
  }
  if (message.mediaType === "video") {
    return `<video class="chat-media" src="${url}" controls></video>`;
  }
  if (message.mediaType === "audio") {
    return `<audio class="chat-media" src="${url}" controls></audio>`;
  }
  if (message.mediaType === "file") {
    return `<a class="chat-media-link" href="${url}" target="_blank" rel="noreferrer">Скачать файл</a>`;
  }
  return `<a class="chat-media-link" href="${url}" target="_blank" rel="noreferrer">Открыть медиа</a>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function productCode(product) {
  return product.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function asArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : [];
}

function hasFilterValue(values, filterValue) {
  if (!filterValue) return true;
  return asArray(values).some((value) => String(value).toLowerCase() === String(filterValue).toLowerCase());
}

function splitList(value) {
  return String(value || "")
    .split(/[,\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseIcons(value) {
  return String(value || "")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function reviewsForVendor(vendorName) {
  return reviews.filter((review) => review.vendor === vendorName);
}

function ratingForVendor(vendorName) {
  const vendorReviews = reviewsForVendor(vendorName);
  if (!vendorReviews.length) return "5.00";
  const sum = vendorReviews.reduce((total, review) => total + Number(review.rating || 5), 0);
  return (sum / vendorReviews.length).toFixed(2);
}

function currentReviewKey() {
  return activeLoginKey() || "guest";
}

function canReviewVendor(vendorName) {
  const key = currentReviewKey();
  return !reviews.some((review) => review.vendor === vendorName && review.authorKey === key);
}

function buildDirectoryEntries() {
  return vendors
    .filter((vendor) => vendor.featured !== false && (vendor.featured || ["snowboard", "cryptonyx", "redqueen"].includes(vendor.name)))
    .map((vendor, index) => {
      const count = vendorProducts(vendor.name).length;
      return {
        id: `vendor-${vendor.id || index}`,
        type: vendor.type || "Магазины",
        name: vendor.title || vendor.name,
        vendor: vendor.name,
        city: vendor.city || "Online",
        countries: asArray(vendor.countries),
        cities: asArray(vendor.cities || vendor.city),
        districts: asArray(vendor.districts),
        iconTags: asArray(vendor.iconTags),
        rating: ratingForVendor(vendor.name),
        reviews: reviewsForVendor(vendor.name).length,
        deals: 0,
        description: vendor.description || "Профиль создан в админке.",
        avatar: vendor.avatar || "assets/cerberus-logo-transparent.png",
        priceLabel: vendor.type === "Обменники" ? "Обменник" : vendor.type === "Услуги" ? "Услуга" : "Магазин"
      };
    })
    .map((entry) => ({
      ...entry,
      description: entry.vendor === "redqueen" ? entry.description : ""
    }));
}

function currentDirectoryEntries() {
  const query = el.search.value.trim().toLowerCase();
  const filtered = buildDirectoryEntries().filter((entry) => {
    const typeMatch = activeDirectoryType === "Все" || entry.type === activeDirectoryType;
    const countryMatch = hasFilterValue(entry.countries, activeFilters.country);
    const cityMatch = !activeFilters.city || hasFilterValue(entry.cities, activeFilters.city) || entry.city.toLowerCase().includes(activeFilters.city.toLowerCase());
    const districtMatch = hasFilterValue(entry.districts, activeFilters.district);
    const iconMatch = hasFilterValue(entry.iconTags, activeFilters.icon);
    const queryMatch = [entry.name, entry.type, entry.vendor, entry.city, entry.description]
      .join(" ")
      .toLowerCase()
      .includes(query);
    return typeMatch && countryMatch && cityMatch && districtMatch && iconMatch && queryMatch;
  });

  return filtered
    .sort((a, b) => {
      const vendorA = vendors.find((vendor) => vendor.name === a.vendor);
      const vendorB = vendors.find((vendor) => vendor.name === b.vendor);
      return Number(vendorA?.topOrder ?? 999) - Number(vendorB?.topOrder ?? 999);
    })
    .slice(0, 10);
}

function defaultCatalogForEntry(entry) {
  const title = entry.name || entry.vendor;
  if (entry.type === "Обменники") {
    return [
      {
        name: `${title} Express`,
        category: "Заявки",
        price: 25,
        description: "Быстрая заявка на консультацию и расчет условий обмена.",
        weight: "1 заявка",
        locationType: "Онлайн"
      },
      {
        name: `${title} Priority`,
        category: "Заявки",
        price: 50,
        description: "Приоритетное сопровождение обменной заявки через сообщения.",
        weight: "1 заявка",
        locationType: "Онлайн"
      }
    ];
  }

  if (entry.type === "Услуги") {
    return [
      {
        name: `${title} Start`,
        category: "Услуги",
        price: 80,
        description: "Стартовый пакет услуги с описанием задачи и ответом исполнителя.",
        weight: "1 услуга",
        locationType: "Онлайн"
      },
      {
        name: `${title} Pro`,
        category: "Услуги",
        price: 160,
        description: "Расширенный пакет услуги с дополнительными правками и поддержкой.",
        weight: "1 услуга",
        locationType: "Онлайн"
      }
    ];
  }

  return [
    {
      name: `${title} Digital Pack`,
      category: "Цифровые товары",
      price: 120,
      description: "Цифровой товар с автоматической выдачей после оформления заказа.",
      weight: "1 файл",
      locationType: "Онлайн"
    },
    {
      name: `${title} Merch Drop`,
      category: "Мерч",
      price: 240,
      description: "Фирменная карточка товара с описанием, остатком и сообщениями продавцу.",
      weight: "1 шт",
      locationType: "Доставка"
    },
    {
      name: `${title} Custom Order`,
      category: "Услуги",
      price: 180,
      description: "Индивидуальный заказ через профиль магазина и личный чат.",
      weight: "1 заказ",
      locationType: "После связи"
    }
  ];
}

function ensureDirectoryVendor(entry) {
  let vendor = vendors.find((item) => item.name === entry.vendor);
  if (!vendor) {
    vendor = {
      id: uid(),
      name: entry.vendor,
      login: `${entry.vendor}_owner`.slice(0, 24),
      loginKey: normalizeLogin(`${entry.vendor}_owner`.slice(0, 24)),
      password: "change-me",
      status: "Активен",
      description: entry.description,
      title: entry.name,
      type: entry.type,
      avatar: "assets/cerberus-logo-transparent.png",
      city: entry.city || "Online",
      paymentMode: "planned",
      paymentCurrency: "USDT",
      paymentNote: "Крипто-оплата подключается через защищенный сервер."
    };
    vendors.push(vendor);
  }

  if (!vendorProducts(vendor.name).length) {
    defaultCatalogForEntry(entry).forEach((item, index) => {
      products.push({
        id: uid(),
        ...item,
        vendor: vendor.name,
        city: vendor.city || entry.city || "Online",
        rating: Number(entry.rating) || 4.9,
        order: products.length + index,
        image: vendor.avatar || "assets/cerberus-logo-transparent.png",
        stockItems: [
          { id: uid(), text: `${item.name}: заказ принят. Продавец свяжется с вами в чате.`, sold: false },
          { id: uid(), text: `${item.name}: резервная выдача для следующего заказа.`, sold: false }
        ]
      });
    });
  }

  persist();
}

function renderCategories() {
  const categories = ["Все", "Магазины", "Обменники", "Услуги"];
  const titleMap = {
    "Все": 'ТОП - 10 <span class="elite-title">ЭЛИТА</span>',
    "Магазины": "Магазины",
    "Обменники": "Обменники",
    "Услуги": "Услуги"
  };
  el.marketTitle.innerHTML = titleMap[activeDirectoryType] || "Магазины";
  el.categoryTabs.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.classList.toggle("is-active", category === activeDirectoryType);
    button.addEventListener("click", () => {
      activeDirectoryType = category;
      render();
    });
    el.categoryTabs.append(button);
  });
}

function renderAccessControls() {
  el.navItems.forEach((item) => {
    const view = item.dataset.view;
    const hidden = view === "wallet" || (view === "admin" && !isOwnerAdmin()) || (view === "vendor" && !canUseVendorCabinet());
    item.hidden = hidden;
    if (hidden && item.classList.contains("is-active")) {
      showView("market");
    }
  });
  if (el.vendorCabinetSelect) {
    el.vendorCabinetSelect.hidden = !isOwnerAdmin();
  }
}

function renderProducts() {
  const visible = currentDirectoryEntries();
  el.productGrid.innerHTML = "";

  if (!visible.length) {
    el.productGrid.innerHTML = '<div class="empty-state">Ничего не найдено.</div>';
    return;
  }

  visible.forEach((entry, index) => {
    const node = el.directoryTemplate.content.firstElementChild.cloneNode(true);
    const cover = node.querySelector(".directory-cover");
    cover.src = entry.avatar || "assets/cerberus-logo-transparent.png";
    cover.alt = entry.name;
    node.querySelector(".category-pill").textContent = entry.type;
    node.querySelector(".rating").textContent = `★ ${entry.rating}`;
    node.querySelector("h3").textContent = entry.name;
    node.querySelector("p").textContent = entry.description;
    node.querySelector(".vendor").textContent = `@${entry.vendor}`;
    node.querySelector(".city").textContent = entry.city;
    node.querySelector(".directory-stats").textContent = `${entry.reviews.toLocaleString("ru-RU")} отзывов · ${entry.deals.toLocaleString("ru-RU")} сделок`;
    node.querySelector(".price").textContent = entry.priceLabel;
    node.addEventListener("click", () => {
      ensureDirectoryVendor(entry);
      openPublicProfile(entry.vendor);
    });
    node.querySelector(".open-directory-button").addEventListener("click", (event) => {
      event.stopPropagation();
      ensureDirectoryVendor(entry);
      openPublicProfile(entry.vendor);
    });
    el.productGrid.append(node);
  });
}

function renderCart() {
  el.cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  el.cartList.innerHTML = "";

  if (!cart.length) {
    el.cartList.innerHTML = '<div class="empty-state">Корзина пустая.</div>';
  }

  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (!product) return;
    const row = document.createElement("div");
    row.className = "line-item line-item-row";
    row.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <span>${item.quantity} × ${money(product.price)}</span>
      </div>
      <button type="button" aria-label="Удалить">Удалить</button>
    `;
    row.querySelector("button").addEventListener("click", () => removeFromCart(item.id));
    el.cartList.append(row);
  });

  el.cartTotal.textContent = money(cartTotal());
}

function renderOrders() {
  el.ordersList.innerHTML = "";
  if (!orders.length) {
    el.ordersList.innerHTML = '<div class="empty-state">Пока нет заказов.</div>';
    return;
  }

  orders.forEach((order) => {
    const item = document.createElement("article");
    item.className = "order-item";
    item.innerHTML = `
      <strong>Заказ ${order.id}</strong>
      <span>${order.createdAt}</span>
      <span>${order.items.length} поз. · ${money(order.total)}</span>
    `;
    el.ordersList.append(item);
  });
}

function renderConversations() {
  el.conversationList.innerHTML = "";
  if (!conversations.length) {
    el.conversationList.innerHTML = '<div class="empty-state">Нет диалогов. Напиши продавцу из карточки товара или оператору.</div>';
  }

  conversations.forEach((conversation) => {
    const last = conversation.messages.at(-1);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "conversation-item";
    button.classList.toggle("is-active", conversation.id === activeConversationId);
    button.innerHTML = `
      <strong>${escapeHtml(conversation.title)}</strong>
      <span>${last ? escapeHtml(last.text) : "Новый диалог"}</span>
    `;
    button.addEventListener("click", () => {
      activeConversationId = conversation.id;
      render();
    });
    el.conversationList.append(button);
  });

  const active = conversations.find((conversation) => conversation.id === activeConversationId);
  el.chatTitle.textContent = active ? active.title : "Выберите чат";
  el.chatThread.innerHTML = "";

  if (!active) {
    el.chatThread.innerHTML = '<div class="empty-state">Здесь появится переписка.</div>';
    return;
  }

  active.messages.forEach((message) => {
    message.id = message.id || uid();
    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${message.from === "me" ? "from-me" : "from-them"}`;
    bubble.innerHTML = `
      <strong>${message.from === "me" ? "Вы" : escapeHtml(active.title)}</strong>
      <span>${escapeHtml(message.text)}</span>
      ${renderMedia(message)}
      <div class="message-tools">
        <button type="button" data-action="react" data-emoji="👍">👍 ${message.reactions?.["👍"] || ""}</button>
        <button type="button" data-action="react" data-emoji="🔥">🔥 ${message.reactions?.["🔥"] || ""}</button>
        <button type="button" data-action="react" data-emoji="✅">✅ ${message.reactions?.["✅"] || ""}</button>
      </div>
      <small>${escapeHtml(message.time)}</small>
    `;
    bubble.querySelectorAll("[data-action='react']").forEach((button) => {
      button.addEventListener("click", () => reactConversationMessage(active.id, message.id, button.dataset.emoji));
    });
    el.chatThread.append(bubble);
  });
}

function renderGlobalChat() {
  el.globalChatList.innerHTML = "";
  if (!globalChat.length) {
    el.globalChatList.innerHTML = '<div class="empty-state">Пока нет сообщений. Будь первым.</div>';
    return;
  }

  globalChat.forEach((message) => {
    const item = document.createElement("article");
    item.className = "global-chat-message";
    const canManage = message.authorKey === normalizeLogin(session?.login) || isOwnerAdmin();
    item.innerHTML = `
      <img src="${escapeHtml(message.avatar || "assets/cerberus-logo-transparent.png")}" alt="">
      <div>
        <div class="global-chat-head">
          <strong>${escapeHtml(message.author || "Пользователь")}</strong>
          <span class="rank-badge ${escapeHtml(message.rankClass || "rank-newbie")}">${escapeHtml(message.rank || "Новичок")}</span>
          <small>${escapeHtml(message.time)}</small>
        </div>
        <p>${escapeHtml(message.text)}</p>
        ${renderMedia(message)}
        <div class="message-tools">
          <button type="button" data-action="react" data-emoji="👍">👍 ${message.reactions?.["👍"] || ""}</button>
          <button type="button" data-action="react" data-emoji="🔥">🔥 ${message.reactions?.["🔥"] || ""}</button>
          <button type="button" data-action="react" data-emoji="✅">✅ ${message.reactions?.["✅"] || ""}</button>
          ${canManage ? '<button type="button" data-action="edit">Изменить</button><button type="button" data-action="delete">Удалить у всех</button>' : ""}
        </div>
      </div>
    `;
    item.querySelectorAll("[data-action='react']").forEach((button) => {
      button.addEventListener("click", () => reactGlobalMessage(message.id, button.dataset.emoji));
    });
    item.querySelector("[data-action='edit']")?.addEventListener("click", () => editGlobalMessage(message.id));
    item.querySelector("[data-action='delete']")?.addEventListener("click", () => deleteGlobalMessage(message.id));
    el.globalChatList.append(item);
  });
}

function renderNews() {
  el.newsList.innerHTML = "";
  if (!announcements.length) {
    el.newsList.innerHTML = '<div class="empty-state">Рассылок пока нет.</div>';
    return;
  }

  announcements.forEach((item) => {
    const article = document.createElement("article");
    article.className = "news-item";
    article.innerHTML = `
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <span>${escapeHtml(item.createdAt)}</span>
        <p>${escapeHtml(item.body)}</p>
      </div>
      <span class="news-badge">${escapeHtml(item.type)}</span>
    `;
    el.newsList.append(article);
  });
}

function renderFilterForm() {
  if (!el.filterForm) return;
  const countrySelect = el.filterForm.elements.country;
  const citySelect = el.filterForm.elements.city;
  const districtSelect = el.filterForm.elements.district;
  const iconSelect = el.filterForm.elements.icon;
  const countries = locationOptions.countries;
  const selectedCountry = activeFilters.country || "";
  const cities = selectedCountry ? locationOptions.cities[selectedCountry] || [] : [...new Set(Object.values(locationOptions.cities).flat())];
  const districts = selectedCountry ? locationOptions.districts[selectedCountry] || [] : [...new Set(Object.values(locationOptions.districts).flat())];

  if (countrySelect) {
    countrySelect.innerHTML = '<option value="">Любая страна</option>' + countries.map((country) => `<option>${country}</option>`).join("");
  }
  if (citySelect) {
    citySelect.innerHTML = '<option value="">Любой город</option>' + cities.map((city) => `<option>${city}</option>`).join("");
  }
  if (districtSelect) {
    districtSelect.innerHTML = '<option value="">Любой район</option>' + districts.map((district) => `<option>${district}</option>`).join("");
  }
  if (iconSelect) {
    iconSelect.innerHTML = '<option value="">Все категории</option>' + iconOptions.map((icon) => `<option value="${icon}">${icon}</option>`).join("");
  }

  Object.entries(activeFilters).forEach(([key, value]) => {
    if (el.filterForm.elements[key]) {
      el.filterForm.elements[key].value = value;
    }
  });
}

function renderWallet() {
  el.walletBalance.textContent = money(wallet.balance);
  el.activityList.innerHTML = "";
  wallet.activity.slice(-8).reverse().forEach((activity) => {
    const item = document.createElement("div");
    item.className = "activity-item";
    item.textContent = activity;
    el.activityList.append(item);
  });
}

function renderProfile() {
  const rank = currentRank();
  el.profilePreview.innerHTML = `
    <div class="profile-preview-head">
      <img src="${escapeHtml(profileAvatar())}" alt="">
      <div>
        <strong>${escapeHtml(currentUserName())}</strong>
        <span class="rank-badge ${rank.className}">${rank.name}</span>
        <p>${profileScore()} завершенных действий: покупки и закрытые обмены.</p>
      </div>
    </div>
    ${profile.bio ? `<p>${escapeHtml(profile.bio)}</p>` : ""}
    ${profile.photoUrl ? `<img class="profile-cover-photo" src="${escapeHtml(profile.photoUrl)}" alt="">` : ""}
  `;
  el.profileForm.nickname.value = profile.nickname;
  el.profileForm.avatar.value = profile.avatar;
  el.profileForm.bio.value = profile.bio;
  el.profileForm.photoUrl.value = profile.photoUrl;
  el.profileForm.city.value = profile.city;
  el.profileForm.contact.value = profile.contact;
}

function renderAdmin() {
  if (!isOwnerAdmin()) {
    el.adminList.innerHTML = "";
    el.adminVendorList.innerHTML = "";
    return;
  }
  el.adminList.innerHTML = "";
  products
    .slice()
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .forEach((product) => {
    const item = document.createElement("div");
    item.className = "admin-product-editor";
    item.innerHTML = `
      <label>
        Название
        <input data-field="name" value="${escapeHtml(product.name)}" maxlength="42">
      </label>
      <label>
        Категория
        <input data-field="category" value="${escapeHtml(product.category)}" maxlength="32">
      </label>
      <label>
        Цена
        <input data-field="price" type="number" min="1" max="9999" value="${product.price}">
      </label>
      <label>
        Магазин
        <input data-field="vendor" value="${escapeHtml(product.vendor)}" maxlength="28">
      </label>
      <label class="wide">
        Описание
        <textarea data-field="description" maxlength="180">${escapeHtml(product.description)}</textarea>
      </label>
      <div class="admin-editor-actions wide">
        <button class="ghost-button" type="button" data-action="up">Выше</button>
        <button class="ghost-button" type="button" data-action="down">Ниже</button>
        <button class="primary-button" type="button" data-action="save">Сохранить</button>
        <button class="ghost-button danger-action" type="button" data-action="delete">Удалить</button>
      </div>
    `;
    item.querySelector('[data-action="save"]').addEventListener("click", () => saveProductEditor(product.id, item));
    item.querySelector('[data-action="delete"]').addEventListener("click", () => deleteProduct(product.id));
    item.querySelector('[data-action="up"]').addEventListener("click", () => moveProduct(product.id, -1));
    item.querySelector('[data-action="down"]').addEventListener("click", () => moveProduct(product.id, 1));
    el.adminList.append(item);
  });

  el.adminVendorList.innerHTML = "";
  vendors.forEach((vendor) => {
    const item = document.createElement("div");
    item.className = "vendor-admin-item";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(vendor.name)}</strong>
        <span>${escapeHtml(vendor.status)} · login: ${escapeHtml(vendor.login)} · ${vendorProducts(vendor.name).length} карточек</span>
        <p>${escapeHtml(vendor.description || "Без описания")}</p>
      </div>
      <div class="admin-product-editor wide">
        <label>
          Логин владельца
          <input data-field="vendorLogin" value="${escapeHtml(vendor.login || "")}" maxlength="32">
        </label>
        <label>
          Новый пароль
          <input data-field="vendorPassword" type="password" maxlength="48" placeholder="Оставь пустым">
        </label>
        <label>
          Тип
          <select data-field="vendorType">
            <option ${vendor.type === "Магазины" ? "selected" : ""}>Магазины</option>
            <option ${vendor.type === "Обменники" ? "selected" : ""}>Обменники</option>
            <option ${vendor.type === "Услуги" ? "selected" : ""}>Услуги</option>
          </select>
        </label>
        <label>
          Топ-10
          <select data-field="vendorFeatured">
            <option value="true" ${vendor.featured !== false ? "selected" : ""}>В топе</option>
            <option value="false" ${vendor.featured === false ? "selected" : ""}>Скрыт из топа</option>
          </select>
        </label>
        <label>
          Позиция
          <input data-field="vendorTopOrder" type="number" min="1" max="10" value="${escapeHtml(vendor.topOrder || "")}">
        </label>
        <label>
          Страна
          <input data-field="vendorCountries" value="${escapeHtml(asArray(vendor.countries).join(", "))}" maxlength="80">
        </label>
        <label>
          Город
          <input data-field="vendorCities" value="${escapeHtml(asArray(vendor.cities || vendor.city).join(", "))}" maxlength="120">
        </label>
        <label>
          Районы
          <input data-field="vendorDistricts" value="${escapeHtml(asArray(vendor.districts).join(", "))}" maxlength="180">
        </label>
        <label>
          Иконки
          <input data-field="vendorIcons" value="${escapeHtml(asArray(vendor.iconTags).join(" "))}" maxlength="40">
        </label>
        <label>
          Telegram
          <input data-field="vendorTelegram" value="${escapeHtml(vendor.telegram || "")}" maxlength="140">
        </label>
      </div>
      <div class="admin-editor-actions">
        <button class="primary-button" type="button" data-action="save">Сохранить</button>
        <button class="ghost-button" type="button" data-action="open">Открыть</button>
        <button class="ghost-button danger-action" type="button" data-action="delete">Удалить</button>
      </div>
    `;
    item.querySelector('[data-action="save"]').addEventListener("click", () => saveVendorAdmin(vendor.name, item));
    item.querySelector('[data-action="open"]').addEventListener("click", () => {
      selectedVendorName = vendor.name;
      showView("vendor");
      render();
    });
    item.querySelector('[data-action="delete"]').addEventListener("click", () => deleteVendor(vendor.name));
    el.adminVendorList.append(item);
  });
}

function renderStats() {
  el.statOrders.textContent = 0;
  el.statProducts.textContent = products.length;
}

function vendorProducts(name) {
  return products
    .filter((product) => product.vendor === name)
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
}

function parseStockText(text) {
  return String(text || "")
    .split(/\n\s*\n+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((text) => ({ id: uid(), text, sold: false }));
}

function availableStock(product) {
  return (product.stockItems || []).filter((item) => !item.sold).length;
}

function selectedVendor() {
  const sessionKey = normalizeLogin(session?.login);
  const sessionVendor = vendors.find((vendor) => (vendor.loginKey || normalizeLogin(vendor.login)) === sessionKey);
  const selectedName = !isOwnerAdmin() && sessionVendor ? sessionVendor.name : (selectedVendorName || sessionVendor?.name || vendors[0]?.name || "");
  return vendors.find((entry) => entry.name === selectedName) || vendors[0];
}

function renderVendorCabinet() {
  el.vendorCabinetSelect.innerHTML = "";
  const availableVendors = isOwnerAdmin() ? vendors : vendors.filter((vendor) => vendor.name === vendorForSession()?.name);
  availableVendors.forEach((vendor) => {
    const option = document.createElement("option");
    option.value = vendor.name;
    option.textContent = vendor.name;
    el.vendorCabinetSelect.append(option);
  });

  if (!availableVendors.length) {
    el.vendorSummary.innerHTML = '<div class="empty-state">К этому аккаунту пока не привязан кабинет. Админ должен назначить профиль.</div>';
    el.vendorProductList.innerHTML = "";
    el.vendorMessageList.innerHTML = "";
    return;
  }

  const sessionVendor = vendorForSession();
  const selectedName = !isOwnerAdmin() && sessionVendor ? sessionVendor.name : (selectedVendorName || availableVendors[0].name);
  selectedVendorName = selectedName;
  el.vendorCabinetSelect.value = selectedName;
  const vendor = vendors.find((entry) => entry.name === selectedName) || vendors[0];
  const storeProducts = vendorProducts(vendor.name);
  const storeConversations = conversations.filter((conversation) => conversation.key === `vendor:${vendor.name}`);

  el.vendorSummary.innerHTML = `
    <article class="vendor-summary-card">
      <div class="vendor-profile-mini">
        <img src="${escapeHtml(vendor.avatar || "assets/cerberus-logo-transparent.png")}" alt="">
        <div>
          <strong>${escapeHtml(vendor.title || vendor.name)}</strong>
          <span>${escapeHtml(vendor.type || "Магазины")} · ${escapeHtml(vendor.status)} · ${storeProducts.length} карточек · ${storeConversations.length} диалогов</span>
        </div>
      </div>
      <p>${escapeHtml(vendor.description || "Описание магазина не заполнено.")}</p>
    </article>
  `;

  el.vendorProfileForm.title.value = vendor.title || vendor.name;
  el.vendorProfileForm.type.value = vendor.type || "Магазины";
  el.vendorProfileForm.avatar.value = vendor.avatar || "assets/cerberus-logo-transparent.png";
  el.vendorProfileForm.city.value = vendor.city || "Online";
  el.vendorProfileForm.description.value = vendor.description || "";

  el.vendorProductList.innerHTML = "";
  if (!storeProducts.length) {
    el.vendorProductList.innerHTML = '<div class="empty-state">У магазина пока нет карточек.</div>';
  }
  storeProducts.forEach((product) => {
    const item = document.createElement("div");
    item.className = "vendor-cabinet-item";
    item.innerHTML = `
      <strong>${escapeHtml(product.name)}</strong>
      <span>${escapeHtml(product.category)} · ${escapeHtml(product.weight || "1 шт")} · ${money(product.price)} · в наличии ${availableStock(product)}</span>
      <p>${escapeHtml(product.description)}</p>
      <div class="admin-editor-actions">
        <button class="ghost-button" type="button" data-action="delete">Удалить</button>
      </div>
    `;
    item.querySelector('[data-action="delete"]').addEventListener("click", () => deleteProduct(product.id));
    el.vendorProductList.append(item);
  });

  el.vendorMessageList.innerHTML = "";
  if (!storeConversations.length) {
    el.vendorMessageList.innerHTML = '<div class="empty-state">Клиенты пока не писали этому магазину.</div>';
  }
  storeConversations.forEach((conversation) => {
    const last = conversation.messages.at(-1);
    const item = document.createElement("form");
    item.className = "vendor-reply-item";
    item.innerHTML = `
      <strong>${escapeHtml(conversation.title)}</strong>
      <span>${last ? escapeHtml(last.text) : "Новый диалог"}</span>
      <input name="reply" maxlength="220" placeholder="Ответить клиенту от имени магазина">
      <button class="primary-button" type="submit">Ответить</button>
      ${vendor.type === "Обменники" ? `<button class="ghost-button" type="button" data-action="complete">${conversation.completed ? "Закрыто" : "Закрыть сделку +1"}</button>` : ""}
    `;
    item.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(item).entries());
      replyAsVendor(conversation.id, data.reply || "");
      item.reset();
      render();
    });
    item.querySelector('[data-action="complete"]')?.addEventListener("click", () => completeExchangeConversation(conversation.id));
    el.vendorMessageList.append(item);
  });

  el.paymentSettingsForm.paymentMode.value = vendor.paymentMode || "planned";
  el.paymentSettingsForm.paymentCurrency.value = vendor.paymentCurrency || "USDT";
  el.paymentSettingsForm.paymentNote.value = vendor.paymentNote || "";
}

function startConversation(vendor, productName = "") {
  const title = vendor === "operator" ? "Оператор Cerberus" : `@${vendor}`;
  const key = vendor === "operator" ? "operator" : `vendor:${vendor}`;
  let conversation = conversations.find((item) => item.key === key);
  if (!conversation) {
    conversation = {
      id: uid(),
      key,
      title,
      messages: [
        {
          id: uid(),
          from: "them",
          text: vendor === "operator"
            ? "Здравствуйте. Оператор на связи. Чем помочь?"
            : `Здравствуйте. Это чат магазина ${title}.`,
          time: new Date().toLocaleString("ru-RU")
        }
      ]
    };
    conversations.unshift(conversation);
  }
  activeConversationId = conversation.id;
}

function sendMessage(data) {
  const active = conversations.find((conversation) => conversation.id === activeConversationId);
  if (!active) return;
  const text = String(data.message || "").trim();
  const mediaUrl = String(data.mediaUrl || "").trim();
  if (!text && !mediaUrl) return;

  active.messages.push({
    id: uid(),
    from: "me",
    text: text || "Медиа",
    mediaType: data.mediaType,
    mediaUrl,
    reactions: {},
    time: new Date().toLocaleString("ru-RU")
  });
}

function inquiryText(product, vendor) {
  const vendorTitle = vendor.title || vendor.name;
  return `Здравствуйте, я по поводу карточки «${product.name}» у ${vendorTitle} на маркетплейсе Cerberus. Актуально? Хочу уточнить детали и договориться с оператором.`;
}

function contactOnSite(product, vendor) {
  startConversation(vendor.name, product.name);
  const conversation = conversations.find((item) => item.id === activeConversationId);
  const text = inquiryText(product, vendor);
  const alreadySent = conversation?.messages.some((message) => message.from === "me" && message.text === text);
  if (conversation && !alreadySent) {
    conversation.messages.push({
      id: uid(),
      from: "me",
      text,
      reactions: {},
      time: new Date().toLocaleString("ru-RU")
    });
  }
  closePublicProfile();
  showView("messages");
  render();
}

function contactTelegram(product, vendor) {
  const telegram = String(vendor.telegram || vendor.telegramHandle || vendor.name || "").trim();
  const handle = telegram.replace(/^https?:\/\/t\.me\//, "").replace(/^@/, "").trim();
  const text = `Привет, я по поводу этого заказа с маркетплейса Cerberus: «${product.name}». Товар еще в наличии? Хочу уточнить детали.`;
  const url = handle
    ? `https://t.me/${encodeURIComponent(handle)}?text=${encodeURIComponent(text)}`
    : `https://t.me/share/url?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function submitVendorReview(vendorName, form) {
  if (!session) {
    wallet.activity.push("Войдите в аккаунт, чтобы оставить отзыв.");
    render();
    return;
  }
  const authorKey = currentReviewKey();
  if (!canReviewVendor(vendorName)) {
    wallet.activity.push("Вы уже оставили отзыв этому профилю.");
    render();
    return;
  }
  const data = Object.fromEntries(new FormData(form).entries());
  reviews.unshift({
    id: uid(),
    vendor: vendorName,
    authorKey,
    author: currentUserName(),
    rating: Math.max(1, Math.min(5, Number(data.rating || 5))),
    text: String(data.text || "").trim(),
    createdAt: new Date().toLocaleString("ru-RU")
  });
  wallet.activity.push(`Отзыв добавлен для ${vendorName}`);
  openPublicProfile(vendorName);
  persist();
}

function replyAsVendor(conversationId, text) {
  const conversation = conversations.find((item) => item.id === conversationId);
  if (!conversation || !text.trim()) return;
  conversation.messages.push({
    id: uid(),
    from: "them",
    text: text.trim(),
    reactions: {},
    time: new Date().toLocaleString("ru-RU")
  });
  wallet.activity.push(`Магазин ответил в диалоге ${conversation.title}`);
}

function completeExchangeConversation(conversationId) {
  const conversation = conversations.find((item) => item.id === conversationId);
  if (!conversation || conversation.completed) return;
  conversation.completed = true;
  conversation.completedAt = new Date().toISOString();
  profile.completedDeals = Number(profile.completedDeals || 0) + 1;
  conversation.messages.push({
    id: uid(),
    from: "them",
    text: "Сделка закрыта сотрудником обменника. Клиенту начислен +1 к репутации.",
    reactions: {},
    time: new Date().toLocaleString("ru-RU")
  });
  wallet.activity.push(`Закрыта обменная сделка: +1 к репутации`);
  render();
}

function reactConversationMessage(conversationId, messageId, emoji) {
  const conversation = conversations.find((item) => item.id === conversationId);
  const message = conversation?.messages.find((item) => item.id === messageId);
  if (!message) return;
  message.reactions = message.reactions || {};
  message.reactions[emoji] = (message.reactions[emoji] || 0) + 1;
  render();
}

function sendGlobalMessage(data) {
  const text = data.text.trim();
  const mediaUrl = data.mediaUrl.trim();
  if (!text && !mediaUrl) return;
  const rank = currentRank();
  globalChat.push({
    id: uid(),
    authorKey: normalizeLogin(session?.login),
    author: currentUserName(),
    avatar: profileAvatar(),
    rank: rank.name,
    rankClass: rank.className,
    text: text || "Медиа",
    mediaType: data.mediaType,
    mediaUrl,
    reactions: {},
    time: new Date().toLocaleString("ru-RU")
  });
  render();
}

function reactGlobalMessage(id, emoji) {
  const message = globalChat.find((item) => item.id === id);
  if (!message) return;
  message.reactions = message.reactions || {};
  message.reactions[emoji] = (message.reactions[emoji] || 0) + 1;
  render();
}

function editGlobalMessage(id) {
  const message = globalChat.find((item) => item.id === id);
  if (!message) return;
  const next = window.prompt("Изменить сообщение", message.text);
  if (next === null) return;
  message.text = next.trim() || message.text;
  message.editedAt = new Date().toISOString();
  render();
}

function deleteGlobalMessage(id) {
  globalChat = globalChat.filter((item) => item.id !== id);
  render();
}

function saveProductEditor(id, container) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  product.name = container.querySelector('[data-field="name"]').value.trim();
  product.category = container.querySelector('[data-field="category"]').value.trim();
  product.price = Number(container.querySelector('[data-field="price"]').value || product.price);
  product.vendor = container.querySelector('[data-field="vendor"]').value.trim();
  product.description = container.querySelector('[data-field="description"]').value.trim();
  const vendor = vendors.find((item) => item.name === product.vendor);
  product.countries = asArray(vendor?.countries);
  product.cities = asArray(vendor?.cities || vendor?.city);
  product.districts = asArray(vendor?.districts);
  product.iconTags = asArray(vendor?.iconTags);
  product.city = vendor?.city || product.city || "Online";

  if (product.vendor && !vendors.some((vendor) => vendor.name === product.vendor)) {
    vendors.push({
      id: uid(),
      name: product.vendor,
      title: product.vendor,
      type: "Магазины",
      avatar: "assets/cerberus-logo-transparent.png",
      city: "Online",
      login: `${product.vendor}_owner`,
      loginKey: normalizeLogin(`${product.vendor}_owner`),
      password: "market123",
      status: "Активен",
      description: `Автоматически созданный кабинет ${product.vendor}.`,
      paymentMode: "planned",
      paymentCurrency: "USDT",
      paymentNote: "Крипто-оплата подключается через защищенный сервер."
    });
  }

  wallet.activity.push(`Карточка обновлена: ${product.name}`);
  render();
}

function moveProduct(id, direction) {
  products = products
    .slice()
    .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
    .map((product, index) => ({ ...product, order: index }));

  const index = products.findIndex((product) => product.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= products.length) return;
  const currentOrder = products[index].order;
  products[index].order = products[target].order;
  products[target].order = currentOrder;
  render();
}

function deleteVendor(name) {
  vendors = vendors.filter((vendor) => vendor.name !== name);
  products = products.map((product) => product.vendor === name ? { ...product, vendor: "unassigned" } : product);
  wallet.activity.push(`Кабинет магазина удален: ${name}`);
  render();
}

async function saveVendorAdmin(name, container) {
  const vendor = vendors.find((item) => item.name === name);
  if (!vendor || !isOwnerAdmin()) return;
  const login = container.querySelector('[data-field="vendorLogin"]').value.trim();
  const password = container.querySelector('[data-field="vendorPassword"]').value;
  vendor.login = login || vendor.login;
  vendor.loginKey = normalizeLogin(vendor.login);
  vendor.type = container.querySelector('[data-field="vendorType"]').value;
  vendor.featured = container.querySelector('[data-field="vendorFeatured"]').value === "true";
  vendor.topOrder = Number(container.querySelector('[data-field="vendorTopOrder"]').value || 999);
  vendor.countries = splitList(container.querySelector('[data-field="vendorCountries"]').value);
  vendor.cities = splitList(container.querySelector('[data-field="vendorCities"]').value);
  vendor.city = vendor.cities[0] || vendor.city || "Online";
  vendor.districts = splitList(container.querySelector('[data-field="vendorDistricts"]').value);
  vendor.iconTags = parseIcons(container.querySelector('[data-field="vendorIcons"]').value);
  vendor.telegram = container.querySelector('[data-field="vendorTelegram"]').value.trim();
  if (password) {
    vendor.passwordHash = await hashPassword(vendor.loginKey, password);
    delete vendor.password;
  }
  wallet.activity.push(`Кабинет обновлен: ${vendor.name}`);
  render();
}

function savePaymentSettings() {
  const selectedName = el.vendorCabinetSelect.value || vendors[0]?.name;
  const vendor = vendors.find((item) => item.name === selectedName);
  if (!vendor) return;
  const data = Object.fromEntries(new FormData(el.paymentSettingsForm).entries());
  vendor.paymentMode = data.paymentMode;
  vendor.paymentCurrency = data.paymentCurrency;
  vendor.paymentNote = data.paymentNote.trim();
  wallet.activity.push(`Платежные настройки сохранены для ${vendor.name}`);
  render();
}

function saveVendorProfile() {
  const vendor = selectedVendor();
  if (!vendor) return;
  const data = Object.fromEntries(new FormData(el.vendorProfileForm).entries());
  vendor.title = data.title.trim() || vendor.name;
  vendor.type = data.type;
  vendor.avatar = data.avatar.trim() || "assets/cerberus-logo-transparent.png";
  vendor.city = data.city.trim() || "Online";
  vendor.description = data.description.trim();
  wallet.activity.push(`Профиль обновлен: ${vendor.title}`);
  render();
}

function addVendorItem() {
  const vendor = selectedVendor();
  if (!vendor) return;
  const data = Object.fromEntries(new FormData(el.vendorItemForm).entries());
  const stockItems = parseStockText(data.stockText);
  products.unshift({
    id: uid(),
    name: data.name.trim(),
    category: data.category,
    price: Number(data.price),
    vendor: vendor.name,
    city: vendor.city || "Online",
    countries: asArray(vendor.countries),
    cities: asArray(vendor.cities || vendor.city),
    districts: asArray(vendor.districts),
    iconTags: asArray(vendor.iconTags),
    rating: 5,
    order: products.length,
    description: data.description.trim(),
    image: data.image.trim() || vendor.avatar || "assets/cerberus-logo-transparent.png",
    weight: data.weight.trim(),
    locationType: data.locationType,
    stockItems
  });
  wallet.activity.push(`Добавлен товар ${data.name.trim()}: ${stockItems.length} в наличии`);
  el.vendorItemForm.reset();
  render();
}

function openPublicProfile(vendorName) {
  const vendor = vendors.find((item) => item.name === vendorName) || {
    name: vendorName,
    title: vendorName,
    type: "Магазины",
    avatar: "assets/cerberus-logo-transparent.png",
    city: "Online",
    description: "Профиль пока не создан владельцем."
  };
  const storeProducts = vendorProducts(vendor.name);
  const vendorReviews = reviewsForVendor(vendor.name);
  const canReview = canReviewVendor(vendor.name);
  el.publicProfileTitle.textContent = vendor.title || vendor.name;
  el.publicProfile.dataset.vendor = vendor.name;
  el.publicProfile.innerHTML = `
    <section class="public-profile-head">
      <img src="${escapeHtml(vendor.avatar || "assets/cerberus-logo-transparent.png")}" alt="">
      <div>
        <span>${escapeHtml(vendor.type || "Магазины")} · ${escapeHtml(vendor.city || "Online")}</span>
        <h3>${escapeHtml(vendor.title || vendor.name)}</h3>
        <strong class="public-rating">★ ${ratingForVendor(vendor.name)} · ${vendorReviews.length} отзывов · 0 сделок</strong>
        <p>${escapeHtml(vendor.description || "Описание пока не заполнено.")}</p>
      </div>
    </section>
    <div class="public-profile-actions">
      <button class="ghost-button" type="button" data-action="message">Написать</button>
      <button class="primary-button" type="button" data-action="catalog">Каталог ниже</button>
    </div>
    <h3>Товары и карточки</h3>
    <div class="public-product-list"></div>
    <section class="public-reviews">
      <h3>Отзывы</h3>
      ${canReview ? `
        <form class="public-review-form">
          <select name="rating" aria-label="Оценка">
            <option value="5">5 звезд</option>
            <option value="4">4 звезды</option>
            <option value="3">3 звезды</option>
            <option value="2">2 звезды</option>
            <option value="1">1 звезда</option>
          </select>
          <input name="text" maxlength="180" placeholder="Ваш отзыв">
          <button class="primary-button" type="submit">Оставить отзыв</button>
        </form>
      ` : `<p class="muted-text">Вы уже оставили отзыв этому профилю.</p>`}
      <div class="public-review-list">
        ${vendorReviews.length ? vendorReviews.map((review) => `
          <article class="public-review-item">
            <strong>★ ${Number(review.rating || 5).toFixed(0)} · ${escapeHtml(review.author || "Пользователь")}</strong>
            <p>${escapeHtml(review.text || "Без текста")}</p>
            <span>${escapeHtml(review.createdAt || "")}</span>
          </article>
        `).join("") : `<div class="empty-state">Пока нет отзывов. Рейтинг держится на 5.00.</div>`}
      </div>
    </section>
  `;
  el.publicProfile.querySelector('[data-action="message"]').addEventListener("click", () => {
    startConversation(vendor.name, vendor.title || vendor.name);
    closePublicProfile();
    showView("messages");
    render();
  });
  el.publicProfile.querySelector('[data-action="catalog"]').addEventListener("click", () => {
    el.publicProfile.querySelector(".public-product-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  el.publicProfile.querySelector(".public-review-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    submitVendorReview(vendor.name, event.currentTarget);
  });
  const list = el.publicProfile.querySelector(".public-product-list");
  if (!storeProducts.length) {
    list.innerHTML = '<div class="empty-state">У профиля пока нет товаров.</div>';
  }
  storeProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "public-product-card";
    card.innerHTML = `
      <img src="${escapeHtml(product.image || vendor.avatar || "assets/cerberus-logo-transparent.png")}" alt="">
      <div>
        <div class="product-meta">
          <span class="category-pill">${escapeHtml(product.category)}</span>
        </div>
        <h4>${escapeHtml(product.name)}</h4>
        <p>${escapeHtml(product.description || "Без описания")}</p>
        <div class="vendor-row">
          <span>${escapeHtml(product.weight || "1 шт")}</span>
          <span>${escapeHtml(product.locationType || "Онлайн")}</span>
        </div>
        <div class="product-actions public-contact-actions">
          <button class="primary-button site-contact-button" type="button" data-action="site-contact">Связь на сайте</button>
          <button class="telegram-contact-button" type="button" data-action="telegram-contact">Связь в телеграме</button>
        </div>
      </div>
    `;
    card.querySelector('[data-action="site-contact"]').addEventListener("click", () => contactOnSite(product, vendor));
    card.querySelector('[data-action="telegram-contact"]').addEventListener("click", () => contactTelegram(product, vendor));
    list.append(card);
  });
  el.profileDrawer.classList.add("is-open");
  el.profileDrawer.setAttribute("aria-hidden", "false");
}

function closePublicProfile() {
  el.profileDrawer.classList.remove("is-open");
  el.profileDrawer.setAttribute("aria-hidden", "true");
}

function openInstallGuide() {
  el.installDrawer.classList.add("is-open");
  el.installDrawer.setAttribute("aria-hidden", "false");
}

function closeInstallGuide() {
  el.installDrawer.classList.remove("is-open");
  el.installDrawer.setAttribute("aria-hidden", "true");
}

function openFilterDrawer() {
  renderFilterForm();
  el.filterDrawer.classList.add("is-open");
  el.filterDrawer.setAttribute("aria-hidden", "false");
}

function closeFilterDrawer() {
  el.filterDrawer.classList.remove("is-open");
  el.filterDrawer.setAttribute("aria-hidden", "true");
}

function openPaymentDrawer() {
  if (!cart.length) return;
  el.paymentWalletAmount.textContent = money(cartTotal());
  el.paymentDrawer.classList.add("is-open");
  el.paymentDrawer.setAttribute("aria-hidden", "false");
}

function closePaymentDrawer() {
  el.paymentDrawer.classList.remove("is-open");
  el.paymentDrawer.setAttribute("aria-hidden", "true");
}

function showAnnouncementModal() {
  const latest = announcements.find((item) => !item.read) || announcements[0];
  if (!latest || storage.get("cerberusAnnouncementSeen", "") === latest.id) return;
  el.announcementTitle.textContent = latest.title;
  el.announcementBody.textContent = latest.body;
  el.announcementModal.classList.add("is-open");
  el.announcementModal.setAttribute("aria-hidden", "false");
}

function closeAnnouncementModal() {
  const latest = announcements.find((item) => !item.read) || announcements[0];
  if (latest) storage.set("cerberusAnnouncementSeen", latest.id);
  el.announcementModal.classList.remove("is-open");
  el.announcementModal.setAttribute("aria-hidden", "true");
}

function generateCaptcha() {
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 2;
  captchaAnswer = a + b;
  el.captchaQuestion.textContent = `${a} + ${b} = ?`;
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === "register";
  el.authForm.classList.toggle("is-register", isRegister);
  el.authTitle.textContent = isRegister ? "Создать аккаунт" : "Войти в Cerberus";
  el.authSubmit.textContent = isRegister ? "Зарегистрироваться" : "Войти";
  el.authForm.password.autocomplete = isRegister ? "new-password" : "current-password";
  el.authTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authMode === mode);
  });
  el.authError.textContent = "";
  el.authForm.reset();
  generateCaptcha();
}

function updateAuthGate() {
  const sessionKey = normalizeLogin(session?.login);
  const accountExists = session && (
    accounts.some((account) => (account.loginKey || normalizeLogin(account.login)) === sessionKey) ||
    vendors.some((vendor) => (vendor.loginKey || normalizeLogin(vendor.login)) === sessionKey)
  );
  document.body.classList.toggle("auth-locked", !accountExists);
  if (!accountExists) {
    session = null;
    generateCaptcha();
  } else {
    loadActiveProfile();
  }
}

async function handleAuth(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(el.authForm).entries());
  const login = data.login.trim();
  const loginKey = normalizeLogin(login);
  const password = data.password;
  const captcha = Number(data.captcha);

  if (captcha !== captchaAnswer || !data.humanCheck) {
    el.authError.textContent = "Подтверди проверку: реши пример и поставь галочку.";
    generateCaptcha();
    return;
  }

  if (authMode === "register") {
    if (accounts.some((account) => (account.loginKey || normalizeLogin(account.login)) === loginKey)) {
      el.authError.textContent = "Такой логин уже зарегистрирован.";
      return;
    }
    if (password !== data.passwordRepeat) {
      el.authError.textContent = "Пароли не совпадают.";
      return;
    }
    accounts.push({ login, loginKey, passwordHash: await hashPassword(loginKey, password), role: "user", createdAt: new Date().toISOString() });
    profile = normalizeProfile({ ...profiles[loginKey], nickname: profiles[loginKey]?.nickname || login });
    profiles[loginKey] = profile;
    wallet.activity.push(`Аккаунт создан: ${login}`);
  } else {
    const accountCandidate = accounts.find((entry) => (entry.loginKey || normalizeLogin(entry.login)) === loginKey);
    const vendorCandidate = vendors.find((entry) => (entry.loginKey || normalizeLogin(entry.login)) === loginKey);
    const account = await credentialMatches(accountCandidate, loginKey, password) ? accountCandidate : null;
    const vendorAccount = await credentialMatches(vendorCandidate, loginKey, password) ? vendorCandidate : null;
    if (!account && !vendorAccount) {
      el.authError.textContent = "Логин или пароль не подходят. Можно перейти в регистрацию.";
      generateCaptcha();
      return;
    }
    wallet.activity.push(vendorAccount ? `Вход магазина выполнен: ${vendorAccount.name}` : `Вход выполнен: ${login}`);
  }

  session = { login, loginKey, signedAt: new Date().toISOString() };
  loadActiveProfile();
  const saved = persist();
  if (!saved) {
    el.authError.textContent = "Браузер не дал сохранить аккаунт. Отключи приватный режим или разреши данные сайта.";
    return;
  }
  updateAuthGate();
  render();
}

function logout() {
  session = null;
  persist();
  setAuthMode("login");
  updateAuthGate();
}

function render() {
  renderAccessControls();
  renderCategories();
  renderProducts();
  renderFilterForm();
  renderCart();
  renderOrders();
  renderConversations();
  renderGlobalChat();
  renderNews();
  renderWallet();
  renderProfile();
  renderVendorCabinet();
  renderAdmin();
  renderStats();
  persist();
}

function addToCart(id) {
  const product = products.find((entry) => entry.id === id);
  if (product && product.stockItems && availableStock(product) <= 0) {
    wallet.activity.push(`Нет в наличии: ${product.name}`);
    render();
    return;
  }
  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  openCart();
  render();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  render();
}

function cartTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
}

function openCart() {
  el.cartDrawer.classList.add("is-open");
  el.cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  el.cartDrawer.classList.remove("is-open");
  el.cartDrawer.setAttribute("aria-hidden", "true");
}

function checkout() {
  const total = cartTotal();
  if (!cart.length) return;
  if (selectedPayment !== "wallet") {
    wallet.activity.push(`Способ ${selectedPayment.toUpperCase()} ожидает серверного подключения`);
    render();
    return;
  }
  if (wallet.balance < total) {
    wallet.activity.push(`Недостаточно CRB для заказа на ${money(total)}`);
    render();
    return;
  }
  const missing = cart.find((item) => {
    const product = products.find((entry) => entry.id === item.id);
    return product?.stockItems && availableStock(product) < item.quantity;
  });
  if (missing) {
    const product = products.find((entry) => entry.id === missing.id);
    wallet.activity.push(`Недостаточно остатков: ${product.name}`);
    render();
    return;
  }

  wallet.balance -= total;
  const order = {
    id: `CRB-${String(Date.now()).slice(-6)}`,
    createdAt: new Date().toLocaleString("ru-RU"),
    total,
    items: cart.map((item) => ({ ...item })),
    deliveries: []
  };
  orders.unshift(order);
  cart.forEach((item) => {
    const product = products.find((entry) => entry.id === item.id);
    if (product) {
      const available = product.stockItems || [];
      const issued = [];
      for (const stock of available) {
        if (issued.length >= item.quantity) break;
        if (!stock.sold) {
          stock.sold = true;
          stock.soldAt = new Date().toISOString();
          stock.orderId = order.id;
          issued.push(stock.text);
        }
      }
      order.deliveries.push({ productId: product.id, productName: product.name, issued });
      startConversation(product.vendor, product.name);
      const active = conversations.find((conversation) => conversation.id === activeConversationId);
      active.messages.push({
        id: uid(),
        from: "me",
        text: `Заказ ${order.id}: ${product.name}, ${item.quantity} шт.`,
        reactions: {},
        time: new Date().toLocaleString("ru-RU")
      });
      if (issued.length) {
        active.messages.push({
          id: uid(),
          from: "them",
          text: `Выдача по заказу ${order.id}:\n${issued.join("\n\n")}`,
          reactions: {},
          time: new Date().toLocaleString("ru-RU")
        });
      }
    }
  });
  wallet.activity.push(`Заказ ${order.id}: -${money(total)}`);
  cart = [];
  closeCart();
  closePaymentDrawer();
  showView("orders");
  render();
}

function showView(name) {
  name = enforceAccessView(name);
  el.navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.view === name));
  el.views.forEach((view) => view.classList.remove("is-visible"));
  document.querySelector(`#${name}View`).classList.add("is-visible");
}

function deleteProduct(id) {
  products = products.filter((product) => product.id !== id);
  cart = cart.filter((item) => item.id !== id);
  render();
}

function resetCatalog() {
  products = defaultProducts.map((product, index) => ({ ...product, id: uid(), order: index }));
  cart = [];
  orders = [];
  vendors = defaultVendors.map((vendor) => ({ ...vendor, id: uid() }));
  selectedVendorName = vendors[0]?.name || "";
  conversations = [];
  activeConversationId = null;
  announcements = defaultAnnouncements.map((item) => ({ ...item, id: uid(), createdAt: new Date().toLocaleString("ru-RU") }));
  globalChat = [];
  wallet = { balance: 500, activity: ["Каталог сброшен: +500 CRB"] };
  activeCategory = "Все";
  render();
}

el.navItems.forEach((item) => item.addEventListener("click", () => showView(item.dataset.view)));
el.authForm.addEventListener("submit", handleAuth);
el.authTabs.forEach((button) => button.addEventListener("click", () => setAuthMode(button.dataset.authMode)));
el.captchaRefresh.addEventListener("click", generateCaptcha);
el.logout.addEventListener("click", logout);
el.installOpen.addEventListener("click", openInstallGuide);
el.installFromProfile.addEventListener("click", openInstallGuide);
el.installClose.addEventListener("click", closeInstallGuide);
el.filterOpen.addEventListener("click", openFilterDrawer);
el.filterClose.addEventListener("click", closeFilterDrawer);
el.filterReset.addEventListener("click", () => {
  activeFilters = { country: "", city: "", district: "", icon: "" };
  activeCategory = "Все";
  closeFilterDrawer();
  render();
});
el.filterForm.elements.country?.addEventListener("change", () => {
  activeFilters.country = el.filterForm.elements.country.value;
  activeFilters.city = "";
  activeFilters.district = "";
  renderFilterForm();
});
el.filterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  activeFilters = Object.fromEntries(new FormData(el.filterForm).entries());
  activeCategory = "Все";
  closeFilterDrawer();
  render();
});
el.paymentClose.addEventListener("click", closePaymentDrawer);
el.paymentOptions.forEach((option) => {
  option.addEventListener("click", () => {
    selectedPayment = option.dataset.payment;
    el.paymentOptions.forEach((entry) => entry.classList.toggle("is-active", entry === option));
  });
});
el.confirmPayment.addEventListener("click", checkout);
el.announcementClose.addEventListener("click", closeAnnouncementModal);
el.announcementOk.addEventListener("click", closeAnnouncementModal);
el.search.addEventListener("input", render);
el.cartToggle.addEventListener("click", openCart);
el.cartClose.addEventListener("click", closeCart);
el.checkout.addEventListener("click", openPaymentDrawer);
el.clearOrders.addEventListener("click", () => {
  orders = [];
  wallet.activity.push("История заказов очищена");
  render();
});
el.newSupportChat.addEventListener("click", () => {
  startConversation("operator");
  render();
});
el.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(el.chatForm).entries());
  sendMessage(data);
  el.chatForm.reset();
  render();
});
el.chatForm.querySelectorAll("[data-chat-emoji]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = el.chatForm.elements.message;
    input.value = `${input.value}${button.dataset.chatEmoji}`;
    input.focus();
  });
});
el.globalChatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(el.globalChatForm).entries());
  sendGlobalMessage(data);
  el.globalChatForm.reset();
});
el.globalChatForm.querySelectorAll("[data-emoji]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = el.globalChatForm.elements.text;
    input.value = `${input.value}${button.dataset.emoji}`;
    input.focus();
  });
});
el.markNewsRead.addEventListener("click", () => {
  announcements = announcements.map((item) => ({ ...item, read: true }));
  wallet.activity.push("Новости отмечены как прочитанные");
  render();
});
el.vendorCabinetSelect.addEventListener("change", () => {
  selectedVendorName = el.vendorCabinetSelect.value;
  render();
});
el.paymentSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  savePaymentSettings();
});
el.vendorProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveVendorProfile();
});
el.vendorItemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addVendorItem();
});
el.profileDrawerClose.addEventListener("click", closePublicProfile);
el.addCredits.addEventListener("click", () => {
  wallet.balance += 250;
  wallet.activity.push("Пополнение: +250 CRB");
  render();
});
el.profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  profile = {
    ...profile,
    ...Object.fromEntries(new FormData(el.profileForm).entries())
  };
  wallet.activity.push(`Профиль обновлен: ${profile.nickname || "без ника"}`);
  render();
});
el.productForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(el.productForm).entries());
  products.unshift({
    id: uid(),
    name: data.name.trim(),
    category: data.category,
    price: Number(data.price),
    vendor: data.vendor.trim(),
    city: data.city.trim() || profile.city || "Online",
    countries: data.country ? [data.country] : [],
    cities: data.city.trim() ? [data.city.trim()] : [],
    districts: splitList(data.district),
    iconTags: parseIcons(data.icons),
    rating: 4.5,
    order: products.length,
    description: data.description.trim()
  });
  if (data.vendor.trim() && !vendors.some((vendor) => vendor.name === data.vendor.trim())) {
    vendors.push({
      id: uid(),
      name: data.vendor.trim(),
      title: data.vendor.trim(),
      type: "Магазины",
      avatar: "assets/cerberus-logo-transparent.png",
      city: data.city.trim() || profile.city || "Online",
      countries: data.country ? [data.country] : [],
      cities: data.city.trim() ? [data.city.trim()] : [],
      districts: splitList(data.district),
      iconTags: parseIcons(data.icons),
      login: `${data.vendor.trim()}_owner`,
      loginKey: normalizeLogin(`${data.vendor.trim()}_owner`),
      password: "market123",
      status: "Активен",
      description: `Автоматически созданный кабинет ${data.vendor.trim()}.`,
      paymentMode: "planned",
      paymentCurrency: "USDT",
      paymentNote: "Крипто-оплата подключается через защищенный сервер."
    });
  }
  el.productForm.reset();
  showView("market");
  render();
});
el.vendorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(el.vendorForm).entries());
  const name = data.name.trim();
  if (!name || vendors.some((vendor) => vendor.name.toLowerCase() === name.toLowerCase())) {
    wallet.activity.push(`Кабинет магазина уже существует: ${name}`);
    render();
    return;
  }
  vendors.push({
    id: uid(),
    name,
    title: name,
    type: data.type,
    avatar: data.avatar.trim() || "assets/cerberus-logo-transparent.png",
    city: data.city.trim() || "Online",
    countries: data.country ? [data.country] : [],
    cities: data.city.trim() ? [data.city.trim()] : [],
    districts: splitList(data.districts),
    iconTags: parseIcons(data.icons),
    telegram: data.telegram.trim(),
    featured: data.featured === "true",
    topOrder: Number(data.topOrder || 999),
    login: data.login.trim(),
    loginKey: normalizeLogin(data.login),
    passwordHash: await hashPassword(data.login, data.password),
    status: data.status,
    description: data.description.trim(),
    paymentMode: "planned",
    paymentCurrency: "USDT",
    paymentNote: "Крипто-оплата подключается через защищенный сервер."
  });
  wallet.activity.push(`Создан кабинет магазина: ${name}`);
  el.vendorForm.reset();
  showView("vendor");
  render();
});
el.broadcastForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(el.broadcastForm).entries());
  announcements.unshift({
    id: uid(),
    title: data.title.trim(),
    type: data.type,
    body: data.body.trim(),
    createdAt: new Date().toLocaleString("ru-RU"),
    read: false
  });
  wallet.activity.push(`Рассылка отправлена: ${data.title.trim()}`);
  el.broadcastForm.reset();
  showView("news");
  render();
});
el.resetCatalog.addEventListener("click", resetCatalog);
el.themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  storage.set("cerberusTheme", document.documentElement.classList.contains("light") ? "light" : "dark");
});

async function initApp() {
  if (storage.get("cerberusTheme", "dark") === "light") {
    document.documentElement.classList.add("light");
  }

  await loadCloudState();
  setAuthMode(accounts.length || vendors.length ? "login" : "register");
  updateAuthGate();
  render();
  showAnnouncementModal();
}

initApp();
