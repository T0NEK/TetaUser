export interface Nazwa
  {
    prefix: string;
    nazwa1: string;
    separator: string;
    nazwa2: string;
    sufix: string;
    rodzaj: string;
    kolor: string;  
  }
  
export interface Wiersze 
   {
      data: string;
      name: string;
      prefix: string;
      dane1: Nazwa;
      separator1: string;
      dane2: Nazwa;
      separator2: string;
      dane3: Nazwa;
      sufix: string;
   }

export interface Osoby
   {
      id: number;
      imie: string;
      nazwisko: string;
      funkcja: string;
      zalogowany: boolean;
      blokada: boolean;
      osoby: boolean;
  }

export interface Sprawdz
  {
      stanSQL: boolean;
      stanAkcji: boolean;
      stanRejestracja: boolean;
      stanCzasStartuDedal: boolean;
      stanCzasDedala: boolean;
      stanPolecenia: boolean;
      stanDzialania: boolean;
  }

export interface Polecenia
  {
      nazwa: string;
      czas: number;
      dzialanie: string;
      autoryzacja: boolean;
      polecenie: boolean;
      komunikat: string;
      nastepnyTrue: string;
      nastepnyFalse: string;
  }

export interface Zalogowany
  {
      zalogowany: number;
      imie: string;
      nazwisko: string;
      autoryzacja: boolean;
      funkcja: string;
      rodzaj: string;
      kolor: string;
  }

export interface Modul
  {
    id: number;  
    nazwa :string;
    symbol: string;
    producent: string;
    opis: string;
  }

export interface Notatka
  {
    id: number;  
    tytul :string;
    wlasciciel: boolean;
    wlascicielText: string;
    stan: boolean;
    stanText: string;
    czasU: string;
    czasA: string;
  }
  