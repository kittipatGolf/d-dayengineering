import addressData from "@/data/thai-addresses.json";

export type ThaiAddressResult = {
  province: string;
  amphoe: string;
  district: string;
  zipcode: string;
};

type AddressDB = Record<string, Record<string, { d: string; z: string }[]>>;

const db = addressData as AddressDB;

/** All 77 provinces sorted */
export const allProvinces: string[] = Object.keys(db).sort((a, b) =>
  a.localeCompare(b, "th"),
);

/** Get amphoes (districts) for a province */
export function getAmphoes(province: string): string[] {
  const amphoes = db[province];
  if (!amphoes) return [];
  return Object.keys(amphoes).sort((a, b) => a.localeCompare(b, "th"));
}

/** Get tambons (subdistricts) for a province + amphoe */
export function getTambons(province: string, amphoe: string): string[] {
  const entries = db[province]?.[amphoe];
  if (!entries) return [];
  return [...new Set(entries.map((e) => e.d))].sort((a, b) =>
    a.localeCompare(b, "th"),
  );
}

/** Get zipcode for a full address selection */
export function getZipcode(
  province: string,
  amphoe: string,
  tambon: string,
): string {
  const entries = db[province]?.[amphoe];
  if (!entries) return "";
  const match = entries.find((e) => e.d === tambon);
  return match?.z ?? "";
}

/** Search all records matching a query in any field, return up to maxResults */
export function searchAddress(
  query: string,
  maxResults = 20,
): ThaiAddressResult[] {
  const q = query.trim();
  if (!q) return [];

  const results: ThaiAddressResult[] = [];

  for (const province of Object.keys(db)) {
    if (results.length >= maxResults) break;
    for (const amphoe of Object.keys(db[province])) {
      if (results.length >= maxResults) break;
      for (const entry of db[province][amphoe]) {
        if (results.length >= maxResults) break;
        if (
          entry.d.includes(q) ||
          amphoe.includes(q) ||
          province.includes(q) ||
          entry.z.startsWith(q)
        ) {
          results.push({
            province,
            amphoe,
            district: entry.d,
            zipcode: entry.z,
          });
        }
      }
    }
  }

  return results;
}
