/**
 * Brazilian Central Bank (BACEN) BR Code / PIX EMV Standard Generator
 * Generates 100% compliant standard PIX "Copia e Cola" payloads and QR codes
 * with exact Tag-Length-Value (TLV) encoding and CRC16-CCITT checksum calculation.
 */

export const DEFAULT_PIX_KEY =
  process.env.NEXT_PUBLIC_PIX_KEY || "90831128372";

function formatTLV(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, "0");
  return `${tag}${length}${value}`;
}

/**
 * Calculates the standard CRC16-CCITT (0x1021, init 0xFFFF) for PIX EMV payloads
 */
export function calculateCRC16(payload: string): string {
  let crc = 0xffff;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }

  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export interface PixPayloadOptions {
  amount?: number;
  pixKey?: string;
  merchantName?: string;
  merchantCity?: string;
  txId?: string;
  description?: string;
}

export interface PixPayloadResult {
  pixCode: string;
  qrCodeUrl: string;
  amount: number;
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  txId: string;
}

/**
 * Generates an official, bank-scannable PIX EMV payload and QR code
 */
export function generatePix(options?: PixPayloadOptions): PixPayloadResult {
  const pixKey = (options?.pixKey || DEFAULT_PIX_KEY).trim();
  const rawMerchantName = options?.merchantName || "APROVAI CONCURSOS";
  const rawMerchantCity = options?.merchantCity || "BRASILIA";

  // Normalize strings (remove accents, max lengths as per BACEN manual)
  const merchantName = rawMerchantName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .slice(0, 25);

  const merchantCity = rawMerchantCity
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .slice(0, 15);

  const txId = (options?.txId || "***")
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 25) || "***";

  // 1. Payload Format Indicator (00)
  const f00 = formatTLV("00", "01");

  // 2. Merchant Account Information - PIX (26)
  // Sub-tag 00: GUI ("br.gov.bcb.pix")
  // Sub-tag 01: Chave PIX
  const gui = formatTLV("00", "br.gov.bcb.pix");
  const key = formatTLV("01", pixKey);
  const desc = options?.description
    ? formatTLV("02", options.description.slice(0, 50))
    : "";
  const f26 = formatTLV("26", `${gui}${key}${desc}`);

  // 3. Merchant Category Code (52) - 0000 general
  const f52 = formatTLV("52", "0000");

  // 4. Transaction Currency (53) - 986 = BRL
  const f53 = formatTLV("53", "986");

  // 5. Transaction Amount (54) - if provided
  let f54 = "";
  const amount = options?.amount ? Number(options.amount.toFixed(2)) : 0;
  if (amount > 0) {
    f54 = formatTLV("54", amount.toFixed(2));
  }

  // 6. Country Code (58) - BR
  const f58 = formatTLV("58", "BR");

  // 7. Merchant Name (59)
  const f59 = formatTLV("59", merchantName);

  // 8. Merchant City (60)
  const f60 = formatTLV("60", merchantCity);

  // 9. Additional Data Field Template (62) -> Sub-tag 05: Reference Label / TxID
  const f05 = formatTLV("05", txId);
  const f62 = formatTLV("62", f05);

  // 10. CRC16 (63)
  const rawPayload = `${f00}${f26}${f52}${f53}${f54}${f58}${f59}${f60}${f62}6304`;
  const checksum = calculateCRC16(rawPayload);
  const fullPixCode = `${rawPayload}${checksum}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(
    fullPixCode
  )}`;

  return {
    pixCode: fullPixCode,
    qrCodeUrl,
    amount,
    pixKey,
    merchantName,
    merchantCity,
    txId,
  };
}
