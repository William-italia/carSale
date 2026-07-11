export abstract class ICryptoService {
  abstract hash(value: string): string;
  abstract compare(value: string, hash: string): boolean;
}
