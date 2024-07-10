import React, { useEffect, useState } from 'react';
import useCryptoStore from '../store/useCryptoStore';
import { fetchCryptoPrices } from '../api/api';
import cls from './CryptoConverter.module.css';
import Input from '../../../Components/Input/Input';
import btc from '../../../assets/icon.bitcoin.png';
import eth from '../../../assets/Ethereum-icon-purple.png';
import usdt from '../../../assets/tether-usdt-logo.png';
import switchImage from '../../../assets/switch.svg';
import { Oval } from 'react-loader-spinner';

const CryptoConverter: React.FC = () => {
  const setCryptoData = useCryptoStore(state => state.setCryptoData);
  const setIsLoading = useCryptoStore(state => state.setIsLoading);
  const data = useCryptoStore(state => state.data);
  const isLoading = useCryptoStore(state => state.isLoading);
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [fromCurrencyName, setFromCurrencyName] = useState<string>('');
  const [toCurrencyName, setToCurrencyName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const symbolToImage = {
    BTC: btc,
    ETH: eth,
    USDT: usdt
  };

  const handleAmountChange = (value: string) => {
    setAmount(parseFloat(value));
  };

  const handleFromCurrencyChange = (value: string) => {
    setFromCurrency(value);
    const selectedCurrency = data.find(item => item.id.toString() === value);
    if (selectedCurrency) {
      setFromCurrencyName(selectedCurrency.name);
    }
  };

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value);
    const selectedCurrency = data.find(item => item.id.toString() === value);
    if (selectedCurrency) {
      setToCurrencyName(selectedCurrency.name);
    }
  };

  const switchCurrencies = () => {
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);

    const tempName = fromCurrencyName;
    setFromCurrencyName(toCurrencyName);
    setToCurrencyName(tempName);
  };

  useEffect(() => {
    const loadCryptoData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCryptoPrices();
        setCryptoData(data);
        setFromCurrency(data[0].id.toString());
        setToCurrency(data[1].id.toString());
        setFromCurrencyName(data[0].name);
        setToCurrencyName(data[1].name);
      } catch (error) {
        setErrorMessage('Ошибка при загрузке данных');
        console.error('Ошибка при загрузке данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCryptoData();
  }, [setCryptoData, setIsLoading]);

  useEffect(() => {
    if (fromCurrency && toCurrency && amount && data.length > 0) {
      const fromCurrencyData = data.find(item => item.id.toString() === fromCurrency);
      const toCurrencyData = data.find(item => item.id.toString() === toCurrency);
      if (fromCurrencyData && toCurrencyData) {
        const convertedValue = parseFloat(((amount * fromCurrencyData.values.USD.price) / toCurrencyData.values.USD.price).toFixed(6));
        setConvertedAmount(convertedValue);
      }
    }
  }, [fromCurrency, toCurrency, amount, data]);

  const options = data.map(item => ({
    value: item.id.toString(),
    symbol: item.symbol,
    name: item.name,
    image: symbolToImage[item.symbol as keyof typeof symbolToImage] || ''
  }));

  return (
    <div className={cls.Conteiner}>
      {isLoading ? (
        <div className={cls.LoaderContainer}>
          <Oval
            height={50}
            width={50}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <>
          {errorMessage && <div className={cls.Error}>{errorMessage}</div>}
          <div className={cls.Converter}>
            <Input
              type='number'
              value={amount}
              onChange={handleAmountChange}
              options={options}
              defaultOption={options.find(option => option.value === fromCurrency)}
              onSelectChange={handleFromCurrencyChange}
            />
            <div className={cls.Switch} onClick={switchCurrencies}>
              <img src={switchImage} alt='switch' className={cls.SwitchImage} />
            </div>
            <Input
              type='number'
              value={convertedAmount}
              readOnly
              options={options}
              defaultOption={options.find(option => option.value === toCurrency)}
              onSelectChange={handleToCurrencyChange}
            />
          </div>
          <span>{amount} {fromCurrencyName} = {convertedAmount} {toCurrencyName}</span>
        </>
      )}
    </div>
  );
};

export default CryptoConverter;
