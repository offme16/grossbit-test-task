import React, { InputHTMLAttributes, memo, useEffect, useState } from 'react';
import cls from './Input.module.css';
import scroll from '../../assets/scroll.svg'
type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;
interface InputProps extends HTMLInputProps {
    value?: number;
    onChange?: (value: string) => void;
    options: { value: string; symbol: string; image: string }[];
    defaultOption?: { value: string; symbol: string; image: string };
    onSelectChange?: (value: string) => void;
}

const Input: React.FC<InputProps> = memo(({ value, onChange, options, defaultOption, onSelectChange, ...otherProps }) => {
    const [inputValue, setInputValue] = useState(value?.toString() || '');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ value: string, symbol: string, image: string } | null>(defaultOption || null);

    useEffect(() => {
        if (options.length > 0 && !selectedOption) {
            setSelectedOption(defaultOption || options[0]);
            onSelectChange?.(defaultOption ? defaultOption.value : options[0].value);
        }
    }, [options, onSelectChange, selectedOption, defaultOption]);

    useEffect(() => {
        setInputValue(value?.toString() || '');
    }, [value]);

    useEffect(() => {
        if (defaultOption) {
            setSelectedOption(defaultOption);
        }
    }, [defaultOption]);

    const onOptionClick = (option: { value: string, symbol: string, image: string }) => {
        setSelectedOption(option);
        setIsOpen(false);
        onSelectChange?.(option.value);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        onChange?.(e.target.value);
    };

    return (
        <div className={cls.Box}>
            <input
                className={cls.input}
                type="number"
                value={inputValue}
                onChange={onInputChange}
                {...otherProps}
            />
            <div className={cls.selectWrapper}>
                <div 
                    className={cls.select}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedOption ? (
                        <div className={cls.selectGroup}>
                            <img src={selectedOption.image} alt={selectedOption.symbol} className={cls.icon} />
                            {selectedOption.symbol}
                        </div>
                    ) : 'Select an option'}
                    <img src={scroll} alt='scroll' className={cls.scroll}/>
                </div>
                
                {isOpen && (
                    <div className={cls.options}>
                        {options.map(option => (
                            <div 
                                key={option.value}
                                className={cls.option}
                                onClick={() => onOptionClick(option)}
                            >
                                <img src={option.image} alt={option.symbol} className={cls.icon} />
                                {option.symbol}

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

export default Input;
