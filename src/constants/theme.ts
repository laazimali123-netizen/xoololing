// ─── XooloLing Theme Constants ────────────────────────────────────────

export const Colors = {
  primary: '#1B5E20',       // Deep green
  primaryLight: '#4CAF50',  // Light green
  primaryDark: '#0D3B0F',
  secondary: '#FF8F00',     // Amber
  secondaryLight: '#FFB300',
  accent: '#2196F3',        // Blue
  background: '#FAFAFA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  border: '#E0E0E0',
  text: '#212121',
  textSecondary: '#757575',
  textHint: '#BDBDBD',
  error: '#D32F2F',
  success: '#388E3C',
  warning: '#F57C00',
  info: '#1976D2',
  disabled: '#9E9E9E',
  divider: '#EEEEEE',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const FontSizes = {
  caption: 12,
  body: 14,
  subheading: 16,
  title: 18,
  heading: 22,
  display: 28,
  hero: 36,
};

export const BorderRadii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

export const AnimalTypeLabels: Record<string, string> = {
  CATTLE: 'Cattle',
  GOAT: 'Goat',
  SHEEP: 'Sheep',
  CAMEL: 'Camel',
  DONKEY: 'Donkey',
  HORSE: 'Horse',
};

export const AnimalEmoji: Record<string, string> = {
  CATTLE: '🐄',
  GOAT: '🐐',
  SHEEP: '🐑',
  CAMEL: '🐪',
  DONKEY: '🫏',
  HORSE: '🐎',
};

export const RoleLabels: Record<string, string> = {
  RURAL_AGENT: 'Rural Agent',
  CITY_AGENT: 'City Agent',
  VET: 'Veterinarian',
  EXPORTER: 'Exporter',
  BUYER: 'Buyer',
  MARKET_ADMIN: 'Market Admin',
  GOV_ADMIN: 'Government Admin',
};

export const StatusColors: Record<string, string> = {
  DRAFT: Colors.textHint,
  ACTIVE: Colors.success,
  SOLD: Colors.info,
  EXPIRED: Colors.warning,
  REMOVED: Colors.error,
  PENDING: Colors.warning,
  ESCROW_FUNDED: Colors.accent,
  INSPECTION: Colors.secondary,
  APPROVED: Colors.success,
  COMPLETED: Colors.primary,
  DISPUTED: Colors.error,
  CANCELLED: Colors.disabled,
  REFUNDED: Colors.secondary,
  HEALTHY: Colors.success,
  SICK: Colors.error,
  QUARANTINED: Colors.warning,
  VACCINATED: Colors.info,
  UNVERIFIED: Colors.textHint,
  VERIFIED: Colors.success,
  REJECTED: Colors.error,
};
