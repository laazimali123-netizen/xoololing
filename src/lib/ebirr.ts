// ─── XooloLing CBE Birr Payment Integration ─────────────────────────
import axios from 'axios';

const EBIRR_BASE = 'https://animalstock.vercel.app/api/payments/ebirr';

interface EBirrPaymentRequest {
  transactionId: string;
  phoneNumber: string;
  amount: number;
  description?: string;
}

interface EBirrPaymentResponse {
  success: boolean;
  reference?: string;
  status?: string;
  message?: string;
}

export async function initiateEBirrPayment(req: EBirrPaymentRequest): Promise<EBirrPaymentResponse> {
  try {
    const { data } = await axios.post(`${EBIRR_BASE}/initiate`, {
      transactionId: req.transactionId,
      phoneNumber: req.phoneNumber,
      amount: req.amount,
      description: req.description || 'XooloLing Livestock Purchase',
    });

    return {
      success: data.success,
      reference: data.data?.reference,
      status: data.data?.status,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Payment initiation failed. Please try again.',
    };
  }
}

export async function verifyEBirrPayment(reference: string): Promise<EBirrPaymentResponse> {
  try {
    const { data } = await axios.get(`${EBIRR_BASE}/verify/${reference}`);
    return {
      success: data.success,
      reference: data.data?.reference,
      status: data.data?.status,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Payment verification failed.',
    };
  }
}

export async function checkEBirrAccount(phoneNumber: string): Promise<boolean> {
  try {
    const { data } = await axios.post(`${EBIRR_BASE}/check-account`, { phoneNumber });
    return data.success;
  } catch {
    return false;
  }
}

export function formatSOS(amount: number): string {
  return new Intl.NumberFormat('so-SO').format(amount) + ' SOS';
}

export function calculateEscrowFee(amount: number): number {
  // 2.5% escrow fee
  return Math.ceil(amount * 0.025);
}

export function calculateTotalWithEscrow(amount: number): number {
  return amount + calculateEscrowFee(amount);
}
