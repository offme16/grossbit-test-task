import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CryptoValue {
  USD: {
    price: number;
  };
}

interface CryptoDataItem {
  id: number;
  name: string;
  values: CryptoValue;
  symbol: string;
}

interface CryptoState {
  data: CryptoDataItem[];
  error: string;
  isLoading: boolean;
  fromCrypto: string;
  toCrypto: string;
  value: number;
  setIsLoading: (isLoading: boolean) => void;
  setCryptoData: (data: CryptoDataItem[]) => void;
  setError: (error: string) => void;
  setFromCrypto: (symbol: string) => void;
  setToCrypto: (symbol: string) => void;
  setValue: (value: number) => void;
}

const useCryptoStore = create<CryptoState>()(devtools((set) => ({
  data: [],
  error: '',
  isLoading: false,
  fromCrypto: '',
  toCrypto: '',
  value: 0,
  setCryptoData: (data) => set({ data }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setFromCrypto: (symbol) => set({ fromCrypto: symbol }),
  setToCrypto: (symbol) => set({ toCrypto: symbol }),
  setValue: (value) => set({ value }),
})));

export default useCryptoStore;

