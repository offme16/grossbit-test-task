import axios from 'axios';

const API_URL = 'https://api.cryptorank.io/v1';
const API_KEY = process.env.REACT_APP_API_KEY;

interface CryptoValue {
  USD: {
    price: number;
  };
}

interface CryptoDataItem {
  id: number;
  symbol: string;
  name: string;
  values: CryptoValue;
}

interface CryptoPriceResponse {
  data: CryptoDataItem[];
}

export const fetchCryptoPrices = async (): Promise<CryptoDataItem[]> => {
  try {
    const response = await axios.get<CryptoPriceResponse>(`${API_URL}/currencies`, {
      params: {
        api_key: API_KEY,
        symbols: 'BTC,ETH,USDT'
      }
    });

    return response.data.data;
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    throw error;
  }
};

